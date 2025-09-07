// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title ARCx Minimal Hook - Ultra Simple Version
 * @dev Minimal contract with predictable gas for testing deployment
 * No external dependencies - pure Solidity
 */
contract ARCxHook {
    
    // Simple constants - no computation needed
    uint24 public constant BASE_FEE = 2500; // 0.25% in basis points
    uint256 public constant MEV_DELAY = 2 seconds;
    
    // Simple state variables
    address public owner;
    bool public paused;
    
    // Simple mapping for MEV protection
    mapping(address => uint256) public lastSwapTime;
    
    // Simple events
    event SwapExecuted(address indexed user, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Simple errors
    error Unauthorized();
    error Paused();
    error TooSoon();
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    modifier notPaused() {
        if (paused) revert Paused();
        _;
    }
    
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    /**
     * @dev Simple swap function with MEV protection
     * Predictable gas usage - only basic operations
     */
    function executeSwap() external notPaused {
        // Check MEV delay
        if (lastSwapTime[msg.sender] != 0 && 
            block.timestamp < lastSwapTime[msg.sender] + MEV_DELAY) {
            revert TooSoon();
        }
        
        // Update timestamp (single storage write)
        lastSwapTime[msg.sender] = block.timestamp;
        
        // Emit event
        emit SwapExecuted(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Simple administrative functions
     */
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    /**
     * @dev View functions - no state changes, predictable gas
     */
    function canSwap(address user) external view returns (bool) {
        if (paused) return false;
        if (lastSwapTime[user] == 0) return true;
        return block.timestamp >= lastSwapTime[user] + MEV_DELAY;
    }
    
    function getNextSwapTime(address user) external view returns (uint256) {
        if (lastSwapTime[user] == 0) return 0;
        return lastSwapTime[user] + MEV_DELAY;
    }
    
    function getTimeUntilNextSwap(address user) external view returns (uint256) {
        if (lastSwapTime[user] == 0) return 0;
        uint256 nextTime = lastSwapTime[user] + MEV_DELAY;
        if (block.timestamp >= nextTime) return 0;
        return nextTime - block.timestamp;
    }
}
