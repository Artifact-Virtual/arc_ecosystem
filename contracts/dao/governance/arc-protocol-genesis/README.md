# ARC PROTOCOL GENESIS

**The Immutable L1 Constitutional Anchor for the ARC Protocol**

Version: 1.0.0  
License: AGPL-3.0  
Solidity: ^0.8.26

---

## Executive Summary

ARC Protocol Genesis is the immutable, deterministic constitutional anchor deployed on Ethereum L1 that binds all ARC subsystems into a single, cryptographically-verifiable framework. It sits above all other contracts, defining fundamental rules that even governance cannot violate.

**Key Features**:
- ✅ **100% Immutable**: Pure functions, no storage, no owner, no upgrades
- ✅ **Deterministic Forever**: Same inputs always produce same outputs  
- ✅ **Constitutional Bounds**: Mathematical limits on treasury, governance, and token operations
- ✅ **Cross-Chain Verification**: L1 anchor provides L2 validation via verifier contracts
- ✅ **Separation of Powers**: Clear boundaries between constitutional rules and governance authority

---

## Problem Statement

ARC has:
- ✅ AI Model Genesis (identity layer for AI models)
- ✅ ADAM Constitutional Engine (proposal evaluation)
- ✅ DAO Governance (Governor, Timelock, Treasury)

**Missing**: A protocol-level genesis block that anchors:
- Protocol constants (never changeable)
- Governance bounds (limits on what governance can do)
- Cross-chain verification (L1→L2 message passing)
- Constitutional hash (immutable reference)
- Emergency powers (who can act, when, how)

**Solution**: ARC Protocol Genesis provides this immutable constitutional bedrock.

---

## Architecture

### Hierarchical Structure

```
┌─────────────────────────────────────────────────────────┐
│         ARC PROTOCOL GENESIS (L1 - Ethereum)            │
│              IMMUTABLE CONSTITUTIONAL ANCHOR            │
│                                                         │
│  • Protocol Constants (chainId, deployment block)      │
│  • Constitutional Hash (keccak256 of founding docs)    │
│  • Governance Bounds (min/max limits)                  │
│  • Emergency Powers (pause conditions)                 │
│  • Subsystem Registry (canonical addresses)            │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼────────┐                   ┌────────▼────────┐
│  L1 SUBSYSTEMS │                   │  L2 SUBSYSTEMS  │
│   (Ethereum)   │                   │     (Base)      │
├────────────────┤                   ├─────────────────┤
│ • Treasury     │                   │ • DEX           │
│ • Timelock     │                   │ • Lending       │
│ • Governor     │                   │ • Liquidity     │
│ • ADAM Host    │                   │ • AI Exec       │
│ • Token (ARCx) │                   │ • Verify Layer  │
│ • AI Genesis   │                   │ • Marketplace   │
└────────────────┘                   └─────────────────┘
```

### Design Principles

1. **Immutability by Construction**
   - Pure functions only (no storage variables)
   - No constructor logic (all data computed from constants)
   - No owner (cannot be controlled by any address)
   - No upgrades (deployed once, exists forever)

2. **Determinism Forever**
   - Hash-based (all rules derived from cryptographic hashes)
   - Stateless (no internal state that changes over time)
   - Predictable (same inputs always produce same outputs)
   - Verifiable (anyone can verify compliance off-chain)

3. **Separation of Powers**
   - **Genesis Layer**: Defines constitutional rules (immutable)
   - **Governance Layer**: Makes policy decisions within bounds (mutable)
   - **Execution Layer**: Implements approved operations (governed)

---

## Core Components

### 1. Protocol Constants

```solidity
// Fundamental Identity
bytes32 public constant PROTOCOL_NAME = keccak256("ARC_PROTOCOL");
bytes32 public constant PROTOCOL_VERSION = keccak256("1.0.0");
bytes32 public constant CONSTITUTIONAL_HASH = keccak256("ARC::CONSTITUTION::v1.0.0");

// Chain Identity
uint256 public constant GENESIS_CHAIN_ID = 1; // Ethereum mainnet
uint256 public immutable GENESIS_BLOCK; // Set at deployment
uint256 public immutable GENESIS_TIMESTAMP; // Set at deployment

// Cryptographic Anchors
bytes32 public immutable DOMAIN_SEPARATOR; // EIP-712 domain
bytes32 public immutable GENESIS_ROOT_HASH; // Merkle root of all genesis data
```

### 2. Governance Bounds

**Treasury Limits** (per proposal):
- Max Withdrawal: 10% of treasury per proposal
- Min Reserve: 20% must always remain
- Daily Spend Limit: 5% max per day

**Governance Parameters**:
- Proposal Threshold: 0.1% - 5%
- Quorum: 4% - 20%
- Voting Period: 1 - 30 days
- Timelock Delay: 2 - 30 days

