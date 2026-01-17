// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/**
 * @title ModelClass
 * @notice Centralized model class IDs for the ARC ecosystem
 * @dev Used by ARCGenesis, ARCModelRegistry, and ARCModelSBT
 * 
 * These class IDs define valid model types in the ARC ecosystem.
 * Each class represents a specific category of AI model.
 */
library ModelClass {
    bytes32 internal constant REASONING_CORE =
        keccak256("ARC::MODEL::REASONING_CORE");
    bytes32 internal constant GENERATIVE_INTERFACE =
        keccak256("ARC::MODEL::GENERATIVE_INTERFACE");
    bytes32 internal constant OPERATIONAL_AGENT =
        keccak256("ARC::MODEL::OPERATIONAL_AGENT");
    bytes32 internal constant VERIFIER_AUDITOR =
        keccak256("ARC::MODEL::VERIFIER_AUDITOR");

    function isValid(bytes32 classId) internal pure returns (bool) {
        return
            classId == REASONING_CORE ||
            classId == GENERATIVE_INTERFACE ||
            classId == OPERATIONAL_AGENT ||
            classId == VERIFIER_AUDITOR;
    }
}
