// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {IARCGenesis} from "../genesis/IARCGenesis.sol";
import {ModelClass} from "../libraries/ModelClass.sol";

/**
 * @title ARCModelRegistry
 * @notice Governed and upgradeable model registration system
 * @dev Integrated with ARCGenesis for compliance verification
 * 
 * DESIGN PRINCIPLES:
 * - Genesis-referenced
 * - Explicit admin (governance / timelock)
 * - No implicit registration
 * - No silent overwrites
 * - Every model immutable once registered
 */
contract ARCModelRegistry {
    error InvalidClass();
    error ModelAlreadyExists();

    event ModelRegistered(
        bytes32 indexed modelId,
        bytes32 indexed classId,
        string name,
        string version,
        address registrar
    );

    IARCGenesis public immutable genesis;
    address public immutable governance;

    mapping(bytes32 => bytes32) private _modelClass;

    constructor(address genesis_, address governance_) {
        genesis = IARCGenesis(genesis_);
        governance = governance_;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "NOT_GOVERNANCE");
        _;
    }

    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 classId
    ) external onlyGovernance returns (bytes32 modelId) {
        if (!genesis.isValidClass(classId)) revert InvalidClass();

        modelId = keccak256(
            abi.encodePacked(name, version, classId, genesis.genesisHash())
        );

        if (_modelClass[modelId] != bytes32(0))
            revert ModelAlreadyExists();

        _modelClass[modelId] = classId;

        emit ModelRegistered(
            modelId,
            classId,
            name,
            version,
            msg.sender
        );
    }

    function modelClass(bytes32 modelId) external view returns (bytes32) {
        return _modelClass[modelId];
    }
}
