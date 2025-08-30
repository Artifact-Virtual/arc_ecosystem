// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MockGovernor is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    address public timelock;
    uint256 public proposalCount;

    struct Proposal {
        address target;
        uint256 value;
        bytes data;
        uint256 eta;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event ProposalQueued(uint256 indexed proposalId);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address _timelock) {
        timelock = _timelock;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external onlyRole(PROPOSER_ROLE) returns (uint256) {
        require(targets.length == values.length && values.length == calldatas.length, "Governor: invalid proposal");

        proposalCount++;
        uint256 proposalId = proposalCount;

        // For simplicity, just store the first action
        proposals[proposalId] = Proposal({
            target: targets[0],
            value: values[0],
            data: calldatas[0],
            eta: 0,
            executed: false
        });

        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }

    function queue(uint256 proposalId) external onlyRole(PROPOSER_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.target != address(0), "Governor: proposal not found");

        proposal.eta = block.timestamp + 2 * 24 * 3600; // 48h delay

        emit ProposalQueued(proposalId);
    }

    function execute(uint256 proposalId) external onlyRole(EXECUTOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.target != address(0), "Governor: proposal not found");
        require(block.timestamp >= proposal.eta, "Governor: proposal not ready");
        require(!proposal.executed, "Governor: proposal already executed");

        proposal.executed = true;

        // Call the timelock to execute
        bytes32 salt = keccak256(abi.encodePacked(proposalId));
        ITimelock(timelock).schedule(
            proposal.target,
            proposal.value,
            proposal.data,
            bytes32(0),
            salt,
            0 // immediate execution for test
        );

        ITimelock(timelock).execute(
            proposal.target,
            proposal.value,
            proposal.data,
            bytes32(0),
            salt
        );

        emit ProposalExecuted(proposalId);
    }

    function getProposalState(uint256 proposalId) external view returns (uint8) {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.target == address(0)) return 0; // Pending
        if (proposal.executed) return 7; // Executed
        if (block.timestamp >= proposal.eta) return 5; // Succeeded
        return 4; // Queued
    }
}

interface ITimelock {
    function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay) external;
    function execute(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt) external payable;
}
