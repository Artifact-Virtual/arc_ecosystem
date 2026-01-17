// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IARCGenesis} from "../genesis/IARCGenesis.sol";
import {IARCModelRegistryV2} from "./IARCModelRegistryV2.sol";
import {ModelClass} from "../libraries/ModelClass.sol";

/**
 * @title ARCModelRegistryV2
 * @notice Enhanced governed model registration system with metadata, versioning, and batch operations
 * @dev Addresses critical and high-priority gaps from audit:
 *      - Batch operations for gas efficiency
 *      - Extended metadata storage
 *      - Model versioning system
 *      - Emergency pause mechanism
 *      - Role-based access control
 *      - Model status management
 *      - Enhanced events for indexing
 */
contract ARCModelRegistryV2 is 
    IARCModelRegistryV2,
    AccessControl,
    Pausable,
    ReentrancyGuard
{
    // Roles
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Genesis reference (immutable)
    IARCGenesis public immutable genesis;
    
    // Model storage
    mapping(bytes32 => ModelMetadata) private _models;
    mapping(bytes32 => bytes32[]) private _modelsByClass;
    mapping(address => bytes32[]) private _modelsByRegistrant;
    mapping(string => bytes32[]) private _modelsByName;
    
    // Counters
    uint256 private _totalModels;
    
    // Errors
    error InvalidClass();
    error ModelAlreadyExists();
    error ModelNotFound();
    error InvalidStatus();
    error InvalidArrayLength();
    error InvalidMetadata();
    
    constructor(address genesis_, address governance_) {
        require(genesis_ != address(0), "INVALID_GENESIS");
        require(governance_ != address(0), "INVALID_GOVERNANCE");
        
        genesis = IARCGenesis(genesis_);
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, governance_);
        _grantRole(GOVERNANCE_ROLE, governance_);
        _grantRole(REGISTRAR_ROLE, governance_);
        _grantRole(PAUSER_ROLE, governance_);
    }
    
    /**
     * @notice Register a single model with extended metadata
     */
    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId,
        bytes32 metadataURI
    ) external override onlyRole(REGISTRAR_ROLE) whenNotPaused nonReentrant returns (bytes32) {
        return _registerModel(name, version, classId, metadataURI, bytes32(0));
    }
    
    /**
     * @notice Register multiple models in a single transaction (gas efficient)
     */
    function registerModelBatch(
        string[] calldata names,
        string[] calldata versions,
        bytes32[] calldata classIds,
        bytes32[] calldata metadataURIs
    ) external override onlyRole(REGISTRAR_ROLE) whenNotPaused nonReentrant returns (bytes32[] memory) {
        uint256 length = names.length;
        
        if (length != versions.length || length != classIds.length || length != metadataURIs.length) {
            revert InvalidArrayLength();
        }
        
        bytes32[] memory modelIds = new bytes32[](length);
        
        for (uint256 i = 0; i < length; i++) {
            modelIds[i] = _registerModel(names[i], versions[i], classIds[i], metadataURIs[i], bytes32(0));
        }
        
        return modelIds;
    }
    
    /**
     * @notice Internal registration logic
     */
    function _registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId,
        bytes32 metadataURI,
        bytes32 parentModelId
    ) internal returns (bytes32) {
        // Validate class through Genesis
        if (!genesis.isValidClass(classId)) {
            revert InvalidClass();
        }
        
        // Validate metadata
        if (bytes(name).length == 0 || bytes(version).length == 0) {
            revert InvalidMetadata();
        }
        
        // Compute deterministic model ID
        bytes32 modelId = keccak256(
            abi.encodePacked(name, version, classId, genesis.genesisHash(), msg.sender, block.timestamp)
        );
        
        // Check for duplicates
        if (_models[modelId].modelId != bytes32(0)) {
            revert ModelAlreadyExists();
        }
        
        // Store model metadata
        _models[modelId] = ModelMetadata({
            modelId: modelId,
            classId: classId,
            name: name,
            version: version,
            registrant: msg.sender,
            registeredAt: block.timestamp,
            status: ModelStatus.Active,
            metadataURI: metadataURI,
            parentModelId: parentModelId,
            usageCount: 0
        });
        
        // Update indices
        _modelsByClass[classId].push(modelId);
        _modelsByRegistrant[msg.sender].push(modelId);
        _modelsByName[name].push(modelId);
        _totalModels++;
        
        // Emit enhanced event
        emit ModelRegisteredV2(
            modelId,
            classId,
            msg.sender,
            name,
            version,
            genesis.genesisHash(),
            block.timestamp,
            metadataURI
        );
        
        return modelId;
    }
    
    /**
     * @notice Mark model as deprecated (still usable but not recommended)
     */
    function deprecateModel(
        bytes32 modelId,
        string calldata reason
    ) external override onlyRole(GOVERNANCE_ROLE) {
        ModelMetadata storage model = _models[modelId];
        
        if (model.modelId == bytes32(0)) revert ModelNotFound();
        if (model.status != ModelStatus.Active) revert InvalidStatus();
        
        ModelStatus oldStatus = model.status;
        model.status = ModelStatus.Deprecated;
        
        emit ModelStatusChanged(modelId, oldStatus, ModelStatus.Deprecated, reason);
        emit ModelDeprecated(modelId, reason);
    }
    
    /**
     * @notice Revoke model permanently
     */
    function revokeModel(
        bytes32 modelId,
        string calldata reason
    ) external override onlyRole(GOVERNANCE_ROLE) {
        ModelMetadata storage model = _models[modelId];
        
        if (model.modelId == bytes32(0)) revert ModelNotFound();
        if (model.status == ModelStatus.Revoked) revert InvalidStatus();
        
        ModelStatus oldStatus = model.status;
        model.status = ModelStatus.Revoked;
        
        emit ModelStatusChanged(modelId, oldStatus, ModelStatus.Revoked, reason);
        emit ModelRevoked(modelId, reason);
    }
    
    /**
     * @notice Get complete model metadata
     */
    function getModel(bytes32 modelId) external view override returns (ModelMetadata memory) {
        ModelMetadata memory model = _models[modelId];
        if (model.modelId == bytes32(0)) revert ModelNotFound();
        return model;
    }
    
    /**
     * @notice Get model class (backwards compatibility)
     */
    function modelClass(bytes32 modelId) external view override returns (bytes32) {
        return _models[modelId].classId;
    }
    
    /**
     * @notice Check if model is active
     */
    function isModelActive(bytes32 modelId) external view override returns (bool) {
        return _models[modelId].status == ModelStatus.Active;
    }
    
    /**
     * @notice Get total number of registered models
     */
    function getModelCount() external view override returns (uint256) {
        return _totalModels;
    }
    
    /**
     * @notice Get models by class
     */
    function getModelsByClass(bytes32 classId) external view returns (bytes32[] memory) {
        return _modelsByClass[classId];
    }
    
    /**
     * @notice Get models by registrant
     */
    function getModelsByRegistrant(address registrant) external view returns (bytes32[] memory) {
        return _modelsByRegistrant[registrant];
    }
    
    /**
     * @notice Get models by name (supports versioning)
     */
    function getModelsByName(string calldata name) external view returns (bytes32[] memory) {
        return _modelsByName[name];
    }
    
    /**
     * @notice Increment usage counter for analytics
     */
    function incrementUsage(bytes32 modelId) external {
        if (_models[modelId].modelId != bytes32(0)) {
            _models[modelId].usageCount++;
        }
    }
    
    /**
     * @notice Emergency pause
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Authorize registrar
     */
    function authorizeRegistrar(address registrar) external onlyRole(GOVERNANCE_ROLE) {
        grantRole(REGISTRAR_ROLE, registrar);
    }
    
    /**
     * @notice Revoke registrar
     */
    function revokeRegistrar(address registrar) external onlyRole(GOVERNANCE_ROLE) {
        revokeRole(REGISTRAR_ROLE, registrar);
    }
}
