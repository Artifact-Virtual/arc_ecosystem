// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./IARCModelRegistry.sol";
import "../genesis/IARCGenesis.sol";
import "../libraries/ModelClass.sol";
import "../libraries/Errors.sol";

/**
 * @title ARCModelRegistry
 * @notice Governed and upgradeable model registration system
 * @dev Integrated with ARCGenesis for compliance verification
 * 
 * RESPONSIBILITIES:
 * - Register models under valid classes
 * - Verify Genesis compliance before registration
 * - Emit canonical ModelID records
 * - Manage model lifecycle (freeze/revoke)
 * - Maintain queryable model registry
 * 
 * GOVERNANCE:
 * - Controlled by governance via AccessControl
 * - Upgradeable via UUPS pattern
 * - Can be paused in emergencies
 * 
 * @custom:security-contact security@arcexchange.io
 */
contract ARCModelRegistry is
    IARCModelRegistry,
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // Roles
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Reference to Genesis contract
    IARCGenesis public genesis;
    
    // Model records
    mapping(bytes32 => ModelRecord) private _models;
    
    // Index: registrant => model IDs
    mapping(address => bytes32[]) private _modelsByRegistrant;
    
    // Index: class => model IDs
    mapping(uint8 => bytes32[]) private _modelsByClass;
    
    // Total models registered
    uint256 public totalModels;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @notice Initialize the registry
     * @param genesis_ Address of the ARCGenesis contract
     * @param governance Address to receive governance role
     */
    function initialize(
        address genesis_,
        address governance
    ) external initializer {
        if (genesis_ == address(0) || governance == address(0)) {
            revert Errors.ZeroAddress();
        }
        
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        
        genesis = IARCGenesis(genesis_);
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, governance);
        _grantRole(GOVERNANCE_ROLE, governance);
        _grantRole(PAUSER_ROLE, governance);
    }
    
    /**
     * @notice Register a new model
     * @param classId Model class ID
     * @param metadataHash Hash of model metadata
     * @param version Model version number
     * @param lineageHash Hash linking to parent models
     * @return modelId The unique model identifier
     */
    function registerModel(
        uint8 classId,
        bytes32 metadataHash,
        uint256 version,
        bytes32 lineageHash
    ) external override whenNotPaused nonReentrant returns (bytes32 modelId) {
        // Verify caller has registrar role or is governance
        if (!hasRole(REGISTRAR_ROLE, msg.sender) && !hasRole(GOVERNANCE_ROLE, msg.sender)) {
            revert Errors.Unauthorized(msg.sender);
        }
        
        // Verify model class is enabled in Genesis
        if (!genesis.isClassEnabled(classId)) {
            revert Errors.ModelClassNotEnabled(classId);
        }
        
        // Validate metadata hash
        if (metadataHash == bytes32(0)) {
            revert Errors.InvalidModelData();
        }
        
        // Compute unique model ID
        modelId = keccak256(abi.encodePacked(
            msg.sender,
            classId,
            metadataHash,
            version,
            block.timestamp
        ));
        
        // Verify not already registered
        if (_models[modelId].status != ModelStatus.None) {
            revert Errors.ModelAlreadyRegistered(modelId);
        }
        
        // Create model record
        _models[modelId] = ModelRecord({
            modelId: modelId,
            classId: classId,
            metadataHash: metadataHash,
            registrant: msg.sender,
            registeredAt: block.timestamp,
            status: ModelStatus.Active,
            version: version,
            lineageHash: lineageHash
        });
        
        // Update indices
        _modelsByRegistrant[msg.sender].push(modelId);
        _modelsByClass[classId].push(modelId);
        totalModels++;
        
        emit ModelRegistered(modelId, classId, msg.sender, metadataHash, version);
        
        return modelId;
    }
    
    /**
     * @notice Freeze a model (governance only)
     * @param modelId The model to freeze
     * @param reason Reason for freezing
     */
    function freezeModel(
        bytes32 modelId,
        string calldata reason
    ) external override onlyRole(GOVERNANCE_ROLE) {
        ModelRecord storage model = _models[modelId];
        
        if (model.status == ModelStatus.None) {
            revert Errors.ModelNotRegistered(modelId);
        }
        
        if (model.status != ModelStatus.Active) {
            revert Errors.ModelFrozen(modelId);
        }
        
        model.status = ModelStatus.Frozen;
        
        emit ModelFrozen(modelId, reason);
    }
    
    /**
     * @notice Unfreeze a model (governance only)
     * @param modelId The model to unfreeze
     */
    function unfreezeModel(bytes32 modelId) external override onlyRole(GOVERNANCE_ROLE) {
        ModelRecord storage model = _models[modelId];
        
        if (model.status != ModelStatus.Frozen) {
            revert Errors.InvalidParameter("Model not frozen");
        }
        
        model.status = ModelStatus.Active;
        
        emit ModelUnfrozen(modelId);
    }
    
    /**
     * @notice Revoke a model permanently (governance only)
     * @param modelId The model to revoke
     * @param reason Reason for revocation
     */
    function revokeModel(
        bytes32 modelId,
        string calldata reason
    ) external override onlyRole(GOVERNANCE_ROLE) {
        ModelRecord storage model = _models[modelId];
        
        if (model.status == ModelStatus.None) {
            revert Errors.ModelNotRegistered(modelId);
        }
        
        if (model.status == ModelStatus.Revoked) {
            revert Errors.ModelRevoked(modelId);
        }
        
        model.status = ModelStatus.Revoked;
        
        emit ModelRevoked(modelId, reason);
    }
    
    /**
     * @notice Get model record
     * @param modelId The model identifier
     * @return ModelRecord The model record
     */
    function getModel(bytes32 modelId) external view override returns (ModelRecord memory) {
        if (_models[modelId].status == ModelStatus.None) {
            revert Errors.ModelNotRegistered(modelId);
        }
        return _models[modelId];
    }
    
    /**
     * @notice Check if a model is active
     * @param modelId The model identifier
     * @return bool True if active
     */
    function isModelActive(bytes32 modelId) external view override returns (bool) {
        return _models[modelId].status == ModelStatus.Active;
    }
    
    /**
     * @notice Get models by registrant
     * @param registrant The registrant address
     * @return bytes32[] Array of model IDs
     */
    function getModelsByRegistrant(
        address registrant
    ) external view override returns (bytes32[] memory) {
        return _modelsByRegistrant[registrant];
    }
    
    /**
     * @notice Get models by class
     * @param classId The model class ID
     * @return bytes32[] Array of model IDs
     */
    function getModelsByClass(uint8 classId) external view override returns (bytes32[] memory) {
        return _modelsByClass[classId];
    }
    
    /**
     * @notice Pause the contract (governance only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause the contract (governance only)
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Authorize upgrade (governance only)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(GOVERNANCE_ROLE) {}
}
