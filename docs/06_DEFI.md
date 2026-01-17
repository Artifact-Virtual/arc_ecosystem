---
title: DeFi Integration
description: Uniswap V4 integration, liquidity provision, and DeFi features
version: 1.0.0
last_updated: 2026-01-17
---

# DeFi Integration

## Overview

The ARC ecosystem integrates deeply with DeFi protocols, primarily through Uniswap V4 on Base L2. This document covers liquidity provision, DEX integration, bridge functionality, and deployed addresses.

---

## Uniswap V4 Integration

### Live Liquidity Pool

**Status:** ✅ Active on Base L2

**Pair:** ARCX2 / WETH  
**Fee Tier:** 0.05% (stable pair fee)  
**Main LP Position:** [#242940](https://app.uniswap.org/positions/v4/base/242940)

### Pool Configuration

| Parameter | Value |
|-----------|-------|
| **Pool Manager** | `0x498581ff718922c3f8e6a244956af099b2652b2b` |
| **Position Manager (NFPM)** | `0x7c5f5a4bbd8fd63184577525326123b519429bdc` |
| **Universal Router** | `0x6ff5693b99212da76ad316178a184ab56d299b43` |
| **Fee Tier** | 0.05% (500 basis points) |
| **Tick Spacing** | 10 |

### Initial Liquidity

**ARCX2 Seeded:** 500,000 tokens (50% of total supply)

**Liquidity Range:**
- Full range liquidity position
- Maximum capital efficiency
- Optimized for trading

**Benefits:**
- Deep liquidity from day one
- Minimal slippage for trades
- Sustainable LP rewards

### Uniswap V4 Features

**Why V4?**
- **Hooks**: Customizable pool behavior (future use)
- **Singleton Design**: Gas-efficient multi-pool management
- **Flash Accounting**: Significant gas savings
- **Native ETH**: Better UX with native asset support

**Current Implementation:**
- No hooks currently active
- Standard concentrated liquidity
- Direct integration with Position Manager
- Compatible with Universal Router

---

## Trading on Uniswap

### How to Swap ARCX2

#### Via Uniswap Interface

1. Visit [app.uniswap.org](https://app.uniswap.org)
2. Connect wallet (Base network)
3. Select ARCX2 token:
   - Address: `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`
4. Choose pair (WETH, USDC, etc.)
5. Enter amount and swap

#### Via Smart Contract

```solidity
// Using Universal Router
IUniversalRouter router = IUniversalRouter(
    0x6ff5693b99212da76ad316178a184ab56d299b43
);

bytes memory commands = abi.encodePacked(
    uint8(Commands.V4_SWAP)
);

bytes[] memory inputs = new bytes[](1);
inputs[0] = abi.encode(
    V4SwapParams({
        poolKey: poolKey,
        zeroForOne: true,
        amountIn: amountIn
    })
);

router.execute(commands, inputs);
```

### Price Impact

**Typical Slippage:**
- Small trades (<1k ARCX2): <0.1%
- Medium trades (1k-10k): 0.1-0.5%
- Large trades (>10k): 0.5-2%

**Slippage Settings:**
- Conservative: 0.5%
- Normal: 1.0%
- High: 2.0%

---

## Liquidity Provision

### Adding Liquidity to ARCX2/WETH Pool

#### Prerequisites

- ARCX2 tokens
- WETH (or ETH to wrap)
- Base network gas (ETH)

#### Step-by-Step Guide

**1. Prepare Assets**
```bash
# Check balances
npx hardhat run scripts/monitor.ts --network base supply

# Approve tokens
npx hardhat run scripts/lp-manager.ts --network base approve
```

**2. Add Liquidity**

Via Uniswap Interface:
1. Go to [Uniswap Pool Interface](https://app.uniswap.org/pools)
2. Click "New Position"
3. Select ARCX2/WETH pair
4. Choose fee tier (0.05%)
5. Set price range
6. Enter amounts
7. Confirm transaction

Via Script:
```bash
npx hardhat run scripts/lp-manager.ts --network base add-liquidity
```

**3. Monitor Position**
```bash
# Check LP status
npx hardhat run scripts/lp-manager.ts --network base status

# Check earnings
npx hardhat run scripts/monitor.ts --network base liquidity
```

#### Fee Earnings

**Fee Structure:**
- Trading fee: 0.05%
- 100% to liquidity providers
- Auto-compounding available

**Estimated APR:**
- Depends on trading volume
- Current range: 5-20% APR
- Check real-time on Uniswap interface

### Managing Your Position

**Increase Liquidity:**
```bash
npx hardhat run scripts/lp-manager.ts --network base increase
```

**Decrease Liquidity:**
```bash
npx hardhat run scripts/lp-manager.ts --network base decrease
```

**Collect Fees:**
```bash
npx hardhat run scripts/lp-manager.ts --network base collect
```

**Remove Liquidity:**
```bash
npx hardhat run scripts/lp-manager.ts --network base remove
```

---

## Uniswap V4 Hook (Optional)

### Hook Contract

**Address:** `0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0`  
**Status:** Deployed but not active for main LP

**Purpose:**
- Custom pool behavior
- Dynamic fee adjustment
- Advanced liquidity management
- MEV protection

**Note:** The main liquidity position (#242940) does NOT use hooks for maximum compatibility and simplicity.

### Future Hook Features

**Planned Enhancements:**
1. **Dynamic Fees**
   - Adjust fees based on volatility
   - Protect LPs during high volatility
   - Optimize capital efficiency

2. **MEV Protection**
   - Sandwich attack prevention
   - Fair ordering mechanisms
   - Front-running protection

3. **Liquidity Incentives**
   - Reward loyal LPs
   - Time-weighted bonuses
   - Volume-based rewards

4. **Advanced Features**
   - Limit orders
   - TWAP integration
   - Rebalancing automation

---

## Bridge Functionality

### Cross-Chain Bridge (Planned)

**Status:** 🚧 In Development

**Supported Chains:**
- Ethereum Mainnet (L1)
- Base L2 (current)
- Optimism (planned)
- Arbitrum (planned)
- Polygon (planned)

### Bridge Architecture

**Components:**
1. **Lock Contract** (Source chain)
   - Locks tokens on origin
   - Emits bridge event
   - Validates user request

2. **Relayer Network**
   - Monitors bridge events
   - Validates proofs
   - Submits to destination

3. **Mint Contract** (Destination chain)
   - Verifies proof
   - Mints wrapped tokens
   - Handles redemptions

### Bridge Security

**Security Measures:**
- Multi-sig guardian council
- Rate limiting per chain
- Emergency pause mechanism
- Fraud proof system
- Insurance fund

**Audit Status:**
- Design phase
- Security review pending
- Testnet deployment planned Q2 2026

### How to Bridge (When Live)

**Bridge ARCX2 from Base to Ethereum:**

1. Visit bridge interface
2. Connect wallet
3. Select source (Base) and destination (Ethereum)
4. Enter amount
5. Confirm transaction on Base
6. Wait for confirmation (~5-10 minutes)
7. Claim on Ethereum

**Fees:**
- Bridge fee: 0.1% of amount
- Gas costs: Variable by chain
- No minimum amount

---

## DeFi Integrations

### Current Integrations

#### 1. Uniswap V4
- ✅ Live liquidity pool
- ✅ Trading active
- ✅ Fee generation

#### 2. Base Network
- ✅ Native deployment
- ✅ Low fees
- ✅ Fast finality

### Planned Integrations

#### 1. Lending Protocols
**Aave / Compound:**
- Collateral for loans
- Earn interest on deposits
- Leverage positions

**Timeline:** Q3 2026

#### 2. Yield Aggregators
**Yearn / Beefy:**
- Auto-compounding LP positions
- Optimized yield strategies
- Gas-efficient rebalancing

**Timeline:** Q3 2026

#### 3. Derivatives Platforms
**GMX / Synthetix:**
- Perpetual futures
- Options trading
- Synthetic assets

**Timeline:** Q4 2026

#### 4. NFT Marketplaces
**OpenSea / Blur:**
- NFT trading with ARCX2
- Floor price discovery
- Royalty payments

**Timeline:** Q2 2026

---

## Deployed Addresses (Base L2)

### Core Contracts

| Contract | Address |
|----------|---------|
| **ARCx V2 Enhanced** | `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437` |
| **ARCxMath Library** | `0xdfB7271303467d58F6eFa10461c9870Ed244F530` |
| **Vesting Contract** | `0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600` |
| **Airdrop Contract** | `0x40fe447cf4B2af7aa41694a568d84F1065620298` |

### Governance & Treasury

| Contract | Address |
|----------|---------|
| **Treasury Safe** | `0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38` |
| **Ecosystem Safe** | `0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb` |
| **Deployer Wallet** | `0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B` |

### Uniswap V4 Infrastructure

| Contract | Address |
|----------|---------|
| **Pool Manager** | `0x498581ff718922c3f8e6a244956af099b2652b2b` |
| **Position Manager** | `0x7c5f5a4bbd8fd63184577525326123b519429bdc` |
| **Universal Router** | `0x6ff5693b99212da76ad316178a184ab56d299b43` |
| **Hook (Optional)** | `0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0` |

### Base Network Tokens

| Token | Address |
|-------|---------|
| **WETH** | `0x4200000000000000000000000000000000000006` |
| **USDC** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

**Authoritative Source:** See `address.book` file for complete list and verification.

---

## LP Position Details

### Main Position #242940

**View Position:**
[Uniswap Interface](https://app.uniswap.org/positions/v4/base/242940)

**Position Details:**
- Pair: ARCX2/WETH
- Fee Tier: 0.05%
- Liquidity: 500,000 ARCX2
- Range: Full range
- Status: Active

**Performance:**
- Total Volume: View on Uniswap
- Fees Earned: View on Uniswap
- APR: Real-time calculation

**Position Management:**
- Owner: Ecosystem Safe
- Managed by: DAO governance
- Rebalancing: As needed based on governance

---

## DeFi Best Practices

### For Traders

1. **Check Liquidity**
   - Review pool depth
   - Check recent volume
   - Monitor price impact

2. **Set Slippage**
   - Use appropriate tolerance
   - Higher for large trades
   - Consider market conditions

3. **Timing**
   - Avoid high gas periods
   - Monitor mempool
   - Use limit orders when available

### For Liquidity Providers

1. **Understand Impermanent Loss**
   - IL risk in volatile markets
   - Fee generation vs IL
   - Time horizon matters

2. **Range Selection**
   - Full range: Safer, lower fees
   - Narrow range: Higher fees, more risk
   - Monitor and rebalance

3. **Fee Collection**
   - Collect regularly
   - Consider auto-compounding
   - Tax implications

### For Integrators

1. **Use Official Contracts**
   - Verify addresses on BaseScan
   - Check address.book file
   - Test on testnet first

2. **Handle Errors**
   - Slippage protection
   - Timeout handling
   - User feedback

3. **Monitor Health**
   - Track pool reserves
   - Watch for anomalies
   - Emergency procedures

---

## API Integration Examples

### Get Pool State

```javascript
const poolManager = await ethers.getContractAt(
  'IPoolManager',
  '0x498581ff718922c3f8e6a244956af099b2652b2b'
);

const slot0 = await poolManager.getSlot0(poolKey);
console.log('Current Price:', slot0.sqrtPriceX96);
```

### Execute Swap

```javascript
const router = await ethers.getContractAt(
  'IUniversalRouter',
  '0x6ff5693b99212da76ad316178a184ab56d299b43'
);

// Prepare swap commands
const commands = '0x00'; // V4_SWAP
const inputs = [encodeV4SwapParams(...)];

await router.execute(commands, inputs, { value: 0 });
```

### Query Position

```javascript
const positionManager = await ethers.getContractAt(
  'INonfungiblePositionManager',
  '0x7c5f5a4bbd8fd63184577525326123b519429bdc'
);

const position = await positionManager.positions(242940);
console.log('Liquidity:', position.liquidity);
```

---

## Monitoring & Analytics

### Real-Time Monitoring

```bash
# Check liquidity status
npx hardhat run scripts/monitor.ts --network base liquidity

# Check LP position
npx hardhat run scripts/lp-manager.ts --network base status

# Full DeFi report
npx hardhat run scripts/monitor.ts --network base report
```

### Analytics Platforms

**Uniswap Analytics:**
- https://info.uniswap.org/
- Pool-specific metrics
- Historical data

**Dune Analytics:**
- Custom dashboards (coming soon)
- Token metrics
- Holder analytics

**DeFiLlama:**
- TVL tracking
- Protocol comparison
- Chain analytics

---

## Troubleshooting

### Common Issues

**Transaction Fails:**
- Check slippage settings
- Verify token approvals
- Ensure sufficient gas

**High Price Impact:**
- Trade smaller amounts
- Wait for more liquidity
- Use limit orders

**LP Position Not Showing:**
- Wrong network selected
- Position outside range
- Refresh interface

For more issues, see [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md)

---

## Related Documentation

- [04_TOKENS.md](./04_TOKENS.md) - Token details
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Contract interfaces
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide
- [10_SCRIPTS.md](./10_SCRIPTS.md) - Management scripts

---

## Support

For DeFi integration support:
- 📧 Email: defi@arcexchange.io
- 💬 Discord: [Join community](https://discord.gg/arc)
- 📝 Issues: [Report problems](https://github.com/Artifact-Virtual/ARC/issues)
- 🦄 Uniswap: [Trade now](https://app.uniswap.org/)
