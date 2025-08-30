# ARCs Token Deployment Notes

## Security Fixes Applied ✅

### Contract Improvements

- ✅ **Admin Zero Check**: Added `require(admin != address(0))` in initialize
- ✅ **Storage Gap**: Added `uint256[50] private __gap` for upgrade safety
- ✅ **VAULT_ROLE Documentation**: Clear comments about role assignment
- ✅ **Access Control**: Proper role separation (admin ≠ vault)

## Deployment Script Snippet

```typescript
// After ARCs token deployment and initialization
async function setupARCsTokenRoles(tokenAddress: string, vaultAddress: string) {
  const ARCsToken = await ethers.getContractAt("ARCsToken", tokenAddress);

  // Grant VAULT_ROLE to the staking vault contract
  console.log("🔑 Granting VAULT_ROLE to vault contract...");
  const vaultRole = await ARCsToken.VAULT_ROLE();
  const grantTx = await ARCsToken.grantRole(vaultRole, vaultAddress);
  await grantTx.wait();
  console.log("✅ VAULT_ROLE granted to:", vaultAddress);

  // Verify roles
  const hasVaultRole = await ARCsToken.hasRole(vaultRole, vaultAddress);
  console.log("🔍 Vault has VAULT_ROLE:", hasVaultRole);

  return { token: ARCsToken, vaultRole };
}

// Usage in deployment script:
const vaultAddress = "0x..."; // StakingVault contract address
await setupARCsTokenRoles(arcsTokenAddress, vaultAddress);
```

## Deployment Checklist

### Pre-Deployment

- [ ] Verify treasury safe address is valid and funded
- [ ] Confirm vault contract address is known (StakingVault)
- [ ] Check deployer wallet has sufficient ETH (0.05+ ETH for Base mainnet)
- [ ] Review and test deployment script locally

### Deployment Steps

- [ ] **Step 1**: Deploy ARCsToken contract

  ```bash
  npx hardhat run scripts/deploy_arcs_token.ts --network base
  ```

- [ ] **Step 2**: Verify deployment on BaseScan
- [ ] **Step 3**: Grant VAULT_ROLE to StakingVault

  ```typescript
  await arcsToken.grantRole(VAULT_ROLE, stakingVaultAddress);
  ```

- [ ] **Step 4**: Transfer DEFAULT_ADMIN_ROLE to multisig

  ```typescript
  await arcsToken.grantRole(DEFAULT_ADMIN_ROLE, multisigAddress);
  await arcsToken.revokeRole(DEFAULT_ADMIN_ROLE, deployerAddress);
  ```

### Post-Deployment Verification

- [ ] **Admin Check**: Confirm multisig has DEFAULT_ADMIN_ROLE
- [ ] **Upgrader Check**: Confirm multisig has UPGRADER_ROLE
- [ ] **Vault Check**: Confirm StakingVault has VAULT_ROLE
- [ ] **Mint/Burn Test**: Test minting and burning from vault
- [ ] **Upgrade Test**: Verify upgrade mechanism works
- [ ] **BaseScan Verification**: Contract verified on BaseScan

### Security Validation

- [ ] No zero addresses in role assignments
- [ ] Multisig controls admin and upgrade functions
- [ ] Only vault can mint/burn tokens
- [ ] Storage gap protects against upgrade issues
- [ ] All roles properly documented

### Emergency Procedures

- [ ] **If wrong address granted**: Use multisig to revoke and regrant
- [ ] **If deployment fails**: Check gas limits and retry
- [ ] **If verification fails**: Manual verification on BaseScan
- [ ] **If roles incorrect**: Use multisig to correct permissions

## Role Assignment Summary

| Role | Assigned To | Purpose | Critical |
|------|-------------|---------|----------|
| `DEFAULT_ADMIN_ROLE` | Multisig Safe | Full admin control | ✅ Critical |
| `UPGRADER_ROLE` | Multisig Safe | Contract upgrades | ✅ Critical |
| `VAULT_ROLE` | StakingVault | Mint/Burn tokens | ✅ Critical |

## Important Notes

1. **VAULT_ROLE Grant**: Must be granted AFTER vault deployment
2. **Multisig Transfer**: Transfer admin roles immediately after deployment
3. **Zero Address Protection**: Contract prevents zero admin assignment
4. **Upgrade Safety**: Storage gap ensures future upgrade compatibility
5. **Access Control**: Clear separation between admin, upgrade, and vault roles

## Deployment Command

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy_arcs_token.ts --network base

# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy_arcs_token.ts --network base-sepolia
```

## Verification Commands

```bash
# Verify contract on BaseScan
npx hardhat verify --network base <CONTRACT_ADDRESS>

# Check roles after deployment
npx hardhat run scripts/verify_roles.ts --network base
```

