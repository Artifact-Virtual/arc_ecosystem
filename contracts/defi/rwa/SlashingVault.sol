// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

/**
 * @title Slashing Vault - Manages Slashed Funds and Recovery
 * @dev Handles slashed operator stakes, recovery mechanisms, and treasury management
 * @notice Provides secure storage and controlled release of slashed funds
 *
 * Features:
 * - Slashing fund management
 * - Recovery mechanisms for operators
 * - Treasury distribution
 * - Emergency controls
 * - Governance integration
 */
contract SlashingVault is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using ECDSAUpgradeable for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    // Recovery Request Status
    enum RecoveryStatus {
        PENDING,
        APPROVED,
        DENIED,
        COMPLETED
    }

    // Recovery Request
    struct RecoveryRequest {
        address operator;
        uint256 amount;
        string reason;
        RecoveryStatus status;
        uint256 requestedAt;
        uint256 approvedAt;
        address approver;
        bytes32 evidenceHash;
    }

    // Distribution Schedule
    struct DistributionSchedule {
        address recipient;
        uint256 amount;
        uint256 releaseTime;
        bool claimed;
        string purpose;
    }

    // State variables
    IERC20Upgradeable public stakingToken;
    address public rwaRegistry;

    mapping(address => uint256) public slashedBalances;
    mapping(bytes32 => RecoveryRequest) public recoveryRequests;
    mapping(uint256 => DistributionSchedule) public distributionSchedules;

    // Configuration
    uint256 public recoveryCooldown;
    uint256 public maxRecoveryPercentage;
    uint256 public treasuryPercentage;
    uint256 public burnPercentage;

    uint256 public totalSlashed;
    uint256 public totalRecovered;
    uint256 public totalDistributed;
    uint256 public totalBurned;

    uint256 public nextRequestId;
    uint256 public nextScheduleId;

    // Analytics
    struct VaultAnalytics {
        uint256 totalSlashed;
        uint256 totalRecovered;
        uint256 totalDistributed;
        uint256 totalBurned;
        uint256 activeRequests;
        uint256 pendingSchedules;
        uint256 lastUpdate;
    }
    VaultAnalytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the Slashing Vault
     */
    function initialize(
        address _stakingToken,
        address _rwaRegistry
    ) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, msg.sender);
        _grantRole(RECOVERY_ROLE, msg.sender);

        stakingToken = IERC20Upgradeable(_stakingToken);
        rwaRegistry = _rwaRegistry;

        // Default configuration
        recoveryCooldown = 30 days;
        maxRecoveryPercentage = 0.5e18; // 50%
        treasuryPercentage = 0.3e18;     // 30%
        burnPercentage = 0.2e18;         // 20%
    }

    /**
     * @dev Receive slashed funds from RWA Registry
     */
    function receiveSlashedFunds(address operator, uint256 amount) external nonReentrant {
        require(msg.sender == rwaRegistry, "SlashingVault: Unauthorized");

        slashedBalances[operator] += amount;
        totalSlashed += amount;
        analytics.totalSlashed += amount;

        emit SlashedFundsReceived(operator, amount);
    }

    /**
     * @dev Request recovery of slashed funds
     */
    function requestRecovery(
        uint256 amount,
        string calldata reason,
        bytes32 evidenceHash
    ) external nonReentrant whenNotPaused returns (bytes32) {
        require(slashedBalances[msg.sender] >= amount, "SlashingVault: Insufficient balance");
        require(amount > 0, "SlashingVault: Invalid amount");

        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, nextRequestId++, block.timestamp));

        recoveryRequests[requestId] = RecoveryRequest({
            operator: msg.sender,
            amount: amount,
            reason: reason,
            status: RecoveryStatus.PENDING,
            requestedAt: block.timestamp,
            approvedAt: 0,
            approver: address(0),
            evidenceHash: evidenceHash
        });

        analytics.activeRequests++;
        emit RecoveryRequested(requestId, msg.sender, amount, reason);
        return requestId;
    }

    /**
     * @dev Approve recovery request
     */
    function approveRecovery(bytes32 requestId) external onlyRole(RECOVERY_ROLE) {
        RecoveryRequest storage request = recoveryRequests[requestId];
        require(request.status == RecoveryStatus.PENDING, "SlashingVault: Invalid status");
        require(request.requestedAt + recoveryCooldown <= block.timestamp, "SlashingVault: Cooldown active");

        // Check maximum recovery percentage
        uint256 maxRecovery = (slashedBalances[request.operator] * maxRecoveryPercentage) / 1e18;
        require(request.amount <= maxRecovery, "SlashingVault: Exceeds max recovery");

        request.status = RecoveryStatus.APPROVED;
        request.approvedAt = block.timestamp;
        request.approver = msg.sender;

        emit RecoveryApproved(requestId, msg.sender);
    }

    /**
     * @dev Deny recovery request
     */
    function denyRecovery(bytes32 requestId, string calldata reason) external onlyRole(RECOVERY_ROLE) {
        RecoveryRequest storage request = recoveryRequests[requestId];
        require(request.status == RecoveryStatus.PENDING, "SlashingVault: Invalid status");

        request.status = RecoveryStatus.DENIED;
        request.approvedAt = block.timestamp;
        request.approver = msg.sender;

        emit RecoveryDenied(requestId, msg.sender, reason);
    }

    /**
     * @dev Claim approved recovery
     */
    function claimRecovery(bytes32 requestId) external nonReentrant {
        RecoveryRequest storage request = recoveryRequests[requestId];
        require(request.operator == msg.sender, "SlashingVault: Not operator");
        require(request.status == RecoveryStatus.APPROVED, "SlashingVault: Not approved");

        uint256 amount = request.amount;
        require(slashedBalances[msg.sender] >= amount, "SlashingVault: Insufficient balance");

        slashedBalances[msg.sender] -= amount;
        totalRecovered += amount;
        analytics.totalRecovered += amount;
        analytics.activeRequests--;

        request.status = RecoveryStatus.COMPLETED;

        // Transfer tokens back to operator
        require(
            stakingToken.transfer(msg.sender, amount),
            "SlashingVault: Transfer failed"
        );

        emit RecoveryClaimed(requestId, msg.sender, amount);
    }

    /**
     * @dev Distribute slashed funds to treasury
     */
    function distributeToTreasury(uint256 amount, string calldata purpose) external onlyRole(TREASURY_ROLE) {
        require(amount > 0, "SlashingVault: Invalid amount");

        // Calculate treasury share
        uint256 treasuryAmount = (amount * treasuryPercentage) / 1e18;
        require(treasuryAmount > 0, "SlashingVault: No treasury share");

        // Create distribution schedule
        uint256 scheduleId = nextScheduleId++;
        distributionSchedules[scheduleId] = DistributionSchedule({
            recipient: msg.sender, // Treasury address
            amount: treasuryAmount,
            releaseTime: block.timestamp + 7 days, // 7 day delay
            claimed: false,
            purpose: purpose
        });

        analytics.pendingSchedules++;
        emit TreasuryDistributionScheduled(scheduleId, treasuryAmount, purpose);
    }

    /**
     * @dev Claim treasury distribution
     */
    function claimTreasuryDistribution(uint256 scheduleId) external nonReentrant {
        DistributionSchedule storage schedule = distributionSchedules[scheduleId];
        require(schedule.recipient == msg.sender, "SlashingVault: Not recipient");
        require(!schedule.claimed, "SlashingVault: Already claimed");
        require(block.timestamp >= schedule.releaseTime, "SlashingVault: Not released");

        schedule.claimed = true;
        totalDistributed += schedule.amount;
        analytics.totalDistributed += schedule.amount;
        analytics.pendingSchedules--;

        // Transfer to treasury
        require(
            stakingToken.transfer(msg.sender, schedule.amount),
            "SlashingVault: Transfer failed"
        );

        emit TreasuryDistributionClaimed(scheduleId, msg.sender, schedule.amount);
    }

    /**
     * @dev Burn remaining slashed funds
     */
    function burnFunds(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount > 0, "SlashingVault: Invalid amount");

        // Calculate burn share
        uint256 burnAmount = (amount * burnPercentage) / 1e18;
        require(burnAmount > 0, "SlashingVault: No burn share");

        totalBurned += burnAmount;
        analytics.totalBurned += burnAmount;

        // Burn tokens (send to zero address)
        require(
            stakingToken.transfer(address(0), burnAmount),
            "SlashingVault: Burn failed"
        );

        emit FundsBurned(burnAmount, msg.sender);
    }

    /**
     * @dev Emergency withdraw (admin only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "SlashingVault: Invalid token");

        IERC20Upgradeable emergencyToken = IERC20Upgradeable(token);
        require(
            emergencyToken.transfer(msg.sender, amount),
            "SlashingVault: Emergency transfer failed"
        );

        emit EmergencyWithdraw(token, amount, msg.sender);
    }

    /**
     * @dev Get recovery request details
     */
    function getRecoveryRequest(bytes32 requestId) external view returns (
        address operator,
        uint256 amount,
        string memory reason,
        RecoveryStatus status,
        uint256 requestedAt,
        uint256 approvedAt,
        address approver
    ) {
        RecoveryRequest memory request = recoveryRequests[requestId];
        return (
            request.operator,
            request.amount,
            request.reason,
            request.status,
            request.requestedAt,
            request.approvedAt,
            request.approver
        );
    }

    /**
     * @dev Get distribution schedule details
     */
    function getDistributionSchedule(uint256 scheduleId) external view returns (
        address recipient,
        uint256 amount,
        uint256 releaseTime,
        bool claimed,
        string memory purpose
    ) {
        DistributionSchedule memory schedule = distributionSchedules[scheduleId];
        return (
            schedule.recipient,
            schedule.amount,
            schedule.releaseTime,
            schedule.claimed,
            schedule.purpose
        );
    }

    /**
     * @dev Get vault balance
     */
    function getVaultBalance() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    /**
     * @dev Get operator slashed balance
     */
    function getSlashedBalance(address operator) external view returns (uint256) {
        return slashedBalances[operator];
    }

    /**
     * @dev Update configuration
     */
    function updateConfig(
        uint256 _recoveryCooldown,
        uint256 _maxRecoveryPercentage,
        uint256 _treasuryPercentage,
        uint256 _burnPercentage
    ) external onlyRole(ADMIN_ROLE) {
        require(_treasuryPercentage + _burnPercentage <= 1e18, "SlashingVault: Invalid percentages");

        recoveryCooldown = _recoveryCooldown;
        maxRecoveryPercentage = _maxRecoveryPercentage;
        treasuryPercentage = _treasuryPercentage;
        burnPercentage = _burnPercentage;

        emit ConfigUpdated(_recoveryCooldown, _maxRecoveryPercentage, _treasuryPercentage, _burnPercentage);
    }

    /**
     * @dev Update analytics
     */
    function updateAnalytics() external {
        analytics.lastUpdate = block.timestamp;
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    // Events
    event SlashedFundsReceived(address indexed operator, uint256 amount);
    event RecoveryRequested(bytes32 indexed requestId, address indexed operator, uint256 amount, string reason);
    event RecoveryApproved(bytes32 indexed requestId, address approver);
    event RecoveryDenied(bytes32 indexed requestId, address approver, string reason);
    event RecoveryClaimed(bytes32 indexed requestId, address indexed operator, uint256 amount);
    event TreasuryDistributionScheduled(uint256 indexed scheduleId, uint256 amount, string purpose);
    event TreasuryDistributionClaimed(uint256 indexed scheduleId, address recipient, uint256 amount);
    event FundsBurned(uint256 amount, address burner);
    event EmergencyWithdraw(address token, uint256 amount, address admin);
    event ConfigUpdated(uint256 recoveryCooldown, uint256 maxRecoveryPct, uint256 treasuryPct, uint256 burnPct);

    // Errors
    error Unauthorized();
    error InsufficientBalance();
    error InvalidAmount();
    error InvalidStatus();
    error CooldownActive();
    error ExceedsMaxRecovery();
    error AlreadyClaimed();
    error NotReleased();
    error InvalidPercentages();
}
