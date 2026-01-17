---
title: System Architecture
description: Core contracts, system design, and contract interactions in the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# System Architecture

## Overview

The ARC ecosystem features a modular architecture built on Base L2, combining governance, DeFi, and token systems into a unified platform. The system uses upgradeable contracts (UUPS pattern), role-based access control, and secure timelock mechanisms.

## Core Contracts

### 1. ARCGovernor.sol

**Purpose:** Main governance contract implementing proposal lifecycle management

**Key Features:**
- Multiple voting mechanisms (standard, quadratic, conviction, ranked choice, weighted)
- Configurable voting periods and delays
- Proposal threshold requirements
- Quorum enforcement
- Integration with timelock for secure execution

**Technical Details:**
- Based on OpenZeppelin Governor
- Implements ERC20Votes for voting power
- Supports flexible voting strategies
- Emits events for all state changes

**Related:** See [05_GOVERNANCE.md](./05_GOVERNANCE.md) for governance details

---

### 2. ARCTimelock.sol

**Purpose:** Secure execution delays for governance actions

**Key Features:**
- Configurable delay periods (minimum 48 hours for critical operations)
- Role-based access control (Proposer, Executor, Admin)
- Batch operation support
- Emergency execution capabilities
- Operation scheduling and cancellation

**Security:**
- Multi-sig requirements for admin operations
- Defense against front-running attacks
- Transparent operation queue
- Time-locked execution prevents hasty decisions

**Access Roles:**
- `PROPOSER_ROLE`: Can schedule operations
- `EXECUTOR_ROLE`: Can execute ready operations
- `ADMIN_ROLE`: Can manage roles and delays

---

### 3. ARCProposal.sol

**Purpose:** Proposal creation and management system

**Key Features:**
- Multiple proposal types (Basic, Treasury, Parameter, Upgrade)
- Proposal validation and categorization
- State management throughout proposal lifecycle
- Integration with voting and treasury systems

**Proposal Types:**
- **Basic**: Simple governance decisions
- **Treasury**: Fund allocation and spending
- **Parameter**: System parameter adjustments
- **Upgrade**: Contract upgrade proposals

**Lifecycle States:**
1. Created
2. Active (voting open)
3. Succeeded/Defeated
4. Queued (in timelock)
5. Executed/Cancelled

---

### 4. ARCVoting.sol

**Purpose:** Flexible voting mechanisms for different governance needs

**Voting Mechanisms:**

1. **Standard Voting**
   - One token, one vote
   - Simple majority or supermajority
   - Most common mechanism

2. **Quadratic Voting**
   - Square root of tokens
   - Prevents whale dominance
   - Encourages broader participation

3. **Conviction Voting**
   - Time-weighted voting
   - Long-term commitment rewarded
   - Reduces short-term manipulation

4. **Ranked Choice Voting**
   - Multiple preference ranking
   - Used for multi-option proposals
   - More nuanced decision-making

5. **Weighted Voting**
   - Custom weight distribution
   - Flexible for different contexts
   - Configurable parameters

**Vote Delegation:**
- Users can delegate voting power
- Delegates can vote on behalf of delegators
- Delegation is revocable at any time

---

### 5. ARCTreasury.sol

**Purpose:** Secure fund management and execution

**Key Features:**
- Multi-token support (native ETH and ERC20)
- Proposal-based fund allocation
- Emergency withdrawal capabilities
- Balance tracking and reporting
- Integration with governance proposals

**Security Measures:**
- Multi-sig safe controls treasury funds
- All withdrawals require governance approval
- Emergency functions for critical situations
- Comprehensive event logging

**Supported Operations:**
- Fund deposits
- Proposal-based withdrawals
- Emergency withdrawals (admin only)
- Balance queries

---

### 6. ARCDAO.sol

**Purpose:** Main orchestrator contract unifying all governance components

**Key Features:**
- Unified interface for all governance operations
- Proposal lifecycle management
- Emergency functions
- State queries and reporting
- Role-based access control

**Integration Points:**
- ARCGovernor for proposal voting
- ARCTimelock for execution delays
- ARCProposal for proposal management
- ARCVoting for voting mechanisms
- ARCTreasury for fund management

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        ARCDAO.sol                        │
│                  (Main Orchestrator)                     │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ ARCGovernor  │◄──►│ ARCProposal  │◄──►│  ARCVoting   │
│              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ ARCTimelock  │    │ ARCTreasury  │    │  ARCx Token  │
│              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Contract Interactions

### Proposal Flow

1. **Creation**
   - User creates proposal via ARCProposal
   - Validates user has minimum tokens (proposal threshold)
   - Proposal enters "Pending" state

2. **Voting**
   - Proposal moves to "Active" after delay period
   - Users vote using ARCVoting mechanisms
   - Voting power based on ERC20Votes snapshots

