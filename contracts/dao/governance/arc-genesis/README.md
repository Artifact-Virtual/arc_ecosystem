# ARC Genesis - AI Model Identity & Registry System

![Status](https://img.shields.io/badge/Status-Production-4CAF50?style=for-the-badge)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.21-363636?style=for-the-badge&logo=solidity)](https://docs.soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## Overview

ARC Genesis is the foundational identity and registry system for AI models in the ARC ecosystem. It provides an immutable root of trust, a governed model registry, and soulbound identity tokens for AI models.

### Architecture

The system consists of three core components:

#### A. ARCGenesis (Immutable Root)
**Responsibilities:**
- Define valid model classes
- Store invariant hashes for each class
- Provide genesis hash anchor
- Verify model compliance

**Design Principles:**
- No governance
- No upgrades
- No admin functions
- Single initialization only
- Pure source of truth

#### B. ARCModelRegistry (Governed, Upgradeable)
**Responsibilities:**
- Register models under valid classes
- Verify Genesis compliance
- Emit canonical ModelID records
- Freeze/revoke models when needed
- Maintain queryable model database

**Design Principles:**
- Controlled by governance
- Upgradeable via UUPS proxy
- Pausable for emergencies
- Role-based access control

#### C. ARCModelSBT (Identity Layer)
**Responsibilities:**
- Issue soulbound identity tokens to models
- Encode class, version, and lineage on-chain
- Enforce non-transferability
- Support revocation for compliance

**Design Principles:**
- ERC721-based soulbound tokens
- Non-transferable by design
- Revocable when necessary
- Upgradeable via UUPS proxy

#### D. Shared Libraries (Critical)
**ModelClass.sol:**
- Centralized model class IDs
- Class validation logic
- Human-readable class names

**Errors.sol:**
- Centralized error definitions
- Reduces contract size
- Simplifies auditing

**Immutable.sol:**
- Base contract for immutable initialization
- Single-use initialization pattern
- State verification helpers

## Directory Structure

```
arc-genesis/
├── contracts/
│   ├── genesis/
│   │   ├── ARCGenesis.sol          # Immutable root contract
│   │   └── IARCGenesis.sol         # Genesis interface
│   │
│   ├── registry/
│   │   ├── ARCModelRegistry.sol    # Model registry contract
│   │   └── IARCModelRegistry.sol   # Registry interface
│   │
│   ├── sbt/
│   │   ├── ARCModelSBT.sol         # Soulbound token contract
│   │   └── IARCModelSBT.sol        # SBT interface
│   │
│   ├── libraries/
│   │   ├── ModelClass.sol          # Model class definitions
│   │   └── Errors.sol              # Centralized errors
│   │
│   └── utils/
│       └── Immutable.sol           # Immutable base contract
│
├── test/
│   ├── Genesis.t.sol               # Genesis tests
│   ├── Registry.t.sol              # Registry tests
│   └── SBT.t.sol                   # SBT tests
│
├── scripts/
│   └── DeployGenesis.s.sol         # Deployment script
│
├── README.md
└── foundry.toml
```

## Model Classes

The system supports six model classes:

1. **GENERATIVE (1)** - Models that generate new content
2. **DISCRIMINATIVE (2)** - Models that classify or discriminate
3. **REINFORCEMENT (3)** - Reinforcement learning models
4. **TRANSFORMER (4)** - Transformer-based architectures
5. **DIFFUSION (5)** - Diffusion models
6. **CONSTITUTIONAL (6)** - Constitutional AI models (e.g., GLADIUS)

## Usage

### Prerequisites

- Solidity ^0.8.21
- Foundry or Hardhat
- OpenZeppelin Contracts v4.9.6

### Installation

```bash
# Clone the repository
git clone https://github.com/Artifact-Virtual/arc_ecosystem.git
cd arc_ecosystem/contracts/dao/governance/arc-genesis

# Install dependencies (if using Foundry)
forge install

# Or with Hardhat
npm install
```

### Compilation

```bash
# With Foundry
forge build

# With Hardhat
npx hardhat compile
```

### Testing

```bash
# With Foundry
forge test

# With Hardhat
npx hardhat test
```

### Deployment

```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY=your_private_key
export GOVERNANCE_ADDRESS=your_governance_address

# Deploy with Foundry
forge script scripts/DeployGenesis.s.sol --rpc-url <your_rpc_url> --broadcast

# Or with Hardhat
npx hardhat run scripts/deploy-genesis.ts --network <network_name>
```

## Integration Guide

### 1. Deploy Genesis (One-time)

```solidity
ARCGenesis genesis = new ARCGenesis();

uint8[] memory classes = new uint8[](6);
classes[0] = ModelClass.GENERATIVE;
// ... add other classes

bytes32[] memory invariants = new bytes32[](6);
invariants[0] = keccak256("INVARIANT_GENERATIVE");
// ... add other invariants

genesis.initialize(genesisHash, classes, invariants);
```

### 2. Deploy Registry

```solidity
ARCModelRegistry registry = new ARCModelRegistry();
registry.initialize(address(genesis), governanceAddress);
```

### 3. Deploy SBT

```solidity
ARCModelSBT sbt = new ARCModelSBT();
sbt.initialize(
    address(registry),
    governanceAddress,
    "ARC Model Identity",
    "ARCM"
);
```

### 4. Register a Model

```solidity
// Grant registrar role
registry.grantRole(registry.REGISTRAR_ROLE(), registrarAddress);

// Register model
bytes32 modelId = registry.registerModel(
    ModelClass.CONSTITUTIONAL,  // class
    metadataHash,               // IPFS/Arweave hash
    1,                          // version
    lineageHash                 // parent model hash
);
```

### 5. Issue SBT

```solidity
// Grant issuer role
sbt.grantRole(sbt.ISSUER_ROLE(), issuerAddress);

// Issue SBT
uint256 tokenId = sbt.issueSBT(
    modelOwnerAddress,
    modelId,
    ModelClass.CONSTITUTIONAL,
    1,
    lineageHash
);
```

## GLADIUS Integration

GLADIUS, the constitutional AI model, uses this system as follows:

1. **Genesis**: CONSTITUTIONAL class is enabled with its invariant hash
2. **Registry**: GLADIUS model is registered with its metadata
3. **SBT**: GLADIUS receives a soulbound identity token
4. **Identity**: The SBT proves GLADIUS's existence and encodes its properties

## Security Considerations

- **Genesis is immutable**: Once deployed, it cannot be changed
- **Registry is governed**: Only governance can freeze/revoke models
- **SBTs are non-transferable**: Cannot be moved between addresses
- **Access control**: Role-based permissions protect critical functions
- **Pausability**: Registry and SBT can be paused in emergencies
- **Upgradeability**: Registry and SBT use UUPS proxy pattern

## Governance

The system is designed with clear separation of concerns:

- **Genesis**: No governance (immutable)
- **Registry**: Governed via AccessControl roles
- **SBT**: Governed via AccessControl roles

Governance roles:
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke roles
- `GOVERNANCE_ROLE`: Can freeze/revoke models, upgrade contracts
- `REGISTRAR_ROLE`: Can register new models
- `ISSUER_ROLE`: Can issue SBTs
- `REVOKER_ROLE`: Can revoke SBTs
- `PAUSER_ROLE`: Can pause contracts

## Auditing Notes

Key security properties to verify:

1. Genesis cannot be re-initialized
2. Only enabled classes can be registered
3. SBTs cannot be transferred (except mint/burn)
4. Model IDs are unique and deterministic
5. Only governance can freeze/revoke
6. Revoked models/SBTs cannot be un-revoked
7. Upgrade authorization is properly restricted

## License

MIT License - see [LICENSE](../../../../LICENSE) file for details.

## Contact

- Security: security@arcexchange.io
- Website: https://arcexchange.io
- Documentation: https://docs.arcexchange.io

---

**Note**: This system is part of the larger ARC ecosystem. For complete documentation, see the [main repository README](../../../../README.md).
