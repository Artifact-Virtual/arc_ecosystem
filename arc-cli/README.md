# ARC CLI - Professional Terminal UI

<div align="center">

![ARC CLI](https://img.shields.io/badge/ARC-CLI-6A00FF?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A comprehensive, professional-grade terminal interface for managing the ARC ecosystem**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Documentation](#documentation)

</div>

---

## 🌟 Overview

ARC CLI is a bleeding-edge terminal application designed for seamless interaction with the ARC ecosystem on Base L2. Built with modern Node.js and featuring an intuitive interface, it provides professional tools for managing tokens, NFTs, SBTs, deployments, and real-time monitoring.

### Key Highlights

- 🎨 **Beautiful UI** - Modern terminal interface with custom theming
- ⚡ **Real-time Data** - Live blockchain monitoring and analytics
- 🔒 **Secure** - Safe transaction handling with confirmation prompts
- 🌐 **Base L2 Native** - Optimized for Base L2 network
- 📊 **Comprehensive** - Complete ecosystem management in one tool
- 🚀 **Production-Ready** - Fully tested and battle-hardened

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- Base L2 RPC access (Infura/Alchemy recommended)
- `.env` file configured (see [Configuration](#configuration))

### Quick Install

```bash
# Navigate to arc-cli directory
cd arc-cli

# Install dependencies
npm install

# Make executable (Unix/Linux/Mac)
chmod +x index.js

# Run the CLI
npm start
```

### Global Installation (Optional)

```bash
# Link globally
npm link

# Run from anywhere
arc
```

---

## 🚀 Usage

### Starting the CLI

```bash
# From arc-cli directory
npm start

# Or if globally installed
arc
```

### Main Menu Navigation

```
════════════════════════════════════════════════════════════════════════════════
                            ARC CLI
════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Welcome to ARC CLI!                                          │
│                                                                 │
│   Manage your ARC ecosystem with ease:                         │
│   ✓ Token management (ARCx)                                   │
│   ✓ NFT & SBT operations                                      │
│   ✓ Real-time monitoring                                      │
│   ✓ Contract deployments                                      │
│   ✓ Network analytics                                         │
│                                                                 │
│   Base L2 Network • Professional Grade                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

? Select an option:
  🌐 Ecosystem Overview
  🚀 Deployments
  🪙  Tokens (ARCx)
  🎨 NFTs Management
  🏅 SBTs (Soul-Bound Tokens)
  📊 Monitoring & Analytics
  ⚙️  Configuration
  ─────────────────────────────────────
  ❓ Help & Documentation
  🚪 Exit
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate menu items |
| `Enter` | Select/Confirm |
| `Space` | Toggle selection (multi-select) |
| `Esc` | Go back/Cancel |
| `Ctrl+C` | Exit application |

---

## 🎯 Features

### 1. Ecosystem Overview

**Dashboard** - Real-time system status and metrics
- Token supply and distribution
- Network status and health
- Contract deployment status
- Key performance indicators

**Token Metrics** - Comprehensive ARCx analytics
- Supply statistics
- Holder distribution
- Market data (price, volume, TVL)
- Token features overview

**Contract Addresses** - All deployed contracts
- Core contracts (ARCx V2, Math Library)
- Infrastructure (Vesting, Airdrop, Hooks)
- Governance (Treasury, Ecosystem Safes)
- Uniswap V4 components

**Health Check** - System diagnostics
- Network connectivity
- Contract responsiveness
- Configuration validation
- RPC endpoint testing

**Network Status** - Base L2 information
- Latest block data
- Gas prices
- Network statistics

### 2. Deployments

**View Deployments** - All contract deployments
- Contract names and addresses
- Network information
- Deployment status
- Verification status

**Contract Details** - Deep dive into contracts
- Bytecode information
- Balance checking
- Explorer links
- Deployment timestamps

**Verification** - Contract verification tools
- BaseScan integration
- Verification commands
- Status tracking

**Deployment Status** - Progress tracking
- Completion percentages
- Progress bars
- Roadmap visualization

### 3. Token Management (ARCx)

**Token Overview** - ARCx token information
- Name, symbol, decimals
- Total and max supply
- Contract address
- Token features

**Supply & Distribution** - Token allocation
- Liquidity pool (50%)
- Vesting (30%)
- Airdrop (10%)
- Marketing (10%)
- Visual progress bars

**Holder Statistics** - Token holder analytics
- Top holders
- Distribution percentages
- Average balances
- Holder count

**Transfer Tokens** - Send ARCx tokens
- Interactive transfer interface
- Address validation
- Confirmation prompts
- Transaction tracking

**Check Balance** - Query any address
- Token balance
- Share of supply
- USD value estimation

**Market Data** - Price and trading info
- Current price
- Market cap
- 24h volume
- Trading pairs
- Liquidity metrics

### 4. NFT Management (Planned)

**Collection Overview** - ARCs NFT details
- Collection statistics
- Minting information
- Feature roadmap

**Browse NFTs** - View collection
- NFT listings
- Ownership data
- Rarity information

**Mint NFT** - Create new NFTs (coming soon)
**Transfer NFT** - Send NFTs (coming soon)
**Check Ownership** - Verify holdings
**Collection Stats** - Analytics and metrics

### 5. SBT Management (Planned)

**SBT Overview** - Soul-bound token system
- Token types
- Benefits overview
- System features

**Browse SBTs** - View issued SBTs
- Credential types
- Holder information
- Issuance dates

**Issue SBT** - Create credentials (coming soon)
**Verify SBT** - Check authenticity
**Check Credentials** - View achievements
**SBT Statistics** - System analytics

### 6. Monitoring & Analytics

**Real-time Dashboard** - Live ecosystem data
- Network status
- Token metrics
- System health
- Auto-refresh capabilities

**Live Transactions** - Monitor transfers
- Recent transaction feed
- Transaction types
- Amount tracking
- Address information

**Gas Tracker** - Gas price monitoring
- Current gas prices
- Speed tiers (Slow/Standard/Fast)
- Transaction cost estimates
- Base L2 optimization info

**Event Logs** - Contract events
- Transfer events
- Approval events
- Block numbers
- Transaction hashes

**Liquidity Monitor** - Pool analytics
- ARCx/WETH pool data
- Reserve amounts
- 24h volume and fees
- Price impact calculator

**Analytics Report** - Comprehensive stats
- 24-hour summaries
- Trading volume
- Unique traders
- Top activities
- Generated reports

### 7. Configuration

**Network Settings** - Chain configuration
**RPC Endpoints** - Provider management
**API Keys** - Service integration
**Preferences** - User customization

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# RPC Provider (Choose one or both)
INFURA_PROJECT_ID=your_infura_project_id
ALCHEMY_API_KEY=your_alchemy_api_key

# Block Explorer (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key

# Wallet (for transactions - KEEP SECURE!)
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x

# Gas Settings (optional)
GAS_PRICE_MAINNET=20
GAS_PRICE_TESTNET=10
REPORT_GAS=true
```

### Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file or share private keys!

- Keep `DEPLOYER_PRIVATE_KEY` secure
- Use separate wallets for testing
- Enable 2FA on RPC provider accounts
- Regularly rotate API keys

### Network Configuration

The CLI automatically reads from:
- `../address.book` - Deployed contract addresses
- `../hardhat.config.ts` - Network settings
- `.env` - Private keys and API credentials

Supported networks:
- **Base L2 Mainnet** (default)
- **Base Sepolia Testnet**
- **Ethereum Mainnet**
- **Hardhat/Ganache Local**

---

## 📖 Documentation

### Architecture

```
arc-cli/
├── index.js              # Main entry point
├── package.json          # Dependencies
├── README.md            # This file
└── lib/
    ├── navigation.js    # Menu system & UI
    ├── theme.js         # Color schemes & styling
    ├── utils.js         # Utility functions
    ├── config.js        # Configuration management
    ├── ecosystem.js     # Ecosystem overview module
    ├── deployments.js   # Deployment management
    ├── tokens.js        # Token operations
    ├── nfts.js          # NFT management
    ├── sbts.js          # SBT operations
    └── monitoring.js    # Real-time monitoring
```

### Module System

Each module follows a consistent pattern:

```javascript
class Module {
  async show() {
    // Display menu
    // Handle user selection
    // Execute action
    // Return to menu or parent
  }
}
```

### Theme Customization

Edit `lib/theme.js` to customize colors:

```javascript
const theme = {
  primary: chalk.hex('#6A00FF'),    // Purple
  success: chalk.hex('#00C853'),    // Green
  warning: chalk.hex('#F9A825'),    // Orange
  error: chalk.hex('#FF1744'),      // Red
  info: chalk.hex('#58A6FF'),       // Blue
  // ... more colors
};
```

### Adding Custom Modules

1. Create new module file in `lib/`
2. Implement `show()` method
3. Register in `index.js`:

```javascript
const customModule = require('./lib/custom');
navigation.register('custom', customModule);
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Network not configured or RPC unavailable"
```bash
# Solution: Check .env file has valid RPC credentials
INFURA_PROJECT_ID=your_project_id
```

**Issue**: "DEPLOYER_PRIVATE_KEY not configured"
```bash
# Solution: Add private key to .env (without 0x prefix)
DEPLOYER_PRIVATE_KEY=your_key_here
```

**Issue**: "Failed to load ecosystem data"
```bash
# Solution: Verify network connectivity and RPC endpoint
# Test with: curl https://base-mainnet.infura.io/v3/YOUR_KEY
```

**Issue**: "Contract address not found"
```bash
# Solution: Ensure address.book is up to date
# Check: cat ../address.book
```

**Issue**: Display formatting issues
```bash
# Solution: Ensure terminal supports colors
# Set: export FORCE_COLOR=1
# Or use: FORCE_COLOR=1 npm start
```

### Debug Mode

Enable verbose logging:

```bash
# Set environment variable
export DEBUG=arc:*

# Or inline
DEBUG=arc:* npm start
```

### Getting Help

1. **Documentation**: Read this README thoroughly
2. **Help Menu**: Press `?` or select "Help & Documentation"
3. **GitHub Issues**: [Report bugs](https://github.com/Artifact-Virtual/ARC/issues)
4. **Discord**: Join our community (link in main repo)

---

## 🔧 Development

### Running in Development

```bash
# Install dependencies
npm install

# Run directly
node index.js

# Watch for changes (requires nodemon)
npm install -g nodemon
nodemon index.js
```

### Testing

```bash
# Run with test network
export NETWORK=base-sepolia
npm start

# Use local Ganache
export NETWORK=ganache
npm start
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Comments**: JSDoc for functions
- **Async/Await**: Preferred over promises

---

## 📊 Screenshots

### Main Dashboard
```
The main dashboard displays:
- ASCII art logo (ARC CLI) in purple/magenta gradient
- Welcome message in bordered box
- Menu with 10 options including Ecosystem, Tokens, NFTs, etc.
- Color-coded icons for each menu item
- Status indicators showing system health
```

### Ecosystem Overview
```
Shows comprehensive system status including:
- Deployment status table with green checkmarks
- Token distribution with progress bars
- Network information and block numbers
- Real-time gas prices in colored text
- System health indicators
```

### Token Management
```
Displays ARCx token information:
- Token details (name, symbol, supply) in formatted tables
- Balance checking with address validation
- Transfer interface with confirmation prompts
- Market data with price changes (green/red indicators)
- Distribution breakdown with visual progress bars
```

### Real-time Monitoring
```
Live monitoring interface featuring:
- Auto-updating dashboard with latest block info
- Transaction feed with timestamps
- Gas price tracker with multiple speed tiers
- Event logs with color-coded event types
- Liquidity pool metrics and price impact calculator
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these amazing open-source projects:

- [inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI prompts
- [chalk](https://github.com/chalk/chalk) - Terminal styling
- [ora](https://github.com/sindresorhus/ora) - Loading spinners
- [cli-table3](https://github.com/cli-table/cli-table3) - Data tables
- [boxen](https://github.com/sindresorhus/boxen) - Bordered boxes
- [figlet](https://github.com/patorjk/figlet.js) - ASCII art
- [ethers.js](https://github.com/ethers-io/ethers.js) - Ethereum library

---

## 📞 Support

- **GitHub**: [Artifact-Virtual/ARC](https://github.com/Artifact-Virtual/ARC)
- **Issues**: [Report a bug](https://github.com/Artifact-Virtual/ARC/issues)
- **Docs**: [Full Documentation](https://github.com/Artifact-Virtual/ARC#readme)

---

<div align="center">

**Made with ❤️ by Artifact Virtual**

![ARC](https://img.shields.io/badge/Powered%20by-Base%20L2-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production-green?style=flat-square)

*Professional Terminal UI for the ARC Ecosystem*

</div>
