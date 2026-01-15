// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCGenesis
 * @notice Interface for the immutable root of the ARC model ecosystem
 * @dev Defines the genesis anchor and valid model classes
 * 
 * The Genesis contract is the source of truth for:
 * - Valid model classes
 * - Genesis hash (immutable anchor)
 * - Invariant hashes for protocol rules
 */
interface IARCGenesis {
    /**
     * @notice Emitted when genesis is initialized
     * @param genesisHash The immutable genesis hash anchor
     * @param timestamp Block timestamp of initialization
     */
    event GenesisInitialized(bytes32 indexed genesisHash, uint256 timestamp);
    
    /**
     * @notice Emitted when a model class is enabled
     * @param classId The model class identifier
     * @param invariantHash The invariant hash for this class
     */
    event ModelClassEnabled(uint8 indexed classId, bytes32 invariantHash);
    
    /**
     * @notice Initialize the genesis with immutable parameters
     * @param _genesisHash The genesis hash anchor
     * @param _enabledClasses Array of initial model class IDs to enable
     * @param _invariantHashes Array of invariant hashes for each class
     */
    function initialize(
        bytes32 _genesisHash,
        uint8[] calldata _enabledClasses,
        bytes32[] calldata _invariantHashes
    ) external;
    
    /**
     * @notice Get the genesis hash anchor
     * @return bytes32 The immutable genesis hash
     */
    function genesisHash() external view returns (bytes32);
    
    /**
     * @notice Check if a model class is enabled
     * @param classId The model class ID to check
     * @return bool True if enabled
     */
    function isClassEnabled(uint8 classId) external view returns (bool);
    
    /**
     * @notice Get the invariant hash for a model class
     * @param classId The model class ID
     * @return bytes32 The invariant hash
     */
    function getInvariantHash(uint8 classId) external view returns (bytes32);
    
    /**
     * @notice Get all enabled model classes
     * @return uint8[] Array of enabled class IDs
     */
    function getEnabledClasses() external view returns (uint8[] memory);
    
    /**
     * @notice Verify a model class and its invariant
     * @param classId The model class ID
     * @param invariantHash The invariant hash to verify
     * @return bool True if valid
     */
    function verifyModelClass(uint8 classId, bytes32 invariantHash) external view returns (bool);
}
