---
title: Token Systems
description: Comprehensive guide to ARCx V2, ARCs, NFTs, and SBTs in the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# Token Systems

## Overview

The ARC ecosystem features a comprehensive multi-token architecture designed for governance, utility, collectibles, and reputation. This document covers all token systems including ARCx V2 Enhanced, ARCs, NFT ecosystem, and Soulbound Tokens.

---

## ARCx V2 Enhanced (LIVE)

### Status: ✅ Live on Base L2 Mainnet

**Contract Address:** `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`  
**Network:** Base L2 (Chain ID: 8453)  
**Symbol:** ARCX2  
**Decimals:** 18  
**Total Supply:** 1,000,000 (finalized)

[![Status](https://img.shields.io/badge/Status-Live-00C853?style=flat-square)](https://basescan.org/address/0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437)
[![Network](https://img.shields.io/badge/Network-Base%20L2-0052FF?style=flat-square)](https://base.org/)
[![DEX](https://img.shields.io/badge/DEX-Uniswap%20V4-FF007A?style=flat-square)](https://app.uniswap.org/)

### Technical Specifications

**Token Standard:** ERC20 with extensions
- ERC20Votes (for governance)
- ERC20Permit (gasless approvals)
- UUPS Upgradeable

**Contract Size:** 24,255 bytes (under 24,576 limit)

**Key Features:**
- ✅ Governance voting power
- ✅ Gasless approvals via permit
- ✅ Upgradeable via UUPS proxy
- ✅ Supply cap enforced (1M tokens)
- ✅ Minting finalized permanently

### Enhanced Features

1. **Advanced Math Library**
   - Deployed at: `0xdfB7271303467d58F6eFa10461c9870Ed244F530`
   - Optimized calculations
   - Gas-efficient operations

2. **Governance Integration**
   - Delegate voting power
   - Snapshot-based voting
   - Time-weighted voting support

3. **Security Features**
   - ReentrancyGuard protection
   - Role-based access control
   - Multi-sig administrative control
   - Emergency pause capability

4. **Gas Optimization**
   - Predictable gas costs
   - Optimized for Base L2
   - Efficient storage patterns

### Token Distribution (1,000,000 ARCX2)

| Allocation | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| **Liquidity Pool** | 500,000 | 50% | Uniswap V4 ARCX2/WETH |
| **Vesting** | 300,000 | 30% | Ecosystem & Development |
| **Airdrop** | 100,000 | 10% | Community distribution |
| **Marketing** | 100,000 | 10% | Growth & partnerships |

### Vesting Schedule

**Contract:** `0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600`

**Beneficiaries:**
- Ecosystem Safe: Long-term vesting
- Development Team: Cliff + vesting
- Advisors: Staged release

**Vesting Details:**
- Cliff periods: 6-12 months
- Linear vesting: 24-48 months
- Early withdrawal penalties available

### Airdrop Campaign

**Contract:** `0x40fe447cf4B2af7aa41694a568d84F1065620298`

**Total Allocation:** 100,000 ARCX2

**Eligibility:**
- Early supporters
- Community contributors
- Platform participants
- Special allocations

**Claiming:**
- Merkle tree-based verification
- Gas-efficient claims
- Time-limited campaign
- Unclaimed tokens recoverable

### Use Cases

1. **Governance**
   - Vote on proposals
   - Delegate voting power
   - Create proposals (threshold required)

2. **Liquidity Provision**
   - Provide liquidity on Uniswap V4
   - Earn trading fees
   - LP incentives

3. **Staking** (Future)
   - Stake for rewards
   - Boost governance power
   - Unlock premium features

4. **Utility** (Future)
   - Platform fee discounts
   - Access to premium features
   - NFT minting privileges

### Contract Verification

View on BaseScan:
- Token Contract: [0xDb3C3f...c437](https://basescan.org/address/0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437)
- Math Library: [0xdfB727...F530](https://basescan.org/address/0xdfB7271303467d58F6eFa10461c9870Ed244F530)
- Vesting: [0x0bBf1f...B600](https://basescan.org/address/0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600)
- Airdrop: [0x40fe44...0298](https://basescan.org/address/0x40fe447cf4B2af7aa41694a568d84F1065620298)

---

## ARCs Token

### Status: 🚧 In Progress

**Type:** ERC20  
**Purpose:** Complementary governance and utility token

### Planned Features

1. **Dual Governance**
   - Works alongside ARCx
   - Different voting weights
   - Specialized governance areas

2. **Utility Focus**
   - Platform operations
   - Fee payments
   - Staking rewards

3. **Distribution Model**
   - Fair launch approach
   - Community-driven allocation
   - Long-term sustainability

### Development Roadmap

- Q1 2026: Contract development
- Q2 2026: Security audits
- Q3 2026: Testnet deployment
- Q4 2026: Mainnet launch

---

## NFT Ecosystem

### Status: ✅ Production Ready

The ARC NFT ecosystem features AI companions with evolving traits, token-bound accounts, and a comprehensive frontend.

### Core Contracts

#### 1. EvolvingCompanion (ERC721)

**Purpose:** AI companion NFTs with XP and evolution

**Features:**
- Unique AI companions
- XP progression system
- Evolution mechanics
- Trait unlocking
- Token-bound accounts

**Metadata:**
- Dynamic attributes
- Evolution stages
- Trait combinations
- Rarity tiers

#### 2. TraitVault (ERC1155)

**Purpose:** Modular trait system for NFTs

**Features:**
- Multiple trait types
- Combinable traits
- Rarity system
- Trading support

**Trait Categories:**
- Appearance traits
- Ability traits
- Special traits
- Event-exclusive traits

#### 3. ModuleMock

**Purpose:** Extensible module system

**Features:**
- Plugin architecture
- Custom behaviors
- Upgrade paths
- Cross-NFT interactions

### NFT Features

1. **AI Companions**
   - Unique personalities
   - Conversation abilities
   - Learning behaviors
   - User interactions

2. **XP System**
   - Gain XP through activities
   - Level up mechanics
   - Milestone rewards
   - Leaderboards

3. **Evolution**
   - Multiple evolution stages
   - Unlock new abilities
   - Visual transformations
   - Permanent upgrades

4. **Trait System**
   - Equip/unequip traits
   - Mix and match
   - Rarity-based bonuses
   - Trade traits separately

5. **Token-Bound Accounts**
   - NFTs own wallets
   - Hold assets
   - Execute transactions
   - Smart account features

### Frontend Application

**Technology Stack:**
- Next.js 13 (App Router)
- wagmi for Web3 integration
- Tailwind CSS for styling
- IPFS for metadata

**Features:**
- Mint NFTs
- View collection
- Manage traits
- Track XP/evolution
- Marketplace integration

**Location:** `contracts/tokens/nft/frontend/`

For detailed NFT documentation:
- NFT Contracts: `contracts/tokens/nft/README.md`
- Frontend Guide: `contracts/tokens/nft/frontend/README.md`

---

## Soulbound Tokens (SBT)

### Status: 🔮 Coming Soon

**Standard:** ERC-5192 (Minimal Soulbound NFT)

### Purpose

Non-transferable tokens for:
- Reputation tracking
- Achievement badges
- Credentials
- Access rights
- Proof of participation

### Planned Features

1. **Non-Transferable**
   - Permanently bound to address
   - Cannot be sold or transferred
   - Lost if wallet compromised

2. **Reputation System**
   - Track user contributions
   - Governance participation
   - Platform activity
   - Achievement milestones

3. **Credentials**
   - Verified credentials
   - Educational certificates
   - Professional badges
   - Community roles

4. **Access Control**
   - Gate certain features
   - Tiered access levels
   - VIP privileges
   - Exclusive content

5. **Proof of Participation**
   - Event attendance
   - Campaign participation
   - Early supporter badges
   - Historical milestones

### Use Cases

**Governance:**
- Voting weight multipliers
- Proposal creation rights
- Special governance roles

**Platform:**
- Premium feature access
- Reduced fees
- Priority support
- Beta testing access

**Community:**
- Recognition badges
- Contribution tracking
- Reputation scores
- Social status

### Development Timeline

- Q2 2026: Contract specification
- Q3 2026: Development & testing
- Q4 2026: Testnet deployment
- Q1 2027: Mainnet launch

---

## Token Interactions

### Cross-Token Synergies

1. **ARCX2 + NFT**
   - Stake ARCX2 for NFT benefits
   - NFT holders get ARCX2 bonuses
   - Joint governance power

2. **ARCX2 + SBT**
   - SBT boosts ARCX2 voting power
   - ARCX2 holders unlock SBT tiers
   - Reputation-weighted governance

3. **NFT + SBT**
   - SBT unlocks special NFT traits
   - NFT achievements grant SBTs
   - Combined status benefits

4. **ARCs + All**
   - ARCs as utility layer
   - Fee payments across ecosystem
   - Reward distribution

### Unified Ecosystem Benefits

- **Multi-token governance**: Different tokens for different decisions
- **Composable utility**: Combine tokens for enhanced features
- **Reputation weighting**: SBTs influence voting power
- **Economic alignment**: All tokens benefit from ecosystem growth

---

## Token Economics

### Supply Model

**ARCx V2 Enhanced:**
- Fixed supply: 1,000,000
- No future minting
- Deflationary potential (burns)

**ARCs:** (Planned)
- To be determined
- Inflationary or fixed
- Community governance

**NFTs:**
- Limited collections
- Dynamic supply
- Minting controls

**SBTs:**
- Unlimited potential supply
- Non-tradable (no market price)
- Achievement-based issuance

### Value Accrual

1. **Trading Fees**
   - Uniswap LP fees
   - Platform trading fees
   - Burn mechanisms

2. **Governance Value**
   - Decision-making power
   - Treasury allocation influence
   - Parameter control

3. **Utility Value**
   - Platform fee discounts
   - Premium feature access
   - Staking rewards

4. **Scarcity Value**
   - Limited supply
   - Vesting schedules
   - Lock-up periods

---

## Token Management

### Multi-Sig Control

**Treasury Safe:** `0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38`
- Controls treasury funds
- 3/5 multisig
- Critical operations

**Ecosystem Safe:** `0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb`
- Development allocation
- 2/3 multisig
- Vesting releases

### Administrative Functions

**Token Upgrades:**
- UUPS proxy pattern
- Multi-sig authorization required
- Timelock delay enforced

**Emergency Controls:**
- Pause functionality
- Emergency withdrawals
- Admin role management

**Vesting Management:**
- Schedule adjustments
- Beneficiary updates
- Early release mechanisms

---

## Integration Guide

### Adding ARCX2 to Your App

```javascript
// Token configuration
const ARCX2_CONFIG = {
  address: '0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437',
  symbol: 'ARCX2',
  decimals: 18,
  chainId: 8453, // Base
};

// Get token balance
const balance = await token.balanceOf(userAddress);

// Transfer tokens
await token.transfer(recipient, amount);

// Approve spending
await token.approve(spender, amount);
```

### Permit (Gasless Approvals)

```javascript
// EIP-2612 Permit
const permit = await token.permit(
  owner,
  spender,
  value,
  deadline,
  v, r, s
);
```

### Delegate Voting Power

```javascript
// Delegate to self
await token.delegate(myAddress);

// Delegate to another
await token.delegate(delegateAddress);

// Check voting power
const votes = await token.getVotes(address);
```

### Query Token Info

```javascript
// Total supply
const supply = await token.totalSupply();

// Decimals
const decimals = await token.decimals();

// Name and symbol
const name = await token.name();
const symbol = await token.symbol();
```

---

## Token Monitoring

### Real-Time Stats

Use the monitoring script:

```bash
# Monitor token supply and distribution
npx hardhat run scripts/monitor.ts --network base supply

# Monitor vesting schedules
npx hardhat run scripts/monitor.ts --network base vesting

# Full monitoring report
npx hardhat run scripts/monitor.ts --network base report
```

### On-Chain Analytics

- **BaseScan**: View transactions and holders
- **Uniswap**: Track liquidity and volume
- **Dune Analytics**: Custom dashboards (coming soon)

---

## Security Considerations

### Token Security

1. **Access Control**
   - Multi-sig for critical functions
   - Role-based permissions
   - Admin controls monitored

2. **Upgrade Safety**
   - UUPS proxy pattern
   - Timelock delays
   - Community oversight

3. **Supply Control**
   - Minting finalized
   - No unauthorized issuance
   - Burn mechanisms safe

4. **Transfer Safety**
   - ReentrancyGuard protection
   - Balance checks
   - Overflow protection (Solidity 0.8+)

For comprehensive security details, see [07_SECURITY.md](./07_SECURITY.md)

---

## Related Documentation

- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) - System architecture
- [05_GOVERNANCE.md](./05_GOVERNANCE.md) - Token governance
- [06_DEFI.md](./06_DEFI.md) - DeFi integrations
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Token interfaces
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide

---

## Support

For token-related questions:
- 📧 Email: tokens@arcexchange.io
- 💬 Discord: [Join our community](https://discord.gg/arc)
- 📝 GitHub Issues: [Report issues](https://github.com/Artifact-Virtual/ARC/issues)
- 🦄 Uniswap: [Trade ARCX2](https://app.uniswap.org/positions/v4/base/242940)
