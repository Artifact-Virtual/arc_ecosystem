# ARC CLI - Usage Guide & Examples

This guide provides detailed examples of using the ARC CLI for common tasks.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Ecosystem Management](#ecosystem-management)
3. [Token Operations](#token-operations)
4. [Monitoring](#monitoring)
5. [Advanced Usage](#advanced-usage)
6. [Common Tasks](#common-tasks)

---

## Getting Started

### First Time Setup

```bash
# 1. Navigate to CLI directory
cd arc-cli

# 2. Install dependencies (if not already done)
npm install

# 3. Configure environment (optional but recommended)
cp ../.env.example ../.env
# Edit .env with your API keys

# 4. Start the CLI
npm start
# Or use the quick start script
./start.sh
# Or run directly
node index.js
```

### Quick Navigation

Use arrow keys (↑/↓) to navigate menus and Enter to select options.

---

## Ecosystem Management

### View System Status

```
Main Menu → 🌐 Ecosystem Overview → 📊 Dashboard
```

**What you'll see:**
- System status table with all components
- Token distribution breakdown
- Network information (latest block, gas prices)
- Real-time health indicators

**Use cases:**
- Quick health check before operations
- Verify all contracts are live
- Check current network conditions

### Check Contract Addresses

```
Main Menu → 🌐 Ecosystem Overview → 🔗 Contract Addresses
```

**What you'll see:**
- Core contracts (ARCx V2, Math Library)
- Infrastructure contracts (Vesting, Airdrop, Hooks)
- Governance addresses (Treasury, Ecosystem Safes)
- Uniswap V4 components

**Use cases:**
- Get contract addresses for external tools
- Verify deployment status
- Copy addresses for BaseScan

### Run Health Check

```
Main Menu → 🌐 Ecosystem Overview → 🏥 Health Check
```

**What you'll see:**
- Network connectivity test
- Contract responsiveness check
- Configuration validation
- RPC endpoint status

**Use cases:**
- Troubleshoot connection issues
- Verify configuration before important operations
- Pre-deployment checks

---

## Token Operations

### Check Token Information

```
Main Menu → 🪙 Tokens (ARCx) → 📊 Token Overview
```

**What you'll see:**
- Token name, symbol, decimals
- Total and max supply
- Contract address
- Token features list

**Use cases:**
- Verify token contract details
- Get basic token information
- Confirm deployment status

### View Token Distribution

```
Main Menu → 🪙 Tokens (ARCx) → 💰 Supply & Distribution
```

**What you'll see:**
- Distribution breakdown by category
- Visual progress bars
- Percentage allocations
- Locked vs circulating supply

**Use cases:**
- Analyze tokenomics
- Verify vesting locks
- Track supply allocation

### Check Wallet Balance

```
Main Menu → 🪙 Tokens (ARCx) → 🔍 Check Balance
```

**Steps:**
1. Select "Check Balance"
2. Enter wallet address (with validation)
3. View balance, share %, and USD value

**Use cases:**
- Check personal holdings
- Verify transfer completion
- Audit holder balances

### Transfer Tokens

```
Main Menu → 🪙 Tokens (ARCx) → 💸 Transfer Tokens
```

**Requirements:**
- DEPLOYER_PRIVATE_KEY configured in .env
- Sufficient ETH for gas
- ARCx balance to transfer

**Steps:**
1. Select "Transfer Tokens"
2. Enter recipient address
3. Enter amount (in ARCx)
4. Confirm transaction
5. Wait for blockchain confirmation

**Example workflow:**
```
Recipient: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Amount: 100
Confirm? Yes
→ Transaction sent: 0xabc123...
→ Waiting for confirmation...
→ Transfer completed!
```

**Use cases:**
- Send tokens to team members
- Distribute airdrop allocations
- Transfer to exchange

---

## Monitoring

### Real-time Dashboard

```
Main Menu → 📊 Monitoring & Analytics → 📊 Real-time Dashboard
```

**What you'll see:**
- Live network status (block number, timestamp)
- Current gas prices
- Token metrics (price, volume, traders)
- System health indicators

**Features:**
- Auto-updating data (conceptual)
- Color-coded status indicators
- Real-time block information

**Use cases:**
- Monitor system during high activity
- Track price movements
- Watch network congestion

### Monitor Transactions

```
Main Menu → 📊 Monitoring & Analytics → ⚡ Live Transactions
```

**What you'll see:**
- Recent ARCx transfers
- Transaction types (Transfer, Swap, Approve)
- From/To addresses
- Transaction amounts

**Use cases:**
- Track token movements
- Monitor trading activity
- Detect unusual patterns

### Gas Price Tracking

```
Main Menu → 📊 Monitoring & Analytics → ⛽ Gas Tracker
```

**What you'll see:**
- Current gas prices (Slow/Standard/Fast)
- Base fee and priority fee breakdown
- Transaction cost estimates
- Cost in ETH and USD

**Use cases:**
- Choose optimal transaction timing
- Estimate operation costs
- Compare with historical data

### Liquidity Monitoring

```
Main Menu → 📊 Monitoring & Analytics → 🔥 Liquidity Monitor
```

**What you'll see:**
- ARCx/WETH pool reserves
- Total liquidity in USD
- 24h volume and fees
- Price impact calculator

**Use cases:**
- Track pool health
- Calculate swap impacts
- Monitor liquidity depth

### Generate Analytics Report

```
Main Menu → 📊 Monitoring & Analytics → 📈 Analytics Report
```

**What you'll see:**
- 24-hour trading summary
- Volume and transaction metrics
- Top traders by activity
- Comprehensive statistics

**Use cases:**
- Daily performance review
- Identify top traders
- Track ecosystem growth

---

## Advanced Usage

### Custom RPC Provider

If you want to use a custom RPC endpoint:

```bash
# Edit .env file
INFURA_PROJECT_ID=your_infura_key
# Or
ALCHEMY_API_KEY=your_alchemy_key
```

The CLI will automatically use these credentials.

### Multiple Wallets

To switch between wallets:

```bash
# Method 1: Edit .env
DEPLOYER_PRIVATE_KEY=your_wallet_1_key

# Method 2: Use environment variable
DEPLOYER_PRIVATE_KEY=your_wallet_2_key npm start
```

### Testnet Operations

To use Base Sepolia testnet:

```javascript
// Edit lib/config.js temporarily or:
// Use testnet addresses in address.book
```

The CLI automatically reads network configuration from hardhat.config.ts.

### Scripted Operations

For automation, you can import CLI modules:

```javascript
const config = require('./arc-cli/lib/config');
const { ethers } = require('ethers');

// Get contract instance
const arcx = config.getContract('arcx');

// Check balance
const balance = await arcx.balanceOf('0x...');
console.log('Balance:', ethers.formatUnits(balance, 18));
```

---

## Common Tasks

### Daily Operations Checklist

1. **Morning Health Check**
   ```
   Ecosystem Overview → Health Check
   ```

2. **Monitor Activity**
   ```
   Monitoring → Real-time Dashboard
   Monitoring → Live Transactions
   ```

3. **Check Liquidity**
   ```
   Monitoring → Liquidity Monitor
   ```

4. **Review Analytics**
   ```
   Monitoring → Analytics Report
   ```

### Pre-Deployment Checklist

1. **Verify Network Status**
   ```
   Ecosystem Overview → Network Status
   ```

2. **Check Gas Prices**
   ```
   Monitoring → Gas Tracker
   ```

3. **Run Health Check**
   ```
   Ecosystem Overview → Health Check
   ```

4. **Review Current Deployments**
   ```
   Deployments → View All Deployments
   ```

### Troubleshooting Workflow

1. **Connection Issues**
   ```
   Ecosystem Overview → Health Check
   → Check "Network Connectivity"
   → Check "RPC Endpoint"
   ```

2. **Configuration Issues**
   ```
   Ecosystem Overview → Health Check
   → Check "Configuration" status
   → Review warnings
   ```

3. **Transaction Failures**
   ```
   Monitoring → Gas Tracker
   → Check current gas prices
   → Verify sufficient ETH balance
   Tokens → Check Balance
   → Verify token balance
   ```

### Quick Reference Commands

```bash
# Start CLI
npm start
# Or
node index.js
# Or
./start.sh

# From project root
npm run cli

# Exit CLI
# Use menu: Exit
# Or press: Ctrl+C
```

### Keyboard Shortcuts Reference

| Key | Action |
|-----|--------|
| `↑` | Move up in menu |
| `↓` | Move down in menu |
| `Enter` | Select/Confirm |
| `Space` | Toggle (multi-select) |
| `Esc` | Cancel/Go back |
| `Ctrl+C` | Force exit |

---

## Best Practices

1. **Always run health check before important operations**
2. **Verify addresses before transferring tokens**
3. **Check gas prices for optimal transaction timing**
4. **Monitor transactions after executing them**
5. **Keep .env file secure and never commit it**
6. **Use testnet for testing new features**
7. **Review analytics regularly for insights**

---

## Tips & Tricks

### Efficiency Tips

- Use keyboard navigation (it's faster than mouse)
- Bookmark frequently used features mentally
- Check gas prices before transfers to save costs
- Monitor liquidity before large swaps

### Security Tips

- Never share your private key
- Use separate wallets for testing
- Enable 2FA on RPC provider accounts
- Keep CLI dependencies updated
- Verify contract addresses on BaseScan

### Performance Tips

- Use local RPC node for faster responses
- Keep terminal window size adequate (80+ columns)
- Clear terminal if output becomes cluttered
- Use monitoring features sparingly to avoid rate limits

---

## Examples by Role

### For Token Holders

**Daily routine:**
1. Check token price and market data
2. Monitor your balance
3. Review trading volume

**Menu path:**
```
Tokens → Price & Market
Tokens → Check Balance
Monitoring → Analytics Report
```

### For Developers

**Development workflow:**
1. Verify deployments
2. Check contract details
3. Monitor events and logs

**Menu path:**
```
Deployments → View Deployments
Deployments → Contract Details
Monitoring → Event Logs
```

### For Community Managers

**Engagement tracking:**
1. Check holder statistics
2. Review transaction activity
3. Generate daily reports

**Menu path:**
```
Tokens → Holder Statistics
Monitoring → Live Transactions
Monitoring → Analytics Report
```

---

## Getting Help

If you need assistance:

1. **In-App Help**: Select "Help & Documentation" from main menu
2. **README**: Read the comprehensive README.md
3. **GitHub Issues**: Report bugs or request features
4. **Community**: Join our Discord/Telegram

---

## Feedback & Contributions

We welcome feedback and contributions!

- Found a bug? [Open an issue](https://github.com/Artifact-Virtual/ARC/issues)
- Have a feature idea? [Submit a suggestion](https://github.com/Artifact-Virtual/ARC/discussions)
- Want to contribute? [Fork and PR](https://github.com/Artifact-Virtual/ARC)

---

**Happy managing! 🚀**

*ARC CLI - Professional Terminal UI for the ARC Ecosystem*
