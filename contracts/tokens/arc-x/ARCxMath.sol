// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

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
