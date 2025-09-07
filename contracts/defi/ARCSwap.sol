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
 * @title ARC Swap V2
 * @dev Advanced cross-chain swap contract for ARC Exchange
 * @notice Enterprise-grade DEX functionality with ARCx V2 Enhanced integration
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 */
contract ARCSwap is
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
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    // Order types
    enum OrderType { MARKET, LIMIT, STOP_LOSS, STOP_LIMIT }
    enum OrderStatus { PENDING, PARTIAL, COMPLETED, CANCELLED, EXPIRED }

    // Advanced swap order structure
    struct SwapOrder {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        uint256 amountOut; // Actual amount received
        uint256 price; // For limit orders
        uint256 deadline;
        OrderType orderType;
        OrderStatus status;
        uint256 filledAmount;
        uint256 createdAt;
        uint256 updatedAt;
        bytes32 referralCode;
    }

    // Fee structure
    struct FeeStructure {
        uint256 protocolFee; // Basis points (e.g., 25 = 0.25%)
        uint256 lpFee; // Fee to liquidity providers
        uint256 treasuryFee; // Fee to ARC treasury
        uint256 referralFee; // Fee for referrers
    }

    // Liquidity pool info
    struct LiquidityPool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        uint256 lastUpdated;
        bool active;
    }

    // Analytics structure
    struct SwapAnalytics {
        uint256 totalVolume;
        uint256 totalFees;
        uint256 totalSwaps;
        uint256 uniqueUsers;
        uint256 lastUpdated;
    }

    // State variables
    mapping(bytes32 => SwapOrder) public swapOrders;
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => LiquidityPool) public liquidityPools;
    mapping(address => uint256) public userSwapCount;
    mapping(bytes32 => uint256) public referralRewards;

    FeeStructure public feeStructure;
    SwapAnalytics public analytics;

    // ARC ecosystem V2 integration
    address public arcxToken; // ARCx V2 Enhanced token
    address public arcsToken;
    address public treasuryRewards;
    address public stakingVault;
    address public treasury;
    address public uniswapV4Hook; // MEV protection integration

    uint256 public minSwapAmount;
    uint256 public maxSwapAmount;
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MAX_SLIPPAGE = 500; // 5%

    // Events
    event SwapInitiated(
        bytes32 indexed orderId,
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        OrderType orderType
    );

    event SwapExecuted(
        bytes32 indexed orderId,
        address indexed user,
        uint256 amountOut,
        uint256 protocolFee,
        uint256 lpFee,
        uint256 treasuryFee
    );

    event SwapCancelled(
        bytes32 indexed orderId,
        address indexed user,
        string reason
    );

    event LiquidityAdded(
        bytes32 indexed poolId,
        address indexed provider,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    );

    event FeesDistributed(
        uint256 treasuryAmount,
        uint256 stakingAmount,
        uint256 lpAmount
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
     * @dev Initialize the contract
     */
    function initialize(
        address admin,
        address _arcxToken,
        address _arcsToken,
        address _treasuryRewards,
        address _stakingVault,
        address _treasury
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(GOVERNANCE_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);

        arcxToken = _arcxToken;
        arcsToken = _arcsToken;
        treasuryRewards = _treasuryRewards;
        stakingVault = _stakingVault;
        treasury = _treasury;

        // Default fee structure
        feeStructure = FeeStructure({
            protocolFee: 25, // 0.25%
            lpFee: 15, // 0.15%
            treasuryFee: 5, // 0.05%
            referralFee: 5 // 0.05%
        });

        minSwapAmount = 1e6; // 1 USDC equivalent
        maxSwapAmount = 1000000e18; // 1M tokens
    }

    /**
     * @dev Advanced swap initiation with multiple order types
     */
    function initiateSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 price,
        OrderType orderType,
        uint256 deadline,
        bytes32 referralCode
    ) external nonReentrant whenNotPaused returns (bytes32) {
        require(supportedTokens[tokenIn] && supportedTokens[tokenOut], "Tokens not supported");
        require(amountIn >= minSwapAmount && amountIn <= maxSwapAmount, "Amount out of range");
        require(deadline > block.timestamp && deadline <= block.timestamp + 7 days, "Invalid deadline");
        require(tokenIn != tokenOut, "Cannot swap same token");

        // Validate slippage
        if (amountOutMin > 0) {
            uint256 slippage = ((amountIn - amountOutMin) * BPS_DENOMINATOR) / amountIn;
            require(slippage <= MAX_SLIPPAGE, "Slippage too high");
        }

        // Transfer tokens from user
        IERC20Upgradeable(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Generate order ID
        bytes32 orderId = keccak256(
            abi.encodePacked(
                msg.sender,
                tokenIn,
                tokenOut,
                amountIn,
                block.timestamp,
                block.number
            )
        );

        // Store swap order
        swapOrders[orderId] = SwapOrder({
            user: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOutMin: amountOutMin,
            amountOut: 0,
            price: price,
            deadline: deadline,
            orderType: orderType,
            status: OrderStatus.PENDING,
            filledAmount: 0,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            referralCode: referralCode
        });

        // Update analytics
        analytics.totalSwaps++;
        if (userSwapCount[msg.sender] == 0) {
            analytics.uniqueUsers++;
        }
        userSwapCount[msg.sender]++;

        emit SwapInitiated(orderId, msg.sender, tokenIn, tokenOut, amountIn, amountOutMin, orderType);

        return orderId;
    }

    /**
     * @dev Execute swap order with advanced fee distribution
     */
    function executeSwap(
        bytes32 orderId,
        uint256 amountOut,
        uint256 oraclePrice
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        SwapOrder storage order = swapOrders[orderId];
        require(order.status == OrderStatus.PENDING, "Order not pending");
        require(order.deadline >= block.timestamp, "Order expired");
        require(amountOut >= order.amountOutMin, "Slippage too high");

        // Calculate fees
        uint256 totalFee = (amountOut * feeStructure.protocolFee) / BPS_DENOMINATOR;
        uint256 treasuryFee = (amountOut * feeStructure.treasuryFee) / BPS_DENOMINATOR;
        uint256 lpFee = (amountOut * feeStructure.lpFee) / BPS_DENOMINATOR;
        uint256 referralFee = 0;

        if (order.referralCode != bytes32(0)) {
            referralFee = (amountOut * feeStructure.referralFee) / BPS_DENOMINATOR;
        }

        uint256 amountOutAfterFees = amountOut - totalFee - referralFee;

        // Update order
        order.amountOut = amountOutAfterFees;
        order.filledAmount = order.amountIn;
        order.status = OrderStatus.COMPLETED;
        order.updatedAt = block.timestamp;

        // Transfer tokens to user
        IERC20Upgradeable(order.tokenOut).safeTransfer(order.user, amountOutAfterFees);

        // Distribute fees
        _distributeFees(order.tokenOut, treasuryFee, lpFee, referralFee, order.referralCode);

        // Update analytics
        analytics.totalVolume += amountOut;
        analytics.totalFees += totalFee + referralFee;

        emit SwapExecuted(orderId, order.user, amountOutAfterFees, totalFee, lpFee, treasuryFee);
    }

    /**
     * @dev Internal fee distribution function
     */
    function _distributeFees(
        address token,
        uint256 treasuryFee,
        uint256 lpFee,
        uint256 referralFee,
        bytes32 referralCode
    ) internal {
        // Treasury fee
        if (treasuryFee > 0 && treasury != address(0)) {
            IERC20Upgradeable(token).safeTransfer(treasury, treasuryFee);
        }

        // LP fee - distribute to staking rewards
        if (lpFee > 0 && treasuryRewards != address(0)) {
            IERC20Upgradeable(token).safeTransfer(treasuryRewards, lpFee);
        }

        // Referral fee
        if (referralFee > 0 && referralCode != bytes32(0)) {
            referralRewards[referralCode] += referralFee;
        }

        emit FeesDistributed(treasuryFee, lpFee, referralFee);
    }

    /**
     * @dev Cancel swap order and refund
     */
    function cancelSwap(bytes32 orderId) external nonReentrant {
        SwapOrder storage order = swapOrders[orderId];
        require(order.user == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        require(order.status == OrderStatus.PENDING, "Order not pending");

        // Refund tokens
        IERC20Upgradeable(order.tokenIn).safeTransfer(order.user, order.amountIn);

        order.status = OrderStatus.CANCELLED;
        order.updatedAt = block.timestamp;

        emit SwapCancelled(orderId, order.user, "User cancelled");
    }

    /**
     * @dev Add liquidity to a pool
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant whenNotPaused returns (bytes32) {
        require(supportedTokens[tokenA] && supportedTokens[tokenB], "Tokens not supported");

        // Transfer tokens
        IERC20Upgradeable(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20Upgradeable(tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        // Create pool ID
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));

        LiquidityPool storage pool = liquidityPools[poolId];
        if (pool.tokenA == address(0)) {
            // New pool
            pool.tokenA = tokenA;
            pool.tokenB = tokenB;
            pool.active = true;
        }

        // Update reserves
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        pool.totalLiquidity += (amountA + amountB) / 2; // Simplified liquidity calculation
        pool.lastUpdated = block.timestamp;

        // Mint LP tokens (simplified)
        uint256 lpTokens = (amountA + amountB) / 2;
        if (arcsToken != address(0)) {
            // Use ARCs as LP token
            IARCsToken(arcsToken).mint(msg.sender, lpTokens);
        }

        emit LiquidityAdded(poolId, msg.sender, tokenA, tokenB, amountA, amountB);

        return poolId;
    }

    /**
     * @dev Emergency pause
     */
    function emergencyPause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
        emit EmergencyAction("CONTRACT_PAUSED", msg.sender, block.timestamp);
    }

    /**
     * @dev Emergency unpause
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction("CONTRACT_UNPAUSED", msg.sender, block.timestamp);
    }

    /**
     * @dev Update fee structure (governance only)
     */
    function updateFeeStructure(
        uint256 _protocolFee,
        uint256 _lpFee,
        uint256 _treasuryFee,
        uint256 _referralFee
    ) external onlyRole(GOVERNANCE_ROLE) {
        require(_protocolFee + _lpFee + _treasuryFee + _referralFee <= 500, "Total fees too high"); // Max 5%

        feeStructure.protocolFee = _protocolFee;
        feeStructure.lpFee = _lpFee;
        feeStructure.treasuryFee = _treasuryFee;
        feeStructure.referralFee = _referralFee;
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
     * @dev Get order details
     */
    function getOrderDetails(bytes32 orderId) external view returns (
        address user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 amountOut,
        OrderType orderType,
        OrderStatus status,
        uint256 filledAmount,
        uint256 deadline
    ) {
        SwapOrder memory order = swapOrders[orderId];
        return (
            order.user,
            order.tokenIn,
            order.tokenOut,
            order.amountIn,
            order.amountOutMin,
            order.amountOut,
            order.orderType,
            order.status,
            order.filledAmount,
            order.deadline
        );
    }

    /**
     * @dev Get analytics data
     */
    function getAnalytics() external view returns (
        uint256 totalVolume,
        uint256 totalFees,
        uint256 totalSwaps,
        uint256 uniqueUsers
    ) {
        return (
            analytics.totalVolume,
            analytics.totalFees,
            analytics.totalSwaps,
            analytics.uniqueUsers
        );
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}

/**
 * @dev Interface for ARCs token
 */
interface IARCsToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}
