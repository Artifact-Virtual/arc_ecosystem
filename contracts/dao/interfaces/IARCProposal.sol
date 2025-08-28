// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCProposal - Proposal Management Interface
 */
interface IARCProposal {
    enum ProposalStage {
        Draft,
        Review,
        Voting,
        Approved,
        Rejected,
        Executed,
        Cancelled
    }

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        ProposalStage stage;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 votingStartsAt;
        uint256 votingEndsAt;
        uint256 executionTime;
        uint256 totalFeedback;
        uint256 positiveFeedback;
        uint256 amendments;
        bool template;
        string category;
        uint256[] relatedProposals;
    }

    struct Feedback {
        address reviewer;
        uint256 proposalId;
        bool support;
        string comment;
        uint256 rating;
        uint256 timestamp;
        uint256 feedbackId;
    }

    struct Amendment {
        uint256 amendmentId;
        uint256 proposalId;
        address proposer;
        string description;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        uint256 createdAt;
        uint256 approvals;
        bool accepted;
    }

    function createProposal(
        string calldata title,
        string calldata description,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas
    ) external returns (uint256);

    function addFeedback(
        uint256 proposalId,
        bool support,
        string calldata comment,
        uint256 rating
    ) external;

    function proposeAmendment(
        uint256 proposalId,
        string calldata description,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas
    ) external returns (uint256);

    function approveAmendment(uint256 amendmentId) external;

    function advanceStage(uint256 proposalId) external;

    function cancelProposal(uint256 proposalId) external;

    function getProposal(uint256 proposalId) external view returns (Proposal memory);

    function getProposalFeedback(uint256 proposalId) external view returns (Feedback[] memory);

    function getProposalAmendments(uint256 proposalId) external view returns (Amendment[] memory);

    function canAdvanceStage(uint256 proposalId) external view returns (bool);

    function getProposalCount() external view returns (uint256);

    function getProposalsByStage(ProposalStage stage) external view returns (uint256[] memory);

    function getProposalsByProposer(address proposer) external view returns (uint256[] memory);
}
