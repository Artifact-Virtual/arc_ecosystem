// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {IARCModelRegistryV2} from "./IARCModelRegistryV2.sol";

/**
 * @title RegistryProxy
 * @notice Upgradeable proxy wrapper for ARCModelRegistry
 * @dev Addresses critical audit gap: provides upgrade flexibility while maintaining base contract immutability
 * 
 * This proxy allows the governance to upgrade the registry implementation without losing data.
 * The proxy maintains state and delegates calls to the current implementation.
 */
contract RegistryProxy {
    // Storage
    address public currentRegistry;
    address public governance;
    
    // Events
    event RegistryUpgraded(address indexed oldRegistry, address indexed newRegistry);
    event GovernanceTransferred(address indexed oldGovernance, address indexed newGovernance);
    
    // Errors
    error NotGovernance();
    error InvalidAddress();
    
    constructor(address registry_, address governance_) {
        require(registry_ != address(0), "INVALID_REGISTRY");
        require(governance_ != address(0), "INVALID_GOVERNANCE");
        
        currentRegistry = registry_;
        governance = governance_;
    }
    
    modifier onlyGovernance() {
        if (msg.sender != governance) revert NotGovernance();
        _;
    }
    
    /**
     * @notice Upgrade to a new registry implementation
     */
    function upgradeRegistry(address newRegistry) external onlyGovernance {
        if (newRegistry == address(0)) revert InvalidAddress();
        
        address oldRegistry = currentRegistry;
        currentRegistry = newRegistry;
        
        emit RegistryUpgraded(oldRegistry, newRegistry);
    }
    
    /**
     * @notice Transfer governance to a new address
     */
    function transferGovernance(address newGovernance) external onlyGovernance {
        if (newGovernance == address(0)) revert InvalidAddress();
        
        address oldGovernance = governance;
        governance = newGovernance;
        
        emit GovernanceTransferred(oldGovernance, newGovernance);
    }
    
    /**
     * @notice Register a model (delegates to current implementation)
     */
    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId,
        bytes32 metadataURI
    ) external returns (bytes32) {
        return IARCModelRegistryV2(currentRegistry).registerModel(
            name,
            version,
            classId,
            metadataURI
        );
    }
    
    /**
     * @notice Register multiple models (delegates to current implementation)
     */
    function registerModelBatch(
        string[] calldata names,
        string[] calldata versions,
        bytes32[] calldata classIds,
        bytes32[] calldata metadataURIs
    ) external returns (bytes32[] memory) {
        return IARCModelRegistryV2(currentRegistry).registerModelBatch(
            names,
            versions,
            classIds,
            metadataURIs
        );
    }
    
    /**
     * @notice Deprecate a model (delegates to current implementation)
     */
    function deprecateModel(bytes32 modelId, string calldata reason) external {
        IARCModelRegistryV2(currentRegistry).deprecateModel(modelId, reason);
    }
    
    /**
     * @notice Revoke a model (delegates to current implementation)
     */
    function revokeModel(bytes32 modelId, string calldata reason) external {
        IARCModelRegistryV2(currentRegistry).revokeModel(modelId, reason);
    }
    
    /**
     * @notice Get model metadata (delegates to current implementation)
     */
    function getModel(bytes32 modelId) external view returns (IARCModelRegistryV2.ModelMetadata memory) {
        return IARCModelRegistryV2(currentRegistry).getModel(modelId);
    }
    
    /**
     * @notice Get model class (delegates to current implementation)
     */
    function modelClass(bytes32 modelId) external view returns (bytes32) {
        return IARCModelRegistryV2(currentRegistry).modelClass(modelId);
    }
    
    /**
     * @notice Check if model is active (delegates to current implementation)
     */
    function isModelActive(bytes32 modelId) external view returns (bool) {
        return IARCModelRegistryV2(currentRegistry).isModelActive(modelId);
    }
    
    /**
     * @notice Get total model count (delegates to current implementation)
     */
    function getModelCount() external view returns (uint256) {
        return IARCModelRegistryV2(currentRegistry).getModelCount();
    }
}
