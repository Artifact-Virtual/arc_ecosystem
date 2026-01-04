# ADAM Constitutional Policy Engine

## Overview

ADAM (Autonomous Decentralized Artificial Mind) is a deterministic, Wasm-sandboxed policy engine that gates all governance actions through explicit constitutional programs. It provides a secure, bounded execution environment for evaluating governance proposals against constitutional rules.

## Architecture

### Core Components

1. **AdamHost.sol** - Main policy evaluation engine
   - Evaluates constitutional policies for governance proposals
   - Manages fuel and memory limits for safe execution
   - Handles 2FA requirements for high-security operations
   - Integrates with governance, timelock, and treasury systems

2. **AdamRegistry.sol** - Policy chain management
   - Manages ordered chains of constitutional programs per topic/hook
   - Validates and stores Wasm program hashes
   - Controls policy registration and updates

3. **Constitutional Policy Programs** (in `policies/` directory)
   - **ParamsGuardPolicy** - Validates parameter changes within bounds
   - **TreasuryLimiterPolicy** - Enforces treasury budget caps
   - **RWARecencyPolicy** - Validates RWA oracle data recency
   - **Dual2FAPolicy** - Requires 2FA for high-impact operations

### Topics

- **TREASURY (0)** - Treasury management and fund allocation
- **PARAMS (1)** - Protocol parameter modifications
- **ENERGY (2)** - Energy credit and sustainability initiatives
- **CARBON (3)** - Carbon credit trading and verification
- **GRANTS (4)** - Grant allocation and milestone tracking

### Hooks

- **onSubmit** - Proposal submission validation
- **onVoteStart** - Voting start validation
- **onTally** - Vote tally validation
- **onQueue** - Proposal queue validation
- **onExecute** - Execution validation
- **onRwaUpdate** - RWA update validation
- **onEmergency** - Emergency action validation

### Verdicts

- **ALLOW (0)** - Action is permitted
- **DENY (1)** - Action is denied
- **AMEND (2)** - Action permitted with modifications
- **REQUIRE_2FA (3)** - Action requires two-factor authentication

## Deployment

### Prerequisites

```bash
npm install
```

### Environment Variables

Create a `.env` file with:

```env
DEPLOYER_PRIVATE_KEY=your_private_key
INFURA_PROJECT_ID=your_infura_id
EAS_ADDRESS=ethereum_attestation_service_address
ELIGIBILITY_ADDRESS=eligibility_contract_address
EMERGENCY_BRAKE_ADDRESS=emergency_brake_address
TREASURY_ADDRESS=treasury_contract_address
RWA_REGISTRY_ADDRESS=rwa_registry_address
```

### Deploy ADAM System

```bash
# Deploy to local network (for testing)
npx hardhat run scripts/deploy_adam.ts --network hardhat

# Deploy to testnet
npx hardhat run scripts/deploy_adam.ts --network sepolia

# Deploy to mainnet (Base L2)
npx hardhat run scripts/deploy_adam.ts --network base
```

### Deployment Steps

The deployment script performs the following steps:

1. Deploys AdamRegistry (UUPS upgradeable)
2. Deploys AdamHost (UUPS upgradeable)
3. Deploys all constitutional policy programs
4. Approves Wasm hashes in the registry
5. Registers policy chains for each topic/hook combination

## Configuration

### Default Policy Chains

#### TREASURY Topic
- **onTally**: TreasuryLimiter (validates budget)
- **onQueue**: Dual2FA (requires 2FA for large amounts)

#### PARAMS Topic
- **onTally**: ParamsGuard (validates bounds)
- **onQueue**: Dual2FA (requires 2FA for critical params)

#### ENERGY Topic
- **onRwaUpdate**: [RWARecency, Dual2FA] (validates oracle data, requires 2FA)

#### CARBON Topic
- **onRwaUpdate**: [RWARecency, Dual2FA] (validates oracle data, requires 2FA)

### Configurable Parameters

