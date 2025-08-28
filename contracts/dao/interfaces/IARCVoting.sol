// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCVoting - Voting Contract Interface
 */
interface IARCVoting {
    enum VotingType {
        SingleChoice,
        Quadratic,
        Conviction,
        RankedChoice,
        Weighted
    }

    struct Delegation {
        address delegator;
        address delegate;
        uint256 amount;
        uint256 conviction;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 delegationId;
        string reason;
    }

    struct Vote {
        address voter;
        uint256 proposalId;
        VotingType votingType;
        uint256[] choices;
        uint256[] weights;
        uint256 conviction;
        uint256 votingPower;
        uint256 timestamp;
        bytes signature;
        bool hasVoted;
        bool delegated;
    }

    struct VotingConfig {
        uint256 minVotingPower;
        uint256 maxConvictionTime;
        uint256 convictionGrowthRate;
        uint256 quadraticScalingFactor;
        bool delegationEnabled;
        bool convictionEnabled;
        bool quadraticEnabled;
        bool rankedChoiceEnabled;
        uint256 delegationCooldown;
        uint256 undelegationCooldown;
    }

    function createVotingSession(
        uint256 proposalId,
        VotingType votingType,
        uint256 duration,
        uint256 numChoices
    ) external returns (uint256);

    function castVote(
        uint256 sessionId,
        uint256[] calldata choices,
        uint256[] calldata weights,
        uint256 convictionAmount
    ) external;

    function castVoteBySig(
        uint256 sessionId,
        uint256[] calldata choices,
        uint256[] calldata weights,
        uint256 convictionAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function delegate(
        address delegate,
        uint256 amount,
        uint256 conviction,
        uint256 duration,
        string calldata reason
    ) external returns (uint256);

    function revokeDelegation(uint256 delegationId) external;

    function getVotingPower(address account) external view returns (uint256);

    function getConvictionPower(address voter, uint256 sessionId) external view returns (uint256);

    function getSessionResults(uint256 sessionId) external view returns (
        uint256 totalVotingPower,
        uint256 totalConviction,
        uint256[] memory choiceVotes,
        uint256 winner
    );

    function getUserDelegations(address user) external view returns (Delegation[] memory);

    function getAnalytics() external view returns (
        uint256 totalVotes,
        uint256 totalVotingPower,
        uint256 averageParticipation,
        uint256 delegationRate
    );
}
