# ADAM Constitutional Policy Engine - Integration Guide

## Overview

This guide explains how to integrate the ADAM (Autonomous Decentralized Artificial Mind) constitutional policy engine with the ARC ecosystem's governance system.

## System Components

### Core ADAM Contracts
- **AdamHost** - Main policy evaluation engine with fuel/memory metering
- **AdamRegistry** - Policy chain management and Wasm hash registry
- **Constitutional Policies** - Specific policy implementations (ParamsGuard, TreasuryLimiter, etc.)

### Integration Layer
- **AdamGovernorIntegration** - Abstract contract for connecting ADAM to ARCGovernor
- **MockEligibility** - Testing utility for eligibility checks

## Integration Architecture

```
┌─────────────────┐
│   ARCGovernor   │
│                 │
│  (proposals,    │
│   voting,       │
│   execution)    │
└────────┬────────┘
         │
         │ extends
         ▼
┌─────────────────────────┐
│ AdamGovernorIntegration │
│                         │
│ _validateWithAdamOn*()  │
└────────┬────────────────┘
         │
         │ calls
         ▼
┌─────────────────┐
│    AdamHost     │
│                 │
│   evaluate()    │
└────────┬────────┘
         │
         │ loads policies
         ▼
┌─────────────────┐
│  AdamRegistry   │
│                 │
│ policyChainOf() │
└────────┬────────┘
         │
         │ chains
         ▼
┌──────────────────────┐
│ Constitutional       │
│ Policies             │
│                      │
│ - ParamsGuard        │
│ - TreasuryLimiter    │
│ - RWARecency         │
│ - Dual2FA            │
└──────────────────────┘
```

## Integration Steps

### Step 1: Deploy ADAM System

```bash
# Configure environment
export DEPLOYER_PRIVATE_KEY=your_key
export TREASURY_ADDRESS=treasury_address
export RWA_REGISTRY_ADDRESS=rwa_address

# Deploy ADAM contracts
npx hardhat run scripts/deploy_adam.ts --network base
```

This deploys:
1. AdamRegistry (upgradeable)
2. AdamHost (upgradeable)
3. All 4 constitutional policy programs
4. Configures initial policy chains

### Step 2: Integrate with ARCGovernor

Update ARCGovernor to extend AdamGovernorIntegration:

```solidity
contract ARCGovernor is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    EIP712Upgradeable,
    AdamGovernorIntegration  // Add this
{
    // ... existing code ...
    
    function initialize(
        address admin,
        address _governanceToken,
        address _timelock,
        address _treasury,
        address _adamHost,  // Add this parameter
        GovernanceConfig memory _config
    ) public initializer {
        // ... existing initialization ...
        
        // Initialize ADAM integration
        _initializeAdamIntegration(_adamHost);
    }
}
```

### Step 3: Add ADAM Validation Hooks

Add validation calls at key governance points:

#### At Proposal Submission

```solidity
function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description,
    ProposalCategory category
) public returns (uint256) {
    // ... existing validation ...
    
    // Validate with ADAM
    bytes memory proofBundle = _buildProofBundle();
    bytes memory diff = _buildDiff(targets, values, calldatas);
    
    require(
        _validateWithAdamOnSubmit(proposalId, uint8(category), proofBundle, diff),
        "Proposal rejected by constitutional validation"
    );
    
    // ... continue with proposal creation ...
}
```

#### At Vote Tally

```solidity
function _countVotes(uint256 proposalId) internal {
    // ... existing vote counting ...
    
    // Validate with ADAM before finalizing
    Proposal storage proposal = proposals[proposalId];
    bytes memory proofBundle = _buildProofBundle();
    bytes memory diff = _buildDiffFromProposal(proposal);
    
    require(
        _validateWithAdamOnTally(
            proposalId,
            uint8(proposal.category),
            proofBundle,
            diff
        ),
        "Proposal rejected by constitutional validation at tally"
    );
}
```

#### At Queue

