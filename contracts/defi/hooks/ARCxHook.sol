// SPDX-License-Identifier: MIT
// Immutable contract
// Treasury Safe = owner
// Gas-Fixed ARCx Hook for Uniswap V4

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ARCx Advanced Uniswap V4 Hook - Gas Predictable
 * @dev Simplified hook with predictable gas consumption for Uniswap V4 integration
 * @notice Fixed gas estimation issues while maintaining core MEV protection
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.2.0-gas-fixed
 * @custom:deployed-on Base L2 Mainnet (Chain ID: 8453)
 * @custom:gas-optimized Fixed "unpredictable gas limit" errors
 * 
 * FEATURES:
 * - Simple fixed fee structure (no dynamic calculations)
 * - Basic MEV protection with timestamp checks
 * - Minimal state changes for predictable gas
 * - Emergency controls maintained
 * 
 * GAS OPTIMIZATIONS:
 * - Removed complex volatility calculations
 * - Simplified fee structure
 * - Minimal storage reads/writes
 * - No external calls during estimation
 */
contract ARCxAdvancedHook is Ownable, ReentrancyGuard {
    
    // Simplified configuration
    struct HookConfig {
        uint64 baseFee;           // Fixed fee in basis points
        uint64 mevDelay;          // MEV protection delay
        bool enabled;             // Hook enabled/disabled
        bool paused;              // Emergency pause
    }
    
    // Minimal trader tracking
    mapping(address => uint256) public lastTradeTime;
    
    HookConfig public config;
    
    event FeeSet(uint64 newFee);
    event HookPaused(bool paused);
    event TradeBlocked(address trader, string reason);
    
    constructor() {
        config = HookConfig({
            baseFee: 25,      // 0.25%
            mevDelay: 2,      // 2 seconds
            enabled: true,
            paused: false
        });
    }
    
    /**
     * @dev Simple configuration update
     */
    function updateConfig(
        uint64 _baseFee,
        uint64 _mevDelay
    ) external onlyOwner {
        require(_baseFee <= 1000, "Fee too high"); // Max 10%
        
        config.baseFee = _baseFee;
        config.mevDelay = _mevDelay;
        
        emit FeeSet(_baseFee);
    }
    
    /**
     * @dev Emergency controls
     */
    function setPaused(bool _paused) external onlyOwner {
        config.paused = _paused;
        emit HookPaused(_paused);
    }
    
    /**
     * @dev Before swap hook - simplified and gas predictable
     */
    function beforeSwap(
        address trader,
        uint256 /* amountIn */,
        uint256 /* currentPrice */
    ) external view returns (uint256 feeRate, bool allowed) {
        // Check if hook is enabled and not paused
        if (!config.enabled || config.paused) {
            return (0, false);
        }
        
        // Simple MEV protection check
        if (config.mevDelay > 0 && lastTradeTime[trader] > 0) {
            if (block.timestamp < lastTradeTime[trader] + config.mevDelay) {
                return (0, false); // MEV protection triggered
            }
        }
        
        // Return fixed fee rate
        return (config.baseFee, true);
    }
    
    /**
     * @dev After swap hook - minimal state update
     */
    function afterSwap(
        address trader,
        uint256 /* amountIn */,
        uint256 /* newPrice */
    ) external {
        require(config.enabled && !config.paused, "Hook disabled");
        
        // Simple state update - just record timestamp
        lastTradeTime[trader] = block.timestamp;
    }
    
    /**
     * @dev Toggle hook features
     */
    function toggleFeatures(
        bool _enabled,
        bool _paused
    ) external onlyOwner {
        config.enabled = _enabled;
        config.paused = _paused;
        
        emit HookPaused(_paused);
    }
    
    /**
     * @dev View functions
     */
    function getConfig() external view returns (HookConfig memory) {
        return config;
    }
    
    function isTradeAllowed(address trader) external view returns (bool) {
        if (!config.enabled || config.paused) {
            return false;
        }
        
        if (config.mevDelay > 0 && lastTradeTime[trader] > 0) {
            return block.timestamp >= lastTradeTime[trader] + config.mevDelay;
        }
        
        return true;
    }
}
        bool paused;              // Emergency pause
    }
    
    // Gas-optimized volatility tracking
    struct VolatilityData {
        uint128 lastPrice;        // Last recorded price
        uint64 lastUpdate;        // Last update timestamp
        uint64 volatilityScore;   // Current volatility score (0-1000)
    }
    
    // Gas-optimized MEV protection
    struct TraderData {
        uint64 lastTradeTime;     // Last trade timestamp
        uint32 tradesInBlock;     // Trades in current block
        uint32 totalTrades;       // Total trades (for analytics)
    }
    
    // State variables
    HookConfig public config;
    VolatilityData public volatility;
    mapping(address => TraderData) public traderData;
    mapping(uint256 => uint256) public blockTradeCount; // Block number => trade count
    
    // Constants for gas optimization
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant MAX_VOLATILITY = 1000;
    uint256 private constant PRICE_CHANGE_THRESHOLD = 500; // 5% price change
    uint256 private constant VOLATILITY_DECAY = 50; // Decay per update
    
    // Events (gas-optimized with indexed parameters)
    event FeeAdjusted(uint256 indexed newFee, uint256 indexed volatilityScore);
    event MEVBlocked(address indexed trader, uint256 indexed timestamp);
    event SandwichPrevented(address indexed trader, uint256 indexed amount);
    event ConfigUpdated(uint64 baseFee, uint64 maxFee, uint64 mevDelay);
    
    constructor() {
        // Initialize with gas-efficient defaults
        config = HookConfig({
            baseFee: 30,              // 0.3%
            maxFee: 100,              // 1.0%
            mevDelay: 2,              // 2 seconds
            maxTradesPerBlock: 5,     // Max 5 trades per block
            dynamicFeesEnabled: true,
            antiSandwichEnabled: true,
            paused: false
        });
        
        volatility = VolatilityData({
            lastPrice: 0,
            lastUpdate: uint64(block.timestamp),
            volatilityScore: 0
        });
    }
    
    /**
     * @dev Before swap hook - gas-optimized MEV and fee calculation
     */
    function beforeSwap(
        address trader,
        uint256 amountIn,
        uint256 currentPrice
    ) external view returns (uint256 feeRate, bool allowed) {
        // Early return if paused
        if (config.paused) {
            return (0, false);
        }
        
        // Gas-efficient MEV protection check
        TraderData memory traderInfo = traderData[trader];
        if (config.mevDelay > 0 && traderInfo.lastTradeTime > 0) {
            if (block.timestamp < traderInfo.lastTradeTime + config.mevDelay) {
                return (0, false); // MEV protection triggered
            }
        }
        
        // Check trades per block limit (gas-efficient)
        if (traderInfo.tradesInBlock >= config.maxTradesPerBlock && 
            block.number == (traderInfo.lastTradeTime >> 32)) { // Approximate block check
            return (0, false); // Too many trades in block
        }
        
        // Gas-efficient dynamic fee calculation
        if (config.dynamicFeesEnabled) {
            feeRate = _calculateDynamicFee(amountIn, currentPrice);
        } else {
            feeRate = config.baseFee;
        }
        
        return (feeRate, true);
    }
    
    /**
     * @dev After swap hook - gas-optimized state updates
     */
    function afterSwap(
        address trader,
        uint256 amountIn,
        uint256 newPrice
    ) external nonReentrant {
        require(!config.paused, "Hook paused");
        
        // Gas-efficient trader data update
        TraderData storage data = traderData[trader];
        uint64 currentTime = uint64(block.timestamp);
        
        // Reset block counter if new block
        if (block.number != (data.lastTradeTime >> 32)) {
            data.tradesInBlock = 1;
        } else {
            data.tradesInBlock++;
        }
        
        data.lastTradeTime = currentTime;
        data.totalTrades++;
        
        // Gas-efficient volatility update (only if significant change)
        if (config.dynamicFeesEnabled && volatility.lastPrice > 0) {
            _updateVolatilityOptimized(newPrice);
        } else if (volatility.lastPrice == 0) {
            // First price update
            volatility.lastPrice = uint128(newPrice);
            volatility.lastUpdate = currentTime;
        }
        
        // Update block trade count for analytics
        blockTradeCount[block.number]++;
    }
    
    /**
     * @dev Gas-optimized dynamic fee calculation
     */
    function _calculateDynamicFee(
        uint256 amountIn,
        uint256 currentPrice
    ) internal view returns (uint256) {
        uint256 baseFeeRate = config.baseFee;
        
        // Size-based fee adjustment (gas-efficient thresholds)
        if (amountIn > 10000 ether) {
            baseFeeRate = baseFeeRate * 150 / 100; // +50% for whale trades
        } else if (amountIn > 1000 ether) {
            baseFeeRate = baseFeeRate * 125 / 100; // +25% for large trades
        }
        
        // Volatility-based adjustment (bounded calculation)
        uint256 volatilityMultiplier = 100 + (volatility.volatilityScore * 50 / MAX_VOLATILITY);
        baseFeeRate = baseFeeRate * volatilityMultiplier / 100;
        
        // Cap at maximum fee
        if (baseFeeRate > config.maxFee) {
            baseFeeRate = config.maxFee;
        }
        
        return baseFeeRate;
    }
    
    /**
     * @dev Gas-optimized volatility tracking
     */
    function _updateVolatilityOptimized(uint256 newPrice) internal {
        uint128 lastPrice = volatility.lastPrice;
        uint64 currentTime = uint64(block.timestamp);
        
        // Only update if enough time has passed (gas optimization)
        if (currentTime < volatility.lastUpdate + 60) {
            return; // Skip update if less than 1 minute
        }
        
        // Calculate price change (bounded to prevent overflow)
        uint256 priceChange;
        if (newPrice > lastPrice) {
            priceChange = ((newPrice - lastPrice) * BASIS_POINTS) / lastPrice;
        } else {
            priceChange = ((lastPrice - newPrice) * BASIS_POINTS) / lastPrice;
        }
        
        // Update volatility score (bounded calculation)
        if (priceChange > PRICE_CHANGE_THRESHOLD) {
            volatility.volatilityScore = uint64(
                volatility.volatilityScore + (priceChange / 10)
            );
            if (volatility.volatilityScore > MAX_VOLATILITY) {
                volatility.volatilityScore = uint64(MAX_VOLATILITY);
            }
        } else {
            // Decay volatility
            if (volatility.volatilityScore > VOLATILITY_DECAY) {
                volatility.volatilityScore -= uint64(VOLATILITY_DECAY);
            } else {
                volatility.volatilityScore = 0;
            }
        }
        
        volatility.lastPrice = uint128(newPrice);
        volatility.lastUpdate = currentTime;
        
        emit FeeAdjusted(_calculateDynamicFee(0, newPrice), volatility.volatilityScore);
    }
    
    /**
     * @dev Update hook configuration (gas-optimized)
     */
    function updateConfig(
        uint64 _baseFee,
        uint64 _maxFee,
        uint64 _mevDelay,
        uint64 _maxTradesPerBlock
    ) external onlyOwner {
        require(_baseFee <= 200, "Base fee too high"); // Max 2%
        require(_maxFee <= 500, "Max fee too high");   // Max 5%
        require(_maxFee >= _baseFee, "Invalid fee range");
        require(_maxTradesPerBlock > 0 && _maxTradesPerBlock <= 20, "Invalid trade limit");
        
        config.baseFee = _baseFee;
        config.maxFee = _maxFee;
        config.mevDelay = _mevDelay;
        config.maxTradesPerBlock = _maxTradesPerBlock;
        
        emit ConfigUpdated(_baseFee, _maxFee, _mevDelay);
    }
    
    /**
     * @dev Toggle features (gas-efficient)
     */
    function toggleFeatures(
        bool _dynamicFees,
        bool _antiSandwich,
        bool _paused
    ) external onlyOwner {
        config.dynamicFeesEnabled = _dynamicFees;
        config.antiSandwichEnabled = _antiSandwich;
        config.paused = _paused;
    }
    
    /**
     * @dev Emergency pause/unpause
     */
    function emergencyPause() external onlyOwner {
        config.paused = !config.paused;
    }
    
    /**
     * @dev View functions for monitoring (gas-efficient)
     */
    function getCurrentFee(uint256 amountIn, uint256 currentPrice) external view returns (uint256) {
        if (config.paused) return 0;
        return config.dynamicFeesEnabled ? 
            _calculateDynamicFee(amountIn, currentPrice) : 
            config.baseFee;
    }
    
    function getTraderInfo(address trader) external view returns (
        uint64 lastTradeTime,
        uint32 tradesInBlock,
        uint32 totalTrades,
        bool canTrade
    ) {
        TraderData memory data = traderData[trader];
        bool canTradeNow = !config.paused && 
            (data.lastTradeTime == 0 || block.timestamp >= data.lastTradeTime + config.mevDelay) &&
            (data.tradesInBlock < config.maxTradesPerBlock || block.number != (data.lastTradeTime >> 32));
            
        return (data.lastTradeTime, data.tradesInBlock, data.totalTrades, canTradeNow);
    }
    
    function getVolatilityInfo() external view returns (
        uint128 lastPrice,
        uint64 lastUpdate,
        uint64 volatilityScore
    ) {
        return (volatility.lastPrice, volatility.lastUpdate, volatility.volatilityScore);
    }
    
    /**
     * @dev Reset volatility (emergency function)
     */
    function resetVolatility() external onlyOwner {
        volatility.volatilityScore = 0;
        volatility.lastUpdate = uint64(block.timestamp);
    }
    
    /**
     * @dev Batch update trader data (for migration or corrections)
     */
    function batchUpdateTraders(
        address[] calldata traders,
        uint32[] calldata totalTrades
    ) external onlyOwner {
        require(traders.length == totalTrades.length, "Array length mismatch");
        require(traders.length <= 50, "Batch too large"); // Gas limit protection
        
        for (uint256 i = 0; i < traders.length; i++) {
            traderData[traders[i]].totalTrades = totalTrades[i];
        }
    }
}
