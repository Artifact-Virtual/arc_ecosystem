---
title: Introduction to ARC
description: Quick start guide to the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# Introduction to ARC

Welcome to **THE|ARC** - A comprehensive decentralized autonomous organization (DAO) and governance system built on Base L2.

## What is ARC?

ARC is a professional-grade blockchain ecosystem that provides:

- 🏛️ **Advanced Governance** - Multiple voting mechanisms with secure timelock controls
- 🪙 **Token Systems** - ARCx V2 Enhanced (live), ARCs, NFTs, and SBTs
- 💹 **DeFi Integration** - Uniswap V4 liquidity, bridges, and swaps
- 🛡️ **Enterprise Security** - 100/100 security audit rating
- 🤖 **AI-Powered Features** - Constitutional policy engine (ADAM)

## Quick Start

### For Users

1. **Connect Your Wallet** - Use MetaMask or any Web3 wallet
2. **Add Base Network** - Configure Base L2 (Chain ID: 8453)
3. **Get ARCX2** - Trade on [Uniswap V4](https://app.uniswap.org/)
4. **Participate in Governance** - Vote on proposals and earn rewards

### For Developers

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

### For Integrators

Check out our [Integration Guide](./ADAM_INTEGRATION_GUIDE.md) for step-by-step instructions on integrating ARC into your application.

## Key Features

### ARCx V2 Enhanced Token (LIVE)

- **Contract**: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`
- **Network**: Base L2 Mainnet
- **Supply**: 1,000,000 ARCX2 (finalized)
- **Liquidity**: 500k ARCX2 on Uniswap V4

### Advanced Governance

- Multiple voting mechanisms (standard, quadratic, conviction, ranked choice)
- Secure timelock controls for proposal execution
- Proposal threshold and quorum enforcement
- Treasury management with multi-sig safes

### Security First

- ✅ Zero vulnerabilities across 70+ contracts
- ✅ 147 tests passing, 92% code coverage
- ✅ Perfect 100/100 security audit rating
- ✅ ReentrancyGuard and access control throughout

## Architecture Overview

```
ARC Ecosystem
├── Governance Layer (DAO, Voting, Proposals)
├── Token Layer (ARCx, ARCs, NFT, SBT)
├── DeFi Layer (Uniswap V4, Bridges, Pools)
├── Security Layer (Timelock, Access Control, Guards)
└── AI Layer (ADAM Constitutional Engine)
```

## Navigation

### Next Steps
- **[Architecture Overview](./02_ARCHITECTURE.md)** - Understand the system design
- **[Development Guide](./03_DEVELOPMENT.md)** - Start building
- **[Token Systems](./04_TOKENS.md)** - Explore token features

### Related Resources
- **[Full Documentation](./00_README_FULL.md)** - Complete details
- **[Security Audit](./07_SECURITY.md)** - Security analysis
- **[API Reference](./08_API_REFERENCE.md)** - Contract interfaces

## Support

Need help? Reach out to us:

- 📧 Email: security@arcexchange.io
- 💬 Discord: [Join our community](https://discord.gg/arc)
- 📝 Issues: [GitHub Issues](https://github.com/Artifact-Virtual/ARC/issues)

---

**Ready to dive deeper?** Continue to [Architecture Overview →](./02_ARCHITECTURE.md)
