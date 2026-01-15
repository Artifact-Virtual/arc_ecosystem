// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {ModelClass} from "../libraries/ModelClass.sol";
import {IARCGenesis} from "./IARCGenesis.sol";

/**
 * @title ARCGenesis
 * @notice Immutable root contract defining the foundation of the ARC model ecosystem
 * @dev This contract is deployed once and never upgraded
 * 
 * DESIGN PRINCIPLES:
 * - Pure functions only
 * - No storage
 * - No owner
 * - No upgrade
 * - Hash-based invariants
 * - Deterministic forever
 * 
 * This contract cannot be corrupted.
 */
contract ARCGenesis is IARCGenesis {
    bytes32 internal constant _GENESIS_HASH =
        keccak256("ARC::GENESIS::v1.0.0");

    function isValidClass(bytes32 classId) external pure override returns (bool) {
        return ModelClass.isValid(classId);
    }

    function invariantHash(bytes32 classId)
        external
        pure
        override
        returns (bytes32)
    {
        if (classId == ModelClass.REASONING_CORE) {
            return keccak256("NO_EXECUTION|NO_ASSETS|ADVISORY_ONLY");
        }
        if (classId == ModelClass.GENERATIVE_INTERFACE) {
            return keccak256("NO_GOV|NO_VERIFY|NO_EXEC");
        }
        if (classId == ModelClass.OPERATIONAL_AGENT) {
            return keccak256("EXEC_ONLY|NO_POLICY|NO_VERIFY");
        }
        if (classId == ModelClass.VERIFIER_AUDITOR) {
            return keccak256("VERIFY_ONLY|NO_EXEC|NO_POLICY");
        }
        revert("INVALID_CLASS");
    }

    function genesisHash() external pure override returns (bytes32) {
        return _GENESIS_HASH;
    }
}
