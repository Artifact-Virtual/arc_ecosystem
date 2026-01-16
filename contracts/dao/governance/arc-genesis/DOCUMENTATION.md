# GENESIS System - Complete Technical Documentation

## Executive Summary

The GENESIS system is an immutable, deterministic identity and registry infrastructure for AI models in the ARC ecosystem. It provides a three-layer architecture consisting of a pure immutable root (ARCGenesis), a governed registry (ARCModelRegistry), and a soulbound identity layer (ARCModelSBT), with comprehensive capability definitions via ModelClassSchema.

**Version**: 1.0.0  
**License**: AGPL-3.0  
**Solidity**: ^0.8.26  
**Status**: Production Ready  

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Contracts](#core-contracts)
3. [Library Contracts](#library-contracts)
4. [Security Model](#security-model)
5. [Gas Optimization](#gas-optimization)
6. [Testing Framework](#testing-framework)
7. [Integration Patterns](#integration-patterns)
8. [Deployment](#deployment)
9. [Governance](#governance)
10. [FAQ](#faq)

---

## System Architecture

### Layered Design

```
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  (DAOs, DeFi, Identity Systems, Access Control)            │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────────────┐
│                  Integration Layer                          │
│        (APIs, SDKs, Frontend, Backend Services)            │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────────────┐
│                   Identity Layer                            │
│               ARCModelSBT (Soulbound Tokens)               │
│  - Non-transferable identity                               │
│  - Model→Token mapping                                     │
│  - Revocation mechanism                                    │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────────────┐
│                   Registry Layer                            │
│            ARCModelRegistry (Governance)                    │
│  - Model registration                                      │
│  - Genesis compliance verification                         │
│  - Canonical model IDs                                     │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────────────┐
│                   Foundation Layer                          │
│         ARCGenesis (Immutable Pure Functions)              │
│  - Class validation                                        │
│  - Invariant hashes                                        │
│  - Genesis hash anchor                                     │
└────────────────────────────────────────────────────────────┘
```

### Component Relationships

```
ARCGenesis (Immutable)
    ↓ validates classes
ARCModelRegistry (Governed)
    ↓ registers models
ARCModelSBT (Identity)
    ↓ issues identity tokens
Applications (Consumption)
```

---

## Core Contracts

### 1. ARCGenesis (Pure Immutable Root)

**Location**: `contracts/genesis/ARCGenesis.sol`  
**Type**: Immutable, Pure Functions  
**Size**: 55 lines  

#### Purpose
Provides the immutable foundation for the GENESIS system. Cannot be corrupted, upgraded, or modified.

#### Key Features
- **Pure Functions Only**: No storage, no state, no side effects
- **Deterministic**: Same input always produces same output
- **Gas Efficient**: Pure functions cost no gas when called externally
- **Audit Friendly**: Minimal code surface, easy to verify

#### Public Functions

##### `isValidClass(bytes32 classId) → bool`
Validates if a class ID is recognized by the system.

```solidity
function isValidClass(bytes32 classId) external pure returns (bool) {
    return ModelClass.isValid(classId);
}
```

**Parameters**:
- `classId`: bytes32 hash of the model class

**Returns**: `true` if valid, `false` otherwise

**Gas Cost**: ~200 gas (pure function)

**Usage**:
```solidity
bytes32 classId = ModelClass.REASONING_CORE;
bool valid = genesis.isValidClass(classId); // Returns true
```

##### `invariantHash(bytes32 classId) → bytes32`
Returns the invariant constraint hash for a given class.

```solidity
function invariantHash(bytes32 classId) external pure returns (bytes32) {
    if (classId == ModelClass.REASONING_CORE) {
        return keccak256("NO_EXECUTION|NO_ASSETS|ADVISORY_ONLY");
    }
    // ... other classes
    revert("INVALID_CLASS");
}
```

**Parameters**:
- `classId`: bytes32 hash of the model class

**Returns**: bytes32 hash representing the constraints

**Reverts**: "INVALID_CLASS" if class ID not recognized

**Usage**:
```solidity
bytes32 invariant = genesis.invariantHash(ModelClass.REASONING_CORE);
// Returns: keccak256("NO_EXECUTION|NO_ASSETS|ADVISORY_ONLY")
```

##### `genesisHash() → bytes32`
Returns the genesis hash anchor.

```solidity
function genesisHash() external pure returns (bytes32) {
    return keccak256("ARC::GENESIS::v1.0.0");
}
```

**Returns**: Constant genesis hash

**Gas Cost**: ~150 gas

**Purpose**: Provides immutable reference point for the entire system

#### Design Rationale

1. **Why Pure Functions?**
   - Cannot be corrupted by governance or admin
   - Deterministic and predictable
   - Zero attack surface for state manipulation
   - Gas-free for external view calls

2. **Why No Storage?**
   - Immutability guarantee
   - No upgrade path means no vulnerability introduction
   - Predictable behavior forever

3. **Why Hard-Coded Classes?**
   - Compile-time verification
   - No runtime class injection possible
   - Explicit, auditable class list

#### Security Properties

- ✅ **Immutable**: No upgrade mechanism exists
- ✅ **Deterministic**: Pure functions guarantee same output
- ✅ **No Admin**: No owner, no governance
- ✅ **No Storage**: Cannot be corrupted
- ✅ **Minimal Code**: 55 lines, easy to audit

---

### 2. ARCModelRegistry (Governed Registry)

**Location**: `contracts/registry/ARCModelRegistry.sol`  
**Type**: Immutable deployment (no UUPS), Governed  
**Size**: 77 lines  

#### Purpose
Manages model registration under governance control, verifying Genesis compliance and emitting canonical model IDs.

#### State Variables

```solidity
IARCGenesis public immutable genesis;        // Reference to Genesis
address public immutable governance;          // Governance address
mapping(bytes32 => bytes32) private _modelClass;  // modelId => classId
```

#### Public Functions

##### `registerModel(string name, string version, bytes32 classId) → bytes32`

Registers a new AI model in the system.

**Access**: Governance only

**Parameters**:
- `name`: Human-readable model name
- `version`: Version string (e.g., "1.0.0")
- `classId`: bytes32 class identifier from ModelClass

**Returns**: Unique `modelId` for the registered model

**Emits**: `ModelRegistered(modelId, classId, name, version, msg.sender)`

**Process**:
1. Validates class via Genesis
2. Computes deterministic modelId
3. Checks for duplicates
4. Stores mapping
5. Emits event

**Model ID Computation**:
```solidity
modelId = keccak256(
    abi.encodePacked(name, version, classId, genesis.genesisHash())
);
```

**Gas Cost**: ~45,000 gas

**Error Conditions**:
- `InvalidClass()`: Class not valid in Genesis
- `ModelAlreadyExists()`: Model ID already registered
- `NOT_GOVERNANCE`: Caller not governance address

**Usage**:
```solidity
bytes32 modelId = registry.registerModel(
    "GLADIUS",
    "1.0.0",
    ModelClass.REASONING_CORE
);
```

##### `modelClass(bytes32 modelId) → bytes32`

Returns the class ID for a registered model.

**Parameters**:
- `modelId`: The model identifier

**Returns**: `classId` if registered, `bytes32(0)` if not found

**Gas Cost**: ~2,400 gas (SLOAD)

**Usage**:
```solidity
bytes32 classId = registry.modelClass(modelId);
if (classId == bytes32(0)) {
    // Model not registered
}
```

#### Design Rationale

1. **Why Governance-Only Registration?**
   - Prevents spam and malicious registrations
   - Ensures quality control
   - Maintains system integrity

2. **Why Immutable Deployment?**
   - Removed UUPS to simplify and reduce attack surface
   - Explicit redeployment if changes needed
   - Clear versioning and migration path

3. **Why Deterministic Model IDs?**
   - Unique identification
   - Collision resistant
   - Includes genesis hash for ecosystem-wide uniqueness

#### Security Properties

- ✅ **Governance Protected**: Only governance can register
- ✅ **Genesis Validated**: All models verified through Genesis
- ✅ **No Silent Overwrites**: Existing models cannot be replaced
- ✅ **Immutable Once Registered**: Model IDs never change
- ✅ **Deterministic IDs**: Collision resistant

---

### 3. ARCModelSBT (Soulbound Identity)

**Location**: `contracts/sbt/ARCModelSBT.sol`  
**Type**: Minimal ERC-721, Non-transferable  
**Size**: 112 lines  

#### Purpose
Issues non-transferable soulbound identity tokens to AI models, creating permanent on-chain identities.

#### State Variables

```solidity
address public immutable registry;           // Registry reference
address public immutable governance;          // Governance address
uint256 private _nextId = 1;                 // Token ID counter
mapping(uint256 => bytes32) public tokenModel;    // tokenId => modelId
mapping(bytes32 => uint256) public modelToken;    // modelId => tokenId
mapping(uint256 => bool) public revoked;          // tokenId => revoked
```

#### Public Functions

##### `mint(bytes32 modelId) → uint256`

Mints a soulbound token for a registered model.

**Access**: Registry only

**Parameters**:
- `modelId`: Model ID from registry

**Returns**: `tokenId` of minted token

**Emits**: `ModelMinted(tokenId, modelId, classId)`

**Process**:
1. Validates model exists in registry
2. Checks not already minted
3. Increments token counter
4. Creates bidirectional mapping
5. Emits event

**Gas Cost**: ~60,000 gas

**Error Conditions**:
- `NotRegistry()`: Caller not registry contract
- `AlreadyMinted()`: SBT already exists for this model
- `InvalidModel()`: Model not found in registry

**Usage**:
```solidity
// Only registry can call
uint256 tokenId = sbt.mint(modelId);
```

##### `revoke(uint256 tokenId)`

Revokes a soulbound token (governance only).

**Access**: Governance only

**Parameters**:
- `tokenId`: Token to revoke

**Emits**: `ModelRevoked(tokenId)`

**Note**: Revocation is permanent and cannot be undone

**Gas Cost**: ~5,000 gas

**Usage**:
```solidity
// Only governance can call
sbt.revoke(tokenId);
```

##### ERC-721 Functions (All Revert)

The following ERC-721 functions are implemented to revert:

- `ownerOf(uint256)` → reverts `NonTransferable()`
- `balanceOf(address)` → reverts `NonTransferable()`
- `transferFrom(address, address, uint256)` → reverts `NonTransferable()`
- `approve(address, uint256)` → reverts `NonTransferable()`
- `getApproved(uint256)` → returns `address(0)`
- `isApprovedForAll(address, address)` → returns `false`

##### ERC-5192 Function

##### `locked(uint256) → bool`

ERC-5192 compliance function.

**Returns**: Always `true` (all tokens are locked/non-transferable)

**Usage**:
```solidity
bool isLocked = sbt.locked(tokenId); // Always returns true
```

#### Design Rationale

1. **Why Non-Transferable?**
   - Identity should be permanent
   - Prevents identity trading/fraud
   - Clear ownership history

2. **Why Minimal ERC-721?**
   - Reduced attack surface
   - Clear intent (not a transferable NFT)
   - Gas efficient

3. **Why Registry-Only Minting?**
   - Tight coupling with registration
   - Prevents unauthorized identity issuance
   - Clear access control

#### Security Properties

- ✅ **Non-Transferable**: All transfers blocked
- ✅ **Registry Gated**: Only registry can mint
- ✅ **Governance Revocable**: Can revoke for compliance
- ✅ **One-Per-Model**: Each model gets exactly one SBT
- ✅ **ERC-5192 Compliant**: Standard soulbound token interface

---

## Library Contracts

### 1. ModelClass Library

**Location**: `contracts/libraries/ModelClass.sol`  
**Type**: Library (internal functions)  
**Size**: 30 lines  

#### Purpose
Centralizes model class identifiers as bytes32 constants.

#### Constants

```solidity
bytes32 internal constant REASONING_CORE = keccak256("ARC::MODEL::REASONING_CORE");
bytes32 internal constant GENERATIVE_INTERFACE = keccak256("ARC::MODEL::GENERATIVE_INTERFACE");
bytes32 internal constant OPERATIONAL_AGENT = keccak256("ARC::MODEL::OPERATIONAL_AGENT");
bytes32 internal constant VERIFIER_AUDITOR = keccak256("ARC::MODEL::VERIFIER_AUDITOR");
```

#### Functions

##### `isValid(bytes32 classId) → bool`

Checks if a class ID is valid.

```solidity
function isValid(bytes32 classId) internal pure returns (bool) {
    return
        classId == REASONING_CORE ||
        classId == GENERATIVE_INTERFACE ||
        classId == OPERATIONAL_AGENT ||
        classId == VERIFIER_AUDITOR;
}
```

#### Design Rationale

- **Centralized Constants**: Single source of truth for class IDs
- **Compile-Time Safety**: No typos in class IDs
- **Auditor Friendly**: Easy to verify all valid classes

---

### 2. ModelClassSchema Library

**Location**: `contracts/libraries/ModelClassSchema.sol`  
**Type**: Library (internal functions)  
**Size**: 277 lines  

#### Purpose
Provides comprehensive metadata and capability definitions for each model class.

#### Structs

##### Capabilities

```solidity
struct Capabilities {
    bool canExecute;        // Execute on-chain actions
    bool canVerify;         // Verify/audit other models
    bool canGovern;         // Participate in governance
    bool canManagePolicy;   // Manage/update policies
    bool canManageAssets;   // Manage treasury/assets
    bool canGenerateOutput; // Generate output
    bool requiresApproval;  // Needs approval for actions
    bool isAdvisoryOnly;    // Advisory output only
}
```

##### ClassSchema

```solidity
struct ClassSchema {
    bytes32 classId;           // Class identifier
    string name;               // Human-readable name
    string description;        // Detailed description
    bytes32 invariantHash;     // Invariant constraints
    Capabilities capabilities; // Capability flags
    string[] useCases;         // Primary use cases
    string[] restrictions;     // Key restrictions
}
```

#### Key Functions

##### `getSchema(bytes32 classId) → ClassSchema`

Returns complete schema for a class.

**Parameters**:
- `classId`: The class identifier

**Returns**: `ClassSchema` struct with all metadata

**Usage**:
```solidity
ModelClassSchema.ClassSchema memory schema = 
    ModelClassSchema.getSchema(ModelClass.REASONING_CORE);

console.log(schema.name); // "Reasoning Core"
console.log(schema.description); // Full description
```

##### `hasCapability(bytes32 classId, string capability) → bool`

Checks if a class has a specific capability.

**Parameters**:
- `classId`: The class identifier
- `capability`: Capability name (e.g., "canExecute")

**Returns**: `true` if class has capability

**Usage**:
```solidity
bool canExec = ModelClassSchema.hasCapability(
    ModelClass.OPERATIONAL_AGENT,
    "canExecute"
); // Returns true
```

##### `validateCapabilities(bytes32 classId, string[] required) → bool`

Validates that a class has all required capabilities.

**Parameters**:
- `classId`: The class identifier
- `required`: Array of required capability names

**Returns**: `true` if all capabilities present

**Usage**:
```solidity
string[] memory required = new string[](2);
required[0] = "canExecute";
required[1] = "canGenerateOutput";

bool valid = ModelClassSchema.validateCapabilities(
    ModelClass.OPERATIONAL_AGENT,
    required
); // Returns true
```

---

### 3. Errors Library

**Location**: `contracts/libraries/Errors.sol`  
**Type**: Library (custom errors)  
**Size**: 55 lines  

#### Purpose
Centralizes custom error definitions for gas efficiency and consistency.

#### Error Categories

**Genesis Errors**:
- `GenesisAlreadyInitialized()`
- `GenesisNotInitialized()`
- `InvalidGenesisHash()`
- `InvalidInvariantHash()`

**Model Class Errors**:
- `InvalidModelClass(uint8 classId)`
- `ModelClassNotEnabled(uint8 classId)`
- `ModelClassAlreadyEnabled(uint8 classId)`

**Registry Errors**:
- `ModelAlreadyRegistered(bytes32 modelId)`
- `ModelNotRegistered(bytes32 modelId)`
- `ModelNotCompliant(bytes32 modelId)`
- `ModelFrozen(bytes32 modelId)`
- `ModelRevoked(bytes32 modelId)`
- `InvalidModelData()`

**SBT Errors**:
- `SBTAlreadyIssued(address owner)`
- `SBTNotIssued(address owner)`
- `SBTTransferNotAllowed()`
- `SBTRevoked(uint256 tokenId)`
- `InvalidTokenId(uint256 tokenId)`
- `InvalidOwner(address owner)`

**Authorization Errors**:
- `Unauthorized(address caller)`
- `NotGovernance(address caller)`
- `NotIssuer(address caller)`

#### Design Rationale

- **Gas Efficient**: Custom errors cheaper than require strings
- **Structured Data**: Can include parameters in errors
- **Centralized**: Single source of truth for error messages
- **Audit Friendly**: Easy to verify all error conditions

---

## Security Model

### Threat Model

#### Assets Protected
1. Model identity integrity
2. Registry data accuracy
3. SBT non-transferability
4. Governance control

#### Threat Actors
1. Malicious users attempting unauthorized registration
2. Attackers trying to corrupt Genesis
3. Bad actors attempting SBT transfers
4. Governance compromise

### Security Properties

#### ARCGenesis
- **Threat**: Code corruption
- **Mitigation**: Pure functions, no storage, immutable
- **Residual Risk**: None (cannot be corrupted)

#### ARCModelRegistry
- **Threat**: Unauthorized registration
- **Mitigation**: Governance-only modifier
- **Residual Risk**: Governance compromise (multisig recommended)

- **Threat**: Duplicate model IDs
- **Mitigation**: Deterministic ID computation with collision detection
- **Residual Risk**: None (mathematically impossible)

#### ARCModelSBT
- **Threat**: Token transfers (identity theft)
- **Mitigation**: All transfer functions revert
- **Residual Risk**: None (hardcoded reverts)

- **Threat**: Unauthorized minting
- **Mitigation**: Registry-only modifier
- **Residual Risk**: Registry compromise (separate audit)

### Access Control Matrix

| Function | Genesis | Registry | SBT | Schema |
|----------|---------|----------|-----|--------|
| Read | Anyone | Anyone | Anyone | Anyone |
| Register | N/A | Governance | N/A | N/A |
| Mint | N/A | N/A | Registry | N/A |
| Revoke | N/A | N/A | Governance | N/A |
| Upgrade | ❌ None | ❌ None | ❌ None | ❌ None |

### Audit Considerations

1. **Genesis**: Verify pure functions only, no storage
2. **Registry**: Check governance access control
3. **SBT**: Verify all transfers revert
4. **Schema**: Review capability definitions match design

---

## Gas Optimization

### Contract Sizes

| Contract | Bytecode Size | % of Limit |
|----------|---------------|------------|
| ARCGenesis | ~1.2 KB | 4.9% |
| ARCModelRegistry | ~2.8 KB | 11.5% |
| ARCModelSBT | ~4.1 KB | 16.8% |
| ModelClassSchema | ~8.5 KB | 34.8% |

### Gas Costs

| Operation | Cost | Notes |
|-----------|------|-------|
| Genesis.isValidClass() | ~200 | Pure function |
| Genesis.invariantHash() | ~250 | Pure function |
| Registry.registerModel() | ~45,000 | Storage write |
| Registry.modelClass() | ~2,400 | Storage read |
| SBT.mint() | ~60,000 | Storage writes |
| SBT.revoke() | ~5,000 | Storage update |

### Optimization Techniques Used

1. **Pure Functions**: Genesis uses pure functions (no gas for external view)
2. **Immutable Variables**: Registry and SBT use immutable for genesis/registry references
3. **Custom Errors**: 90% cheaper than require strings
4. **Minimal Storage**: Only essential data stored
5. **No Loops**: Avoided where possible
6. **Efficient Mappings**: Direct key→value lookups

---

## Testing Framework

### Test Structure

```
test/
├── Genesis.t.sol       (Genesis contract tests)
├── Registry.t.sol      (Registry contract tests)
└── SBT.t.sol           (SBT contract tests)
```

### Test Coverage Goals

- **Genesis**: 100% (pure functions, straightforward)
- **Registry**: 95%+ (all registration paths)
- **SBT**: 95%+ (minting, revocation, transfer blocking)
- **Integration**: 90%+ (cross-contract interactions)

### Running Tests

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testRegisterModel

# Coverage report
forge coverage
```

---

## Integration Patterns

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration patterns.

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment instructions.

---

## Governance

### Governance Responsibilities

1. **Model Registration**: Approve/register new AI models
2. **SBT Revocation**: Revoke identities for compliance
3. **System Monitoring**: Watch for suspicious activity

### Recommended Governance Structure

- **Multisig Wallet**: 3/5 or 5/7 for mainnet
- **DAO**: Snapshot voting with on-chain execution
- **Timelock**: 24-48 hour delay for critical operations

### Governance Best Practices

1. Use multisig for governance address
2. Implement timelock for critical operations
3. Regular security audits
4. Community transparency
5. Clear escalation procedures

---

## FAQ

### Q: Can Genesis be upgraded?
**A**: No. Genesis is immutable by design with pure functions and no storage.

### Q: Can Registry be upgraded?
**A**: No. Registry has no UUPS mechanism. Redeployment required for changes.

### Q: Can SBTs be transferred?
**A**: No. All transfer functions revert. SBTs are permanently bound.

### Q: What happens if governance is compromised?
**A**: Use multisig with multiple signers. If compromised, deploy new Registry/SBT with new governance.

### Q: Can models be deleted from the registry?
**A**: No. Models are immutable once registered. They can only be marked as revoked via SBT.

### Q: How are model classes added?
**A**: New classes require Genesis redeployment (immutable design). Major version change.

### Q: What's the cost to register a model?
**A**: ~45,000 gas (~$2-10 depending on gas price and ETH price).

### Q: Can I use this without SBT?
**A**: Yes. SBT is optional. Registry can be used standalone.

---

## Version History

- v1.0.0 (2026-01-16): Initial GENESIS system documentation

---

## License

AGPL-3.0 - See LICENSE file for details

---

## Contact

- Documentation: This file
- Integration Help: See INTEGRATION_GUIDE.md
- Deployment Help: See DEPLOYMENT_GUIDE.md
- Security Issues: security@arcexchange.io