3. **Execution**
   - Succeeded proposals queue in ARCTimelock
   - Minimum delay enforced (48 hours)
   - Executor role executes after delay

4. **Treasury Operations**
   - If proposal involves funds, ARCTreasury processes
   - Multi-sig approval required
   - Funds transferred to designated recipient

### Governance Execution Path

```
User Submit Proposal
    ↓
ARCProposal validates
    ↓
ARCGovernor opens voting
    ↓
ARCVoting tallies votes
    ↓
If succeeded → ARCTimelock queue
    ↓
Wait delay period
    ↓
Execute via ARCTimelock
    ↓
If treasury operation → ARCTreasury executes
```

---

## Token Integration

### ARCx V2 Enhanced (Live on Base)

**Address:** `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`

**Features:**
- ERC20Votes for governance
- ERC20Permit for gasless approvals
- UUPS upgradeable
- 1,000,000 total supply (finalized)

**Governance Power:**
- 1 ARCX2 = 1 vote (standard voting)
- Voting power delegated via ERC20Votes
- Snapshot-based to prevent double voting

---

## Deployment Architecture

### Base L2 Infrastructure

**ARCx Token:** `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`  
**Math Library:** `0xdfB7271303467d58F6eFa10461c9870Ed244F530`  
**Vesting Contract:** `0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600`  
**Airdrop Contract:** `0x40fe447cf4B2af7aa41694a568d84F1065620298`

**Treasury Safe:** `0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38`  
**Ecosystem Safe:** `0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb`

### Uniswap V4 Infrastructure

**Pool Manager:** `0x498581ff718922c3f8e6a244956af099b2652b2b`  
**Position Manager:** `0x7c5f5a4bbd8fd63184577525326123b519429bdc`  
**Universal Router:** `0x6ff5693b99212da76ad316178a184ab56d299b43`

---

## Access Control Hierarchy

```
Multi-Sig Safes (Treasury & Ecosystem)
    ↓
ADMIN_ROLE (Contract Upgrades & Emergency)
    ↓
PROPOSER_ROLE (Create & Queue Proposals)
    ↓
EXECUTOR_ROLE (Execute Approved Proposals)
    ↓
Token Holders (Vote on Proposals)
```

---

## Security Architecture

### Defense in Depth

1. **Multi-Sig Control**
   - Critical operations require multiple signatures
   - Treasury Safe: 3/5 multisig
   - Ecosystem Safe: 2/3 multisig

2. **Timelock Delays**
   - Minimum 48-hour delay for critical operations
   - Allows community to review before execution
   - Emergency execution path for urgent issues

3. **Access Control**
   - Role-based permissions (269+ checks)
   - Least privilege principle
   - Regular permission audits

4. **Upgradability**
   - UUPS proxy pattern
   - Only authorized admins can upgrade
   - Upgrade proposals require timelock

5. **Reentrancy Protection**
   - 115+ ReentrancyGuard modifiers
   - Checks-Effects-Interactions pattern
   - No unprotected external calls

---

## Network Configuration

### Base L2 Mainnet

**Chain ID:** 8453  
**RPC:** https://mainnet.base.org  
**Explorer:** https://basescan.org

**Native Assets:**
- WETH: `0x4200000000000000000000000000000000000006`
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

---

## Contract Size & Gas Optimization

**ARCx V2 Enhanced:**
- Contract Size: 24,255 bytes (under 24,576 limit)
- Gas-optimized for Base L2
- Predictable gas costs

**Optimization Techniques:**
- Efficient storage patterns
- Minimal external calls
- Batch operations support
- Event-based monitoring

---

## Future Architecture Enhancements

### Planned Additions

1. **ARCs Token**
   - Additional governance token
   - Complementary to ARCx
   - Status: In Progress

2. **NFT Ecosystem**
   - AI companions (ERC721)
   - Trait system (ERC1155)
   - Token-bound accounts
   - Status: Production Ready

3. **Soulbound Tokens (SBT)**
   - Reputation system
   - Non-transferable credentials
   - Status: Coming Soon

4. **Cross-Chain Bridge**
   - Multichain expansion
   - Secure message passing
   - Status: Planned

---

## Related Documentation

- [04_TOKENS.md](./04_TOKENS.md) - Token system details
- [05_GOVERNANCE.md](./05_GOVERNANCE.md) - Governance mechanisms
- [06_DEFI.md](./06_DEFI.md) - DeFi integrations
- [07_SECURITY.md](./07_SECURITY.md) - Security practices
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Contract interfaces
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide

---

## Support

For architecture questions or technical discussions:
- 📧 Email: dev@arcexchange.io
- 💬 Discord: [Join our community](https://discord.gg/arc)
- 📝 GitHub Issues: [Report issues](https://github.com/Artifact-Virtual/ARC/issues)
