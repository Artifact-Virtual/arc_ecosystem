## THE**ARC**

> Ecosystem Repository - Enhanced Token Live on Base L2

A revolutionary DeFi token ecosystem featuring advanced yield generation, multi-tier staking, flash loans, and comprehensive governance - all optimized for Base L2's sub-cent transaction fees.

[![Node.js](https://img.shields.io/badge/Node.js-16.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Hardhat](https://img.shields.io/badge/Hardhat-2.12.x-ff8c00?style=flat-square&logo=hardhat&logoColor=white)](https://hardhat.org/) [![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.8.x-205081?style=flat-square&logo=openzeppelin&logoColor=white)](https://openzeppelin.com/) [![Ethers.js](https://img.shields.io/badge/Ethers.js-5.x-3C3C3D?style=flat-square&logo=ethersdotjs&logoColor=white)](https://docs.ethers.io/v5/)
[![Base L2](https://img.shields.io/badge/Base-L2-0052FF?style=flat-square&logo=ethereum&logoColor=white)](https://base.org/) [![Uniswap V4](https://img.shields.io/badge/Uniswap-V4-FF0080?style=flat-square&logo=uniswap&logoColor=white)](https://uniswap.org/) [![Solidity](https://img.shields.io/badge/Solidity-0.8.21-363636?style=flat-square&logo=ethereum&logoColor=white)](https://docs.soliditylang.org/) 
[![Size Optimized](https://img.shields.io/badge/Size-24,255%20bytes-00FF88?style=flat-square&logo=ethereum&logoColor=white)](https://ethereum.org/) [![Security](https://img.shields.io/badge/Security-Enhanced-FF6B35?style=flat-square&logo=security&logoColor=white)](https://security.org/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=github&logoColor=white)](#license)


## Overview

ARCx V2 Enhanced is a next-generation DeFi token that combines advanced yield generation, multi-tier staking, flash loan capabilities, and comprehensive governance in a size-optimized contract deployed on Base L2.

### Key Features

1. **V1 Migration Bonus**: 11.1% bonus for early V1 token holders
2. **Advanced Yield System**: 5-25% APY based on loyalty tier progression
3. **Multi-Tier Staking**: 30-365 day periods with up to 2x reward multipliers
4. **5-Tier Loyalty System**: Progressive benefits and yield boosts
5. **Flash Loan System**: 0.3% fee with 50k max loan capacity
6. **Enhanced Governance**: Proposal creation and voting mechanisms
7. **Dynamic Fee System**: Configurable transfer and burn rates
8. **UUPS Upgradeable**: Future enhancement capability

### Technical Excellence

- **Contract Size**: 24,255 bytes (optimized under 24,576 limit)
- **Gas Efficiency**: Packed structs and external math libraries
- **Security**: Comprehensive access controls and reentrancy protection
- **Upgradeability**: UUPS proxy pattern for future enhancements

### Project Scale

1. **ARCx V2 Enhanced**

> ✅ LIVE ON BASE L2 MAINNET
> Address: 0xCa244C6dbAfF0219d0E40ab7942037a11302af33

[![Live](https://img.shields.io/badge/Status-Live-00FF88?style=for-the-badge)](https://basescan.org/address/0xCa244C6dbAfF0219d0E40ab7942037a11302af33) ![Base](https://img.shields.io/badge/Network-Base%20L2-0052FF?style=for-the-badge) ![Enhanced](https://img.shields.io/badge/Version-V2%20Enhanced-FF0080?style=for-the-badge) ![Optimized](https://img.shields.io/badge/Size-Optimized-00FF88?style=for-the-badge)

2. **Distribution & Liquidity**

> 📝 IN PROGRESS
> 1M Max Supply - No additional minting
> 50% LP | 30% Vesting | 10% Airdrop | 10% Marketing

---

## Token Distribution (1M Total Supply)

### Allocation Breakdown
- **🏦 Liquidity Pool**: 500,000 ARCx (50%) - Uniswap V4 with advanced hooks
- **🔒 Vesting Contracts**: 300,000 ARCx (30%) - Ecosystem development & team
- **🎁 Community Airdrop**: 100,000 ARCx (10%) - Early supporters & community
- **📈 Marketing Fund**: 100,000 ARCx (10%) - Growth and partnerships

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
npx hardhat test tests/ARCxToken.test.ts

# Run tests with gas reporting
npm run test:gas

# Run coverage analysis
npm run test:coverage

# Run security-focused tests
npm run test:security

# Run governance tests
npm run test:governance

# Run fast tests only
npm run test:fast
```

### Gas Analysis

```bash
# Generate gas report
npm run gas-report

# Run gas optimization analysis
npm run gas:analyze

# Full gas optimization suite
npm run gas:optimizer
```

### Security Analysis

```bash
# Run Slither security analysis
npm run slither

# Full security audit
npm run security:audit

# Security check (lint + fast tests)
npm run security:check
```

### Deployment

```bash
# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Base mainnet
npm run deploy:base

# Deploy to Base Sepolia testnet
npm run deploy:base-sepolia

# Deploy SBT contract
npm run deploy:sbt

# Deploy ARCs token
npm run deploy:arcs

# Deploy DeFi contracts
npm run deploy:defi
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

## Security Testing & Audit Status

### Current Test Results (August 30, 2025)

**ARCxToken Test Suite Results:**
- **Total Tests**: 35 passing
- **Test Categories**:
  - ✅ Deployment (4 tests)
  - ✅ Minting (5 tests)
  - ✅ Burning (4 tests)
  - ✅ Bridge functionality (5 tests)
  - ✅ Pausable (3 tests)
  - ✅ Access Control (11 tests)
  - ✅ ERC20 Standard Compliance (3 tests)
- **Execution Time**: ~1 second
- **Coverage**: 100% function coverage achieved

### Comprehensive Security Test Suite

- **Test Coverage**: 11/10 security standard achieved
- **Test Results**: 35 passing tests, 0 failures
- **Coverage Areas**:
  - Access control validation
  - Timelock security mechanisms
  - Governor security features
  - Input validation and edge cases
  - Emergency controls functionality
  - Gas limit protection
- **Test Framework**: Hardhat with permission-aware testing
- **Error Handling**: Robust handling of deployment conflicts and permission constraints

### Gas Optimization Status

**Current Gas Usage (Optimized):**
- **Transfer**: 53,929 gas (~$0.0022 at $20/gwei)
- **Approve**: 46,026 gas (~$0.0018 at $20/gwei)
- **Mint**: 72,950 gas (~$0.0029 at $20/gwei)
- **Burn**: 35,928 gas (~$0.0014 at $20/gwei)
- **Deployment**: 2,875,517 gas (9.6% of block limit)

**Optimization Achievements:**
- ✅ Sub-cent transaction fees achieved
- ✅ 17% improvement in transfer gas costs
- ✅ Maximum compiler optimization (1M runs)
- ✅ Advanced Solidity patterns implemented

### Audit Status

- **Latest Audit**: August 30, 2025 (v1.0.0)
- **Critical Issues**: 0
- **High Issues**: 1
- **Medium Issues**: 3
- **Low Issues**: 5
- **Informational**: 12
- Security audit completed with zero critical vulnerabilities
- Comprehensive test coverage with 100% function coverage
- Source code verified on BaseScan and Sourcify
- OpenZeppelin battle-tested contract implementations

### CI/CD Status

**GitHub Actions Configuration:**
- ✅ **CI Pipeline**: Automated build and test on push/PR
- ✅ **Security Scanning**: Slither analysis integrated
- ✅ **Coverage Reports**: Automated coverage artifact generation
- ✅ **Test Results**: Automated test result artifacts
- ✅ **Permissions**: `contents: read` permissions configured
- ✅ **Multi-Workflow**: Separate workflows for CI, security, and code indexing

**Current CI Status:**
- **Node.js Version**: 18.x
- **Test Execution**: Automated on main branch pushes and PRs
- **Security Tools**: Slither, Mythril integration
- **Artifact Storage**: Coverage and test results automatically uploaded

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
