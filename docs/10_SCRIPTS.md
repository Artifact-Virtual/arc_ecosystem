---
title: Scripts & Tools Documentation
description: Complete guide to management scripts and command-line tools
version: 1.0.0
last_updated: 2026-01-17
---

# Scripts & Tools Documentation

## Overview

The ARC ecosystem features a comprehensive script suite for system management, monitoring, deployment, and operations. This document provides detailed documentation for all available scripts and tools.

---

## Script Architecture

### Design Principles

1. **Separation of Concerns** - Each script handles one major component
2. **Comprehensive Coverage** - Every aspect of ecosystem managed
3. **Consistent Interface** - All scripts follow same command pattern
4. **Error Handling** - Robust error handling and user feedback
5. **Documentation** - Extensive inline documentation

### Script Categories

- **Core Management** - System orchestration and monitoring
- **Specialized Management** - Vesting, LP, airdrop operations
- **Deployment** - Contract deployment automation
- **Utilities** - Shared functions and constants

---

## Core Management Scripts

### 1. Ecosystem Manager

**File:** `scripts/ecosystem-manager.ts`

Master orchestrator for the entire ARC ecosystem.

#### Commands

```bash
# System health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# System status overview
npx hardhat run scripts/ecosystem-manager.ts --network base status

# Display all contract addresses
npx hardhat run scripts/ecosystem-manager.ts --network base addresses
```

#### Features

- Comprehensive system health monitoring
- Contract status verification
- Network connectivity checks
- Balance verification
- Role and permission audits

#### Example Output

```
🏛️ ARC Ecosystem Health Check

✅ Network: Base L2 (8453)
✅ ARCx Token: 0xDb3C... [Verified]
✅ Vesting: 0x0bBf1f... [Active]
✅ Airdrop: 0x40fe44... [Live]
✅ Treasury Safe: 0x8F8fdB... [Funded]
✅ LP Position: #242940 [Active]

📊 System Status: HEALTHY
```

---

### 2. Monitor

**File:** `scripts/monitor.ts`

Real-time monitoring and reporting system.

#### Commands

```bash
# Full monitoring report
npx hardhat run scripts/monitor.ts --network base report

# Monitor token supply
npx hardhat run scripts/monitor.ts --network base supply

# Monitor vesting schedules
npx hardhat run scripts/monitor.ts --network base vesting

# Monitor liquidity positions
npx hardhat run scripts/monitor.ts --network base liquidity

# Monitor system health
npx hardhat run scripts/monitor.ts --network base health
```

#### Features

- Real-time token metrics
- Vesting schedule tracking
- Liquidity position monitoring
- Holder distribution analysis
- Treasury balance tracking

#### Example: Supply Monitoring

```bash
npx hardhat run scripts/monitor.ts --network base supply
```

Output:
```
📊 ARCX2 Token Supply Report

Total Supply: 1,000,000 ARCX2
Circulating: 600,000 ARCX2 (60%)
Locked: 400,000 ARCX2 (40%)

Distribution:
- Liquidity Pool: 500,000 (50%)
- Vesting: 300,000 (30%)
- Airdrop: 100,000 (10%)
- Marketing: 100,000 (10%)

Top Holders:
1. Uniswap V4 Pool: 500,000
2. Vesting Contract: 300,000
3. Treasury Safe: 100,000
```

---

### 3. Configuration Manager

**File:** `scripts/config.ts`

Environment and configuration management.

#### Commands

```bash
# Show current configuration
npx hardhat run scripts/config.ts --network base show

# Validate contract deployments
npx hardhat run scripts/config.ts --network base validate

# Generate .env.example file
npx hardhat run scripts/config.ts --network base env

# Update constants file with current addresses
npx hardhat run scripts/config.ts --network base update
```

#### Features

- Configuration validation
- Address verification
- Environment generation
- Constants management
- Network connectivity checks

#### Example: Validation

```bash
npx hardhat run scripts/config.ts --network base validate
```

Output:
```
🔍 Validating Configuration

✅ Network: Base L2 connected
✅ ARCx Token: Deployed and verified
✅ Vesting: Configured correctly
✅ Airdrop: Ready for claims
✅ Treasury Safe: Funded
✅ Ecosystem Safe: Active
✅ Uniswap Pool: Live

📋 Validation: PASSED
```

---

## Specialized Management Scripts

### 4. Vesting Manager

**File:** `scripts/vesting-manager.ts`

Complete vesting schedule management.

#### Commands