```solidity
function queue(uint256 proposalId) public {
    // ... existing checks ...
    
    Proposal storage proposal = proposals[proposalId];
    bytes memory proofBundle = _buildProofBundle();
    bytes memory diff = _buildDiffFromProposal(proposal);
    
    (bool approved, bool needs2FA) = _validateWithAdamOnQueue(
        proposalId,
        uint8(proposal.category),
        proofBundle,
        diff
    );
    
    if (needs2FA) {
        // Store 2FA requirement
        proposal.requires2FA = true;
        emit TwoFARequired(proposalId);
        return;
    }
    
    require(approved, "Proposal rejected at queue");
    
    // ... continue with queueing ...
}
```

#### At Execution

```solidity
function execute(uint256 proposalId) public payable {
    // ... existing checks ...
    
    Proposal storage proposal = proposals[proposalId];
    
    // Check 2FA if required
    if (proposal.requires2FA) {
        bytes4 hook = adamHost.HOOK_QUEUE();
        require(
            _checkAdam2FASatisfied(proposalId, hook),
            "2FA not satisfied"
        );
    }
    
    // Validate execution
    bytes memory proofBundle = _buildProofBundle();
    bytes memory diff = _buildDiffFromProposal(proposal);
    
    require(
        _validateWithAdamOnExecute(
            proposalId,
            uint8(proposal.category),
            proofBundle,
            diff
        ),
        "Proposal rejected at execution"
    );
    
    // ... continue with execution ...
}
```

### Step 4: Helper Functions

Add helper functions to build proof bundles and diffs:

```solidity
function _buildProofBundle() internal view returns (bytes memory) {
    // Build CBOR-encoded proof bundle
    // Include: EAS UIDs, oracle signatures, snapshot block, etc.
    // For now, return empty bytes (policies handle gracefully)
    return "";
}

function _buildDiff(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas
) internal pure returns (bytes memory) {
    // Encode proposal actions as diff
    return abi.encode(targets, values, calldatas);
}

function _buildDiffFromProposal(
    Proposal storage proposal
) internal view returns (bytes memory) {
    return abi.encode(
        proposal.targets,
        proposal.values,
        proposal.calldatas
    );
}
```

### Step 5: Admin Functions

Add admin functions for ADAM management:

```solidity
function setAdamHost(address newHost) external onlyRole(ADMIN_ROLE) {
    _setAdamHost(newHost);
}

function setAdamEnabled(bool enabled) external onlyRole(ADMIN_ROLE) {
    _setAdamEnabled(enabled);
}

function mapCategoryToTopic(
    uint8 category,
    uint256 topicId
) external onlyRole(ADMIN_ROLE) {
    _mapCategoryToTopic(category, topicId);
}
```

## Configuration

### Policy Chain Setup

After deployment, configure policy chains:

```bash
export ADAM_REGISTRY_ADDRESS=deployed_registry_address

# View current policies
npx hardhat run scripts/setup_adam_policies.ts --network base status

# Add/modify policies (edit script first)
npx hardhat run scripts/setup_adam_policies.ts --network base add-policy
```

### Parameter Tuning

#### ParamsGuardPolicy

```javascript
// Set parameter bounds
await paramsGuard.setParamBounds(
    ethers.id("QUORUM_PCT"),
    ethers.parseUnits("30", 16),  // min 30%
    ethers.parseUnits("90", 16),  // max 90%
    true,   // can only increase
    false   // can decrease? no
);
```

#### TreasuryLimiterPolicy

```javascript
// Set epoch budget
await treasuryLimiter.setEpochBudgetCap(
    ethers.parseEther("500000")  // 500K tokens per epoch
);

// Set large transaction threshold
await treasuryLimiter.setLargeTxThreshold(
    ethers.parseEther("50000")  // 50K tokens triggers 2FA
);
```

#### RWARecencyPolicy

```javascript
// Set recency window for ENERGY topic
await rwaRecency.setRecencyWindow(
    2,  // ENERGY topic
    3600  // 1 hour
);

// Register oracle operator
await rwaRecency.registerOperator(
    operatorAddress,
    ethers.parseEther("10000"),  // stake
    9500  // 95% SLA
);
```

#### Dual2FAPolicy

```javascript
// Set treasury threshold for 2FA
await dual2FA.setTreasuryThreshold(
    ethers.parseEther("100000")  // 100K tokens
);

// Mark parameter as critical
await dual2FA.setCriticalParam(
    ethers.id("VOTING_PERIOD"),
    true
);
```

