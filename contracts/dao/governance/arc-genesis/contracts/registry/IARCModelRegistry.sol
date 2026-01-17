// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/**
 * @title IARCModelRegistry
 * @notice Interface for the governed model registration system
 * @dev Registry is upgradeable and controlled by governance
 */
interface IARCModelRegistry {
    event ModelRegistered(
        bytes32 indexed modelId,
        bytes32 indexed classId,
        string name,
        string version,
        address registrar
    );

    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId
    ) external returns (bytes32 modelId);

    function modelClass(bytes32 modelId) external view returns (bytes32);
}
