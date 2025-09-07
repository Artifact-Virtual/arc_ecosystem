// SPDX-License-Identifier: MIT
// Immutable library contract
// No owner required for libraries
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

/**
 * @title ARCxMath - Mathematical Operations Library
 * @dev External math library for ARCx V2 Enhanced to optimize contract size
 * @notice Provides gas-optimized mathematical operations for yield, fees, and multipliers
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 * @custom:deployed-on Base L2 Mainnet (Chain ID: 8453)
 * @custom:contract-address 0xdfB7271303467d58F6eFa10461c9870Ed244F530
 * 
 * FEATURES:
 * - Gas-optimized yield calculations for staking rewards
 * - Dynamic fee calculations with basis point precision
 * - Multiplier operations for tier-based rewards
 * - Safe arithmetic operations preventing overflow/underflow
 * 
 * USAGE:
 * - Called by ARCx V2 Enhanced contract for all mathematical operations
 * - Used by staking system for reward calculations
 * - Utilized by fee system for dynamic pricing
 * 
 * TROUBLESHOOTING:
 * - Library functions are pure and cannot fail unless called with invalid parameters
 * - All calculations use basis points (10000 = 100%) to avoid floating point issues
 * - Division by zero is not protected - calling contract must validate inputs
 */
library ARCxMath {
    function calculateYield(uint256 balance, uint256 rate, uint256 time) internal pure returns (uint256) {
        return (balance * rate * time) / (10000 * 365 days);
    }
    
    function calculateFee(uint256 amount, uint256 rate) internal pure returns (uint256) {
        return (amount * rate) / 10000;
    }
    
    function applyMultiplier(uint256 base, uint256 multiplier) internal pure returns (uint256) {
        return (base * multiplier) / 10000;
    }
}
