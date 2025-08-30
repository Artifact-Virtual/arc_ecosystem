# 🔒 ARCs Token Security Deployment Checklist

## ✅ **Security Fixes Implemented**

### Contract-Level Security

- [x] **Admin Zero Check**: `require(admin != address(0))` in initialize
- [x] **Storage Gap**: `uint256[50] private __gap` for upgrade safety
- [x] **VAULT_ROLE Documentation**: Clear comments about role assignment
- [x] **Access Control**: Proper role separation (multisig ≠ vault)

### Deployment Script Security

- [x] **Multisig Transfer**: Immediate transfer of DEFAULT_ADMIN_ROLE to multisig
- [x] **VAULT_ROLE Fix**: Grants to StakingVault contract (not treasury)
- [x] **Address Validation**: Validates vault and multisig addresses
- [x] **Deployer Revocation**: Revokes admin role from deployer immediately

## 📋 **Pre-Deployment Checklist**

### Environment Setup

- [x] Configure ARCs deployment variables in main `.env` file
- [ ] Set `STAKING_VAULT_ADDRESS` to your deployed StakingVault contract
- [ ] Set `MULTISIG_ADDRESS` to your Gnosis Safe/multisig address
- [ ] Verify deployer wallet has 0.05+ ETH for Base mainnet deployment

### Contract Verification

- [ ] StakingVault contract is deployed and functional
- [ ] Multisig has sufficient signers and is operational
- [ ] All addresses are valid Ethereum addresses (no zero addresses)

### Network Configuration

- [ ] Hardhat config has Base network properly configured
- [ ] Infura/Alchemy API keys are set
- [ ] Deployer private key is configured

## 🚀 **Deployment Steps**

### Step 1: Environment Setup

```bash
# Configure ARCs deployment variables in main .env file
# Edit .env with your actual addresses for:
# - STAKING_VAULT_ADDRESS
# - MULTISIG_ADDRESS
```

### Step 2: Deploy ARCs Token

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy_arcs_token.ts --network base

# Or deploy to Base Sepolia for testing
npx hardhat run scripts/deploy_arcs_token.ts --network base-sepolia
```

### Step 3: Verify Deployment

- [ ] Contract deployed successfully (check console output)
- [ ] Contract address captured
- [ ] All role assignments verified in console output
- [ ] Multisig has DEFAULT_ADMIN_ROLE
- [ ] StakingVault has VAULT_ROLE
- [ ] Ecosystem Safe has UPGRADER_ROLE
- [ ] Deployer has NO admin roles

### Step 4: Post-Deployment

- [ ] Update `constants.ts` with ARCs token address
- [ ] Verify contract on BaseScan
- [ ] Test mint/burn functions from StakingVault
- [ ] Confirm multisig can perform admin operations
- [ ] Update documentation with new addresses

## 🔍 **Security Verification**

### Role Verification

- [ ] **DEFAULT_ADMIN_ROLE**: Only multisig
- [ ] **UPGRADER_ROLE**: Only ecosystem safe
- [ ] **VAULT_ROLE**: Only staking vault contract
- [ ] **Deployer**: No admin roles

### Function Verification

- [ ] `mint()`: Only callable by VAULT_ROLE holder
- [ ] `burn()`: Only callable by VAULT_ROLE holder
- [ ] `upgrade()`: Only callable by UPGRADER_ROLE holder
- [ ] `grantRole()`: Only callable by DEFAULT_ADMIN_ROLE holder

### Address Validation

- [ ] No zero addresses in role assignments
- [ ] All addresses are valid Ethereum addresses
- [ ] Multisig is operational and accessible
- [ ] StakingVault contract is deployed and functional

## 🚨 **Emergency Procedures**

### If Deployment Fails

- [ ] Check gas prices and account balance
- [ ] Verify network configuration
- [ ] Confirm all addresses are valid
- [ ] Retry deployment

### If Wrong Address Assigned

- [ ] Use multisig to revoke incorrect role assignment
- [ ] Grant role to correct address
- [ ] Verify role assignments
- [ ] Update documentation

### If Multisig Issues

- [ ] Verify multisig configuration
- [ ] Check signer access
- [ ] Confirm multisig has sufficient ETH
- [ ] Test multisig transaction creation

## 📊 **Success Metrics**

### Deployment Success

- [ ] ✅ Contract deployed without errors
- [ ] ✅ All roles assigned correctly
- [ ] ✅ Multisig controls admin functions
- [ ] ✅ StakingVault can mint/burn
- [ ] ✅ Deployer has no admin privileges

### Security Success

- [ ] ✅ No zero addresses
- [ ] ✅ Proper role separation
- [ ] ✅ Multisig control established
- [ ] ✅ Upgrade safety maintained
- [ ] ✅ Access control enforced

## 📝 **Documentation Updates**

After successful deployment:

- [ ] Update `constants.ts` with ARCs token address
- [ ] Update system status documentation
- [ ] Update deployment notes with actual addresses
- [ ] Create incident response documentation
- [ ] Update security procedures

## 🎯 **Final Status**

- [ ] **READY FOR PRODUCTION** - All security requirements met
- [ ] **MULTISIG CONTROL** - Admin functions secured
- [ ] **VAULT INTEGRATION** - Staking functionality enabled
- [ ] **UPGRADE SAFE** - Future upgrades protected
- [ ] **FULLY VERIFIED** - All checks passed

---

**Deployment Date**: ________
**Deployer Address**: ________
**ARCs Token Address**: ________
**Multisig Address**: ________
**StakingVault Address**: ________
**Network**: Base Mainnet / Base Sepolia
