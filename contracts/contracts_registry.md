# ARC Ecosystem Contracts Registry

## Overview
This registry provides a comprehensive index of all smart contracts in the ARC ecosystem, organized by category and functionality.

## Core Architecture

### **DAO & Governance Layer**
#### Core DAO Contracts
- **ARCDAO.sol** - Main DAO contract implementing constitutional governance
- **ARCGovernor.sol** - Custom governor with MACI integration and weighted voting
- **ARCProposal.sol** - Proposal management and lifecycle
- **ARCTimelock.sol** - Time-locked execution with per-topic delays
- **ARCTreasury.sol** - Treasury management and fund allocation
- **ARCVoting.sol** - Voting mechanics and tallying system

#### ADAM Constitutional Protocol
- **AdamHost.sol** - Wasm policy engine for constitutional enforcement
- **AdamRegistry.sol** - Policy chain management and storage
- **functions.json** - ADAM function definitions and configurations

### **Token System**
#### ARCx Token (Governance Token)
- **ARCx.sol** - Main governance token with ERC20Votes functionality
- **interfaces/IERC20.sol** - ERC20 interface for ARCx token

#### ARCs Token (Utility Token)
- **ARCs.sol** - Utility token for ecosystem interactions
- **deployment_notes.md** - Deployment configurations and notes

#### Soulbound Token System
- **ARC_IdentitySBT.sol** - Soulbound identity tokens with decay-weighted reputation
- **ARC_Eligibility.sol** - Topic-based eligibility with component weight calculation
- **blueprint.md** - SBT system design and specifications

### **DeFi & Financial Infrastructure**
#### Core DeFi Contracts
- **ARCxDutchAuction.sol** - Dutch auction mechanism for token distribution
- **ARCxSmartAirdrop.sol** - Smart airdrop system with eligibility checks
- **ARCx_MVC.sol** - Multi-vesting contract for token distribution
- **ARCSwap.sol** - DEX integration and swap functionality

#### Treasury & Rewards
- **TreasuryRewards.sol** - Reward distribution and claiming
- **PenaltyVault.sol** - Penalty collection and management
- **StakingVault.sol** - Staking rewards and management

#### Infrastructure
- **ARCBridge.sol** - Cross-chain bridge functionality

### **RWA (Real-World Assets) Registry**
#### Core RWA System
- **ARC_RWARegistry.sol** - Main RWA registration and attestation system
- **IRWARegistry.sol** - RWA registry interface definitions
- **SlashingVault.sol** - Operator slashing and recovery management

### **Liquidity & Pool Management**
#### Uniswap V4 Integration
- **NonfungiblePositionManager.sol** - NFT position management for liquidity
- **PositionManager.sol** - Position management interface
- **ProtocolFees.sol** - Protocol fee collection and distribution

#### Pool Interfaces
- **IPoolManager.sol** - Pool management interface
- **IPositionManager.sol** - Position management interface
- **IWETH.sol** - Wrapped Ether interface

### **Interface Definitions**
#### DAO Interfaces
- **IARCDAO.sol** - DAO contract interface
- **IARCGovernor.sol** - Governor contract interface
- **IARCProposal.sol** - Proposal interface
- **IARCTimelock.sol** - Timelock interface
- **IARCTreasury.sol** - Treasury interface
- **IARCVoting.sol** - Voting interface
- **IEligibility.sol** - Eligibility interface for governance

#### ADAM Interfaces
- **IAdamHost.sol** - ADAM host interface
- **IAdamRegistry.sol** - ADAM registry interface

## Contract Categories Summary

### **Governance & DAO (12 contracts)**
- 6 core DAO contracts
- 2 ADAM constitutional contracts
- 1 ADAM configuration file
- 3 interface definitions

### **Token System (6 contracts)**
- 2 main tokens (ARCx, ARCs)
- 2 SBT system contracts
- 1 interface
- 1 blueprint document

### **DeFi & Financial (8 contracts)**
- 4 core DeFi contracts
- 3 treasury/rewards contracts
- 1 infrastructure contract

### **RWA System (3 contracts)**
- 1 main registry contract
- 1 interface definition
- 1 slashing vault contract

### **Pool & Liquidity (6 contracts)**
- 3 Uniswap V4 contracts
- 3 pool management interfaces

### **Total: 35 contracts and interfaces**

## Integration Points

### **Internal Dependencies**
- **SBT System** → **Eligibility** → **Governor** (identity and voting weights)
- **ADAM Protocol** → **Governor** (constitutional enforcement)
- **RWA Registry** → **Slashing Vault** (operator staking and penalties)
- **Treasury** → **Rewards** (fund distribution)

### **External Integrations**
- **Ethereum Attestation Service (EAS)** - Identity attestations
- **Minimal Anti-Collusion Infrastructure (MACI)** - Private voting
- **Uniswap V4** - Liquidity management
- **OpenZeppelin** - Security and upgradeability

## Security & Access Control

### **Role-Based Access**
- **ADMIN_ROLE** - Administrative functions
- **CURATOR_ROLE** - Content curation and approval
- **OPERATOR_ROLE** - RWA operations
- **SLASHER_ROLE** - Penalty enforcement
- **TREASURY_ROLE** - Fund management

### **Upgrade Mechanisms**
- **UUPS Upgradeable** - All major contracts support secure upgrades
- **Timelock Control** - Time-locked execution for critical changes
- **Multi-sig Safety** - Gnosis Safe integration for admin functions

## Deployment & Configuration

### **Network Support**
- **Base (EVM)** - Primary deployment target
- **Ethereum Mainnet** - Future expansion target
- **Cross-chain** - Bridge-enabled for multi-chain support

### **Configuration Files**
- **hardhat.config.ts** - Development and deployment configuration
- **functions.json** - ADAM protocol configurations
- **deployment_notes.md** - Token deployment specifications

## Development & Testing

### **Test Coverage**
- Comprehensive test suites for all major contracts
- Integration tests for cross-contract interactions
- Security testing with formal verification

### **Documentation**
- **README.md** - Project overview and setup
- **blueprint.md** - System architecture specifications
- **contracts_registry.md** - This comprehensive contract index

---

*Last updated: August 28, 2025*
*Total Contracts: 35*
*Architecture: Constitutional DAO with ADAM Protocol*