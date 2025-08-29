# ARC Ecosystem Deployment Guide

This guide covers the deployment of ARC's core components: Soulbound Tokens (SBT) for citizenship, ARCs staking tokens, and DeFi infrastructure.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Hardhat environment configured
- Base network access
- Sufficient ETH for gas fees

### Environment Setup

```bash
# Install dependencies
npm install

# Configure environment variables in .env
INFURA_PROJECT_ID=your_infura_project_id
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📋 Deployment Scripts

### 1. ARC Identity SBT (Citizenship)

**Purpose**: Deploy soulbound tokens for ARC citizenship and governance roles.

```bash
# Deploy to Base mainnet
npm run deploy:sbt

# Dry run (recommended first)
npm run deploy:sbt-dry

# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy_sbt.ts --network base-sepolia
```

**What it deploys:**

- ARC_IdentitySBT contract
- Configures EAS integration
- Sets up default roles (CODE, GOV, RWA_CURATOR, etc.)
- Grants initial permissions

**Post-deployment:**

1. Update `constants.ts` with SBT address
2. Configure EAS schema on Base
3. Setup citizenship issuance workflows

### 2. ARCs Token (Staking Derivative)

**Purpose**: Deploy the staking token that represents staked ARCx.

```bash
# Deploy to Base mainnet
npm run deploy:arcs

# Dry run
npm run deploy:arcs-dry

# Deploy to Base Sepolia
npx hardhat run scripts/deploy_arcs_token.ts --network base-sepolia
```

**What it deploys:**

- ARCsToken contract (upgradeable)
- Configures access roles
- Sets up minting/burning permissions

**Post-deployment:**

1. Update `constants.ts` with ARCs address
2. Deploy staking vault next
3. Setup initial token distribution

### 3. DeFi Infrastructure (Staking Vault)

**Purpose**: Deploy staking contracts for ARCx token staking.

```bash
# Deploy to Base mainnet
npm run deploy:defi

# Dry run
npm run deploy:defi-dry

# Deploy to Base Sepolia
npx hardhat run scripts/deploy_defi.ts --network base-sepolia
```

**What it deploys:**

- ARCxStakingVault contract
- Configures staking parameters
- Sets up reward distribution

**Post-deployment:**

1. Update `constants.ts` with vault address
2. Fund vault with ARCs tokens
3. Setup frontend integration

## 🔧 Configuration

### Network Configuration
The scripts are configured for Base mainnet. Update `hardhat.config.ts` for other networks:

```typescript
base: {
  url: `https://base-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
  gasPrice: Math.max(parseInt(GAS_PRICE_MAINNET) * 100000000, 50000000),
  timeout: 60000,
}
```

### Contract Addresses
Update `scripts/shared/constants.ts` with deployed addresses:

```typescript
export const CONTRACTS = {
  // Update these after deployment
  ARC_IDENTITY_SBT: "0x...", // From SBT deployment
  ARCS_TOKEN: "0x...",       // From ARCs deployment
  STAKING_VAULT: "0x...",    // From DeFi deployment

  // Existing addresses
  ARCX_TOKEN: "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44",
  // ... other existing contracts
}
```

## 📊 Deployment Order

### Recommended Sequence:
1. **ARC Identity SBT** - Foundation for citizenship
2. **ARCs Token** - Staking token derivative
3. **DeFi Infrastructure** - Staking vault and rewards

### Parallel Deployment:
You can deploy ARCs and SBT in parallel if needed.

## 🧪 Testing

### Dry Run Mode
Always test with dry-run first:
```bash
npm run deploy:sbt-dry
npm run deploy:arcs-dry
npm run deploy:defi-dry
```

### Local Testing
```bash
# Start local Hardhat node
npx hardhat node

# Deploy to localhost in another terminal
npx hardhat run scripts/deploy_sbt.ts --network localhost
```

## 🔍 Verification

### Contract Verification
```bash
# Verify on BaseScan
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS "Constructor arguments"
```

### Manual Verification
Check deployment logs for:
- ✅ Contract addresses
- ✅ Initialization status
- ✅ Role assignments
- ✅ Parameter configurations

## 🚨 Troubleshooting

### Common Issues

**1. Insufficient Gas**
```
Error: insufficient funds for gas
```
- Check ETH balance in deployer account
- Increase gas limit in hardhat.config.ts

**2. Network Connection**
```
Error: could not detect network
```
- Verify INFURA_PROJECT_ID
- Check network connectivity
- Confirm Base mainnet is accessible

**3. Contract Verification Fails**
```
Error: Contract verification failed
```
- Ensure constructor arguments match exactly
- Check API keys
- Wait a few minutes after deployment

### Recovery Steps
1. Check transaction on BaseScan
2. Verify contract bytecode
3. Redeploy if necessary
4. Update constants with correct addresses

## 📈 Post-Deployment

### 1. Update Documentation
- Update contract addresses in docs
- Generate new deployment reports
- Update API documentation

### 2. Frontend Integration
- Update frontend with new addresses
- Test integration endpoints
- Deploy updated frontend

### 3. Monitoring Setup
- Setup contract monitoring
- Configure alerts for critical events
- Setup analytics dashboards

### 4. Security Audit
- Run security tests
- Perform penetration testing
- Audit access controls

## 🎯 Next Steps

After successful deployment:

1. **Test Citizenship Issuance**
   - Issue test SBTs
   - Verify role assignments
   - Test EAS attestations

2. **Setup Staking**
   - Fund staking vault
   - Test staking/unstaking
   - Verify reward distribution

3. **Governance Integration**
   - Connect SBT to governance
   - Setup voting mechanisms
   - Test proposal workflows

## 📞 Support

For deployment issues:
1. Check deployment logs
2. Verify network configuration
3. Review contract requirements
4. Contact development team

## 📝 Changelog

- **v1.0.0**: Initial separate deployment scripts
- Added comprehensive error handling
- Improved configuration management
- Enhanced post-deployment guidance
