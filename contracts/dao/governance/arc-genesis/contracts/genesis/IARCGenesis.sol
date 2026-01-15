// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/**
 * @title IARCGenesis
 * @notice Interface for the immutable root of the ARC model ecosystem
 * @dev Defines the genesis anchor and valid model classes
 */
interface IARCGenesis {
    function isValidClass(bytes32 classId) external pure returns (bool);
    function invariantHash(bytes32 classId) external pure returns (bytes32);
    function genesisHash() external pure returns (bytes32);
}
