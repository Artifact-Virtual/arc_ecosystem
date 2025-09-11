// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IEvolvingCompanion {
    function ownerOf(uint256 tokenId) external view returns (address);
    function totalSupply() external view returns (uint256);
    function tokenByIndex(uint256 index) external view returns (uint256);
}

contract CompanionGovernance is Ownable, ReentrancyGuard {
    IEvolvingCompanion public companion;

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        bytes data; // encoded function call
        address target; // contract to call
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) vote; // true = for, false = against
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint256)) public votingPower; // tokenId => voter => power

    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant QUORUM_THRESHOLD = 10; // 10% of total supply needed

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 power);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyCompanionOwner(uint256 tokenId) {
        require(companion.ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    constructor(address _companion) {
        companion = IEvolvingCompanion(_companion);
    }

    // Each companion NFT gets 1 vote
    function delegateVotingPower(uint256 tokenId, address delegate) external onlyCompanionOwner(tokenId) {
        votingPower[tokenId][delegate] = 1;
    }

    function createProposal(
        string calldata description,
        address target,
        bytes calldata data
    ) external returns (uint256) {
        require(bytes(description).length > 0, "Empty description");

        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.data = data;
        proposal.target = target;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function castVote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        // Count voting power from all delegated tokens
        uint256 voterPower = 0;
        uint256 totalSupply = companion.totalSupply();

        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 tokenId = companion.tokenByIndex(i);
            if (votingPower[tokenId][msg.sender] > 0) {
                voterPower += votingPower[tokenId][msg.sender];
            }
        }

        require(voterPower > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        proposal.vote[msg.sender] = support;

        if (support) {
            proposal.forVotes += voterPower;
        } else {
            proposal.againstVotes += voterPower;
        }

        emit VoteCast(proposalId, msg.sender, support, voterPower);
    }

    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");

        // Check quorum
        uint256 totalSupply = companion.totalSupply();
        uint256 quorumRequired = (totalSupply * QUORUM_THRESHOLD) / 100;
        require(proposal.forVotes >= quorumRequired, "Quorum not reached");

        proposal.executed = true;

        // Execute the proposal
        (bool success, ) = proposal.target.call(proposal.data);
        require(success, "Execution failed");

        emit ProposalExecuted(proposalId);
    }

    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed
        );
    }

    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
}
