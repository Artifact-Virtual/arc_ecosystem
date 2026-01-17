---
title: Development Guide
description: Complete guide for building, testing, and developing on the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# Development Guide

## Prerequisites

### Required Software

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher (or yarn 1.22+)
- **Git**: Latest version

### Recommended Tools

- **VS Code** with Solidity extension
- **Hardhat** extension for VS Code
- **MetaMask** or similar Web3 wallet
- **Base Mainnet** RPC access

### System Requirements

- **Operating System**: Linux, macOS, or Windows (WSL recommended)
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 2GB free

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Artifact-Virtual/ARC.git
cd ARC
```

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Environment Setup

Create a `.env` file in the project root:

```bash
# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453

# Private Keys (NEVER commit these)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Core Contracts
ARCX_TOKEN_ADDRESS=0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437
VESTING_CONTRACT_ADDRESS=0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600
AIRDROP_CONTRACT_ADDRESS=0x40fe447cf4B2af7aa41694a568d84F1065620298

# Governance & Security
TREASURY_SAFE_ADDRESS=0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38
ECOSYSTEM_SAFE_ADDRESS=0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb

# Uniswap V4 Infrastructure
UNISWAP_V4_POOL_MANAGER=0x498581ff718922c3f8e6a244956af099b2652b2b
UNISWAP_V4_POSITION_MANAGER=0x7c5f5a4bbd8fd63184577525326123b519429bdc
MAIN_LP_POSITION_ID=242940

# API Keys (optional)
BASESCAN_API_KEY=your_api_key_here
```

**Note:** Generate `.env.example` with:
```bash
npx hardhat run scripts/config.ts --network base env
```

---

## Project Structure

```
ARC/
├── contracts/              # Smart contracts
│   ├── dao/               # Governance contracts
│   │   ├── ARCGovernor.sol
│   │   ├── ARCTimelock.sol
│   │   ├── ARCProposal.sol
│   │   ├── ARCVoting.sol
│   │   ├── ARCTreasury.sol
│   │   └── ARCDAO.sol
│   ├── tokens/            # Token contracts
│   │   ├── arc-x/         # ARCx V2 Enhanced
│   │   ├── arc-s/         # ARCs token
│   │   ├── nft/           # NFT ecosystem
│   │   ├── sbt/           # Soulbound tokens
│   │   └── vesting/       # Vesting contracts
│   ├── defi/              # DeFi integrations
│   │   ├── bridge/        # Cross-chain bridge
│   │   └── swap/          # DEX integrations
│   ├── pool/              # Liquidity pool contracts
│   ├── thirdparty/        # External integrations
│   └── mocks/             # Test mocks
│
├── scripts/               # Management scripts
│   ├── ecosystem-manager.ts    # System orchestrator
│   ├── monitor.ts              # Real-time monitoring
│   ├── config.ts               # Configuration management
│   ├── vesting-manager.ts      # Vesting operations
│   ├── lp-manager.ts           # Liquidity management
│   ├── airdrop-manager.ts      # Airdrop campaigns
│   ├── deployment-manager.ts   # Deployment orchestration
│   ├── shared/
│   │   ├── constants.ts        # Centralized addresses
│   │   └── utils.ts            # Common utilities
│   └── README.md               # Script documentation
│
├── tests/                 # Test suite
│   ├── dao/              # Governance tests
│   ├── tokens/           # Token tests
│   ├── defi/             # DeFi tests
│   └── integration/      # Integration tests
│
├── docs/                  # Documentation
│   ├── 01_INTRODUCTION.md
│   ├── 02_ARCHITECTURE.md
│   ├── 03_DEVELOPMENT.md (this file)
│   ├── 04_TOKENS.md
│   ├── 05_GOVERNANCE.md
│   ├── 06_DEFI.md
│   ├── 07_SECURITY.md
│   ├── 08_API_REFERENCE.md
│   ├── 09_DEPLOYMENT.md
│   ├── 10_SCRIPTS.md
│   └── 11_TROUBLESHOOTING.md
│
├── tools/                 # Development tools
├── ai-engine/            # AI-powered features
├── arc-cli/              # Terminal UI
├── hardhat.config.ts     # Hardhat configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript config
└── address.book          # Deployed addresses
```

---

## Build & Compile

### Compile Contracts

```bash
# Compile all contracts
npx hardhat compile

# Clean and recompile
npx hardhat clean && npx hardhat compile

