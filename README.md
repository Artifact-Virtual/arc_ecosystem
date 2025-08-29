## THE**ARC**

> Ecosystem Repository

A comprehensive decentralized autonomous organization (DAO) featuring multiple voting mechanisms, secure timelock controls, and modular contract architecture.

[![Node.js](https://img.shields.io/badge/Node.js-16.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Hardhat](https://img.shields.io/badge/Hardhat-2.12.x-ff8c00?style=flat-square&logo=hardhat&logoColor=white)](https://hardhat.org/) [![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.8.x-205081?style=flat-square&logo=openzeppelin&logoColor=white)](https://openzeppelin.com/) [![Ethers.js](https://img.shields.io/badge/Ethers.js-5.x-3C3C3D?style=flat-square&logo=ethersdotjs&logoColor=white)](https://docs.ethers.io/v5/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.12.0-FF6F00?style=flat-square&logo=ethereum&logoColor=white)](https://wagmi.sh/) [![Viem](https://img.shields.io/badge/Viem-2.17.3-4B32C3?style=flat-square&logo=ethereum&logoColor=white)](https://viem.sh/) [![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=ethereum&logoColor=white)](https://docs.soliditylang.org/) [![Playwright](https://img.shields.io/badge/Playwright-E2E%20Testing-45ba63?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/) [![PowerShell](https://img.shields.io/badge/PowerShell-7.x-5391FE?style=flat-square&logo=powershell&logoColor=white)](https://learn.microsoft.com/powershell/) ![AI Integration](https://img.shields.io/badge/AI-Anthropic%20%7C%20OpenAI%20%7C%20Gemini-ffb300?style=flat-square&logo=ai&logoColor=white)
[![Multichain](https://img.shields.io/badge/Multichain-Ethereum%20%7C%20Solana-6c47ff?style=flat-square&logo=ethereum&logoColor=white)](https://ethereum.org/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=github&logoColor=white)](#license)


## Overview

The ARC ecosystem implements a revolutionary **Constitutional DAO** powered by the **ADAM Protocol** - a deterministic, Wasm-sandboxed policy engine that enforces governance rules through explicit constitutional programs. This creates a next-generation governance system with unparalleled security, flexibility, and transparency.

### Key Innovations

1. **ADAM Constitutional Protocol**: Wasm-based policy engine with fuel-metered execution
2. **Dual-Token Economy**: ARCx governance token + ARCs staked derivative
3. **Identity SBT System**: Soulbound tokens with decay-weighted reputation
4. **Multi-Mechanism Voting**: 5 different voting systems (Standard, Quadratic, Conviction, Ranked Choice, Weighted)
5. **RWA Integration**: Real-world asset governance with operator staking
6. **Cross-Chain Infrastructure**: Advanced bridge system with validator networks

### Project Scale

1. **ARCx**

> Deployed
> Address: 0xA4093669DAFbD123E37d52e0939b3aB3C2272f44

[![Live](https://img.shields.io/badge/Status-Live-00FF88?style=for-the-badge)](https://basescan.org/address/0xA4093669DAFbD123E37d52e0939b3aB3C2272f44) ![Base](https://img.shields.io/badge/Network-Base%20L2-0052FF?style=for-the-badge) ![V4](https://img.shields.io/badge/DEX-Uniswap%20V4-FF0080?style=for-the-badge) ![Security](https://img.shields.io/badge/Audit-A%2B-00FF88?style=for-the-badge)

1. **ARCs**

> In progress


3. **SoulBound NTT**
   
> Coming Soon

---

## Architecture

### Core Contracts

#### 1. ARCGovernor.sol

- **Purpose**: Main governance contract implementing proposal lifecycle management
- **Features**:
  - Multiple voting mechanisms (standard, quadratic, conviction, ranked choice, weighted)
  - Configurable voting periods and delays
  - Proposal threshold requirements
  - Quorum enforcement
  - Integration with timelock for secure execution

#### 2. ARCTimelock.sol

- **Purpose**: Secure execution delays for governance actions
- **Features**:
  - Configurable delay periods
  - Role-based access control (Proposer, Executor, Admin)
  - Batch operation support
  - Emergency execution capabilities
  - Operation scheduling and cancellation

#### 3. ARCProposal.sol

- **Purpose**: Proposal creation and management system
- **Features**:
  - Multiple proposal types (Basic, Treasury, Parameter, Upgrade)
  - Proposal validation and categorization
  - State management throughout proposal lifecycle
  - Integration with voting and treasury systems

#### 4. ARCVoting.sol

- **Purpose**: Flexible voting mechanisms for different governance needs
- **Features**:
  - Standard voting (one token, one vote)
  - Quadratic voting (square root of tokens)
  - Conviction voting (time-weighted)
  - Ranked choice voting
  - Weighted voting (custom weight distribution)
  - Vote delegation support

#### 5. ARCTreasury.sol

- **Purpose**: Secure fund management and execution
- **Features**:
  - Multi-token support (native and ERC20)
  - Proposal-based fund allocation
  - Emergency withdrawal capabilities
  - Balance tracking and reporting
  - Integration with governance proposals

#### 6. ARCDAO.sol

- **Purpose**: Main orchestrator contract unifying all governance components
- **Features**:
  - Unified interface for all governance operations
  - Proposal lifecycle management
  - Emergency functions
  - State queries and reporting
  - Role-based access control

## Installation & Setup

### Prerequisites

- Node.js 16.x or higher
- Hardhat 2.12.x or higher
- OpenZeppelin Contracts 4.8.x or higher

### Installation

```bash
npm install
```

### Compilation

```bash
npx hardhat compile
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/governor.test.js
npx hardhat test test/timelock.test.js
npx hardhat test test/treasury.test.js
npx hardhat test test/voting.test.js
npx hardhat test test/proposal.test.js
npx hardhat test test/dao-integration.test.js
```

### Deployment

```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet/mainnet
npx hardhat run scripts/deploy.js --network <network-name>
```

## Usage

### Creating a Proposal

```javascript
// Basic proposal
await dao.createProposal(
    [targetAddress],           // Target contracts
    [0],                       // ETH values
    [encodedFunctionData],     // Calldata
    "Proposal description",    // Description
    0                          // Proposal type (Basic)
);

// Treasury proposal
await dao.createProposal(
    [treasuryAddress],
    [0],
    [transferCalldata],
    "Fund allocation proposal",
    1                          // Treasury type
);
```

### Voting on Proposals

```javascript
// Standard voting
await dao.castVote(proposalId, 1, 0); // 1 = For, 0 = Standard

// Quadratic voting
await dao.castVote(proposalId, 1, 1); // 1 = Quadratic

// Conviction voting
await dao.castVote(proposalId, 1, 2); // 2 = Conviction
```

### Executing Proposals

```javascript
// Queue proposal after voting period
await dao.queueProposal(proposalId);

// Execute after timelock delay
await dao.executeProposal(proposalId);
```

## Voting Mechanisms

### 1. Standard Voting

- **Formula**: 1 token = 1 vote
- **Use case**: Simple majority decisions
- **Pros**: Easy to understand, predictable
- **Cons**: Wealth concentration bias

### 2. Quadratic Voting

- **Formula**: Vote power = √tokens
- **Use case**: Reduce wealth concentration bias
- **Pros**: More equal representation
- **Cons**: Complex calculation

### 3. Conviction Voting

- **Formula**: Vote power = tokens × time_staked
- **Use case**: Long-term alignment decisions
- **Pros**: Rewards long-term holders
- **Cons**: Slower decision making

### 4. Ranked Choice Voting

- **Formula**: Voters rank preferences
- **Use case**: Multi-option decisions
- **Pros**: No strategic voting, better representation
- **Cons**: More complex voting process

### 5. Weighted Voting

- **Formula**: Custom weight distribution
- **Use case**: Specialized governance needs
- **Pros**: Highly flexible
- **Cons**: Complex setup

## Security Features

### Timelock Protection

- All governance actions are delayed by configurable periods
- Prevents flash loan attacks and governance manipulation
- Allows time for community review and exit

### Access Control

- Role-based permissions (Governor, Proposer, Executor, Admin)
- Emergency functions for critical situations
- Multi-signature requirements for sensitive operations

### Emergency Mechanisms

- Emergency execution bypasses timelock for critical fixes
- Emergency withdrawal for fund protection
- Pause functionality to halt operations if needed

## Configuration

### Governor Settings

- `votingDelay`: Blocks between proposal creation and voting start
- `votingPeriod`: Blocks for voting duration
- `proposalThreshold`: Minimum tokens needed to create proposals
- `quorumPercentage`: Minimum participation required

### Timelock Settings

- `minDelay`: Minimum delay for operation execution
- `gracePeriod`: Maximum delay before operations expire

### Voting Settings

- Support multiple voting types per proposal
- Configurable voting power calculations
- Flexible quorum requirements

## Integration

### ARC Ecosystem Integration

- Native ARCx token integration
- TreasuryRewards contract compatibility
- StakingVault integration for voting power
- Cross-contract communication protocols

### External Integrations

- OpenZeppelin upgradeable contracts
- ERC20 token standard compliance
- Multi-token treasury support
- Emergency function compatibility

## Development

### Project Structure

```bash
contracts/
├── dao/
│   ├── ARCGovernor.sol
│   ├── ARCTimelock.sol
│   ├── ARCProposal.sol
│   ├── ARCVoting.sol
│   ├── ARCTreasury.sol
│   └── ARCDAO.sol
├── defi/
│   ├── ARCSwap.sol
│   ├── ARCxDutchAuction.sol
│   ├── ARCxSmartAirdrop.sol
│   ├── ARCx_MVC.sol
│   ├── PenaltyVault.sol
│   ├── StakingVault.sol
│   ├── TreasuryRewards.sol
│   └── infrastructure/
│       └── ARCBridge.sol
├── interfaces/
│   ├── IARCGovernor.sol
│   ├── IARCTimelock.sol
│   ├── IARCProposal.sol
│   ├── IARCVoting.sol
│   ├── IARCTreasury.sol
│   └── IARCDAO.sol
├── pool/
├── thirdparty/
└── tokens/
    └── ARCToken.sol

scripts/
├── deploy.js
├── configure.js
└── dao-manager.js

test/
├── governor.test.js
├── timelock.test.js
├── treasury.test.js
├── voting.test.js
├── proposal.test.js
└── dao-integration.test.js
```

### Adding New Features

1. Create feature branch
2. Implement contract changes
3. Add comprehensive tests
4. Update documentation
5. Create pull request

### Testing Strategy

- Unit tests for individual contracts
- Integration tests for contract interactions
- Security tests for edge cases
- Gas usage optimization tests

## Security Considerations

### Audit Status

- Contracts follow OpenZeppelin security patterns
- Comprehensive test coverage
- Timelock protection on all governance actions
- Emergency functions for critical situations

### Known Limitations

- Quadratic voting calculations may have precision issues with very large token amounts
- Conviction voting requires careful parameter tuning
- Ranked choice voting has higher gas costs for complex elections

### Emergency Procedures

1. Pause contracts if critical vulnerability discovered
2. Use emergency functions for immediate action if needed
3. Execute emergency withdrawal to protect funds
4. Communicate with community through official channels

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:

- Documentation: [Link to full documentation]
- Discord: [Community Discord]
- GitHub Issues: [Repository issues]

## Changelog

### v1.0.0

- Initial release of ARC Governance System
- Six core governance contracts
- Multiple voting mechanisms
- Comprehensive test suite
- Deployment scripts and documentation
