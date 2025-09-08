# THE**ARC**

> Ecosystem Repository

A comprehensive decentralized autonomous organization (DAO) and governance system for the ARC ecosystem, featuring multiple voting mechanisms, secure timelock controls, modular contract architecture, and the ARCx V2 Enhanced token live on Base L2.

[![Base L2](https://img.shields.io/badge/Base-L2%20LIVE-0052FF?style=flat-square&logo=ethereum&logoColor=white)](https://base.org/) [![Solidity](https://img.shields.io/badge/Solidity-0.8.21-363636?style=flat-square&logo=ethereum&logoColor=white)](https://docs.soliditylang.org/) [![Hardhat](https://img.shields.io/badge/Hardhat-2.26.x-ff8c00?style=flat-square&logo=hardhat&logoColor=white)](https://hardhat.org/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=github&logoColor=white)](#license)

## Overview

The ARC ecosystem provides a robust framework for decentralized decision-making and DeFi operations. It includes a suite of governance contracts and the ARCx V2 Enhanced token, now deployed and live on Base L2 Mainnet.

### Project Scale

1. **ARCx V2 Enhanced (LIVE)**

   - Address: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`
   - Network: Base L2 Mainnet (Chain ID: 8453)
   - Symbol: ARCX2 • Decimals: 18 • Total Supply: 1,000,000 (finalized)
   - Contract Size: 24,255 bytes (under 24,576 limit)
   - DEX: Uniswap V4 — LP live (no hooks)

1. **ARCs**

   - Status: In progress

1. **SoulBound NTT**

   - Status: Coming soon

---

## Deployed Addresses (Base L2)

Authoritative source: `address.book` (verify on BaseScan when in doubt).

- ARCx V2 Enhanced: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`
- ARCxMath Library: `0xdfB7271303467d58F6eFa10461c9870Ed244F530`
- Vesting Contract: `0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600`
- Airdrop Contract: `0x40fe447cf4B2af7aa41694a568d84F1065620298`
- Treasury Safe: `0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38`
- Ecosystem Safe: `0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb`

Uniswap V4 Infrastructure (Base):

- Pool Manager: `0x498581ff718922c3f8e6a244956af099b2652b2b`
- Position Manager (NFPM): `0x7c5f5a4bfd8fd63184577525326123b519429bdc`
- Universal Router: `0x6ff5693b99212da76ad316178a184ab56d299b43`

Base Network Tokens:

- WETH: `0x4200000000000000000000000000000000000006`
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

Note: A Uniswap V4 Hook exists at `0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0`, but it is not used for the live LP path.

---

## Uniswap V4 — Live LP (no hooks)

- Pair: ARCX2 / WETH (Base L2)
- Fee Tier: 0.05% (stable pairs)
- Seeded Liquidity: 500,000 ARCX2 (50% of supply)
- Pool Manager: `0x498581ff718922c3f8e6a244956af099b2652b2b`
- Position Manager (NFPM): `0x7c5f5a4bfd8fd63184577525326123b519429bdc`
- Universal Router: `0x6ff5693b99212da76ad316178a184ab56d299b43`

Details and historical notes: `docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md` (initial UI-created position referenced; current LP config is as above).

---

## Architecture

### Core Contracts

#### 1. ARCGovernor.sol

- Purpose: Main governance contract implementing proposal lifecycle management
- Features:
  - Multiple voting mechanisms (standard, quadratic, conviction, ranked choice, weighted)
  - Configurable voting periods and delays
  - Proposal threshold requirements
  - Quorum enforcement
  - Integration with timelock for secure execution

#### 2. ARCTimelock.sol

- Purpose: Secure execution delays for governance actions
- Features:
  - Configurable delay periods
  - Role-based access control (Proposer, Executor, Admin)
  - Batch operation support
  - Emergency execution capabilities
  - Operation scheduling and cancellation

#### 3. ARCProposal.sol

- Purpose: Proposal creation and management system
- Features:
  - Multiple proposal types (Basic, Treasury, Parameter, Upgrade)
  - Proposal validation and categorization
  - State management throughout proposal lifecycle
  - Integration with voting and treasury systems

#### 4. ARCVoting.sol

- Purpose: Flexible voting mechanisms for different governance needs
- Features:
  - Standard voting (one token, one vote)
  - Quadratic voting (square root of tokens)
  - Conviction voting (time-weighted)
  - Ranked choice voting
  - Weighted voting (custom weight distribution)
  - Vote delegation support

#### 5. ARCTreasury.sol

- Purpose: Secure fund management and execution
- Features:
  - Multi-token support (native and ERC20)
  - Proposal-based fund allocation
  - Emergency withdrawal capabilities
  - Balance tracking and reporting
  - Integration with governance proposals

#### 6. ARCDAO.sol

- Purpose: Main orchestrator contract unifying all governance components
- Features:
  - Unified interface for all governance operations
  - Proposal lifecycle management
  - Emergency functions
  - State queries and reporting
  - Role-based access control

---

## Token Distribution (1,000,000 ARCX2)

- Liquidity Pool: 500,000 ARCX2 (50%) — Uniswap V4 (0.05% stable fee)
- Vesting (Ecosystem + Dev): 300,000 ARCX2 (30%)
- Airdrop: 100,000 ARCX2 (10%)
- Marketing: 100,000 ARCX2 (10%)

Vesting details are managed by the Master Vesting contract and subject to configured cliffs and schedules.

---

## Development

### Prerequisites

- Node.js 16.x or higher
- Hardhat 2.26.x or higher
- OpenZeppelin Contracts (upgradeable)

### Install / Build / Test

```bash
npm install
npx hardhat compile
npx hardhat test
```

### Project Structure (high level)

```bash
contracts/
├── dao/
├── defi/
├── pool/
├── thirdparty/
└── tokens/

scripts/
└── ...

test/
└── ...
```

---

## Security & Operations

- Multi-sig safes secure treasury and ecosystem funds
- Role-based access control for administration and upgrades
- Emergency pause mechanisms available where applicable
- Gas predictability ensured for DEX interactions (fees disabled; feeExempt set for Uniswap actors)

---

## Important Links

- Address Book (authoritative): `./address.book`
- Release Notes: `./docs/RELEASE_NOTES.md`
- Uniswap V4 LP Summary: `./docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md`
- Security: `./docs/SECURITY.md`
- Full Docs: `./docs/`

---

## License

MIT License — see `LICENSE`.