# Compile with verbose output
npx hardhat compile --verbose
```

### Build Artifacts

Compiled artifacts are stored in:
- `artifacts/` - Contract ABIs and bytecode
- `cache/` - Hardhat cache (can be deleted)

---

## Testing

### Run All Tests

```bash
# Run complete test suite
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test tests/dao/ARCGovernor.test.ts
```

### Test Coverage

```bash
# Generate coverage report
npx hardhat coverage

# View coverage in browser
open coverage/index.html
```

**Current Coverage:**
- Statements: 92%
- Branches: 87%
- Functions: 89%
- Lines: 91%

### Test Categories

1. **Unit Tests** (`tests/`)
   - Individual contract functions
   - Edge cases and error conditions
   - Access control validation

2. **Integration Tests** (`tests/integration/`)
   - Multi-contract interactions
   - End-to-end workflows
   - System behavior

3. **Security Tests** (`tests/security/`)
   - Reentrancy protection
   - Access control
   - Emergency scenarios

---

## Script Architecture

The ARC ecosystem features a comprehensive script suite for management and operations.

### Core Management Scripts

#### 1. Ecosystem Manager

Master orchestrator for system health and status.

```bash
# System health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# System status overview
npx hardhat run scripts/ecosystem-manager.ts --network base status

# Display all addresses
npx hardhat run scripts/ecosystem-manager.ts --network base addresses
```

#### 2. Monitor

Real-time monitoring and reporting.

```bash
# Full monitoring report
npx hardhat run scripts/monitor.ts --network base report

# Monitor token supply
npx hardhat run scripts/monitor.ts --network base supply

# Monitor vesting schedules
npx hardhat run scripts/monitor.ts --network base vesting

# Monitor liquidity positions
npx hardhat run scripts/monitor.ts --network base liquidity
```

#### 3. Configuration Manager

Environment and configuration management.

```bash
# Show current configuration
npx hardhat run scripts/config.ts --network base show

# Validate deployments
npx hardhat run scripts/config.ts --network base validate

# Generate .env.example
npx hardhat run scripts/config.ts --network base env

# Update constants file
npx hardhat run scripts/config.ts --network base update
```

### Specialized Scripts

#### 4. Vesting Manager

Complete vesting schedule management.

```bash
# Check beneficiaries
npx hardhat run scripts/vesting-manager.ts --network base check-beneficiaries

# Check treasury status
npx hardhat run scripts/vesting-manager.ts --network base check-treasury

# Setup and finalize vesting
npx hardhat run scripts/vesting-manager.ts --network base setup-finalize
```

#### 5. LP Manager

Uniswap V4 liquidity management.

```bash
# Check LP compatibility
npx hardhat run scripts/lp-manager.ts --network base check

# Configure for LP
npx hardhat run scripts/lp-manager.ts --network base configure

# Revert LP changes
npx hardhat run scripts/lp-manager.ts --network base revert
```

#### 6. Airdrop Manager

Airdrop campaign management.

```bash
# Check airdrop status
npx hardhat run scripts/airdrop-manager.ts --network base status

# Setup airdrop (owner only)
npx hardhat run scripts/airdrop-manager.ts --network base setup

# Claim airdrop tokens
npx hardhat run scripts/airdrop-manager.ts --network base claim

# Generate merkle tree
npx hardhat run scripts/airdrop-manager.ts --network base merkle
```

#### 7. Deployment Manager

Contract deployment orchestration.

```bash
# Deploy infrastructure
npx hardhat run scripts/deployment-manager.ts --network base infrastructure

# Deploy token
npx hardhat run scripts/deployment-manager.ts --network base token
```

For detailed script documentation, see [10_SCRIPTS.md](./10_SCRIPTS.md)

---

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes to contracts
# Edit contracts/your-contract.sol

# Compile
npx hardhat compile

# Write tests
# Edit tests/your-contract.test.ts

# Run tests
npx hardhat test

# Check coverage
npx hardhat coverage
```

### 2. Testing Workflow

```bash
# Run specific test file
npx hardhat test tests/dao/ARCGovernor.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Debug test
npx hardhat test --verbose
```

### 3. Deployment Workflow

```bash
# Validate configuration
npx hardhat run scripts/config.ts --network base validate

# Deploy to testnet
npx hardhat run scripts/deployment-manager.ts --network base-sepolia

# Verify contracts
npx hardhat verify --network base CONTRACT_ADDRESS

# Monitor deployment
npx hardhat run scripts/monitor.ts --network base report
```

### 4. Code Review Checklist

- [ ] All tests passing
- [ ] Code coverage maintained/improved
- [ ] Gas optimization considered
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] No hardcoded addresses or secrets
- [ ] Access control properly implemented

---

## Local Development

### Hardhat Network

```bash
# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deployment-manager.ts --network localhost

# Run tests against local node
npx hardhat test --network localhost
```

