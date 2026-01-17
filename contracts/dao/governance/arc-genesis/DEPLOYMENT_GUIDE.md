# GENESIS System Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the GENESIS system to various networks, including local development, testnets, and mainnet.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Deployment](#local-deployment)
4. [Testnet Deployment](#testnet-deployment)
5. [Mainnet Deployment](#mainnet-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Upgrade Considerations](#upgrade-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Foundry** (recommended) or **Hardhat**
- **Node.js** v18+ and **npm** v8+
- **Git**
- Wallet with sufficient native tokens for deployment

### Required Knowledge

- Solidity smart contract deployment
- Command line proficiency
- Understanding of gas costs and network fees

### Network Requirements

| Network | Gas Token | Recommended Gas Price | Estimated Total Cost |
|---------|-----------|----------------------|---------------------|
| Localhost | ETH | N/A | Free |
| Sepolia | SepoliaETH | 1-5 gwei | ~0.05 ETH |
| Base Sepolia | ETH | 0.001-0.01 gwei | ~0.001 ETH |
| Ethereum Mainnet | ETH | 15-50 gwei | 0.1-0.3 ETH |
| Base Mainnet | ETH | 0.001-0.01 gwei | 0.005-0.015 ETH |

---

## Environment Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/Artifact-Virtual/arc_ecosystem.git
cd arc_ecosystem/contracts/dao/governance/arc-genesis
```

### Step 2: Install Dependencies

#### Using Foundry (Recommended)

```bash
# Install Foundry if not already installed
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install project dependencies
forge install
```

#### Using Hardhat

```bash
# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Network RPC URLs
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Deployment account
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Governance address (multisig or DAO)
GOVERNANCE_ADDRESS=0x...

# Etherscan/Basescan API keys for verification
ETHERSCAN_API_KEY=your_etherscan_key
BASESCAN_API_KEY=your_basescan_key

# Optional: Gas price settings
GAS_PRICE=auto
```

**⚠️ Security Warning**: Never commit `.env` files. Ensure `.env` is in `.gitignore`.

---

## Local Deployment

### Using Foundry

#### Step 1: Start Local Node

```bash
# Terminal 1: Start Anvil (local Ethereum node)
anvil
```

#### Step 2: Deploy Contracts

```bash
# Terminal 2: Deploy to local node
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast

# View deployment addresses
cat arc-genesis-deployment.txt
```

#### Step 3: Verify Deployment

```bash
# Run the verify function
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --sig "verify()"
```

### Using Hardhat

```bash
# Deploy to local Hardhat network
npx hardhat run scripts/deploy-genesis.ts --network localhost

# Or deploy to Hardhat node
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy-genesis.ts --network localhost  # Terminal 2
```

---

## Testnet Deployment

### Sepolia Testnet

#### Step 1: Fund Deployer Account

Get Sepolia ETH from faucets:
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

#### Step 2: Deploy

```bash
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv
```

#### Step 3: Save Deployment Addresses

```bash
# Deployment addresses are saved to arc-genesis-deployment.txt
cat arc-genesis-deployment.txt

# Example output:
# ARCGenesis=0x1234...
# ARCModelRegistry=0x5678...
# ARCModelSBT=0x9abc...
```

### Base Sepolia Testnet

```bash
# Get Base Sepolia ETH from bridge or faucet
# https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --verifier blockscout \
    --verifier-url https://base-sepolia.blockscout.com/api \
    -vvvv
```

---

## Mainnet Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Governance multisig/DAO address confirmed
- [ ] Sufficient ETH for deployment (~0.1-0.3 ETH for Ethereum, ~0.01 ETH for Base)
- [ ] Emergency pause mechanism understood
- [ ] Post-deployment verification plan ready
- [ ] Team coordination for deployment timing

### Ethereum Mainnet Deployment

```bash
# ⚠️ MAINNET DEPLOYMENT - DOUBLE CHECK EVERYTHING

# 1. Dry run first (no broadcast)
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $MAINNET_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    -vvvv

# 2. Review gas estimates and addresses

# 3. Execute deployment
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $MAINNET_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --slow \
    -vvvv

# 4. Verify deployment
forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $MAINNET_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --sig "verify()"
```

### Base Mainnet Deployment

```bash
# Base mainnet has lower gas costs but same security requirements

forge script scripts/DeployGenesis.s.sol:DeployGenesis \
    --rpc-url $BASE_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --verifier blockscout \
    --verifier-url https://base.blockscout.com/api \
    --slow \
    -vvvv
```

---

## Post-Deployment Verification

### Step 1: Verify Contract Functionality

```bash
# Test Genesis contract
cast call $GENESIS_ADDRESS "genesisHash()(bytes32)" --rpc-url $RPC_URL

# Test a valid class
cast call $GENESIS_ADDRESS "isValidClass(bytes32)(bool)" \
    $(cast keccak "ARC::MODEL::REASONING_CORE") \
    --rpc-url $RPC_URL

# Test Registry
cast call $REGISTRY_ADDRESS "genesis()(address)" --rpc-url $RPC_URL
cast call $REGISTRY_ADDRESS "governance()(address)" --rpc-url $RPC_URL
```

### Step 2: Register Test Model (Governance Only)

```bash
# This requires governance account
cast send $REGISTRY_ADDRESS \
    "registerModel(string,string,bytes32)(bytes32)" \
    "TestModel" "1.0.0" $(cast keccak "ARC::MODEL::REASONING_CORE") \
    --private-key $GOVERNANCE_PRIVATE_KEY \
    --rpc-url $RPC_URL
```

### Step 3: Verify Block Explorer

1. Visit Etherscan/Basescan
2. Search for each deployed contract
3. Verify:
   - Contract is verified (green checkmark)
   - Source code matches
   - Constructor arguments correct
   - Read/Write functions accessible

### Step 4: Update Documentation

```bash
# Save deployment addresses
cat > DEPLOYMENT_ADDRESSES.md << EOF
# GENESIS Deployment Addresses

Network: [Mainnet/Sepolia/Base/etc]
Deployed: $(date)

## Contract Addresses

- ARCGenesis: $GENESIS_ADDRESS
- ARCModelRegistry: $REGISTRY_ADDRESS
- ARCModelSBT: $SBT_ADDRESS

## Configuration

- Governance: $GOVERNANCE_ADDRESS
- Genesis Hash: $(cast call $GENESIS_ADDRESS "genesisHash()(bytes32)" --rpc-url $RPC_URL)

## Verification

All contracts verified on [block explorer]
EOF
```

---

## Deployment Script Customization

### Custom Deployment Script

```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/registry/ARCModelRegistry.sol";
import "../contracts/sbt/ARCModelSBT.sol";

contract CustomDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address governance = vm.envAddress("GOVERNANCE_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Genesis
        ARCGenesis genesis = new ARCGenesis();
        console.log("Genesis deployed:", address(genesis));
        
        // Deploy Registry
        ARCModelRegistry registry = new ARCModelRegistry(
            address(genesis),
            governance
        );
        console.log("Registry deployed:", address(registry));
        
        // Deploy SBT
        ARCModelSBT sbt = new ARCModelSBT(
            address(registry),
            governance
        );
        console.log("SBT deployed:", address(sbt));
        
        vm.stopBroadcast();
        
        // Save addresses
        vm.writeFile(
            "./deployment-addresses.json",
            string.concat(
                '{',
                '"genesis":"', vm.toString(address(genesis)), '",',
                '"registry":"', vm.toString(address(registry)), '",',
                '"sbt":"', vm.toString(address(sbt)), '"',
                '}'
            )
        );
    }
}
```

---

## Upgrade Considerations

### Immutable Components (Cannot Upgrade)

- **ARCGenesis**: Immutable by design (pure functions, no storage)
- No upgrade path exists or needed

### Non-Upgradeable Components (Redeployment Required)

- **ARCModelRegistry**: No UUPS upgrade mechanism
- **ARCModelSBT**: No UUPS upgrade mechanism

If changes needed:
1. Deploy new versions
2. Governance must update references
3. Historical data remains on old contracts
4. Consider migration strategy

### Migration Strategy

If new Registry needed:

```solidity
contract RegistryMigration {
    ARCModelRegistry public oldRegistry;
    ARCModelRegistry public newRegistry;
    
    function migrateModel(bytes32 modelId) external {
        // Get data from old registry
        bytes32 classId = oldRegistry.modelClass(modelId);
        
        // Register in new registry (governance only)
        // Manual process per model
    }
}
```

---

## Troubleshooting

### Issue: Deployment Fails with "Insufficient Funds"

**Solution**: Ensure deployer account has enough native tokens
```bash
# Check balance
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Send more funds if needed
```

### Issue: "Nonce Too Low" Error

**Solution**: Clear pending transactions or wait for confirmation
```bash
# Check nonce
cast nonce $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Use --legacy flag if needed
```

### Issue: Verification Fails

**Solution**: Manually verify on block explorer
1. Go to contract on Etherscan/Basescan
2. Click "Verify & Publish"
3. Upload flattened source or use Foundry/Hardhat verify

```bash
# Flatten contract
forge flatten src/genesis/ARCGenesis.sol > ARCGenesis-flat.sol

# Or use forge verify
forge verify-contract $CONTRACT_ADDRESS \
    src/genesis/ARCGenesis.sol:ARCGenesis \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $ETHERSCAN_API_KEY
```

### Issue: Genesis Hash Mismatch

**Cause**: Wrong genesis hash in deployment

**Solution**: Verify genesis hash matches expected value
```solidity
// Expected: keccak256("ARC::GENESIS::v1.0.0")
// Verify it matches what's deployed
```

---

## Gas Optimization Tips

1. **Use --optimize flag**:
   ```bash
   forge script ... --optimize --optimizer-runs 1
   ```

2. **Deploy during low gas periods** (check https://etherscan.io/gastracker)

3. **Use L2s for lower costs**:
   - Base Mainnet: ~100x cheaper than Ethereum
   - Optimism: ~50-100x cheaper
   - Arbitrum: ~50-100x cheaper

4. **Batch deployments**: Deploy all contracts in single transaction when possible

---

## Security Best Practices

1. **Use Hardware Wallet** for mainnet deployments
2. **Verify on Multiple Nodes** before confirming deployment
3. **Test on Testnet First** - always deploy to testnet before mainnet
4. **Use Multisig for Governance** - never use EOA as governance address
5. **Save Private Keys Securely** - use env files, hardware wallets, or key management systems
6. **Audit Before Deployment** - get professional audit for mainnet
7. **Monitor After Deployment** - set up monitoring for suspicious activity

---

## Deployment Checklist

### Pre-Deployment
- [ ] Tests pass (forge test)
- [ ] Security audit completed
- [ ] Governance address confirmed
- [ ] Environment variables set
- [ ] Sufficient funds in deployer account
- [ ] Testnet deployment successful

### During Deployment
- [ ] Genesis deployed
- [ ] Registry deployed with correct Genesis address
- [ ] SBT deployed with correct Registry address
- [ ] All contracts verified on block explorer
- [ ] Deployment addresses saved

### Post-Deployment
- [ ] Functional tests on deployed contracts
- [ ] Governance can access admin functions
- [ ] Test model registration works
- [ ] Documentation updated with addresses
- [ ] Team notified of deployment
- [ ] Monitoring set up

---

## Support

For deployment issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [Foundry Book](https://book.getfoundry.sh/)
3. Contact team on Discord/Telegram

---

## Version History

- v1.0.0 (2026-01-16): Initial GENESIS deployment guide