**Token Economics**:
- Max Total Supply: 1 billion ARCx
- Max Inflation: 5% per year
- Min Inflation: 0% (no forced inflation)

**Emergency Powers**:
- Max Pause Duration: 7 days
- Council Size: 3-9 multisig signers

### 3. Subsystem Registry

Canonical addresses for all protocol components (immutable after deployment):
- Core Governance: Treasury, Timelock, Governor, Token (ARCx)
- Constitutional Engine: ADAM Host, ADAM Registry
- AI Identity System: AI Genesis, AI Registry, AI SBT
- Cross-Chain: L1↔L2 Messenger, L2 Genesis Verifier
- Emergency: Emergency Council Multisig

---

## Validation Functions

All ARC subsystems **MUST** call genesis validation before critical operations.

### Treasury Operations

```solidity
function validateTreasuryWithdrawal(
    uint256 amount,
    uint256 treasuryBalance,
    uint256 lastWithdrawalTimestamp,
    uint256 dailySpentAmount
) external pure returns (bool valid, string memory reason);
```

**Checks**:
1. Amount ≤ 10% of treasury balance
2. Remaining balance ≥ 20% of initial balance
3. Daily spending ≤ 5% of treasury balance

### Governance Parameters

```solidity
function validateGovernanceParameter(
    bytes32 paramName,
    uint256 newValue
) external pure returns (bool valid, string memory reason);
```

**Validates**: proposalThreshold, quorum, votingPeriod, timelockDelay

### Token Minting

```solidity
function validateTokenMint(
    uint256 currentSupply,
    uint256 mintAmount,
    uint256 lastMintTimestamp
) external pure returns (bool valid, string memory reason);
```

**Checks**:
1. Would not exceed 1B max supply
2. Annual inflation ≤ 5% (pro-rated for partial years)

### Emergency Pause

```solidity
function validateEmergencyPause(
    uint256 pauseDuration,
    uint256 councilSigners
) external pure returns (bool valid, string memory reason);
```

**Checks**:
1. Pause duration ≤ 7 days
2. Council has 3-9 signers

---

## L2 Cross-Chain Verification

### L2GenesisVerifier

Lightweight verification contract deployed on L2s (Base, Optimism, Arbitrum) that mirrors L1 genesis validation logic.

**Features**:
- Stores L1 genesis hash immutably
- Mirrors all validation functions from L1
- Enables L2 contracts to validate operations against L1 constitutional rules
- No cross-chain messaging required for basic validation

**Deployment**:
1. Deploy ARCProtocolGenesis on Ethereum L1
2. Deploy L2GenesisVerifier on each L2 with L1 genesis hash
3. L2 contracts call verifier for validation

---

## Deployment

### Prerequisites

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install
```

### Environment Variables

Create `.env` file:

```bash
# Deployer
DEPLOYER_PRIVATE_KEY=your_private_key

# Canonical Addresses
TREASURY_ADDRESS=0x...
TIMELOCK_ADDRESS=0x...
GOVERNOR_ADDRESS=0x...
TOKEN_ADDRESS=0x...
ADAM_HOST_ADDRESS=0x...
ADAM_REGISTRY_ADDRESS=0x...
AI_GENESIS_ADDRESS=0x...
AI_REGISTRY_ADDRESS=0x...
AI_SBT_ADDRESS=0x...
EMERGENCY_COUNCIL_ADDRESS=0x...

# Optional (can be zero initially)
L1_L2_MESSENGER_ADDRESS=0x...
L2_VERIFIER_ADDRESS=0x...
```

### Deploy to L1 (Ethereum)

```bash
# Sepolia testnet
forge script scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify

# Ethereum mainnet
forge script scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
    --rpc-url $MAINNET_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify
```

### Deploy to L2 (Base)

After L1 deployment, set L1 genesis info:

```bash
export L1_GENESIS_HASH=0x...  # From L1 deployment
export L1_GENESIS_ADDRESS=0x...  # L1 genesis contract address
export L1_GENESIS_BLOCK=123456  # L1 deployment block
```

Deploy L2 verifier:

```bash
# Base Sepolia testnet
forge script scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify

# Base mainnet
forge script scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
    --rpc-url $BASE_MAINNET_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify
```

---

## Testing

### Run All Tests

```bash
forge test
```

### Run Specific Test File

```bash
forge test --match-path test/ProtocolGenesis.t.sol
forge test --match-path test/L2GenesisVerifier.t.sol
```

### Run with Verbosity

```bash
forge test -vvv  # Show stack traces
forge test -vvvv  # Show all traces
```

### Coverage

```bash
forge coverage
```

### Gas Report

```bash
forge test --gas-report
```

---

## Integration Guide

### Treasury Integration

```solidity
import {IARCProtocolGenesis} from "arc-protocol-genesis/contracts/IARCProtocolGenesis.sol";

