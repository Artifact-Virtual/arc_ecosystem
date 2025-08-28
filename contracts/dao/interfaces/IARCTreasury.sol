// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 * @title IARCTreasury - Treasury Contract Interface
 */
interface IARCTreasury {
    struct TreasuryAsset {
        address token;
        uint256 balance;
        uint256 allocated;
        uint256 yieldEarned;
        uint256 lastUpdate;
        bool active;
        uint256 targetAllocation;
        uint256 maxAllocation;
        address strategy;
    }

    struct SpendingProposal {
        uint256 id;
        address proposer;
        address recipient;
        address token;
        uint256 amount;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 approvals;
        uint256 requiredApprovals;
        bool executed;
        bool cancelled;
        bytes32 proposalHash;
    }

    struct YieldStrategy {
        address strategyAddress;
        address token;
        uint256 allocatedAmount;
        uint256 yieldEarned;
        uint256 apy;
        bool active;
        uint256 lastHarvest;
        string name;
        uint256 riskLevel;
    }

    struct TreasuryConfig {
        uint256 proposalTimelock;
        uint256 emergencyTimelock;
        uint256 maxSpendingLimit;
        uint256 requiredApprovals;
        uint256 rebalanceThreshold;
        uint256 yieldHarvestCooldown;
        bool emergencyMode;
        uint256 circuitBreakerThreshold;
    }

    function deposit(address token, uint256 amount) external;

    function proposeSpending(
        address recipient,
        address token,
        uint256 amount,
        string calldata description
    ) external returns (uint256);

    function approveSpending(uint256 proposalId) external;

    function executeSpending(uint256 proposalId) external;

    function emergencyWithdraw(
        address token,
        uint256 amount,
        address recipient
    ) external;

    function addYieldStrategy(
        address strategyAddress,
        address token,
        string calldata name,
        uint256 riskLevel
    ) external;

    function allocateToStrategy(address strategyAddress, uint256 amount) external;

    function harvestYield(address strategyAddress) external;

    function rebalancePortfolio() external;

    function activateEmergency() external;

    function deactivateEmergency() external;

    function getTotalValue() external view returns (uint256);

    function getAnalytics() external view returns (
        uint256 totalValue,
        uint256 totalYield,
        uint256 assetCount,
        uint256 strategyCount
    );

    function approveToken(address token, uint256 targetAllocation, uint256 maxAllocation) external;

    function approveRecipient(address recipient) external;
}
