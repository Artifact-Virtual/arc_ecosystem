// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/**
 * @title ARC Bridge
 * @dev Advanced cross-chain bridge for ARC Exchange
 * @notice Enterprise-grade bridge with ARC ecosystem integration and multi-chain support
 */
contract ARCBridge is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    enum BridgeStatus { PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED }
    enum BridgeType { NATIVE, WRAPPED, CANONICAL }
    enum ValidationStatus { PENDING, APPROVED, REJECTED }

    // Advanced bridge request structure
    struct BridgeRequest {
        address user;
        address token;
        uint256 amount;
        uint256 amountAfterFee;
        uint256 targetChainId;
        string targetAddress;
        BridgeStatus status;
        BridgeType bridgeType;
        uint256 timestamp;
        uint256 deadline;
        bytes32 txHash;
        uint256 validatorCount;
        mapping(address => bool) validatorApprovals;
        ValidationStatus validationStatus;
        uint256 retryCount;
        bytes32 referralCode;
    }

    // Bridge validator structure
    struct BridgeValidator {
        address validator;
        uint256 stakeAmount;
        uint256 reputation;
        bool active;
        uint256 lastActive;
    }

    // Chain configuration
    struct ChainConfig {
        uint256 chainId;
        string name;
        address wrappedNativeToken;
        uint256 minBridgeAmount;
        uint256 maxBridgeAmount;
        uint256 bridgeFee; // Basis points
        bool active;
        uint256 dailyLimit;
        uint256 dailyVolume;
        uint256 lastReset;
    }

    // Bridge analytics
    struct BridgeAnalytics {
        uint256 totalVolume;
        uint256 totalFees;
        uint256 totalBridges;
        uint256 uniqueUsers;
        uint256 failedBridges;
        uint256 averageProcessingTime;
        uint256 lastUpdated;
    }

    // State variables
    mapping(bytes32 => BridgeRequest) public bridgeRequests;
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => ChainConfig) public chainConfigs;
    mapping(address => BridgeValidator) public bridgeValidators;
    mapping(address => uint256) public userBridgeCount;

    BridgeAnalytics public analytics;
    address[] public activeValidators;

    // ARC ecosystem integration
    address public arcxToken;
    address public treasuryRewards;
    address public treasury;
    address public penaltyVault;

    uint256 public constant MAX_VALIDATORS = 10;
    uint256 public constant MIN_VALIDATOR_STAKE = 1000e18; // 1000 ARCx
    uint256 public constant VALIDATION_THRESHOLD = 70; // 70% approval needed
    uint256 public constant MAX_RETRY_ATTEMPTS = 3;
    uint256 public constant PROCESSING_TIMEOUT = 24 hours;
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Events
    event BridgeInitiated(
        bytes32 indexed requestId,
        address indexed user,
        address token,
        uint256 amount,
        uint256 targetChainId,
        string targetAddress,
        BridgeType bridgeType
    );

    event BridgeValidated(
        bytes32 indexed requestId,
        address indexed validator,
        bool approved
    );

    event BridgeCompleted(
        bytes32 indexed requestId,
        bytes32 indexed txHash,
        uint256 processingTime
    );

    event BridgeFailed(
        bytes32 indexed requestId,
        string reason,
        uint256 retryCount
    );

    event ValidatorAdded(
        address indexed validator,
        uint256 stakeAmount
    );

    event ValidatorRemoved(
        address indexed validator
    );

    event ChainConfigured(
        uint256 indexed chainId,
        string name,
        bool active
    );

    event EmergencyAction(
        string action,
        address indexed caller,
        uint256 timestamp
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the bridge contract
     */
    function initialize(
        address admin,
        address _arcxToken,
        address _treasuryRewards,
        address _treasury,
        address _penaltyVault
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(GOVERNANCE_ROLE, admin);
        _grantRole(VALIDATOR_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);

        arcxToken = _arcxToken;
        treasuryRewards = _treasuryRewards;
        treasury = _treasury;
        penaltyVault = _penaltyVault;

        // Initialize Base chain config
        _configureChain(8453, "Base", address(0), 1e6, 100000e18, 50, true, 1000000e18);

        // Initialize Ethereum chain config
        _configureChain(1, "Ethereum", address(0), 1e6, 100000e18, 50, true, 1000000e18);

        // Initialize Arbitrum chain config
        _configureChain(42161, "Arbitrum", address(0), 1e6, 100000e18, 50, true, 1000000e18);
    }

    /**
     * @dev Configure chain parameters
     */
    function _configureChain(
        uint256 chainId,
        string memory name,
        address wrappedNative,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 bridgeFee,
        bool active,
        uint256 dailyLimit
    ) internal {
        chainConfigs[chainId] = ChainConfig({
            chainId: chainId,
            name: name,
            wrappedNativeToken: wrappedNative,
            minBridgeAmount: minAmount,
            maxBridgeAmount: maxAmount,
            bridgeFee: bridgeFee,
            active: active,
            dailyLimit: dailyLimit,
            dailyVolume: 0,
            lastReset: block.timestamp
        });

        emit ChainConfigured(chainId, name, active);
    }

    /**
     * @dev Advanced bridge initiation with validation
     */
    function initiateBridge(
        address token,
        uint256 amount,
        uint256 targetChainId,
        string calldata targetAddress,
        BridgeType bridgeType,
        bytes32 referralCode
    ) external nonReentrant whenNotPaused returns (bytes32) {
        ChainConfig storage config = chainConfigs[targetChainId];
        require(config.active, "Chain not supported");
        require(supportedTokens[token], "Token not supported");
        require(amount >= config.minBridgeAmount && amount <= config.maxBridgeAmount, "Amount out of range");
        require(bytes(targetAddress).length > 0, "Invalid target address");

        // Check daily volume limit
        _checkDailyLimit(config, amount);

        // Calculate fees
        uint256 bridgeFee = (amount * config.bridgeFee) / BPS_DENOMINATOR;
        uint256 amountAfterFee = amount - bridgeFee;

        // Transfer tokens from user
        IERC20Upgradeable(token).safeTransferFrom(msg.sender, address(this), amount);

        // Generate request ID
        bytes32 requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                token,
                amount,
                targetChainId,
                block.timestamp,
                block.number
            )
        );

        // Initialize bridge request
        BridgeRequest storage request = bridgeRequests[requestId];
        request.user = msg.sender;
        request.token = token;
        request.amount = amount;
        request.amountAfterFee = amountAfterFee;
        request.targetChainId = targetChainId;
        request.targetAddress = targetAddress;
        request.status = BridgeStatus.PENDING;
        request.bridgeType = bridgeType;
        request.timestamp = block.timestamp;
        request.deadline = block.timestamp + PROCESSING_TIMEOUT;
        request.validationStatus = ValidationStatus.PENDING;
        request.referralCode = referralCode;

        // Update analytics
        analytics.totalBridges++;
        if (userBridgeCount[msg.sender] == 0) {
            analytics.uniqueUsers++;
        }
        userBridgeCount[msg.sender]++;

        // Update daily volume
        config.dailyVolume += amount;

        emit BridgeInitiated(requestId, msg.sender, token, amount, targetChainId, targetAddress, bridgeType);

        return requestId;
    }

    /**
     * @dev Validator approval process
     */
    function validateBridge(bytes32 requestId, bool approved) external onlyRole(VALIDATOR_ROLE) {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.PENDING, "Request not pending");
        require(!request.validatorApprovals[msg.sender], "Already validated");
        require(request.deadline >= block.timestamp, "Request expired");

        BridgeValidator storage validator = bridgeValidators[msg.sender];
        require(validator.active, "Validator not active");

        request.validatorApprovals[msg.sender] = true;
        request.validatorCount++;

        if (approved) {
            validator.reputation += 10;
        } else {
            validator.reputation -= 5;
        }

        // Check if validation threshold is met
        uint256 approvalPercentage = (request.validatorCount * 100) / activeValidators.length;
        if (approvalPercentage >= VALIDATION_THRESHOLD) {
            request.validationStatus = ValidationStatus.APPROVED;
            request.status = BridgeStatus.PROCESSING;
        }

        emit BridgeValidated(requestId, msg.sender, approved);
    }

    /**
     * @dev Complete bridge transaction
     */
    function completeBridge(
        bytes32 requestId,
        bytes32 txHash
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.PROCESSING, "Request not processing");
        require(request.validationStatus == ValidationStatus.APPROVED, "Not validated");

        uint256 processingTime = block.timestamp - request.timestamp;

        // Update analytics
        analytics.totalVolume += request.amount;
        analytics.averageProcessingTime = (analytics.averageProcessingTime + processingTime) / 2;

        request.status = BridgeStatus.COMPLETED;
        request.txHash = txHash;

        // Distribute fees
        _distributeBridgeFees(request);

        emit BridgeCompleted(requestId, txHash, processingTime);
    }

    /**
     * @dev Handle bridge failure with retry logic
     */
    function failBridge(bytes32 requestId, string calldata reason) external onlyRole(OPERATOR_ROLE) {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.PROCESSING || request.status == BridgeStatus.PENDING, "Invalid status");

        request.retryCount++;

        if (request.retryCount >= MAX_RETRY_ATTEMPTS) {
            // Max retries reached - refund user
            _refundBridge(requestId, reason);
        } else {
            // Reset status for retry
            request.status = BridgeStatus.PENDING;
            request.validationStatus = ValidationStatus.PENDING;
            request.deadline = block.timestamp + PROCESSING_TIMEOUT;

            // Clear validator approvals
            for (uint256 i = 0; i < activeValidators.length; i++) {
                request.validatorApprovals[activeValidators[i]] = false;
            }
            request.validatorCount = 0;

            emit BridgeFailed(requestId, reason, request.retryCount);
        }
    }

    /**
     * @dev Refund failed bridge
     */
    function _refundBridge(bytes32 requestId, string memory reason) internal {
        BridgeRequest storage request = bridgeRequests[requestId];

        // Refund tokens to user
        IERC20Upgradeable(request.token).safeTransfer(request.user, request.amount);

        request.status = BridgeStatus.REFUNDED;

        emit BridgeFailed(requestId, reason, request.retryCount);
    }

    /**
     * @dev Distribute bridge fees across ARC ecosystem
     */
    function _distributeBridgeFees(BridgeRequest storage request) internal {
        ChainConfig storage config = chainConfigs[request.targetChainId];
        uint256 totalFee = request.amount - request.amountAfterFee;

        // Treasury fee (70%)
        uint256 treasuryFee = (totalFee * 7000) / BPS_DENOMINATOR;
        if (treasuryFee > 0 && treasury != address(0)) {
            IERC20Upgradeable(request.token).safeTransfer(treasury, treasuryFee);
        }

        // Staking rewards (20%)
        uint256 stakingFee = (totalFee * 2000) / BPS_DENOMINATOR;
        if (stakingFee > 0 && treasuryRewards != address(0)) {
            IERC20Upgradeable(request.token).safeTransfer(treasuryRewards, stakingFee);
        }

        // Referral fee (10%)
        uint256 referralFee = (totalFee * 1000) / BPS_DENOMINATOR;
        if (referralFee > 0 && request.referralCode != bytes32(0)) {
            // Store referral reward (can be claimed later)
            // referralRewards[request.referralCode] += referralFee;
        }

        analytics.totalFees += totalFee;
    }

    /**
     * @dev Check and reset daily volume limits
     */
    function _checkDailyLimit(ChainConfig storage config, uint256 amount) internal {
        // Reset daily volume if needed
        if (block.timestamp >= config.lastReset + 24 hours) {
            config.dailyVolume = 0;
            config.lastReset = block.timestamp;
        }

        require(config.dailyVolume + amount <= config.dailyLimit, "Daily limit exceeded");
    }

    /**
     * @dev Add bridge validator
     */
    function addValidator(address validator, uint256 stakeAmount) external onlyRole(ADMIN_ROLE) {
        require(activeValidators.length < MAX_VALIDATORS, "Max validators reached");
        require(stakeAmount >= MIN_VALIDATOR_STAKE, "Insufficient stake");
        require(!bridgeValidators[validator].active, "Already a validator");

        // Transfer stake from validator
        IERC20Upgradeable(arcxToken).safeTransferFrom(msg.sender, address(this), stakeAmount);

        bridgeValidators[validator] = BridgeValidator({
            validator: validator,
            stakeAmount: stakeAmount,
            reputation: 100,
            active: true,
            lastActive: block.timestamp
        });

        activeValidators.push(validator);

        emit ValidatorAdded(validator, stakeAmount);
    }

    /**
     * @dev Remove bridge validator
     */
    function removeValidator(address validator) external onlyRole(ADMIN_ROLE) {
        BridgeValidator storage validatorInfo = bridgeValidators[validator];
        require(validatorInfo.active, "Not an active validator");

        // Return stake
        IERC20Upgradeable(arcxToken).safeTransfer(validator, validatorInfo.stakeAmount);

        validatorInfo.active = false;

        // Remove from active validators array
        for (uint256 i = 0; i < activeValidators.length; i++) {
            if (activeValidators[i] == validator) {
                activeValidators[i] = activeValidators[activeValidators.length - 1];
                activeValidators.pop();
                break;
            }
        }

        emit ValidatorRemoved(validator);
    }

    /**
     * @dev Emergency pause
     */
    function emergencyPause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
        emit EmergencyAction("BRIDGE_PAUSED", msg.sender, block.timestamp);
    }

    /**
     * @dev Emergency unpause
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction("BRIDGE_UNPAUSED", msg.sender, block.timestamp);
    }

    /**
     * @dev Update chain configuration
     */
    function updateChainConfig(
        uint256 chainId,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 bridgeFee,
        uint256 dailyLimit
    ) external onlyRole(GOVERNANCE_ROLE) {
        ChainConfig storage config = chainConfigs[chainId];
        require(config.active, "Chain not configured");

        config.minBridgeAmount = minAmount;
        config.maxBridgeAmount = maxAmount;
        config.bridgeFee = bridgeFee;
        config.dailyLimit = dailyLimit;
    }

    /**
     * @dev Add supported token
     */
    function addSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        supportedTokens[token] = true;
    }

    /**
     * @dev Remove supported token
     */
    function removeSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        supportedTokens[token] = false;
    }

    /**
     * @dev Get bridge request details
     */
    function getBridgeRequest(bytes32 requestId) external view returns (
        address user,
        address token,
        uint256 amount,
        uint256 targetChainId,
        string memory targetAddress,
        BridgeStatus status,
        uint256 timestamp,
        bytes32 txHash
    ) {
        BridgeRequest storage request = bridgeRequests[requestId];
        return (
            request.user,
            request.token,
            request.amount,
            request.targetChainId,
            request.targetAddress,
            request.status,
            request.timestamp,
            request.txHash
        );
    }

    /**
     * @dev Get analytics data
     */
    function getAnalytics() external view returns (
        uint256 totalVolume,
        uint256 totalFees,
        uint256 totalBridges,
        uint256 uniqueUsers,
        uint256 failedBridges
    ) {
        return (
            analytics.totalVolume,
            analytics.totalFees,
            analytics.totalBridges,
            analytics.uniqueUsers,
            analytics.failedBridges
        );
    }

    /**
     * @dev Get validator info
     */
    function getValidatorInfo(address validator) external view returns (
        uint256 stakeAmount,
        uint256 reputation,
        bool active,
        uint256 lastActive
    ) {
        BridgeValidator memory info = bridgeValidators[validator];
        return (
            info.stakeAmount,
            info.reputation,
            info.active,
            info.lastActive
        );
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
