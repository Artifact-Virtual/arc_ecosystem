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
    uint256 public epochReserved; // Reserved budget for queued proposals
    uint256 public largeTxThreshold;

    // Grant tracking
    mapping(bytes32 => bool) public approvedGrants;
    
    // Budget reservations for proposals
    mapping(uint256 => uint256) public proposalReservations;

    event EpochBudgetSet(uint256 indexed epoch, uint256 cap);
    event EpochReset(uint256 indexed epoch, uint256 timestamp);
    event GrantApproved(bytes32 indexed grantId);
    event SpendingRecorded(uint256 indexed epoch, uint256 amount, uint256 totalSpent);
    event BudgetReserved(uint256 indexed proposalId, uint256 amount, uint256 totalReserved);
    event BudgetReleased(uint256 indexed proposalId, uint256 amount, uint256 totalReserved);

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
     * 
     * @notice This function is view-only and checks against current epoch budget.
     * Budget reservation should be done via reserveBudget() after this check passes
     * to prevent TOCTOU race conditions.
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

        // Parse context using ABI encoding - expect: (proposalId, amount, recipient, grantId)
        (uint256 proposalId, uint256 amount, address recipient, bytes32 grantId) = abi.decode(
            ctx,
            (uint256, uint256, address, bytes32)
        );

        // Check if this would exceed budget (including reserved amounts)
        if (epochSpent + epochReserved + amount > epochBudgetCap) {
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
        (uint256 proposalId, uint256 amount, address recipient, bytes32 grantId) = abi.decode(
            ctx,
            (uint256, uint256, address, bytes32)
        );

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
     * @dev Reserve budget for a queued proposal (prevents TOCTOU race condition)
     * @param proposalId The proposal ID to reserve budget for
     * @param amount The amount to reserve
     */
    function reserveBudget(uint256 proposalId, uint256 amount) external {
        require(msg.sender == treasury, "TreasuryLimiter: only treasury");
        require(proposalReservations[proposalId] == 0, "TreasuryLimiter: already reserved");
        
        // Check if epoch needs reset
        if (block.timestamp >= epochStartTime + epochDuration) {
            _resetEpoch();
        }

        // Check if reservation would exceed budget
        require(
            epochSpent + epochReserved + amount <= epochBudgetCap,
            "TreasuryLimiter: reservation would exceed budget"
        );

        proposalReservations[proposalId] = amount;
        epochReserved += amount;
        
        emit BudgetReserved(proposalId, amount, epochReserved);
    }

    /**
     * @dev Release budget reservation for a cancelled/rejected proposal
     * @param proposalId The proposal ID to release budget for
     */
    function releaseBudget(uint256 proposalId) external {
        require(msg.sender == treasury, "TreasuryLimiter: only treasury");
        
        uint256 reserved = proposalReservations[proposalId];
        require(reserved > 0, "TreasuryLimiter: no reservation");
        
        proposalReservations[proposalId] = 0;
        epochReserved -= reserved;
        
        emit BudgetReleased(proposalId, reserved, epochReserved);
    }

    /**
     * @dev Record spending (only callable by treasury to prevent admin manipulation)
     * @param proposalId The proposal ID being executed
     * @param amount The amount being spent
     */
    function recordSpending(uint256 proposalId, uint256 amount) external {
        require(msg.sender == treasury, "TreasuryLimiter: only treasury");
        
        // Check if epoch needs reset
        if (block.timestamp >= epochStartTime + epochDuration) {
            _resetEpoch();
        }

        // If there was a reservation, release it first
        uint256 reserved = proposalReservations[proposalId];
        if (reserved > 0) {
            proposalReservations[proposalId] = 0;
            epochReserved -= reserved;
            
            // Use the actual amount, not the reserved amount (could be different)
            require(amount <= epochBudgetCap - epochSpent, "TreasuryLimiter: exceeds budget");
        } else {
            // No reservation - check budget directly
            require(epochSpent + amount <= epochBudgetCap, "TreasuryLimiter: exceeds budget");
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