#### AdamHost
- `fuelMax`: Maximum fuel per policy evaluation (default: 1,000,000)
- `memoryMax`: Maximum memory per evaluation (default: 256KB)
- `min2FA`: Minimum blocks for 2FA (default: 10)
- `max2FA`: Maximum blocks for 2FA (default: 100)

#### ParamsGuardPolicy
- Parameter bounds (min/max values)
- Monotonicity constraints (can only increase/decrease)
- Allowlist for changeable parameters

#### TreasuryLimiterPolicy
- Epoch budget cap (default: 1M tokens)
- Epoch duration (default: 30 days)
- Large transaction threshold (default: 100K tokens)

#### RWARecencyPolicy
- Recency window per topic (default: 1 hour)
- Minimum oracle count (default: 2)
- Minimum operator SLA (default: 95%)
- Minimum operator stake (default: 10K tokens)

#### Dual2FAPolicy
- Treasury threshold (default: 50K tokens)
- Parameter change threshold (default: 10%)
- Critical parameter list

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run security tests
npm run test:security

# Run with coverage
npm run test:coverage
```

### Test Files

- `tests/security/AdamHostSecurity.test.ts` - AdamHost security tests
- `tests/security/AdamRegistrySecurity.test.ts` - AdamRegistry security tests

## Integration with Governance

To integrate ADAM with your governance system:

1. Deploy ADAM contracts using the deployment script
2. Configure your Governor contract to call `AdamHost.evaluate()` before proposal actions
3. Update your Timelock to respect 2FA requirements
4. Grant necessary roles:
   - Grant `POLICY_EXECUTOR_ROLE` to Governor contract
   - Grant `EMERGENCY_ROLE` to emergency multisig
   - Transfer `ADMIN_ROLE` to governance/timelock

### Example Integration

```solidity
// In your Governor contract
function propose(...) external returns (uint256) {
    // Evaluate proposal with ADAM
    (uint8 verdict, bytes memory newDiff) = adamHost.evaluate(
        HOOK_SUBMIT,
        topicId,
        proposalId,
        proofBundle,
        diff
    );
    
    require(verdict == VERDICT_ALLOW, "Proposal denied by constitution");
    
    // Continue with proposal creation
    ...
}
```

## Security Considerations

1. **Fuel Limits**: All policy evaluations are fuel-metered to prevent DoS
2. **Memory Bounds**: Memory usage is capped to prevent resource exhaustion
3. **Role-Based Access**: Critical functions protected by role checks
4. **Upgradeability**: Uses UUPS pattern with admin-controlled upgrades
5. **2FA Requirements**: High-impact operations require dual signatures
6. **Emergency Pause**: System can be paused in case of emergency

## Wasm Programs

In production, constitutional policies would be implemented as WebAssembly programs with:

- Pure/deterministic execution
- Fixed ABI for host communication
- Fuel and memory caps enforced by runtime
- No syscalls, time, or randomness access

The current Solidity implementations serve as:
1. Reference implementations for the constitutional logic
2. Testable versions during development
3. Fallback if Wasm integration is not ready

## Future Enhancements

1. **Full Wasm Integration**: Replace Solidity policies with actual Wasm programs
2. **Zero-Knowledge Proofs**: Privacy-preserving policy evaluation
3. **Cross-Chain Support**: Multi-chain constitutional governance
4. **AI Optimization**: AI-powered policy chain optimization
5. **Quantum Resistance**: Post-quantum cryptographic primitives

## Maintenance

### Updating Policies

1. Deploy new policy contract
2. Approve new Wasm hash in registry
3. Update policy chain via governance proposal
4. Test thoroughly before enabling

### Monitoring

Key metrics to monitor:
- Policy evaluation success/failure rate
- Fuel consumption trends
- 2FA satisfaction rate
- Emergency pause events
- Policy chain modifications

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/Artifact-Virtual/arc_ecosystem/issues
- Documentation: See `/docs/governance/whitepaper-adam.md`
- Security: security@arcexchange.io

## License

AGPL-3.0