```bash
# Check beneficiaries and schedules
npx hardhat run scripts/vesting-manager.ts --network base check-beneficiaries

# Check treasury and vesting balances
npx hardhat run scripts/vesting-manager.ts --network base check-treasury

# Check overall vesting status
npx hardhat run scripts/vesting-manager.ts --network base check-status

# Get vesting contract owner
npx hardhat run scripts/vesting-manager.ts --network base get-owner

# Setup schedules and finalize minting
npx hardhat run scripts/vesting-manager.ts --network base setup-finalize
```

#### Features

- Beneficiary management
- Schedule configuration
- Balance tracking
- Release management
- Emergency controls

#### Example: Check Beneficiaries

```bash
npx hardhat run scripts/vesting-manager.ts --network base check-beneficiaries
```

Output:
```
👥 Vesting Beneficiaries

1. Ecosystem Safe
   - Allocated: 150,000 ARCX2
   - Vested: 15,000 ARCX2
   - Remaining: 135,000 ARCX2
   - Cliff: 6 months
   - Duration: 48 months
   
2. Development Team
   - Allocated: 100,000 ARCX2
   - Vested: 0 ARCX2
   - Remaining: 100,000 ARCX2
   - Cliff: 12 months
   - Duration: 36 months

3. Advisors
   - Allocated: 50,000 ARCX2
   - Vested: 5,000 ARCX2
   - Remaining: 45,000 ARCX2
   - Cliff: 6 months
   - Duration: 24 months

Total: 300,000 ARCX2
```

---

### 5. LP Manager

**File:** `scripts/lp-manager.ts`

Uniswap V4 liquidity management.

#### Commands

```bash
# Check LP compatibility status
npx hardhat run scripts/lp-manager.ts --network base check

# Configure token for LP compatibility
npx hardhat run scripts/lp-manager.ts --network base configure

# Revert LP compatibility changes
npx hardhat run scripts/lp-manager.ts --network base revert

# Add liquidity to pool
npx hardhat run scripts/lp-manager.ts --network base add-liquidity

# Check position status
npx hardhat run scripts/lp-manager.ts --network base status

# Collect fees
npx hardhat run scripts/lp-manager.ts --network base collect
```

#### Features

- Pool initialization
- Liquidity management
- Position monitoring
- Fee collection
- Compatibility checks

#### Example: Position Status

```bash
npx hardhat run scripts/lp-manager.ts --network base status
```

Output:
```
💧 Liquidity Position Status

Position ID: #242940
Pair: ARCX2/WETH
Fee Tier: 0.05%

Liquidity:
- ARCX2: 500,000
- WETH: 2.5
- USD Value: ~$8,500

Fees Earned (24h):
- ARCX2: 50
- WETH: 0.0001
- USD Value: ~$0.34

APR: ~15.2%
Status: Active ✅
```

---

### 6. Airdrop Manager

**File:** `scripts/airdrop-manager.ts`

Complete airdrop campaign management.

#### Commands

```bash
# Check airdrop status
npx hardhat run scripts/airdrop-manager.ts --network base status

# Setup airdrop (owner only)
npx hardhat run scripts/airdrop-manager.ts --network base setup

# Claim airdrop tokens
npx hardhat run scripts/airdrop-manager.ts --network base claim

# Emergency withdraw (owner only)
npx hardhat run scripts/airdrop-manager.ts --network base withdraw

# Generate merkle tree
npx hardhat run scripts/airdrop-manager.ts --network base merkle \
  --input data/recipients.csv
```

#### Features

- Merkle tree generation
- Campaign setup
- Claim processing
- Status tracking
- Emergency controls

#### Example: Airdrop Status

```bash
npx hardhat run scripts/airdrop-manager.ts --network base status
```

Output:
```
🎁 Airdrop Campaign Status

Total Allocation: 100,000 ARCX2
Claimed: 45,000 ARCX2 (45%)
Remaining: 55,000 ARCX2 (55%)

Recipients:
- Total: 1,000
- Claimed: 450 (45%)
- Pending: 550 (55%)

Campaign Period:
- Start: 2026-01-01
- End: 2026-03-31
- Status: Active ✅

Your Eligibility:
- Eligible: Yes ✅
- Amount: 100 ARCX2
- Claimed: No
```

---

### 7. Deployment Manager

**File:** `scripts/deployment-manager.ts`

Contract deployment orchestration.

#### Commands

```bash
# Deploy infrastructure (vesting, airdrop, hook)
npx hardhat run scripts/deployment-manager.ts --network base infrastructure

# Deploy ARCx V2 Enhanced token
npx hardhat run scripts/deployment-manager.ts --network base token

# Deploy all contracts
npx hardhat run scripts/deployment-manager.ts --network base all
```

#### Features

