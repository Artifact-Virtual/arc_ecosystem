# ARC SBT & Token Deployment Guide

This guide covers the deployment of THE ARC's Soulbound Token (SBT) for citizenship and ARC tokens for staking/DeFi functionality.

## Overview

The deployment includes three main components:

1. **ARC Identity SBT** - Soulbound citizenship tokens
2. **ARCx Token** - Main governance token
3. **ARCs Token** - Staked ARCx derivative for rewards
4. **ARCx Staking Vault** - DeFi staking functionality

## Prerequisites

- Node.js >= 18.0.0
- Hardhat environment configured
- Base network access
- Sufficient ETH for gas fees
- Environment variables set:
  - `DEPLOYER_PRIVATE_KEY`
  - `INFURA_PROJECT_ID` or `ALCHEMY_API_KEY`

## Quick Start

### Deploy Everything (SBT + Tokens + Staking)
```bash
npm run deploy:sbt-tokens
```

### Deploy Individual Components

#### Deploy Only SBT (Citizenship)
```bash
npm run deploy:sbt
```

#### Deploy Only Tokens (ARCx + ARCs)
```bash
npm run deploy:tokens
```

### Dry Run (Test Deployment)
```bash
npm run deploy:sbt-dry
npm run deploy:tokens-dry
```

## Deployment Process

### 1. ARC Identity SBT Deployment

The SBT deployment includes:
- **Contract**: `ARC_IdentitySBT.sol`
- **Features**:
  - Soulbound ERC-721 tokens (non-transferable)
  - EAS attestation integration
  - Role-based eligibility system
  - Decay-weighted reputation
  - Rate-limited issuance

**Configuration**:
- Timelock: Treasury Safe
- Safe Executor: Ecosystem Safe
- EAS Address: Base EAS contract
- Schema ID: Citizenship role schema

### 2. Token Ecosystem Deployment

#### ARCx Token
- **Contract**: `ARCxToken.sol`
- **Type**: Immutable ERC-20
- **Supply**: 1,000,000 ARCx (fixed)
- **Features**: Access control, burnable, pausable

#### ARCs Token
- **Contract**: `ARCsToken.sol`
- **Type**: Upgradeable ERC-20
- **Purpose**: Staked ARCx derivative
- **Features**: Mint/burn by vault, upgradeable

### 3. Staking Vault Deployment

The staking vault enables DeFi functionality:
- **Contract**: `ARCxStakingVault.sol`
- **Features**:
  - Stake ARCx, earn ARCs rewards
  - Configurable reward rates
  - Lock periods
  - Emergency functions

## Contract Addresses

After deployment, update these in `scripts/shared/constants.ts`:

```typescript
export const CONTRACTS = {
  // New contracts (update after deployment)
  ARC_IDENTITY_SBT: "0x...", // SBT contract address
  ARCS_TOKEN: "0x...", // ARCs token address
  ARC_STAKING_VAULT: "0x...", // Staking vault address

  // Existing contracts
  ARCX_TOKEN: "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44",
  // ... other existing contracts
}
```

## Post-Deployment Setup

### 1. SBT Configuration
```bash
# Grant issuer roles to authorized addresses
# Setup EAS schema on Base
# Configure citizenship issuance criteria
```

### 2. Token Setup
```bash
# Transfer initial ARCx supply to appropriate addresses
# Setup ARCs token permissions
# Configure token bridges if needed
```

### 3. Staking Vault Setup
```bash
# Fund vault with ARCs reward tokens
# Set reward rates and lock periods
# Configure whitelisting if needed
```

## Testing

Run the deployment tests:
```bash
npm run test
```

Test individual components:
```bash
npx hardhat test tests/ARCxToken.test.ts
npx hardhat test tests/ARC_IdentitySBT.test.ts
```

## Verification

Verify contracts on BaseScan:
```bash
npx hardhat verify --network base CONTRACT_ADDRESS "Constructor Args"
```

## Security Considerations

- **Multi-sig Control**: All admin functions controlled by Treasury Safe
- **Timelock**: SBT operations subject to timelock delays
- **Access Control**: Role-based permissions throughout
- **Upgradeability**: Only ARCs token and vault are upgradeable
- **Emergency Functions**: Pause and emergency withdraw capabilities

## Troubleshooting

### Common Issues

1. **Insufficient Gas**: Ensure adequate ETH balance
2. **Network Issues**: Check Base network connectivity
3. **Role Permissions**: Verify deployer has necessary roles
4. **Contract Dependencies**: Ensure all dependencies are deployed first

### Recovery Procedures

1. **Failed Deployment**: Use `--dry-run` to test first
2. **Stuck Transaction**: Check gas prices and network congestion
3. **Role Issues**: Use emergency functions if needed

## Integration

### Frontend Integration
```javascript
// SBT Citizenship Check
const isCitizen = await sbtContract.balanceOf(userAddress) > 0;

// Token Balances
const arcxBalance = await arcxContract.balanceOf(userAddress);
const arcsBalance = await arcsContract.balanceOf(userAddress);

// Staking
await stakingVault.stake(amount);
const rewards = await stakingVault.getPendingRewards(userAddress);
```

### Governance Integration
- SBT holders get citizenship privileges
- ARCx for governance voting
- ARCs for staking rewards and liquidity

## Monitoring

Monitor deployed contracts:
- Transaction activity on BaseScan
- Token balances and transfers
- Staking participation
- SBT issuance and revocation

## Support

For issues or questions:
1. Check deployment logs
2. Verify contract addresses
3. Test with dry-run mode
4. Review security configurations
