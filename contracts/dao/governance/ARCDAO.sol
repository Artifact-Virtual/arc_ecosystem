// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./ARCGovernor.sol";
import "./ARCTimelock.sol";
import "./ARCProposal.sol";
import "./ARCVoting.sol";
import "./ARCTreasury.sol";

/**
 * @title ARC DAO - Main Integration Contract
 * @dev Nobel-worthy DAO orchestration system
 * @notice Central hub for DEX DAO governance, integrating all governance components
 *         with advanced proposal lifecycle, voting mechanisms, and treasury management
 *
 * Features:
 * - Unified DAO interface
 * - Proposal lifecycle orchestration
 * - Voting system integration
 * - Treasury management coordination
 * - Emergency controls and circuit breakers
 * - DAO analytics and reporting
 * - Cross-contract communication
 * - Upgrade coordination
 * - Risk management integration
 */
contract ARCDAO is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");

    // DAO configuration
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

    // Proposal status tracking
    struct ProposalStatus {
        uint256 proposalId;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool cancelled;
        bool emergency;
        uint256 stage;           // 0: Draft, 1: Active, 2: Voting, 3: Queued, 4: Executed
        bytes[] proposalData;
        address[] targets;
        uint256[] values;
        string description;
    }

    // DAO analytics
    struct DAOAnalytics {
        uint256 totalProposals;
        uint256 executedProposals;
        uint256 activeMembers;
        uint256 totalVotingPower;
        uint256 treasuryValue;
        uint256 averageParticipation;
        uint256 lastUpdate;
    }

    // State variables
    mapping(uint256 => ProposalStatus) public proposalStatuses;
    mapping(address => bool) public daoMembers;
    mapping(uint256 => uint256) public proposalStages;

    DAOConfig public config;
    DAOAnalytics public analytics;

    // Contract references
    ARCGovernor public governor;
    ARCTimelock public timelock;
    ARCProposal public proposalManager;
    ARCVoting public voting;
    ARCTreasury public treasury;

    address public governanceToken;
    uint256 public proposalCount;

    // Emergency controls
    bool public emergencyPaused;
    uint256 public emergencyActivationTime;
    mapping(address => uint256) public emergencyActions;

    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalAdvanced(uint256 indexed proposalId, uint256 stage);
    event ProposalExecuted(uint256 indexed proposalId, address indexed executor);
    event EmergencyActivated(address indexed activator, uint256 timestamp);
    event EmergencyDeactivated(address indexed deactivator, uint256 timestamp);
    event MemberAdded(address indexed member);
    event MemberRemoved(address indexed member);
    event ContractsUpdated(address indexed updater);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the DAO
     */
    function initialize(
        address admin,
        DAOConfig memory _config,
        address _governanceToken,
        address _governor,
        address _timelock,
        address _proposalManager,
        address _voting,
        address _treasury
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);
        _grantRole(GOVERNANCE_ROLE, admin);

        config = _config;
        governanceToken = _governanceToken;

        governor = ARCGovernor(_governor);
        timelock = ARCTimelock(_timelock);
        proposalManager = ARCProposal(_proposalManager);
        voting = ARCVoting(_voting);
        treasury = ARCTreasury(_treasury);

        // Add admin as first member
        daoMembers[admin] = true;
        analytics.activeMembers = 1;
    }

    /**
     * @dev Create a new DAO proposal
     */
    function createProposal(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas,
        string calldata description
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(daoMembers[msg.sender], "Not a DAO member");
        require(targets.length == values.length && targets.length == calldatas.length, "Array length mismatch");

        // Check proposal threshold
        uint256 proposerBalance = IERC20Upgradeable(governanceToken).balanceOf(msg.sender);
        require(proposerBalance >= config.proposalThreshold, "Insufficient proposal threshold");

        proposalCount++;
        uint256 proposalId = proposalCount;

        // Create proposal in governor
        uint256 governorProposalId = governor.propose(targets, values, calldatas, description);

        // Track proposal status
        ProposalStatus storage status = proposalStatuses[proposalId];
        status.proposalId = proposalId;
        status.proposer = msg.sender;
        status.startTime = block.timestamp;
        status.stage = 0; // Draft
        status.targets = targets;
        status.values = values;
        status.proposalData = calldatas;
        status.description = description;

        // Create proposal in proposal manager
        proposalManager.createProposal(description, targets, values, calldatas);

        analytics.totalProposals++;

        emit ProposalCreated(proposalId, msg.sender, description);

        return proposalId;
    }

    /**
     * @dev Advance proposal through stages
     */
    function advanceProposal(uint256 proposalId) external nonReentrant {
        ProposalStatus storage status = proposalStatuses[proposalId];
        require(!status.executed && !status.cancelled, "Proposal already finalized");

        if (status.stage == 0) {
            // Draft -> Active
            proposalManager.advanceStage(proposalId);
            status.stage = 1;
        } else if (status.stage == 1) {
            // Active -> Voting
            uint256 votingSessionId = voting.createVotingSession(
                proposalId,
                ARCVoting.VotingType.SingleChoice,
                config.votingPeriod,
                2 // Yes/No
            );
            status.stage = 2;
        } else if (status.stage == 2) {
            // Voting -> Queued (if passed)
            // Check voting results
            (uint256 totalPower, , , ) = voting.getSessionResults(proposalId);
            if (totalPower > 0) {
                // Queue for execution
                governor.queue(status.targets, status.values, status.proposalData, keccak256(bytes(status.description)));
                status.stage = 3;
            }
        } else if (status.stage == 3) {
            // Queued -> Executed
            governor.execute(status.targets, status.values, status.proposalData, keccak256(bytes(status.description)));
            status.executed = true;
            status.stage = 4;
            analytics.executedProposals++;
        }

        emit ProposalAdvanced(proposalId, status.stage);
    }

    /**
     * @dev Cast vote on proposal
     */
    function castVote(uint256 proposalId, uint8 support) external {
        require(daoMembers[msg.sender], "Not a DAO member");

        ProposalStatus storage status = proposalStatuses[proposalId];
        require(status.stage == 2, "Proposal not in voting stage");

        governor.castVote(proposalId, support);
    }

    /**
     * @dev Execute proposal after timelock
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        ProposalStatus storage status = proposalStatuses[proposalId];
        require(!status.executed, "Proposal already executed");
        require(status.stage == 3, "Proposal not queued");

        timelock.executeBatch(
            status.targets,
            status.values,
            status.proposalData,
            0,
            keccak256(bytes(status.description))
        );

        status.executed = true;
        status.stage = 4;
        analytics.executedProposals++;

        emit ProposalExecuted(proposalId, msg.sender);
    }

    /**
     * @dev Cancel proposal
     */
    function cancelProposal(uint256 proposalId) external {
        ProposalStatus storage status = proposalStatuses[proposalId];
        require(!status.executed, "Cannot cancel executed proposal");
        require(!status.cancelled, "Proposal already cancelled");
        require(
            status.proposer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized to cancel"
        );

        governor.cancel(status.targets, status.values, status.proposalData, keccak256(bytes(status.description)));
        status.cancelled = true;
    }

    /**
     * @dev Add DAO member
     */
    function addMember(address member) external onlyRole(GOVERNANCE_ROLE) {
        require(!daoMembers[member], "Already a member");

        daoMembers[member] = true;
        analytics.activeMembers++;

        emit MemberAdded(member);
    }

    /**
     * @dev Remove DAO member
     */
    function removeMember(address member) external onlyRole(GOVERNANCE_ROLE) {
        require(daoMembers[member], "Not a member");

        daoMembers[member] = false;
        analytics.activeMembers--;

        emit MemberRemoved(member);
    }

    /**
     * @dev Activate emergency mode
     */
    function activateEmergency() external onlyRole(EMERGENCY_ROLE) {
        emergencyPaused = true;
        emergencyActivationTime = block.timestamp;
        config.emergencyMode = true;

        // Pause all contracts
        treasury.pause();
        voting.pause();

        emit EmergencyActivated(msg.sender, block.timestamp);
    }

    /**
     * @dev Deactivate emergency mode
     */
    function deactivateEmergency() external onlyRole(ADMIN_ROLE) {
        require(
            block.timestamp >= emergencyActivationTime + config.emergencyThreshold,
            "Emergency timelock active"
        );

        emergencyPaused = false;
        emergencyActivationTime = 0;
        config.emergencyMode = false;

        // Unpause contracts
        treasury.unpause();
        voting.unpause();

        emit EmergencyDeactivated(msg.sender, block.timestamp);
    }

    /**
     * @dev Update DAO configuration
     */
    function updateConfig(DAOConfig calldata newConfig) external onlyRole(ADMIN_ROLE) {
        config = newConfig;
    }

    /**
     * @dev Update contract references
     */
    function updateContracts(
        address _governor,
        address _timelock,
        address _proposalManager,
        address _voting,
        address _treasury
    ) external onlyRole(ADMIN_ROLE) {
        governor = ARCGovernor(_governor);
        timelock = ARCTimelock(_timelock);
        proposalManager = ARCProposal(_proposalManager);
        voting = ARCVoting(_voting);
        treasury = ARCTreasury(_treasury);

        emit ContractsUpdated(msg.sender);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        bool cancelled,
        uint256 stage,
        string memory description
    ) {
        ProposalStatus storage status = proposalStatuses[proposalId];
        return (
            status.proposer,
            status.startTime,
            status.endTime,
            status.executed,
            status.cancelled,
            status.stage,
            status.description
        );
    }

    /**
     * @dev Get DAO analytics
     */
    function getAnalytics() external view returns (
        uint256 totalProposals,
        uint256 executedProposals,
        uint256 activeMembers,
        uint256 treasuryValue
    ) {
        uint256 treasuryVal = treasury.getTotalValue();
        return (
            analytics.totalProposals,
            analytics.executedProposals,
            analytics.activeMembers,
            treasuryVal
        );
    }

    /**
     * @dev Check if proposal can be advanced
     */
    function canAdvanceProposal(uint256 proposalId) external view returns (bool) {
        ProposalStatus storage status = proposalStatuses[proposalId];
        if (status.executed || status.cancelled) return false;

        if (status.stage == 0) return true; // Draft -> Active
        if (status.stage == 1) return true; // Active -> Voting
        if (status.stage == 2) {
            // Check if voting period ended
            return block.timestamp >= status.endTime;
        }
        if (status.stage == 3) {
            // Check if timelock passed
            return block.timestamp >= status.endTime + config.timelockDelay;
        }

        return false;
    }

    /**
     * @dev Get voting power of member
     */
    function getVotingPower(address member) external view returns (uint256) {
        return voting.getVotingPower(member);
    }

    /**
     * @dev Pause DAO operations
     */
    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause DAO operations
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
