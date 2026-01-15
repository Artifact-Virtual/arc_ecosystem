// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./IARCGenesis.sol";
import "../utils/Immutable.sol";
import "../libraries/ModelClass.sol";
import "../libraries/Errors.sol";

/**
 * @title ARCGenesis
 * @notice Immutable root contract defining the foundation of the ARC model ecosystem
 * @dev This contract is deployed once and never upgraded
 * 
 * RESPONSIBILITIES:
 * - Store the genesis hash (immutable anchor point)
 * - Define valid model classes
 * - Store invariant hashes for each model class
 * - Provide verification functions for model compliance
 * 
 * DESIGN PRINCIPLES:
 * - No governance, no upgrades, no admin functions
 * - Single initialization only
 * - Pure source of truth for protocol fundamentals
 * 
 * @custom:security-contact security@arcexchange.io
 */
contract ARCGenesis is IARCGenesis, Immutable {
    // The immutable genesis hash - anchor point for the ecosystem
    bytes32 private _genesisHash;
    
    // Mapping of enabled model classes
    mapping(uint8 => bool) private _enabledClasses;
    
    // Mapping of model class to its invariant hash
    mapping(uint8 => bytes32) private _invariantHashes;
    
    // Array of enabled class IDs for enumeration
    uint8[] private _classIds;
    
    /**
     * @notice Initialize the genesis with immutable parameters
     * @param genesisHash_ The genesis hash anchor
     * @param enabledClasses Array of initial model class IDs to enable
     * @param invariantHashes Array of invariant hashes for each class
     * 
     * @dev Can only be called once. Arrays must have equal length.
     * @dev All class IDs must be valid according to ModelClass library.
     */
    function initialize(
        bytes32 genesisHash_,
        uint8[] calldata enabledClasses,
        bytes32[] calldata invariantHashes
    ) external override initializer {
        // Validate genesis hash
        if (genesisHash_ == bytes32(0)) {
            revert Errors.InvalidGenesisHash();
        }
        
        // Validate array lengths match
        if (enabledClasses.length != invariantHashes.length) {
            revert Errors.InvalidParameter("Array length mismatch");
        }
        
        // Validate array is not empty
        if (enabledClasses.length == 0) {
            revert Errors.InvalidParameter("Empty classes array");
        }
        
        // Set genesis hash
        _genesisHash = genesisHash_;
        
        // Enable each model class
        for (uint256 i = 0; i < enabledClasses.length; i++) {
            uint8 classId = enabledClasses[i];
            bytes32 invariantHash = invariantHashes[i];
            
            // Validate class ID
            if (!ModelClass.isValid(classId)) {
                revert Errors.InvalidModelClass(classId);
            }
            
            // Validate invariant hash
            if (invariantHash == bytes32(0)) {
                revert Errors.InvalidInvariantHash();
            }
            
            // Check not already enabled (prevent duplicates)
            if (_enabledClasses[classId]) {
                revert Errors.ModelClassAlreadyEnabled(classId);
            }
            
            // Enable class
            _enabledClasses[classId] = true;
            _invariantHashes[classId] = invariantHash;
            _classIds.push(classId);
            
            emit ModelClassEnabled(classId, invariantHash);
        }
        
        emit GenesisInitialized(_genesisHash, block.timestamp);
    }
    
    /**
     * @notice Get the genesis hash anchor
     * @return bytes32 The immutable genesis hash
     */
    function genesisHash() external view override whenInitialized returns (bytes32) {
        return _genesisHash;
    }
    
    /**
     * @notice Check if a model class is enabled
     * @param classId The model class ID to check
     * @return bool True if enabled
     */
    function isClassEnabled(uint8 classId) external view override whenInitialized returns (bool) {
        return _enabledClasses[classId];
    }
    
    /**
     * @notice Get the invariant hash for a model class
     * @param classId The model class ID
     * @return bytes32 The invariant hash
     */
    function getInvariantHash(uint8 classId) external view override whenInitialized returns (bytes32) {
        if (!_enabledClasses[classId]) {
            revert Errors.ModelClassNotEnabled(classId);
        }
        return _invariantHashes[classId];
    }
    
    /**
     * @notice Get all enabled model classes
     * @return uint8[] Array of enabled class IDs
     */
    function getEnabledClasses() external view override whenInitialized returns (uint8[] memory) {
        return _classIds;
    }
    
    /**
     * @notice Verify a model class and its invariant
     * @param classId The model class ID
     * @param invariantHash The invariant hash to verify
     * @return bool True if valid
     */
    function verifyModelClass(
        uint8 classId,
        bytes32 invariantHash
    ) external view override whenInitialized returns (bool) {
        // Check class is enabled
        if (!_enabledClasses[classId]) {
            return false;
        }
        
        // Verify invariant hash matches
        return _invariantHashes[classId] == invariantHash;
    }
}