## Testing

### Unit Tests

Test ADAM integration:

```javascript
describe("ADAM Governor Integration", function() {
    it("should validate proposal at submission", async function() {
        const tx = await governor.propose(
            [target],
            [value],
            [calldata],
            "Test Proposal",
            0  // TREASURY category
        );
        
        // Should emit ProposalValidatedByAdam event
        await expect(tx)
            .to.emit(governor, "ProposalValidatedByAdam");
    });
    
    it("should reject invalid parameter change", async function() {
        // Propose out-of-bounds parameter change
        await expect(
            governor.propose(
                [paramsGuard.address],
                [0],
                [invalidParamChangeCalldata],
                "Invalid Param Change",
                1  // PARAMS category
            )
        ).to.be.revertedWith("Proposal rejected by constitutional validation");
    });
});
```

### Integration Tests

Test full governance flow with ADAM:

```javascript
it("should execute valid treasury proposal", async function() {
    // Create proposal
    await governor.propose(...);
    
    // Vote
    await governor.castVote(proposalId, true);
    
    // Queue (validates with ADAM)
    await governor.queue(proposalId);
    
    // Wait for timelock
    await time.increase(timelockDelay);
    
    // Execute (validates with ADAM)
    await governor.execute(proposalId);
    
    // Verify execution
    expect(await treasury.lastExecuted()).to.equal(proposalId);
});
```

## Monitoring

### Events to Monitor

```solidity
event ProposalValidatedByAdam(
    uint256 indexed proposalId,
    bytes4 hook,
    uint8 verdict,
    bytes newDiff
);

event TwoFARequired(uint256 indexed proposalId);
event AdamValidationEnabled(bool enabled);
```

### Health Checks

```javascript
// Check ADAM system status
const status = await governor.getAdamStatus();
console.log("ADAM Enabled:", status.enabled);
console.log("ADAM Host:", status.host);
console.log("Topic Mappings:", status.topicMappings);

// Check policy chains
const chains = await adamRegistry.getAllChains();
console.log("Active chains:", chains);
```

## Troubleshooting

### Common Issues

#### Proposal Rejected at Submission
- Check parameter bounds in ParamsGuardPolicy
- Verify treasury budget in TreasuryLimiterPolicy
- Ensure proof bundle is correctly formatted

#### 2FA Not Satisfied
- Verify 2FA signature is from different signer
- Check block window (must be between min2FA and max2FA)
- Ensure 2FA hash matches pending request

#### Policy Evaluation Fails
- Check fuel limits in AdamHost
- Verify policy is registered in AdamRegistry
- Ensure Wasm hash is approved

### Debug Commands

```bash
# Check ADAM configuration
npx hardhat run scripts/debug_adam.ts --network base

# View policy chains
npx hardhat console --network base
> const registry = await ethers.getContractAt("AdamRegistry", address)
> await registry.getAllChains()

# Check proposal validation
> const host = await ethers.getContractAt("AdamHost", address)
> await host.evaluate(hook, topic, proposalId, proof, diff)
```

## Security Considerations

1. **Admin Role Management**: Transfer ADMIN_ROLE to governance/timelock after setup
2. **Fuel Limits**: Monitor fuel usage to prevent DoS
3. **2FA Security**: Ensure disjoint signers for 2FA
4. **Emergency Pause**: Keep EMERGENCY_ROLE with secure multisig
5. **Upgrade Safety**: Test upgrades thoroughly before deployment

## Production Checklist

- [ ] Deploy ADAM contracts
- [ ] Deploy constitutional policies
- [ ] Register policy chains
- [ ] Configure parameter bounds
- [ ] Set up 2FA thresholds
- [ ] Register RWA operators
- [ ] Integrate with ARCGovernor
- [ ] Deploy ARCGovernor upgrade
- [ ] Test full governance flow
- [ ] Transfer admin roles to governance
- [ ] Set up monitoring
- [ ] Document configuration
- [ ] Train governance participants

## Support

For questions or issues:
- GitHub Issues: https://github.com/Artifact-Virtual/arc_ecosystem/issues
- Documentation: `/contracts/dao/adam/README.md`
- Security: security@arcexchange.io
