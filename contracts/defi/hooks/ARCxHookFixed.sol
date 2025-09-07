// SPDX-License-Identifier: MIT
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
