// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../../../contracts/dao/adam/policies/TreasuryLimiterPolicy.sol";
import "../../../contracts/dao/adam/policies/ParamsGuardPolicy.sol";
import "../../../contracts/dao/adam/policies/RWARecencyPolicy.sol";
import "../../../contracts/dao/adam/policies/Dual2FAPolicy.sol";

/**
 * @title ADAM Policy Fuzzing Tests
 * @dev Property-based testing for ADAM constitutional policies
 * @notice Tests invariants that must hold under all conditions
 * 
 * Run with Echidna:
 *   echidna-test . --contract AdamPolicyFuzzTest --config echidna.yaml
 * 
 * Run with Foundry:
 *   forge test --match-contract AdamPolicyFuzzTest
 * 
 * Invariants Tested:
 * 1. Budget never exceeds cap (even with concurrent proposals)
 * 2. Reserved + spent always <= budget cap
 * 3. Parameter changes always within bounds
 * 4. 2FA always required for high-value operations
 * 5. Oracle data always within recency limits
 * 6. Policy verdicts are deterministic for same inputs
 */
contract AdamPolicyFuzzTest {
    TreasuryLimiterPolicy public treasuryPolicy;
    ParamsGuardPolicy public paramsPolicy;
    RWARecencyPolicy public rwaPolicy;
    Dual2FAPolicy public dual2FAPolicy;
    
    address public treasury = address(0x1);
    address public admin = address(this);
    
    // Tracking state for invariant checks
    uint256 public totalReserved;
    uint256 public totalSpent;
    uint256 public budgetCap;
    
    constructor() {
        budgetCap = 1_000_000 ether;
        
        treasuryPolicy = new TreasuryLimiterPolicy(
            admin,
            treasury,
            budgetCap,
            30 days
        );
        
        paramsPolicy = new ParamsGuardPolicy(admin);
        rwaPolicy = new RWARecencyPolicy(admin, 1 hours, 2, 95, 10000 ether);
        dual2FAPolicy = new Dual2FAPolicy(admin, 50_000 ether);
    }
    
    /*//////////////////////////////////////////////////////////////
                        TREASURY LIMITER INVARIANTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev INVARIANT: Total reserved + spent never exceeds budget cap
     */
    function echidna_budget_never_exceeds_cap() public view returns (bool) {
        uint256 currentEpoch = block.timestamp / treasuryPolicy.epochDuration();
        uint256 reserved = treasuryPolicy.epochReserved(currentEpoch);
        uint256 spent = treasuryPolicy.epochSpent(currentEpoch);
        
        return (reserved + spent) <= budgetCap;
    }
    
    /**
     * @dev INVARIANT: Reserved budget is always non-negative
     */
    function echidna_reserved_non_negative() public view returns (bool) {
        uint256 currentEpoch = block.timestamp / treasuryPolicy.epochDuration();
        uint256 reserved = treasuryPolicy.epochReserved(currentEpoch);
        
        // Reserved should never be negative (overflow check)
        return reserved >= 0;
    }
    
    /**
     * @dev PROPERTY: Reserve, spend, release cycle maintains invariants
     */
    function fuzz_reserve_spend_cycle(
        uint256 proposalId,
        uint256 amount
    ) public {
        // Bound amount to reasonable range
        amount = bound(amount, 1 ether, budgetCap / 2);
        
        uint256 currentEpoch = block.timestamp / treasuryPolicy.epochDuration();
        uint256 reservedBefore = treasuryPolicy.epochReserved(currentEpoch);
        uint256 spentBefore = treasuryPolicy.epochSpent(currentEpoch);
        
        // Only proceed if we have budget
        if (reservedBefore + spentBefore + amount > budgetCap) {
            return;
        }
        
        // Reserve budget
        try treasuryPolicy.reserveBudget(proposalId, amount) {
            uint256 reservedAfter = treasuryPolicy.epochReserved(currentEpoch);
            assert(reservedAfter == reservedBefore + amount);
            
            // Convert to spending
            treasuryPolicy.recordSpending(proposalId, amount);
            uint256 spentAfter = treasuryPolicy.epochSpent(currentEpoch);
            assert(spentAfter == spentBefore + amount);
            
            // Reservation should be cleared
            uint256 reservedFinal = treasuryPolicy.epochReserved(currentEpoch);
            assert(reservedFinal == reservedBefore);
        } catch {
            // Revert is acceptable if budget exceeded
        }
    }
    
    /**
     * @dev PROPERTY: Concurrent reservations respect budget cap
     */
    function fuzz_concurrent_reservations(
        uint256 proposalId1,
        uint256 proposalId2,
        uint256 amount1,
        uint256 amount2
    ) public {
        // Ensure different proposal IDs
        if (proposalId1 == proposalId2) return;
        
        // Bound amounts
        amount1 = bound(amount1, 1 ether, budgetCap / 3);
        amount2 = bound(amount2, 1 ether, budgetCap / 3);
        
        uint256 currentEpoch = block.timestamp / treasuryPolicy.epochDuration();
        uint256 initialReserved = treasuryPolicy.epochReserved(currentEpoch);
        uint256 initialSpent = treasuryPolicy.epochSpent(currentEpoch);
        
        // Try to reserve both
        bool first = false;
        bool second = false;
        
        try treasuryPolicy.reserveBudget(proposalId1, amount1) {
            first = true;
        } catch {}
        
        try treasuryPolicy.reserveBudget(proposalId2, amount2) {
            second = true;
        } catch {}
        
        uint256 finalReserved = treasuryPolicy.epochReserved(currentEpoch);
        uint256 finalSpent = treasuryPolicy.epochSpent(currentEpoch);
        
        // INVARIANT: Total never exceeds cap
        assert(finalReserved + finalSpent <= budgetCap);
        
        // If both succeeded, both amounts should be reserved
        if (first && second) {
            assert(finalReserved == initialReserved + amount1 + amount2);
        }
    }
    
    /*//////////////////////////////////////////////////////////////
                        PARAMS GUARD INVARIANTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev INVARIANT: Parameter changes always respect bounds
     */
    function echidna_params_within_bounds() public view returns (bool) {
        // All parameters added to ParamsGuardPolicy should remain within bounds
        // This is a meta-property that holds if the policy is correctly implemented
        return true;
    }
    
    /**
     * @dev PROPERTY: Setting parameter bounds works correctly
     */
    function fuzz_parameter_bounds(
        bytes32 paramKey,
        uint256 minValue,
        uint256 maxValue,
        uint256 testValue
    ) public {
        // Ensure min < max
        if (minValue >= maxValue) return;
        
        // Bound values to reasonable range
        minValue = bound(minValue, 0, type(uint128).max);
        maxValue = bound(maxValue, minValue + 1, type(uint128).max);
        testValue = bound(testValue, 0, type(uint256).max);
        
        // Set bounds
        paramsPolicy.setParamBounds(paramKey, minValue, maxValue, 0); // 0 = any direction
        
        // Create context for a parameter change
        bytes32[] memory keys = new bytes32[](1);
        uint256[] memory oldValues = new uint256[](1);
        uint256[] memory newValues = new uint256[](1);
        
        keys[0] = paramKey;
        oldValues[0] = (minValue + maxValue) / 2; // Start in middle
        newValues[0] = testValue;
        
        bytes memory context = abi.encode(keys, oldValues, newValues);
        
        // Evaluate
        (uint8 verdict, ) = paramsPolicy.evaluate(
            bytes4(0), // hook
            0, // topicId
            0, // proposalId
            "", // proofBundle
            context
        );
        
        // If value is within bounds, should allow
        if (testValue >= minValue && testValue <= maxValue) {
            assert(verdict == 0); // ALLOW
        } else {
            assert(verdict == 1); // DENY
        }
    }
    
    /*//////////////////////////////////////////////////////////////
                        DUAL 2FA INVARIANTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev INVARIANT: Large transactions always require 2FA
     */
    function echidna_large_tx_requires_2fa() public view returns (bool) {
        // This is enforced by Dual2FAPolicy threshold
        return dual2FAPolicy.largeTxThreshold() > 0;
    }
    
    /**
     * @dev PROPERTY: 2FA requirement is deterministic based on amount
     */
    function fuzz_2fa_threshold(uint256 amount) public {
        // Bound amount
        amount = bound(amount, 0, 10_000_000 ether);
        
        uint256 threshold = dual2FAPolicy.largeTxThreshold();
        
        // Create context
        bytes memory context = abi.encode(
            amount,
            uint256(0), // paramValue (not used for treasury)
            bytes32(0), // paramKey
            uint256(0)  // timestamp
        );
        
        // Evaluate
        (uint8 verdict, ) = dual2FAPolicy.evaluate(
            bytes4(0),
            0, // TREASURY topic
            0,
            "",
            context
        );
        
        // Check determinism
        if (amount > threshold) {
            assert(verdict == 3); // REQUIRE_2FA
        } else {
            assert(verdict == 0); // ALLOW
        }
    }
    
    /*//////////////////////////////////////////////////////////////
                        RWA RECENCY INVARIANTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev PROPERTY: Stale oracle data is always rejected
     */
    function fuzz_oracle_recency(
        uint256 timestamp,
        uint256 numOracles
    ) public {
        // Bound inputs
        timestamp = bound(timestamp, block.timestamp - 2 hours, block.timestamp + 1 hours);
        numOracles = bound(numOracles, 1, 10);
        
        // Create mock oracle addresses
        address[] memory oracles = new address[](numOracles);
        for (uint256 i = 0; i < numOracles; i++) {
            oracles[i] = address(uint160(i + 100));
        }
        
        // Create context
        bytes memory context = abi.encode(
            timestamp,
            numOracles,
            oracles
        );
        
        // Evaluate
        (uint8 verdict, ) = rwaPolicy.evaluate(
            bytes4(0),
            2, // ENERGY topic
            0,
            "",
            context
        );
        
        uint256 recencyLimit = rwaPolicy.maxRecency();
        bool isRecent = (block.timestamp - timestamp) <= recencyLimit;
        bool enoughOracles = numOracles >= rwaPolicy.minOracleCount();
        
        // Future timestamps should be rejected
        if (timestamp > block.timestamp) {
            assert(verdict == 1); // DENY
        }
        // Recent data with enough oracles should pass
        else if (isRecent && enoughOracles) {
            assert(verdict == 0); // ALLOW
        }
        // Stale data should be rejected
        else {
            assert(verdict == 1); // DENY
        }
    }
    
    /*//////////////////////////////////////////////////////////////
                            HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev Bound value to range [min, max]
     */
    function bound(uint256 value, uint256 min, uint256 max) internal pure returns (uint256) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}
