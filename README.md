# THE|**ARC**

![LEGENDARY](https://img.shields.io/badge/LEGENDARY-6A00FF?style=for-the-badge&labelColor=0D1117)
[![License: MIT](https://img.shields.io/badge/License-MIT-00C853?style=for-the-badge&labelColor=0D1117&logo=opensourceinitiative&logoColor=white)](#license)
[![Last Commit](https://img.shields.io/github/last-commit/ARTIFACT-VIRTUAL/arc_ecosystem?branch=main&style=for-the-badge&logo=github&labelColor=0D1117&color=6A00FF)](https://github.com/ARTIFACT-VIRTUAL/arc_ecosystem/commits/main)
[![Security](https://img.shields.io/badge/Security-100%2F100-00C853?style=for-the-badge&labelColor=0D1117)](#security)

---

## 🏛️ Overview

**ARC** is a comprehensive decentralized autonomous organization (DAO) and governance system featuring multiple voting mechanisms, secure timelock controls, modular contract architecture, and the ARCx V2 Enhanced token live on Base L2.

[![Launch CLI](https://img.shields.io/badge/🚀_Launch-Terminal_UI-6A00FF?style=for-the-badge)](./arc-cli)
[![Launch Engine](https://img.shields.io/badge/💻_Launch-Development_Engine-00C853?style=for-the-badge)](./docs/02_DEVELOPMENT_ENGINE.html)
[![View Docs](https://img.shields.io/badge/📚_View-Documentation-58A6FF?style=for-the-badge)](./docs)

---

## 📚 Documentation Index

### Getting Started
- **[Full Documentation](./docs/00_README_FULL.md)** - Complete system overview and details
- **[Quick Start Guide](./docs/01_INTRODUCTION.md)** - Get up and running quickly
- **[Architecture Overview](./docs/02_ARCHITECTURE.md)** - System design and structure
- **[Development Guide](./docs/03_DEVELOPMENT.md)** - Build, test, and deploy

### Core Systems
- **[Token Systems](./docs/04_TOKENS.md)** - ARCx, ARCs, NFTs, and SBTs
- **[Governance](./docs/05_GOVERNANCE.md)** - DAO and voting mechanisms
- **[DeFi Integration](./docs/06_DEFI.md)** - Uniswap V4, bridges, and liquidity
- **[Security](./docs/07_SECURITY.md)** - Audits, best practices, and policies

### Technical Reference
- **[API Reference](./docs/08_API_REFERENCE.md)** - Contract interfaces and functions
- **[Deployment Guide](./docs/09_DEPLOYMENT.md)** - Production deployment instructions
- **[Scripts & Tools](./docs/10_SCRIPTS.md)** - Management and monitoring tools
- **[Troubleshooting](./docs/11_TROUBLESHOOTING.md)** - Common issues and solutions

### Additional Resources
- **[Whitepapers](./docs/governance)** - ADAM, SBT, and governance models
- **[Research](./docs/research)** - Industry analysis and future directions
- **[Contributing](./docs/environment/CONTRIBUTING.md)** - Contribution guidelines
- **[Code of Conduct](./docs/environment/CODE_OF_CONDUCT.md)** - Community standards

---

## 🚀 Quick Start for Developers

### Prerequisites
```bash
Node.js 18.x or higher
npm or yarn
```

### Installation & Build
```bash
# Clone the repository
git clone https://github.com/Artifact-Virtual/ARC.git
cd ARC

# Install dependencies
npm install

# Compile contracts
npm run build

# Run tests
npm test
```

### Key Development Files
- **Configuration**: `hardhat.config.ts`, `package.json`
- **Core Contracts**: `contracts/dao/`, `contracts/tokens/`
- **Scripts**: `scripts/` - Management and deployment tools
- **Tests**: `tests/` - Comprehensive test suite
- **Documentation**: `docs/` - Full documentation

### Terminal UI - System Management
```bash
# Launch the ARC Terminal UI
npm run arc-cli

# Or directly
node arc-cli/index.js
```

The Terminal UI provides:
- 📊 Ecosystem overview and metrics
- 🚀 Deployment management
- 💰 Token, NFT, and SBT management
- 🔍 Real-time monitoring
- ⚙️ Configuration and settings

### Essential Commands
```bash
# System health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# Monitor system status
npx hardhat run scripts/monitor.ts --network base report

# Validate configuration
npx hardhat run scripts/config.ts --network base validate

# Run tests
npm test

# Deploy contracts (testnet)
npm run deploy:base-sepolia

# Deploy contracts (mainnet)
npm run deploy:base
```

---

## 🎯 Project Highlights

### ARCx V2 Enhanced (LIVE on Base L2)
- **Address**: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`
- **Network**: Base L2 Mainnet (Chain ID: 8453)
- **Supply**: 1,000,000 ARCX2 (finalized)
- **DEX**: Uniswap V4 with 500k ARCX2 liquidity

[![Status](https://img.shields.io/badge/Status-Live-00C853?style=flat-square)](https://basescan.org/address/0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437)
[![Network](https://img.shields.io/badge/Network-Base%20L2-0052FF?style=flat-square)](https://base.org/)
[![DEX](https://img.shields.io/badge/DEX-Uniswap%20V4-FF007A?style=flat-square&logo=uniswap&logoColor=white)](https://app.uniswap.org/)

### Security Status: **PERFECT 100/100** ✅
- ✅ Zero vulnerabilities across 70+ contracts
- ✅ 147 tests passing, 92% code coverage
- ✅ 115+ ReentrancyGuard protections
- ✅ 269+ access control checks

📋 **[Full Security Audit](./docs/07_SECURITY.md)**

---

## 📁 Project Structure

```
ARC/
├── contracts/          # Smart contracts
│   ├── dao/           # Governance and DAO contracts
│   ├── tokens/        # Token contracts (ARCx, ARCs, NFT, SBT)
│   ├── defi/          # DeFi integration contracts
│   └── pool/          # Liquidity pool contracts
├── scripts/           # Deployment and management scripts
├── tests/             # Test suite
├── docs/              # Comprehensive documentation
├── arc-cli/           # Terminal UI system management
├── tools/             # Development tools
└── ai-engine/         # AI-powered features

```

---

## 🔗 Important Links

### Live Applications
- 🏛️ **[Development Engine](./docs/02_DEVELOPMENT_ENGINE.html)** - Unified development platform
- 💻 **[Contract IDE](./docs/contract_deployment_ide.html)** - Write, compile & deploy
- 🌉 **[Bridge Interface](./docs/bridge.html)** - Cross-chain transfers
- 🎨 **[NFT Interface](./contracts/tokens/nft/frontend)** - NFT minting and management

### Documentation
- 📖 **[Full Documentation](./docs/00_README_FULL.md)** - Complete system details
- 🔐 **[Security Audit](./docs/07_SECURITY.md)** - PERFECT 100/100 rating
- 📋 **[Address Book](./address.book)** - All deployed contract addresses
- 🎓 **[Integration Guides](./docs/ADAM_INTEGRATION_GUIDE.md)** - Step-by-step integration

### Resources
- 🌐 **[Base Network](https://base.org/)** - Our L2 home
- 🦄 **[Uniswap Position](https://app.uniswap.org/positions/v4/base/242940)** - Live liquidity
- 📊 **[BaseScan](https://basescan.org/address/0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437)** - Contract verification

---

## 🛠️ Technology Stack

[![Solidity](https://img.shields.io/badge/Solidity-0.8.21-363636?style=flat-square&logo=solidity&logoColor=white)](https://docs.soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Upgradeable-205081?style=flat-square&logo=openzeppelin&logoColor=white)](https://openzeppelin.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.x-ff8c00?style=flat-square&logo=hardhat&logoColor=white)](https://hardhat.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-3C3C3D?style=flat-square&logo=ethereum&logoColor=white)](https://docs.ethers.org/v6/)
[![Uniswap](https://img.shields.io/badge/Uniswap-V4-FF007A?style=flat-square&logo=uniswap&logoColor=white)](https://app.uniswap.org/)

---

## 📞 Support & Community

- 📧 **Security**: security@arcexchange.io
- 💬 **Discord**: [Join our community](https://discord.gg/arc)
- 🐦 **Twitter**: [@ARCEcosystem](https://twitter.com/ARCEcosystem)
- 📝 **Issues**: [GitHub Issues](https://github.com/Artifact-Virtual/ARC/issues)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## ⭐ Star Us!

If you find ARC useful, please consider giving us a star on GitHub! It helps others discover the project.

[![GitHub stars](https://img.shields.io/github/stars/Artifact-Virtual/ARC?style=social)](https://github.com/Artifact-Virtual/ARC)
