---
title: Deployment Guide
description: Complete guide for deploying ARC contracts to Base L2 and other networks
version: 1.0.0
last_updated: 2026-01-17
---

# Deployment Guide

## Overview

This guide covers the complete deployment process for ARC ecosystem contracts, including prerequisites, network configuration, deployment procedures, and post-deployment verification.

---

## Prerequisites

### Required Tools

- **Node.js**: 18.x or higher
- **Hardhat**: 2.26.x or higher
- **Git**: Latest version
- **Wallet**: With sufficient ETH for gas

### Network Requirements

**Base L2 Mainnet:**
- RPC URL: https://mainnet.base.org
- Chain ID: 8453
- Native Token: ETH
- Block Explorer: https://basescan.org

**Base Sepolia Testnet:**
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Native Token: ETH (testnet)
- Faucet: https://portal.cdp.coinbase.com/products/faucet

### Wallet Preparation

**Mainnet Deployment:**
- Minimum 0.1 ETH for deployment gas
- Private key secured (hardware wallet recommended)
- Multi-sig setup for admin roles

**Testnet Deployment:**
- Get testnet ETH from faucet
- Use dedicated test wallet
- Never use mainnet private keys

---

## Environment Setup

### 1. Configure Environment Variables

Create `.env` file:

```bash
# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_CHAIN_ID=8453

# Deployment Wallet
DEPLOYER_PRIVATE_KEY=your_private_key_here
DEPLOYER_ADDRESS=0x...

# Multi-Sig Safes
TREASURY_SAFE_ADDRESS=0x...
ECOSYSTEM_SAFE_ADDRESS=0x...

# API Keys
BASESCAN_API_KEY=your_api_key_here

# Optional: Gas Configuration
GAS_PRICE_GWEI=0.1
MAX_FEE_PER_GAS=2
MAX_PRIORITY_FEE_PER_GAS=1
```

### 2. Verify Configuration

```bash
# Validate configuration
npx hardhat run scripts/config.ts --network base validate

# Check network connectivity
npx hardhat run scripts/config.ts --network base show

# Verify wallet balance
npx hardhat run scripts/deployment-manager.ts --network base check-balance
```

---

## Deployment Process

### Phase 1: Core Infrastructure

#### Step 1: Deploy ARCx V2 Enhanced Token

```bash
# Deploy token contract
npx hardhat run scripts/deployment-manager.ts --network base token

# Verify deployment
npx hardhat verify --network base TOKEN_ADDRESS
```

**Expected Output:**
```
✅ ARCxMath Library deployed: 0x...
✅ ARCx V2 Enhanced deployed: 0x...
📝 Deployment details saved to: deployments/base/token.json
```

#### Step 2: Deploy Vesting Contract

```bash
# Deploy vesting
npx hardhat run scripts/deployment-manager.ts --network base vesting

# Verify deployment
npx hardhat verify --network base VESTING_ADDRESS ARCx_TOKEN_ADDRESS
```

**Expected Output:**
```
✅ Vesting Contract deployed: 0x...
📝 Configuration: 300,000 ARCX2 allocated
```

#### Step 3: Deploy Airdrop Contract

```bash
# Deploy airdrop
npx hardhat run scripts/deployment-manager.ts --network base airdrop

# Verify deployment
npx hardhat verify --network base AIRDROP_ADDRESS ARCx_TOKEN_ADDRESS
```

**Expected Output:**
```
✅ Airdrop Contract deployed: 0x...
📝 Configuration: 100,000 ARCX2 allocated
```

### Phase 2: Governance Contracts

#### Step 4: Deploy Timelock

```bash
npx hardhat run scripts/deploy-timelock.ts --network base
```

**Configuration:**
- Minimum delay: 48 hours
- Proposers: Treasury Safe
- Executors: Ecosystem Safe
- Admin: Deployer (temporary)

#### Step 5: Deploy Governor

```bash
npx hardhat run scripts/deploy-governor.ts --network base
```

**Configuration:**
- Voting delay: 1 day
- Voting period: 7 days
- Proposal threshold: 10,000 ARCX2
- Quorum: 100,000 ARCX2

#### Step 6: Deploy Treasury

```bash
npx hardhat run scripts/deploy-treasury.ts --network base
```

**Configuration:**
- Owner: Governor contract
- Emergency admin: Treasury Safe

### Phase 3: DeFi Integration

#### Step 7: Setup Uniswap V4 Pool