### Hardhat Console

```bash
# Start interactive console
npx hardhat console --network base

# Example usage
> const token = await ethers.getContractAt("ARCxV2", "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437")
> const balance = await token.balanceOf("0x...")
> console.log(balance.toString())
```

---

## Debugging

### Console Logging

```solidity
import "hardhat/console.sol";

contract MyContract {
    function myFunction() public {
        console.log("Debug message");
        console.log("Value:", someValue);
    }
}
```

### Stack Traces

Hardhat provides detailed stack traces for reverted transactions:

```bash
npx hardhat test --show-stack-traces
```

### Gas Profiling

```bash
# Profile gas usage
REPORT_GAS=true npx hardhat test

# Generate gas report
npx hardhat test > gas-report.txt
```

---

## Code Quality Tools

### Linting

```bash
# Lint Solidity
npx solhint 'contracts/**/*.sol'

# Lint TypeScript
npx eslint scripts/ tests/

# Auto-fix issues
npx eslint --fix scripts/ tests/
```

### Formatting

```bash
# Format Solidity
npx prettier --write 'contracts/**/*.sol'

# Format TypeScript
npx prettier --write 'scripts/**/*.ts' 'tests/**/*.ts'
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit
```

---

## Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `release/*` - Release preparation

### Commit Messages

Follow conventional commits:

```
feat: add new voting mechanism
fix: resolve reentrancy issue
docs: update API reference
test: add coverage for treasury
chore: update dependencies
```

### Pull Request Process

1. Create feature branch
2. Make changes with tests
3. Run full test suite
4. Update documentation
5. Submit PR with description
6. Address review comments
7. Merge after approval

---

## Performance Optimization

### Gas Optimization Tips

1. **Use appropriate data types**
   - `uint256` is more efficient than smaller uints
   - Pack structs efficiently

2. **Minimize storage operations**
   - Cache storage variables in memory
   - Use `memory` instead of `storage` when possible

3. **Batch operations**
   - Combine multiple operations
   - Use loops efficiently

4. **Avoid unnecessary checks**
   - Remove redundant validations
   - Use `unchecked` for safe arithmetic

### Example: Gas-Efficient Code

```solidity
// ❌ Inefficient
function badExample() public {
    for (uint i = 0; i < items.length; i++) {
        totalValue += items[i].value; // Multiple storage reads
    }
}

// ✅ Efficient
function goodExample() public {
    uint256 length = items.length; // Cache length
    uint256 _totalValue = totalValue; // Cache storage var
    
    for (uint i = 0; i < length;) {
        _totalValue += items[i].value;
        unchecked { ++i; } // Save gas on safe increment
    }
    
    totalValue = _totalValue; // Single storage write
}
```

---

## Security Best Practices

### 1. Access Control

```solidity
// Always use access control
function sensitiveOperation() external onlyRole(ADMIN_ROLE) {
    // Implementation
}
```

### 2. Reentrancy Protection

```solidity
// Use nonReentrant modifier
function withdraw() external nonReentrant {
    // Implementation
}
```

### 3. Input Validation

```solidity
function transfer(address to, uint256 amount) external {
    require(to != address(0), "Invalid address");
    require(amount > 0, "Invalid amount");
    // Implementation
}
```

For comprehensive security guidelines, see [07_SECURITY.md](./07_SECURITY.md)

---

## Continuous Integration

### GitHub Actions

The project uses GitHub Actions for CI/CD:

- **Test**: Run full test suite
- **Lint**: Check code quality
- **Coverage**: Generate coverage reports
- **Security**: Run security audits

### Pre-commit Hooks

```bash
# Install pre-commit hooks
npm install husky -D
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

---

## Common Development Commands

```bash
# Compile contracts
npm run build

# Run tests
npm test

# Generate coverage
npm run coverage

# Lint code
npm run lint

# Format code
npm run format

# Clean artifacts
npm run clean

# System health check
npm run health

# Monitor system
npm run monitor
```

---

## Related Documentation

- [01_INTRODUCTION.md](./01_INTRODUCTION.md) - Getting started
- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) - System architecture
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Contract interfaces
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide
- [10_SCRIPTS.md](./10_SCRIPTS.md) - Script documentation
- [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md) - Common issues

---

## Support

For development questions and support:
- 📧 Email: dev@arcexchange.io
- 💬 Discord: [Join our community](https://discord.gg/arc)
- 📝 GitHub Issues: [Report issues](https://github.com/Artifact-Virtual/ARC/issues)
- 📚 Documentation: [Full docs](./00_README_FULL.md)
