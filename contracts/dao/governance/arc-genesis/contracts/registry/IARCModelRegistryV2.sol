// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {IARCGenesis} from "../genesis/IARCGenesis.sol";
import {ModelClass} from "../libraries/ModelClass.sol";

/**
 * @title IARCModelRegistryV2
 * @notice Enhanced interface for the governed model registration system
 * @dev Registry V2 with metadata, versioning, and batch operations
 */
interface IARCModelRegistryV2 {
    /**
     * @notice Model status enumeration
     */
    enum ModelStatus {
        None,        // Not registered
        Active,      // Registered and active
        Deprecated,  // Still usable but not recommended
        Revoked      // Completely disabled
    }
    
    /**
     * @notice Extended model metadata
     */
    struct ModelMetadata {
        bytes32 modelId;
        bytes32 classId;
        string name;
        string version;
        address registrant;
        uint256 registeredAt;
        ModelStatus status;
        bytes32 metadataURI;      // IPFS/Arweave hash
        bytes32 parentModelId;     // For versioning
        uint256 usageCount;        // Track usage
    }
    
    /**
     * @notice Enhanced event with comprehensive indexing
     */
    event ModelRegisteredV2(
        bytes32 indexed modelId,
        bytes32 indexed classId,
        address indexed registrant,
        string name,
        string version,
        bytes32 genesisHash,
        uint256 timestamp,
        bytes32 metadataURI
    );
    
    event ModelStatusChanged(
        bytes32 indexed modelId,
        ModelStatus oldStatus,
        ModelStatus newStatus,
        string reason
    );
    
    event ModelDeprecated(bytes32 indexed modelId, string reason);
    event ModelRevoked(bytes32 indexed modelId, string reason);
    
    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId,
        bytes32 metadataURI
    ) external returns (bytes32 modelId);
    
    function registerModelBatch(
        string[] calldata names,
        string[] calldata versions,
        bytes32[] calldata classIds,
        bytes32[] calldata metadataURIs
    ) external returns (bytes32[] memory modelIds);
    
    function deprecateModel(bytes32 modelId, string calldata reason) external;
    function revokeModel(bytes32 modelId, string calldata reason) external;
    
    function getModel(bytes32 modelId) external view returns (ModelMetadata memory);
    function modelClass(bytes32 modelId) external view returns (bytes32);
    function isModelActive(bytes32 modelId) external view returns (bool);
    function getModelCount() external view returns (uint256);
}
