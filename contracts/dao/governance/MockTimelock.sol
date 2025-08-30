// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MockTimelock is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    uint256 public delay;
    mapping(bytes32 => uint256) public timestamps;
    mapping(bytes32 => bool) public executed;

    event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay);
    event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data);

    constructor(uint256 _delay) {
        delay = _delay;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
    }

    function schedule(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt,
        uint256 _delay
    ) external onlyRole(PROPOSER_ROLE) {
        bytes32 id = keccak256(abi.encode(target, value, data, predecessor, salt));
        timestamps[id] = block.timestamp + _delay;

        emit CallScheduled(id, 0, target, value, data, predecessor, _delay);
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt
    ) external payable onlyRole(EXECUTOR_ROLE) {
        bytes32 id = keccak256(abi.encode(target, value, data, predecessor, salt));
        require(timestamps[id] > 0, "Timelock: operation not scheduled");
        require(block.timestamp >= timestamps[id], "Timelock: operation not ready");
        require(!executed[id], "Timelock: operation already executed");

        executed[id] = true;

        (bool success,) = target.call{value: value}(data);
        require(success, "Timelock: operation failed");

        emit CallExecuted(id, 0, target, value, data);
    }

    function getMinDelay() external view returns (uint256) {
        return delay;
    }
}