- Automated deployment
- Contract verification
- Configuration management
- Post-deployment setup
- Deployment tracking

---

## Shared Resources

### Constants

**File:** `scripts/shared/constants.ts`

Centralized address and configuration management.

```typescript
export const ADDRESSES = {
  BASE: {
    ARCX_TOKEN: '0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437',
    VESTING: '0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600',
    AIRDROP: '0x40fe447cf4B2af7aa41694a568d84F1065620298',
    TREASURY_SAFE: '0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38',
    ECOSYSTEM_SAFE: '0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb',
    // ... more addresses
  }
};
```

### Utilities

**File:** `scripts/shared/utils.ts`

Common utility functions and helpers.

```typescript
// Contract validation
export async function validateContract(address: string): Promise<boolean>

// Network validation
export function validateNetwork(chainId: number): boolean

// Balance verification
export async function checkBalance(address: string): Promise<BigNumber>

// Formatting helpers
export function formatAmount(amount: BigNumber): string
export function formatAddress(address: string): string
```

---

## Usage Examples

### System Health Check

```bash
# Quick health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# Detailed monitoring
npx hardhat run scripts/monitor.ts --network base report
```

### Deploy New Contract

```bash
# Deploy to testnet first
npx hardhat run scripts/deployment-manager.ts --network base-sepolia token

# Verify deployment
npx hardhat run scripts/config.ts --network base-sepolia validate

# Deploy to mainnet
npx hardhat run scripts/deployment-manager.ts --network base token
```

### Manage Vesting

```bash
# Check current status
npx hardhat run scripts/vesting-manager.ts --network base check-status

# Setup new beneficiary (requires admin)
npx hardhat run scripts/vesting-manager.ts --network base add-beneficiary \
  --address 0x... \
  --amount 10000 \
  --cliff 6 \
  --duration 24
```

### Monitor Liquidity

```bash
# Check position
npx hardhat run scripts/lp-manager.ts --network base status

# Collect fees
npx hardhat run scripts/lp-manager.ts --network base collect

# Monitor continuously
watch -n 60 'npx hardhat run scripts/monitor.ts --network base liquidity'
```

---

## Script Best Practices

### 1. Always Validate First

```bash
# Before any operation
npx hardhat run scripts/config.ts --network base validate
```

### 2. Use Testnet First

```bash
# Test on Base Sepolia
npx hardhat run scripts/YOUR_SCRIPT.ts --network base-sepolia

# Then mainnet
npx hardhat run scripts/YOUR_SCRIPT.ts --network base
```

### 3. Monitor After Changes

```bash
# After any operation
npx hardhat run scripts/monitor.ts --network base report
```

### 4. Keep Backups

```bash
# Backup current state before changes
npx hardhat run scripts/backup-state.ts --network base

# Save deployment info
scripts/deployment-manager.ts > deployments/$(date +%Y%m%d).log
```

---

## Common Commands

### Quick Reference

```bash
# System health
npm run health

# Monitor system
npm run monitor

# Validate config
npm run validate

# Check vesting
npm run vesting:status

# Check LP
npm run lp:status

# Check airdrop
npm run airdrop:status
```

### Add to package.json

```json
{
  "scripts": {
    "health": "hardhat run scripts/ecosystem-manager.ts --network base health",
    "monitor": "hardhat run scripts/monitor.ts --network base report",
    "validate": "hardhat run scripts/config.ts --network base validate",
    "vesting:status": "hardhat run scripts/vesting-manager.ts --network base check-status",
    "lp:status": "hardhat run scripts/lp-manager.ts --network base status",
    "airdrop:status": "hardhat run scripts/airdrop-manager.ts --network base status"
  }
}
```

---

## Troubleshooting Scripts

### Connection Issues

```bash
# Check network connectivity
npx hardhat run scripts/config.ts --network base show

# Test RPC connection
curl -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Permission Issues

```bash
# Check wallet permissions
npx hardhat run scripts/check-permissions.ts --network base

# Verify multi-sig setup
npx hardhat run scripts/verify-multisig.ts --network base
```

For more troubleshooting, see [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md)

---

## Related Documentation

- [03_DEVELOPMENT.md](./03_DEVELOPMENT.md) - Development guide
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide
- [11_TROUBLESHOOTING.md](./11_TROUBLESHOOTING.md) - Common issues
- [scripts/README.md](../scripts/README.md) - Detailed script docs

---

## Support

For script-related questions:
- 📧 Email: dev@arcexchange.io
- 💬 Discord: [Developer channel](https://discord.gg/arc)
- 📝 GitHub: [Script issues](https://github.com/Artifact-Virtual/ARC/issues)
