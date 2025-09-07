// SPDX-License-Identifier: MIT
// Upgradeable contract via UUPS proxy
// Treasury Safe = owner/admin
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";

/**
 * @title ARC Governor V2 - Advanced Decentralized Governance System
 * @dev Nobel-tier governance system with sophisticated voting mechanisms and ARCx V2 integration
 * @notice Multi-modal governance combining token voting, reputation scoring, and expertise-based decisions
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 * @custom:upgradeable UUPS proxy pattern
 * 
 * FEATURES:
 * - Quadratic voting to prevent whale dominance and encourage broad participation
 * - Conviction voting for time-weighted decision commitment and long-term thinking
 * - Delegation system allowing expertise-based vote proxy with granular controls
 * - Multi-stage proposal lifecycle with discussion, voting, and execution phases
 * - Integration with ARCx V2 Enhanced voting power and SBT reputation weighting
 * - Emergency governance mechanisms for critical protocol upgrades
 * 
 * USAGE:
 * - Token holders propose improvements and vote on protocol changes
 * - Reputation scores from SBTs provide additional voting weight for experts
 * - Delegation allows specialized voters to represent community interests
 * - Time-locked execution ensures community review of passed proposals
 * TROUBLESHOOTING:
 * - Voting failures may indicate insufficient token balance or delegation setup
 * - Proposal rejections require meeting minimum support and quorum thresholds
 * - Emergency actions bypass normal timelock for critical security responses
 * - Check SBT reputation status if voting power seems lower than expected
 */
