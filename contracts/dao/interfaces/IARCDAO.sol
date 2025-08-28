// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCDAO - Main DAO Interface
 */
interface IARCDAO {
    struct DAOConfig {
        string name;
        string description;
        uint256 proposalThreshold;
        uint256 votingDelay;
        uint256 votingPeriod;
        uint256 timelockDelay;
        uint256 quorumPercentage;
        bool emergencyMode;
        uint256 emergencyThreshold;
        uint256 upgradeTimelock;
    }

    struct ProposalStatus {
        uint256 proposalId;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool cancelled;
        bool emergency;
        uint256 stage;
        bytes[] proposalData;
        address[] targets;
        uint256[] values;
        string description;
    }

    struct DAOAnalytics {
        uint256 totalProposals;
        uint256 executedProposals;
        uint256 activeMembers;
        uint256 totalVotingPower;
        uint256 treasuryValue;
        uint256 averageParticipation;
        uint256 lastUpdate;
    }

    function createProposal(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas,
        string calldata description
    ) external returns (uint256);

    function advanceProposal(uint256 proposalId) external;

    function castVote(uint256 proposalId, uint8 support) external;

    function executeProposal(uint256 proposalId) external;

    function cancelProposal(uint256 proposalId) external;

    function addMember(address member) external;

    function removeMember(address member) external;

    function activateEmergency() external;

    function deactivateEmergency() external;

    function updateConfig(DAOConfig calldata newConfig) external;

    function updateContracts(
        address governor,
        address timelock,
        address proposalManager,
        address voting,
        address treasury
    ) external;

    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        bool cancelled,
        uint256 stage,
        string memory description
    );

    function getAnalytics() external view returns (
        uint256 totalProposals,
        uint256 executedProposals,
        uint256 activeMembers,
        uint256 treasuryValue
    );

    function canAdvanceProposal(uint256 proposalId) external view returns (bool);

    function getVotingPower(address member) external view returns (uint256);

    function isMember(address account) external view returns (bool);
}