```bash
# Check LP compatibility
npx hardhat run scripts/lp-manager.ts --network base check

# Configure for LP (if needed)
npx hardhat run scripts/lp-manager.ts --network base configure

# Add initial liquidity
npx hardhat run scripts/lp-manager.ts --network base add-liquidity \
  --amount-arcx 500000 \
  --amount-weth 1.0 \
  --fee-tier 500
```

**Pool Configuration:**
- Pair: ARCX2/WETH
- Fee: 0.05% (500 basis points)
- Range: Full range
- Initial Liquidity: 500,000 ARCX2

---

## Post-Deployment Configuration

### 1. Transfer Ownership

```bash
# Transfer token ownership to Treasury Safe
npx hardhat run scripts/transfer-ownership.ts --network base \
  --contract ARCx_TOKEN_ADDRESS \
  --new-owner TREASURY_SAFE_ADDRESS

# Transfer vesting ownership
npx hardhat run scripts/transfer-ownership.ts --network base \
  --contract VESTING_ADDRESS \
  --new-owner ECOSYSTEM_SAFE_ADDRESS
```

### 2. Setup Vesting Schedules

```bash
# Setup vesting for all beneficiaries
npx hardhat run scripts/vesting-manager.ts --network base setup-finalize

# Verify vesting schedules
npx hardhat run scripts/vesting-manager.ts --network base check-beneficiaries
```

### 3. Configure Airdrop

```bash
# Generate merkle tree
npx hardhat run scripts/airdrop-manager.ts --network base merkle \
  --input data/airdrop-recipients.csv

# Setup airdrop campaign
npx hardhat run scripts/airdrop-manager.ts --network base setup \
  --merkle-root 0x...
```

### 4. Setup Roles and Permissions

```bash
# Grant governance roles
npx hardhat run scripts/setup-roles.ts --network base

# Verify role configuration
npx hardhat run scripts/verify-roles.ts --network base
```

**Roles to Configure:**
- PROPOSER_ROLE → Treasury Safe
- EXECUTOR_ROLE → Ecosystem Safe
- ADMIN_ROLE → Governor Contract
- DEFAULT_ADMIN_ROLE → Renounced

---

## Contract Verification

### Verify on BaseScan

#### Automatic Verification

```bash
# Verify token
npx hardhat verify --network base TOKEN_ADDRESS

# Verify with constructor args
npx hardhat verify --network base VESTING_ADDRESS \
  --constructor-args scripts/verify-args.js
```

#### Manual Verification

1. Go to BaseScan contract page
2. Click "Verify and Publish"
3. Select "Solidity (Single file)" or "Standard JSON"
4. Upload flattened contract or JSON
5. Enter constructor arguments
6. Submit for verification

### Verification Checklist

- [ ] Token contract verified
- [ ] Vesting contract verified
- [ ] Airdrop contract verified
- [ ] Governor contract verified
- [ ] Timelock contract verified
- [ ] Treasury contract verified
- [ ] All proxy implementations verified

---

## Deployment Validation

### Automated Checks

```bash
# Full system health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# Validate all deployments
npx hardhat run scripts/config.ts --network base validate

# Generate deployment report
npx hardhat run scripts/monitor.ts --network base report
```

### Manual Validation

#### 1. Token Contract

- [ ] Total supply = 1,000,000 ARCX2
- [ ] Decimals = 18
- [ ] Name = "ARCx V2 Enhanced"
- [ ] Symbol = "ARCX2"
- [ ] Minting finalized
- [ ] Owner = Treasury Safe

#### 2. Vesting Contract

- [ ] Total allocated = 300,000 ARCX2
- [ ] All beneficiaries configured
- [ ] Cliff periods set correctly
- [ ] Vesting durations configured
- [ ] Owner = Ecosystem Safe

#### 3. Airdrop Contract

- [ ] Total allocation = 100,000 ARCX2
- [ ] Merkle root set
- [ ] Start/end times configured
- [ ] Token approval granted
- [ ] Owner = Treasury Safe

#### 4. Governance Contracts

- [ ] Timelock delay = 48 hours
- [ ] Voting period = 7 days
- [ ] Proposal threshold = 10,000 ARCX2
- [ ] Quorum = 100,000 ARCX2
- [ ] Roles properly configured

#### 5. Uniswap V4 Pool

- [ ] Pool initialized
- [ ] Liquidity added (500k ARCX2)
- [ ] Fee tier = 0.05%
- [ ] Position NFT minted
- [ ] Trading enabled

---

## Deployment Scripts Reference

### Core Deployment Scripts

**Token Deployment:**
```bash
scripts/deployment-manager.ts token
```

**Infrastructure Deployment:**
```bash
scripts/deployment-manager.ts infrastructure
```

