// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/**
 * @title SBTProxy
 * @notice Upgradeable proxy wrapper for ARCModelSBT
 * @dev Provides upgrade flexibility while maintaining base contract immutability
 */
contract SBTProxy {
    // Storage
    address public currentSBT;
    address public governance;
    
    // Events
    event SBTUpgraded(address indexed oldSBT, address indexed newSBT);
    event GovernanceTransferred(address indexed oldGovernance, address indexed newGovernance);
    
    // Errors
    error NotGovernance();
    error InvalidAddress();
    
    constructor(address sbt_, address governance_) {
        require(sbt_ != address(0), "INVALID_SBT");
        require(governance_ != address(0), "INVALID_GOVERNANCE");
        
        currentSBT = sbt_;
        governance = governance_;
    }
    
    modifier onlyGovernance() {
        if (msg.sender != governance) revert NotGovernance();
        _;
    }
    
    /**
     * @notice Upgrade to a new SBT implementation
     */
    function upgradeSBT(address newSBT) external onlyGovernance {
        if (newSBT == address(0)) revert InvalidAddress();
        
        address oldSBT = currentSBT;
        currentSBT = newSBT;
        
        emit SBTUpgraded(oldSBT, newSBT);
    }
    
    /**
     * @notice Transfer governance
     */
    function transferGovernance(address newGovernance) external onlyGovernance {
        if (newGovernance == address(0)) revert InvalidAddress();
        
        address oldGovernance = governance;
        governance = newGovernance;
        
        emit GovernanceTransferred(oldGovernance, newGovernance);
    }
    
    /**
     * @notice Fallback to delegate all calls to current SBT implementation
     */
    fallback() external payable {
        address implementation = currentSBT;
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    receive() external payable {}
}