contract ARCTreasury {
    IARCProtocolGenesis public immutable genesis;
    
    function withdraw(uint256 amount) external {
        // Validate against genesis bounds
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            address(this).balance,
            lastWithdrawalTimestamp,
            dailySpentAmount
        );
        
        require(valid, reason);
        
        // Proceed with withdrawal
        // ...
    }
}
```

### Governor Integration

```solidity
import {IARCProtocolGenesis} from "arc-protocol-genesis/contracts/IARCProtocolGenesis.sol";

contract ARCGovernor {
    IARCProtocolGenesis public immutable genesis;
    
    function updateParameter(bytes32 paramName, uint256 newValue) external {
        // Validate against genesis bounds
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(
            paramName,
            newValue
        );
        
        require(valid, reason);
        
        // Proceed with parameter update
        // ...
    }
}
```

### Token Integration

```solidity
import {IARCProtocolGenesis} from "arc-protocol-genesis/contracts/IARCProtocolGenesis.sol";

contract ARCxToken {
    IARCProtocolGenesis public immutable genesis;
    
    function mint(address to, uint256 amount) external {
        // Validate against genesis bounds
        (bool valid, string memory reason) = genesis.validateTokenMint(
            totalSupply(),
            amount,
            lastMintTimestamp
        );
        
        require(valid, reason);
        
        // Proceed with minting
        _mint(to, amount);
    }
}
```

---

## Security

### Threat Model

**Protected Against**:
- ✅ Governance attacks (bounds prevent catastrophic changes)
- ✅ Treasury drainage (withdrawal limits, reserve requirements)
- ✅ Token hyperinflation (supply cap, inflation rate limits)
- ✅ Permanent protocol lock (emergency pause time-bounded)
- ✅ Unauthorized modifications (no owner, no upgrades)

**Attack Vectors Mitigated**:
1. **Compromised Governance**: Even if governance is fully compromised, attackers cannot:
   - Drain more than 10% of treasury per proposal
   - Leave treasury below 20% reserve
   - Spend more than 5% daily
   - Mint tokens beyond 1B supply or 5% annual inflation
   - Set governance parameters outside bounds

2. **Emergency Abuse**: Emergency council is limited to:
   - 7-day maximum pause
   - Must have 3-9 multisig signers
   - Cannot change any protocol rules

### Audit Recommendations

**Before Mainnet**:
1. External security audit by reputable firm (Trail of Bits, OpenZeppelin, Consensys Diligence)
2. Formal verification of validation logic
3. Economic analysis of parameter bounds
4. Threat modeling workshop
5. Bug bounty program (Immunefi)

**Timeline**: 12-16 weeks from deployment to production

---

## Gas Optimization

All validation functions are **pure** and have minimal gas cost:
- `validateTreasuryWithdrawal`: ~500 gas
- `validateGovernanceParameter`: ~300 gas  
- `validateTokenMint`: ~400 gas
- `validateEmergencyPause`: ~200 gas
- `isCanonicalSubsystem`: ~100 gas

---

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Core genesis contract
- ✅ L2 verifier contract
- ✅ Comprehensive tests
- ✅ Deployment scripts
- ✅ Documentation

### Phase 2: Integration (Weeks 1-4)
- [ ] Integrate with Treasury
- [ ] Integrate with Governor
- [ ] Integrate with Token (ARCx)
- [ ] Integrate with ADAM
- [ ] Integrate with AI Genesis

### Phase 3: Cross-Chain (Weeks 5-8)
- [ ] LayerZero integration for L1↔L2 messaging
- [ ] Deploy L2 verifiers (Base, Optimism, Arbitrum)
- [ ] Cross-chain validation tests

### Phase 4: Audit & Launch (Weeks 9-16)
- [ ] External security audit
- [ ] Formal verification
- [ ] Testnet deployment & testing
- [ ] Mainnet deployment
- [ ] Bug bounty launch

---

## FAQ

**Q: Can genesis be upgraded?**  
A: No. By design, there is no upgrade mechanism. Genesis is deployed once and exists forever.

**Q: What if we need to change the bounds?**  
A: Deploy a new genesis contract and migrate all subsystems. This is intentionally difficult to ensure constitutional stability.

**Q: Can governance override genesis rules?**  
A: No. Governance operates within the bounds set by genesis. Even with 100% vote support, governance cannot violate genesis constraints.

**Q: What happens if emergency council is compromised?**  
A: Damage is limited to 7-day pause. Council cannot change rules, drain treasury, or permanently lock protocol.

**Q: How does L2 verification work without cross-chain messages?**  
A: L2GenesisVerifier mirrors L1 logic with constants. For basic validation, no messaging needed. For advanced features (e.g., canonical address verification), cross-chain messaging required.

---

## License

AGPL-3.0

---

## Contact

- Security Issues: security@arcexchange.io
- Documentation: See DESIGN_BLUEPRINT.md
- Integration Support: See this README

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-17  
**Status**: Ready for integration and testnet deployment
