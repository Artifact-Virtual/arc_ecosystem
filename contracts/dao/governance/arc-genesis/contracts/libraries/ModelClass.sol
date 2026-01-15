// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title ModelClass
 * @notice Centralized model class IDs for the ARC ecosystem
 * @dev Used by ARCGenesis, ARCModelRegistry, and ARCModelSBT
 * 
 * These class IDs define valid model types in the ARC ecosystem.
 * Each class represents a specific category of AI model.
 */
library ModelClass {
    // Model class identifiers
    uint8 public constant GENERATIVE = 1;
    uint8 public constant DISCRIMINATIVE = 2;
    uint8 public constant REINFORCEMENT = 3;
    uint8 public constant TRANSFORMER = 4;
    uint8 public constant DIFFUSION = 5;
    uint8 public constant CONSTITUTIONAL = 6;
    
    // Maximum valid class ID
    uint8 public constant MAX_CLASS_ID = 6;
    
    /**
     * @notice Check if a model class ID is valid
     * @param classId The class ID to validate
     * @return bool True if valid, false otherwise
     */
    function isValid(uint8 classId) internal pure returns (bool) {
        return classId > 0 && classId <= MAX_CLASS_ID;
    }
    
    /**
     * @notice Get human-readable name for a model class
     * @param classId The class ID
     * @return string The class name
     */
    function getName(uint8 classId) internal pure returns (string memory) {
        if (classId == GENERATIVE) return "Generative";
        if (classId == DISCRIMINATIVE) return "Discriminative";
        if (classId == REINFORCEMENT) return "Reinforcement";
        if (classId == TRANSFORMER) return "Transformer";
        if (classId == DIFFUSION) return "Diffusion";
        if (classId == CONSTITUTIONAL) return "Constitutional";
        return "Unknown";
    }
}
