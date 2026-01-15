// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCModelRegistry
 * @notice Interface for the governed model registration system
 * @dev Registry is upgradeable and controlled by governance
 * 
 * The Registry is responsible for:
 * - Registering models under valid classes
 * - Verifying Genesis compliance
 * - Emitting canonical ModelID records
 * - Managing model lifecycle (freeze/revoke)
 */
interface IARCModelRegistry {
    /**
     * @notice Model status enumeration
     */
    enum ModelStatus {
        None,       // Not registered
        Active,     // Registered and active
        Frozen,     // Temporarily frozen
        Revoked     // Permanently revoked
    }
    
    /**
     * @notice Model record structure
     */
    struct ModelRecord {
        bytes32 modelId;        // Unique model identifier
        uint8 classId;          // Model class
        bytes32 metadataHash;   // IPFS/Arweave hash of model metadata
        address registrant;     // Who registered the model
        uint256 registeredAt;   // Block timestamp of registration
        ModelStatus status;     // Current status
        uint256 version;        // Model version number
        bytes32 lineageHash;    // Hash linking to parent models
    }
    
    /**
     * @notice Emitted when a model is registered
     */
    event ModelRegistered(
        bytes32 indexed modelId,
        uint8 indexed classId,
        address indexed registrant,
        bytes32 metadataHash,
        uint256 version
    );
    
    /**
     * @notice Emitted when a model is frozen
     */
    event ModelFrozen(bytes32 indexed modelId, string reason);
    
    /**
     * @notice Emitted when a model is unfrozen
     */
    event ModelUnfrozen(bytes32 indexed modelId);
    
    /**
     * @notice Emitted when a model is revoked
     */
    event ModelRevoked(bytes32 indexed modelId, string reason);
    
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
    ) external returns (bytes32 modelId);
    
    /**
     * @notice Freeze a model (governance only)
     * @param modelId The model to freeze
     * @param reason Reason for freezing
     */
    function freezeModel(bytes32 modelId, string calldata reason) external;
    
    /**
     * @notice Unfreeze a model (governance only)
     * @param modelId The model to unfreeze
     */
    function unfreezeModel(bytes32 modelId) external;
    
    /**
     * @notice Revoke a model permanently (governance only)
     * @param modelId The model to revoke
     * @param reason Reason for revocation
     */
    function revokeModel(bytes32 modelId, string calldata reason) external;
    
    /**
     * @notice Get model record
     * @param modelId The model identifier
     * @return ModelRecord The model record
     */
    function getModel(bytes32 modelId) external view returns (ModelRecord memory);
    
    /**
     * @notice Check if a model is active
     * @param modelId The model identifier
     * @return bool True if active
     */
    function isModelActive(bytes32 modelId) external view returns (bool);
    
    /**
     * @notice Get models by registrant
     * @param registrant The registrant address
     * @return bytes32[] Array of model IDs
     */
    function getModelsByRegistrant(address registrant) external view returns (bytes32[] memory);
    
    /**
     * @notice Get models by class
     * @param classId The model class ID
     * @return bytes32[] Array of model IDs
     */
    function getModelsByClass(uint8 classId) external view returns (bytes32[] memory);
}
