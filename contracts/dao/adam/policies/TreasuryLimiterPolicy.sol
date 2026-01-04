// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../interfaces/IAdamPolicy.sol";

/**
 * @title TreasuryLimiterPolicy - Treasury Budget Management Policy
 * @dev Constitutional policy that enforces treasury spending limits
 * @notice Enforces epoch-based budget caps and grant requirements
 *
 * Rules enforced:
 * - Total epoch spending cannot exceed cap
 * - Large allocations require grant approval
 * - Emergency withdrawals require special authorization
 */
contract TreasuryLimiterPolicy is IAdamPolicy {
    // Verdict constants
    uint8 public constant VERDICT_ALLOW = 0;
    uint8 public constant VERDICT_DENY = 1;
    uint8 public constant VERDICT_REQUIRE_2FA = 3;

    // State
    bytes32 private _wasmHash;
    address public admin;
    address public treasury;

    // Budget tracking
    uint256 public epochDuration = 30 days;
    uint256 public currentEpoch;
    uint256 public epochStartTime;
    uint256 public epochBudgetCap;
    uint256 public epochSpent;
    uint256 public largeTxThreshold;

    // Grant tracking
    mapping(bytes32 => bool) public approvedGrants;

    event EpochBudgetSet(uint256 indexed epoch, uint256 cap);
    event EpochReset(uint256 indexed epoch, uint256 timestamp);
    event GrantApproved(bytes32 indexed grantId);
    event SpendingRecorded(uint256 indexed epoch, uint256 amount, uint256 totalSpent);

    modifier onlyAdmin() {
        require(msg.sender == admin, "TreasuryLimiter: not admin");
        _;
    }

    constructor(
        address _admin,
        address _treasury,
        bytes32 wasmHashValue,
        uint256 _epochBudgetCap,
        uint256 _largeTxThreshold
    ) {
        admin = _admin;
        treasury = _treasury;
        _wasmHash = wasmHashValue;
        epochBudgetCap = _epochBudgetCap;
        largeTxThreshold = _largeTxThreshold;
        epochStartTime = block.timestamp;
        currentEpoch = 1;
    }

    /**
     * @dev Get Wasm hash for this policy
     */
    function wasmHash() external view override returns (bytes32) {
        return _wasmHash;
    }

    /**
     * @dev Evaluate treasury action against budget limits
     * @param ctx Context containing treasury action details
     * @return verdict ALLOW, DENY, or REQUIRE_2FA based on evaluation
     * @return data Empty bytes or reason for denial
     */
    function evaluate(bytes calldata ctx) external view override returns (uint8 verdict, bytes memory data) {
        if (ctx.length == 0) {
            return (VERDICT_DENY, "Empty context");
        }

        // Check if epoch needs reset
        if (block.timestamp >= epochStartTime + epochDuration) {
            // New epoch - would be reset in actual execution
            // For evaluation, assume fresh budget
            return _evaluateWithFreshBudget(ctx);
        }

        // Parse context - expect: (amount, recipient, grantId)
        // Format: 32 bytes amount, 20 bytes recipient, 32 bytes grantId
        require(ctx.length >= 84, "TreasuryLimiter: invalid context length");
        
        uint256 amount = uint256(bytes32(ctx[0:32]));
        address recipient = address(bytes20(ctx[32:52]));
        bytes32 grantId = bytes32(ctx[52:84]);

        // Check if this would exceed budget
        if (epochSpent + amount > epochBudgetCap) {
            return (VERDICT_DENY, "Epoch budget exceeded");
        }

        // Check if recipient is zero address
        if (recipient == address(0)) {
            return (VERDICT_DENY, "Invalid recipient");
        }

        // Check if large transaction requires 2FA
        if (amount >= largeTxThreshold) {
            return (VERDICT_REQUIRE_2FA, "Large transaction requires 2FA");
        }

        // Check if grant approval required
        if (grantId != bytes32(0)) {
            if (!approvedGrants[grantId]) {
                return (VERDICT_DENY, "Grant not approved");
            }
        }

        return (VERDICT_ALLOW, "");
    }

    /**
     * @dev Evaluate with fresh budget (for new epoch)
     */
    function _evaluateWithFreshBudget(bytes calldata ctx) internal view returns (uint8, bytes memory) {
        uint256 amount = uint256(bytes32(ctx[0:32]));
        address recipient = address(bytes20(ctx[32:52]));
        bytes32 grantId = bytes32(ctx[52:84]);

        // Check if amount exceeds cap for a single epoch
        if (amount > epochBudgetCap) {
            return (VERDICT_DENY, "Amount exceeds epoch budget cap");
        }

        if (recipient == address(0)) {
            return (VERDICT_DENY, "Invalid recipient");
        }

        if (amount >= largeTxThreshold) {
            return (VERDICT_REQUIRE_2FA, "Large transaction requires 2FA");
        }

        if (grantId != bytes32(0) && !approvedGrants[grantId]) {
            return (VERDICT_DENY, "Grant not approved");
        }

        return (VERDICT_ALLOW, "");
    }

    /**
     * @dev Record spending (called by treasury after successful execution)
     */
    function recordSpending(uint256 amount) external {
        require(msg.sender == treasury || msg.sender == admin, "TreasuryLimiter: not authorized");
        
        // Check if epoch needs reset
        if (block.timestamp >= epochStartTime + epochDuration) {
            _resetEpoch();
        }

        epochSpent += amount;
        emit SpendingRecorded(currentEpoch, amount, epochSpent);
    }

    /**
     * @dev Reset epoch (internal)
     */
    function _resetEpoch() internal {
        currentEpoch++;
        epochStartTime = block.timestamp;
        epochSpent = 0;
        emit EpochReset(currentEpoch, block.timestamp);
    }

    /**
     * @dev Set epoch budget cap
     */
    function setEpochBudgetCap(uint256 newCap) external onlyAdmin {
        require(newCap > 0, "TreasuryLimiter: cap must be > 0");
        epochBudgetCap = newCap;
        emit EpochBudgetSet(currentEpoch, newCap);
    }

    /**
     * @dev Set large transaction threshold
     */
    function setLargeTxThreshold(uint256 threshold) external onlyAdmin {
        largeTxThreshold = threshold;
    }

    /**
     * @dev Approve a grant
     */
    function approveGrant(bytes32 grantId) external onlyAdmin {
        require(grantId != bytes32(0), "TreasuryLimiter: invalid grant ID");
        approvedGrants[grantId] = true;
        emit GrantApproved(grantId);
    }

    /**
     * @dev Revoke grant approval
     */
    function revokeGrant(bytes32 grantId) external onlyAdmin {
        approvedGrants[grantId] = false;
    }

    /**
     * @dev Set epoch duration
     */
    function setEpochDuration(uint256 duration) external onlyAdmin {
        require(duration >= 1 days, "TreasuryLimiter: min 1 day");
        require(duration <= 365 days, "TreasuryLimiter: max 365 days");
        epochDuration = duration;
    }

    /**
     * @dev Manually reset epoch (admin only, for emergencies)
     */
    function resetEpoch() external onlyAdmin {
        _resetEpoch();
    }

    /**
     * @dev Get current budget status
     */
    function getBudgetStatus() external view returns (
        uint256 epoch,
        uint256 cap,
        uint256 spent,
        uint256 remaining,
        uint256 timeLeft
    ) {
        epoch = currentEpoch;
        cap = epochBudgetCap;
        spent = epochSpent;
        remaining = cap > spent ? cap - spent : 0;
        
        uint256 epochEnd = epochStartTime + epochDuration;
        timeLeft = block.timestamp < epochEnd ? epochEnd - block.timestamp : 0;
    }

    /**
     * @dev Transfer admin role
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "TreasuryLimiter: zero address");
        admin = newAdmin;
    }

    /**
     * @dev Update treasury address
     */
    function setTreasury(address newTreasury) external onlyAdmin {
        require(newTreasury != address(0), "TreasuryLimiter: zero address");
        treasury = newTreasury;
    }
}