**Full Deployment:**
```bash
scripts/deployment-manager.ts all
```

### Configuration Scripts

**Setup Vesting:**
```bash
scripts/vesting-manager.ts setup-finalize
```

**Setup Airdrop:**
```bash
scripts/airdrop-manager.ts setup
```

**Configure LP:**
```bash
scripts/lp-manager.ts configure
```

---

## Network Configurations

### Base L2 Mainnet

**hardhat.config.ts:**
```typescript
base: {
  url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
  chainId: 8453,
  accounts: [process.env.DEPLOYER_PRIVATE_KEY],
  gasPrice: "auto",
  verify: {
    etherscan: {
      apiUrl: "https://api.basescan.org",
      apiKey: process.env.BASESCAN_API_KEY,
    },
  },
}
```

### Base Sepolia Testnet

**hardhat.config.ts:**
```typescript
baseSepolia: {
  url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
  chainId: 84532,
  accounts: [process.env.DEPLOYER_PRIVATE_KEY],
  gasPrice: "auto",
}
```

---

## Gas Optimization

### Deployment Costs (Estimated)

| Contract | Gas Used | Cost (@ 0.1 gwei) |
|----------|----------|-------------------|
| ARCx V2 Token | ~3,000,000 | ~0.0003 ETH |
| Vesting | ~2,000,000 | ~0.0002 ETH |
| Airdrop | ~1,500,000 | ~0.00015 ETH |
| Governor | ~4,000,000 | ~0.0004 ETH |
| Timelock | ~2,500,000 | ~0.00025 ETH |
| Treasury | ~1,500,000 | ~0.00015 ETH |
| **Total** | **~14,500,000** | **~0.00145 ETH** |

### Optimization Tips

1. **Deploy during low activity**
   - Check Base network gas prices
   - Deploy during off-peak hours
   - Use gas price estimators

2. **Batch related operations**
   - Deploy multiple contracts in one session
   - Combine setup transactions
   - Use multicall where possible

3. **Use deployment scripts**
   - Automated deployment
   - Reduced human error
   - Consistent configuration

---

## Troubleshooting

### Common Issues

**Issue: Transaction Underpriced**
```bash
# Increase gas price
export MAX_FEE_PER_GAS=3
export MAX_PRIORITY_FEE_PER_GAS=2
```

**Issue: Contract Size Too Large**
```bash
# Enable optimizer
# In hardhat.config.ts:
optimizer: {
  enabled: true,
  runs: 200
}
```

**Issue: Verification Failed**
```bash
# Use flattened contract
npx hardhat flatten contracts/YourContract.sol > flattened.sol

# Remove duplicate SPDX licenses
# Verify manually on BaseScan
```

For more troubleshooting, see [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md)

---

## Emergency Procedures

### Deployment Rollback

If deployment fails critically:

1. **Do not panic** - Most issues are recoverable
2. **Assess impact** - What deployed successfully?
3. **Secure funds** - Ensure no funds at risk
4. **Document issue** - Save all transaction hashes
5. **Contact team** - Get assistance if needed

### Contract Pause

If critical issue discovered post-deployment:

```bash
# Pause token (if emergency pause enabled)
npx hardhat run scripts/emergency-pause.ts --network base

# Pause governance
npx hardhat run scripts/pause-governance.ts --network base
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed and tested
- [ ] Security audit completed
- [ ] Test deployment successful
- [ ] Environment variables configured
- [ ] Wallet funded with sufficient ETH
- [ ] Multi-sig safes configured
- [ ] Team notified of deployment

### During Deployment

- [ ] Deploy core contracts
- [ ] Verify each deployment
- [ ] Save deployment addresses
- [ ] Configure contracts
- [ ] Transfer ownership
- [ ] Setup roles and permissions

### Post-Deployment

- [ ] All contracts verified on BaseScan
- [ ] System health check passed
- [ ] Documentation updated
- [ ] Team notified of completion
- [ ] Monitoring enabled
- [ ] Announcement prepared

---

## Related Documentation

- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) - System architecture
- [03_DEVELOPMENT.md](./03_DEVELOPMENT.md) - Development guide
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Contract interfaces
- [10_SCRIPTS.md](./10_SCRIPTS.md) - Script documentation
- [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md) - Common issues

---

## Support

For deployment support:
- 📧 Email: dev@arcexchange.io
- 💬 Discord: [Developer channel](https://discord.gg/arc)
- 📝 GitHub: [Deployment issues](https://github.com/Artifact-Virtual/ARC/issues)