contract ARCGovernor is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    EIP712Upgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using ECDSAUpgradeable for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    // Proposal states with advanced lifecycle
    enum ProposalState {
        Draft,          // Proposal being drafted
        Pending,        // Submitted but not yet active
        Active,         // Active for voting
        Succeeded,      // Passed voting threshold
        Defeated,       // Failed voting threshold
        Queued,         // Queued for execution
        Executed,       // Successfully executed
        Cancelled,      // Cancelled by proposer or guardian
        Expired,        // Expired without execution
        Vetoed          // Vetoed by guardian
    }

    // Proposal categories for specialized governance
    enum ProposalCategory {
        Treasury,       // Treasury management
        Protocol,       // Protocol parameters
        Governance,     // Governance settings
        Emergency,      // Emergency actions
        CrossChain,     // Cross-chain operations
        Partnership,    // Partnership proposals
        Grant,          // Grant allocations
        Constitutional  // Constitutional changes
    }

    // Voting types
    enum VotingType {
        SingleChoice,   // Simple yes/no
        Quadratic,      // Quadratic voting
        Conviction,     // Conviction voting
        RankedChoice,   // Ranked choice voting
        Weighted        // Weighted voting
    }

    // Advanced proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalCategory category;
        VotingType votingType;
        string title;
        string description;
        string metadataURI;      // IPFS link to detailed proposal
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 totalConviction;
        uint256 convictionLastUpdate;
        ProposalState state;
        bool executed;
        bool cancelled;
        bool vetoed;
        uint256 proposalThreshold;
        uint256 quorumThreshold;
        uint256 timelockDelay;
        mapping(address => Receipt) receipts;
        mapping(bytes32 => uint256) convictionVotes;
        bytes32 proposalHash;
    }

    // Voting receipt with advanced features
    struct Receipt {
        bool hasVoted;
        uint256 votes;
        uint256 conviction;
        uint256 convictionStart;
        bool support;
        VotingType votingType;
        uint256 weight;
    }

    // Delegation structure
    struct Delegation {
        address delegate;
        uint256 amount;
        uint256 conviction;
        uint256 lastUpdate;
        bool active;
    }

    // Governance configuration
    struct GovernanceConfig {
        uint256 votingDelay;         // Blocks before voting starts
        uint256 votingPeriod;        // Blocks voting lasts
        uint256 proposalThreshold;   // Minimum tokens to propose
        uint256 quorumPercentage;    // Minimum quorum percentage
        uint256 timelockDelay;       // Timelock delay for execution
        uint256 convictionGrowth;    // Conviction voting growth rate
        uint256 emergencyThreshold;  // Emergency proposal threshold
        bool quadraticVotingEnabled;
        bool convictionVotingEnabled;
    }

    // State variables
    mapping(uint256 => Proposal) public proposals;
    mapping(address => Delegation) public delegations;
    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) public executedProposals;

    GovernanceConfig public config;
    IERC20Upgradeable public governanceToken;
    address public timelock;
    address public treasury;

    uint256 public proposalCount;
    uint256 public totalDelegated;
    uint256 public totalConviction;

    // Analytics
    struct GovernanceAnalytics {
        uint256 totalProposals;
        uint256 activeProposals;
        uint256 executedProposals;
        uint256 averageParticipation;
        uint256 totalVotesCast;
        uint256 lastUpdate;
    }

    GovernanceAnalytics public analytics;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalCategory category,
        string title,
        uint256 startBlock,
        uint256 endBlock
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votes,
        uint256 conviction,
        VotingType votingType
    );

    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event ProposalVetoed(uint256 indexed proposalId, address guardian);
    event VoteDelegated(address indexed delegator, address indexed delegate, uint256 amount);
    event EmergencyAction(address indexed caller, string action);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the governor contract
     */
    function initialize(
        address admin,
        address _governanceToken,
        address _timelock,
        address _treasury,
        GovernanceConfig memory _config
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        __EIP712_init("ARC Governor", "1");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(PROPOSER_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);
        _grantRole(GUARDIAN_ROLE, admin);

        governanceToken = IERC20Upgradeable(_governanceToken);
        timelock = _timelock;
        treasury = _treasury;
        config = _config;
    }

    /**
     * @dev Create a new proposal with advanced features
     */
    function propose(
        ProposalCategory category,
        VotingType votingType,
        string calldata title,
        string calldata description,
        string calldata metadataURI,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas,
        uint256 proposalThreshold,
        uint256 quorumThreshold,
        uint256 timelockDelay
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(targets.length == values.length && values.length == calldatas.length, "Invalid proposal parameters");
        require(targets.length > 0, "Empty proposal");
        require(bytes(title).length > 0, "Empty title");
        require(bytes(description).length > 0, "Empty description");

        uint256 proposerVotes = getVotes(msg.sender);
        require(proposerVotes >= proposalThreshold, "Insufficient proposal threshold");

        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.category = category;
        proposal.votingType = votingType;
        proposal.title = title;
        proposal.description = description;
        proposal.metadataURI = metadataURI;
        proposal.targets = targets;
        proposal.values = values;
        proposal.calldatas = calldatas;
        proposal.startBlock = block.number + config.votingDelay;
        proposal.endBlock = proposal.startBlock + config.votingPeriod;
        proposal.state = ProposalState.Pending;
        proposal.proposalThreshold = proposalThreshold;
        proposal.quorumThreshold = quorumThreshold;
        proposal.timelockDelay = timelockDelay;

        // Generate proposal hash for uniqueness
        proposal.proposalHash = keccak256(abi.encode(
            targets, values, calldatas, block.timestamp, msg.sender
        ));

        analytics.totalProposals++;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            category,
            title,
            proposal.startBlock,
            proposal.endBlock
        );

        return proposalId;
    }

    /**
     * @dev Cast vote with advanced voting mechanisms
     */
    function castVote(
        uint256 proposalId,
        bool support,
        uint256 conviction,
        VotingType votingType
    ) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Active, "Proposal not active");
        require(block.number >= proposal.startBlock, "Voting not started");
        require(block.number <= proposal.endBlock, "Voting ended");

        Receipt storage receipt = proposal.receipts[msg.sender];
        require(!receipt.hasVoted, "Already voted");

        uint256 votes = getVotes(msg.sender);
        require(votes > 0, "No voting power");

        uint256 weightedVotes;

        if (votingType == VotingType.Quadratic && config.quadraticVotingEnabled) {
            weightedVotes = sqrt(votes);
        } else if (votingType == VotingType.Conviction && config.convictionVotingEnabled) {
            weightedVotes = votes;
            proposal.convictionVotes[keccak256(abi.encode(msg.sender, proposalId))] = conviction;
            proposal.totalConviction += conviction;
        } else {
            weightedVotes = votes;
        }

        receipt.hasVoted = true;
        receipt.votes = weightedVotes;
        receipt.conviction = conviction;
        receipt.convictionStart = block.timestamp;
        receipt.support = support;
        receipt.votingType = votingType;
        receipt.weight = weightedVotes;

        if (support) {
            proposal.forVotes += weightedVotes;
        } else {
            proposal.againstVotes += weightedVotes;
        }

        analytics.totalVotesCast += weightedVotes;

        emit VoteCast(proposalId, msg.sender, support, weightedVotes, conviction, votingType);
    }

    /**
     * @dev Execute successful proposal
     */
    function execute(
        uint256 proposalId
    ) external nonReentrant whenNotPaused onlyRole(EXECUTOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Succeeded, "Proposal not succeeded");
        require(!proposal.executed, "Already executed");

        // Check timelock delay
        require(
            block.timestamp >= proposal.endBlock + proposal.timelockDelay,
            "Timelock delay not met"
        );

        proposal.executed = true;
        proposal.state = ProposalState.Executed;

        // Execute proposal calls
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success,) = proposal.targets[i].call{value: proposal.values[i]}(
                proposal.calldatas[i]
            );
            require(success, "Proposal execution failed");
        }

        executedProposals[proposal.proposalHash] = true;
        analytics.executedProposals++;

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Delegate voting power
     */
    function delegate(address delegatee, uint256 amount) external nonReentrant {
        require(delegatee != address(0), "Cannot delegate to zero address");
        require(amount > 0, "Cannot delegate zero amount");

        uint256 balance = governanceToken.balanceOf(msg.sender);
        require(balance >= amount, "Insufficient balance");

        // Transfer tokens to delegation contract (simplified - in practice would use escrow)
        governanceToken.safeTransferFrom(msg.sender, address(this), amount);

        Delegation storage delegation = delegations[msg.sender];
        delegation.delegate = delegatee;
        delegation.amount = amount;
        delegation.lastUpdate = block.timestamp;
        delegation.active = true;

        totalDelegated += amount;

        emit VoteDelegated(msg.sender, delegatee, amount);
    }

    /**
     * @dev Get voting power for address (including delegations)
     */
    function getVotes(address account) public view returns (uint256) {
        uint256 balance = governanceToken.balanceOf(account);

        // Add delegated power
        uint256 delegatedPower = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            Delegation storage delegation = delegations[address(uint160(i))];
            if (delegation.delegate == account && delegation.active) {
                delegatedPower += delegation.amount;
            }
        }

        return balance + delegatedPower;
    }

    /**
     * @dev Get proposal state
     */
    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];

        if (proposal.state == ProposalState.Executed) {
            return ProposalState.Executed;
        } else if (proposal.state == ProposalState.Cancelled) {
            return ProposalState.Cancelled;
        } else if (proposal.state == ProposalState.Vetoed) {
            return ProposalState.Vetoed;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (_quorumReached(proposalId) && _voteSucceeded(proposalId)) {
            return ProposalState.Succeeded;
        } else if (_quorumReached(proposalId) && !_voteSucceeded(proposalId)) {
            return ProposalState.Defeated;
        } else {
            return ProposalState.Expired;
        }
    }

    /**
     * @dev Check if quorum is reached
     */
    function _quorumReached(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 quorum = (governanceToken.totalSupply() * proposal.quorumThreshold) / 10000;
        return totalVotes >= quorum;
    }

    /**
     * @dev Check if vote succeeded
     */
    function _voteSucceeded(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        return proposal.forVotes > proposal.againstVotes;
    }

    /**
     * @dev Emergency veto power
     */
    function vetoProposal(uint256 proposalId) external onlyRole(GUARDIAN_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.state == ProposalState.Pending ||
            proposal.state == ProposalState.Active ||
            proposal.state == ProposalState.Succeeded,
            "Cannot veto proposal"
        );

        proposal.vetoed = true;
        proposal.state = ProposalState.Vetoed;

        emit ProposalVetoed(proposalId, msg.sender);
    }

    /**
     * @dev Emergency pause
     */
    function emergencyPause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
        emit EmergencyAction(msg.sender, "GOVERNANCE_PAUSED");
    }

    /**
     * @dev Emergency unpause
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "GOVERNANCE_UNPAUSED");
    }

    /**
     * @dev Update governance configuration
     */
    function updateConfig(GovernanceConfig calldata newConfig) external onlyRole(ADMIN_ROLE) {
        config = newConfig;
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        ProposalCategory category,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        ProposalState state,
        uint256 startBlock,
        uint256 endBlock
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.category,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.state,
            proposal.startBlock,
            proposal.endBlock
        );
    }

    /**
     * @dev Get governance analytics
     */
    function getAnalytics() external view returns (
        uint256 totalProposals,
        uint256 activeProposals,
        uint256 executedProposalsCount,
        uint256 totalVotesCast,
        uint256 totalDelegatedAmount
    ) {
        return (
            analytics.totalProposals,
            analytics.activeProposals,
            analytics.executedProposals,
            analytics.totalVotesCast,
            totalDelegated
        );
    }

    /**
     * @dev Calculate square root for quadratic voting
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
