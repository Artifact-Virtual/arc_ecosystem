---
title: Troubleshooting Guide
description: Common issues, solutions, and debugging tips for the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# Troubleshooting Guide

## Overview

This guide covers common issues, error messages, and solutions for the ARC ecosystem. Use this as a reference when encountering problems during development, deployment, or operation.

---

## Quick Diagnostics

### Run Health Check

```bash
# System health check
npx hardhat run scripts/ecosystem-manager.ts --network base health

# Full diagnostic report
npx hardhat run scripts/monitor.ts --network base report

# Validate configuration
npx hardhat run scripts/config.ts --network base validate
```

---

## Build & Compilation Issues

### Issue: Contract Too Large

**Error Message:**
```
Error: Contract code size exceeds 24576 bytes
```

**Solution:**

1. **Enable Optimizer:**
```javascript
// hardhat.config.ts
solidity: {
  version: "0.8.21",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200  // Increase for smaller size
    }
  }
}
```

2. **Split Large Contracts:**
   - Extract functionality to libraries
   - Use inheritance
   - Implement proxy pattern

3. **Remove Unused Code:**
   - Delete commented code
   - Remove unused imports
   - Minimize string literals

---

### Issue: Compilation Failed

**Error Message:**
```
Error: Source "contracts/..." not found
```

**Solutions:**

```bash
# Clean and recompile
npx hardhat clean
rm -rf cache/ artifacts/
npx hardhat compile

# Check imports
# Ensure all paths are correct
# Use relative paths consistently

# Update dependencies
npm install
npm update @openzeppelin/contracts
```

---

### Issue: Solidity Version Mismatch

**Error Message:**
```
Error: Source file requires different compiler version
```

**Solution:**

```javascript
// Ensure consistent versions
// hardhat.config.ts
solidity: {
  compilers: [
    { version: "0.8.21" },
    { version: "0.8.19" }  // If needed for specific contracts
  ]
}
```

---

## Test Failures

### Issue: Tests Timing Out

**Error Message:**
```
Error: Timeout of 2000ms exceeded
```

**Solutions:**

```javascript
// Increase timeout in test file
describe("MyTest", function () {
  this.timeout(60000); // 60 seconds
  
  it("should work", async function () {
    // Test code
  });
});
```

```bash
# Or increase globally
MOCHA_TIMEOUT=60000 npx hardhat test
```

---

### Issue: Network Connection Failed

**Error Message:**
```
Error: could not detect network
```

**Solutions:**

1. **Check RPC URL:**
```bash
# Test connection
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

2. **Update Configuration:**
```javascript
// hardhat.config.ts
networks: {
  base: {
    url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
    chainId: 8453,
    timeout: 60000  // Increase timeout
  }
}
```

3. **Use Alternative RPC:**
```bash
# Try different RPC providers
export BASE_RPC_URL=https://base.llamarpc.com
export BASE_RPC_URL=https://base.blockpi.network/v1/rpc/public
```

---

### Issue: Insufficient Test Coverage

**Error Message:**
```
Error: Coverage below threshold
```

**Solutions:**

```bash
# Generate coverage report
npx hardhat coverage

# Identify uncovered code
open coverage/index.html

# Add missing tests
# Focus on:
# - Edge cases
# - Error conditions
# - Access control
# - State transitions
```

---

## Deployment Issues

### Issue: Transaction Underpriced

**Error Message:**
```
Error: transaction underpriced
```

**Solutions:**

1. **Increase Gas Price:**
```bash
# Set in environment
export MAX_FEE_PER_GAS=3
export MAX_PRIORITY_FEE_PER_GAS=2
```

2. **Update Config:**
```javascript
// hardhat.config.ts
networks: {
  base: {
    gasPrice: "auto",
    gasMultiplier: 1.2  // 20% buffer
  }
}
```

3. **Wait for Lower Gas:**
```bash
# Check current gas prices
npx hardhat run scripts/check-gas.ts --network base
```

---

### Issue: Nonce Too Low

**Error Message:**
```
Error: nonce too low
```

**Solutions:**

```bash
# Reset account nonce
npx hardhat run scripts/reset-nonce.ts --network base

# Or manually specify nonce
const nonce = await signer.getTransactionCount("pending");
const tx = await contract.method({nonce: nonce});
```

---

### Issue: Contract Deployment Failed

**Error Message:**
```
Error: contract creation code storage out of gas
```

**Solutions:**

1. **Increase Gas Limit:**
```javascript
const contract = await factory.deploy({
  gasLimit: 10_000_000  // Increase limit
});
```

2. **Optimize Contract:**
   - Enable optimizer
   - Remove unnecessary code
   - Use libraries

3. **Split Deployment:**
   - Deploy libraries separately
   - Link libraries
   - Deploy main contract

---

### Issue: Verification Failed

**Error Message:**
```
Error: Unable to verify contract
```

**Solutions:**

1. **Wait for Indexing:**
```bash
# Wait 2-3 minutes after deployment
sleep 180
npx hardhat verify --network base ADDRESS
```

2. **Flatten Contract:**
```bash
# Create flattened version
npx hardhat flatten contracts/Token.sol > flattened.sol

# Remove duplicate SPDX licenses
# Verify manually on BaseScan
```

3. **Use Constructor Args:**
```bash
# Create args file
echo "module.exports = ['0x...', 1000000];" > args.js

# Verify with args
npx hardhat verify --network base ADDRESS \
  --constructor-args args.js
```

---

## Network & Connection Issues

### Issue: RPC Rate Limiting

**Error Message:**
```
Error: Too many requests
```

**Solutions:**

1. **Use Multiple RPC Endpoints:**
```javascript
// Rotate between endpoints
const RPC_URLS = [
  "https://mainnet.base.org",
  "https://base.llamarpc.com",
  "https://base.blockpi.network/v1/rpc/public"
];
```

2. **Add Delays:**
```javascript
// Add delay between requests
await new Promise(resolve => setTimeout(resolve, 1000));
```

3. **Use Alchemy/Infura:**
```bash
# Get dedicated RPC endpoint
export BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

---

### Issue: Chain ID Mismatch

**Error Message:**
```
Error: chain ID does not match
```

**Solutions:**

```javascript
// Verify chain ID
const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
console.log("Current chain:", chainId);

// Ensure correct network
// Base Mainnet: 8453
// Base Sepolia: 84532
```

---

### Issue: Account Not Found

**Error Message:**
```
Error: could not find account
```

**Solutions:**

```bash
# Check private key
npx hardhat run scripts/check-wallet.ts --network base

# Verify .env file
cat .env | grep DEPLOYER_PRIVATE_KEY

# Ensure key starts with 0x
DEPLOYER_PRIVATE_KEY=0x...
```

---

## Transaction Issues

### Issue: Transaction Reverted

**Error Message:**
```
Error: VM Exception while processing transaction: revert
```

**Solutions:**

1. **Check Error Message:**
```javascript
try {
  await contract.method();
} catch (error) {
  console.log("Revert reason:", error.reason);
}
```

2. **Enable Debug Mode:**
```javascript
// In test
const tx = await contract.method();
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

3. **Common Causes:**
   - Insufficient balance
   - Access control violation
   - Invalid parameters
   - Reentrancy protection triggered
   - Deadline expired

---

### Issue: Gas Estimation Failed

**Error Message:**
```
Error: cannot estimate gas
```

**Solutions:**

1. **Provide Gas Limit:**
```javascript
await contract.method({
  gasLimit: 500_000
});
```

2. **Check Transaction:**
   - Will it revert?
   - Are parameters valid?
   - Does sender have permission?

3. **Test Locally:**
```bash
# Test on local network first
npx hardhat node
npx hardhat run scripts/test-tx.ts --network localhost
```

---

## Smart Contract Issues

### Issue: Function Not Found

**Error Message:**
```
Error: contract.functionName is not a function
```

**Solutions:**

1. **Verify ABI:**
```javascript
// Check contract interface
const contract = await ethers.getContractAt("ContractName", address);
console.log("Functions:", Object.keys(contract.functions));
```

2. **Recompile Contracts:**
```bash
npx hardhat clean
npx hardhat compile
```

3. **Check Contract Address:**
```bash
# Verify correct contract
npx hardhat run scripts/config.ts --network base show
```

---

### Issue: Access Control Error

**Error Message:**
```
Error: AccessControlUnauthorizedAccount
```

**Solutions:**

1. **Check Roles:**
```bash
# Verify roles
npx hardhat run scripts/check-roles.ts --network base
```

2. **Grant Role:**
```javascript
// Grant required role
const ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
await contract.grantRole(ROLE, address);
```

3. **Use Correct Signer:**
```javascript
// Ensure using correct wallet
const signer = await ethers.getSigner(ADMIN_ADDRESS);
const contract = contractFactory.connect(signer);
```

---

### Issue: Proxy Initialization Failed

**Error Message:**
```
Error: Initializable: contract is already initialized
```

**Solutions:**

1. **Check Initialization:**
```javascript
// Only initialize once
if (await proxy.implementation() === ethers.constants.AddressZero) {
  await proxy.initialize(...);
}
```

2. **Deploy New Proxy:**
```bash
# If needed, deploy new proxy instance
npx hardhat run scripts/deploy-proxy.ts --network base
```

---

## Governance Issues

### Issue: Proposal Failed

**Error Message:**
```
Error: Governor: proposal not successful
```

**Solutions:**

1. **Check Quorum:**
```javascript
const quorum = await governor.quorum(proposalSnapshot);
const votes = await governor.proposalVotes(proposalId);
console.log("Quorum:", quorum.toString());
console.log("For votes:", votes.forVotes.toString());
```

2. **Check Voting Period:**
```javascript
const state = await governor.state(proposalId);
// 1 = Active, 4 = Succeeded
console.log("State:", state);
```

3. **Verify Threshold:**
```bash
# Check if met requirements
npx hardhat run scripts/check-proposal.ts --network base --id PROPOSAL_ID
```

---

### Issue: Cannot Vote

**Error Message:**
```
Error: Governor: vote not currently active
```

**Solutions:**

1. **Check Proposal State:**
```javascript
const state = await governor.state(proposalId);
// Must be Active (1)
```

2. **Check Voting Power:**
```javascript
const votes = await token.getPastVotes(address, snapshot);
console.log("Voting power:", ethers.utils.formatEther(votes));
```

3. **Ensure Not Already Voted:**
```javascript
const hasVoted = await governor.hasVoted(proposalId, address);
console.log("Already voted:", hasVoted);
```

---

## DeFi & Uniswap Issues

### Issue: Pool Not Found

**Error Message:**
```
Error: Pool does not exist
```

**Solutions:**

1. **Verify Pool Key:**
```javascript
const poolKey = {
  currency0: token0,
  currency1: token1,
  fee: 500,  // 0.05%
  tickSpacing: 10,
  hooks: ethers.constants.AddressZero
};
```

2. **Initialize Pool:**
```bash
npx hardhat run scripts/lp-manager.ts --network base initialize-pool
```

---

### Issue: Insufficient Liquidity

**Error Message:**
```
Error: Insufficient liquidity for this trade
```

**Solutions:**

1. **Increase Slippage:**
   - Use higher slippage tolerance
   - 1-2% for normal trades
   - 3-5% for low liquidity

2. **Trade Smaller Amount:**
   - Split large trades
   - Use time-weighted average

3. **Add Liquidity:**
```bash
npx hardhat run scripts/lp-manager.ts --network base add-liquidity
```

---

### Issue: Price Impact Too High

**Error Message:**
```
Error: Price impact exceeds maximum
```

**Solutions:**

1. **Reduce Trade Size:**
   - Trade smaller amounts
   - Multiple smaller trades

2. **Wait for More Liquidity:**
   - Monitor pool depth
   - Trade during high volume

3. **Use Limit Orders:**
   - When available
   - Set acceptable price

---

## Monitoring & Scripts Issues

### Issue: Script Permission Denied

**Error Message:**
```
Error: Permission denied
```

**Solutions:**

```bash
# Make script executable
chmod +x scripts/your-script.sh

# Or run with node/npx
npx hardhat run scripts/your-script.ts
```

---

### Issue: Environment Variable Not Found

**Error Message:**
```
Error: Environment variable not found
```

**Solutions:**

1. **Create .env File:**
```bash
cp .env.example .env
# Edit with your values
```

2. **Verify Variables:**
```bash
# Check if loaded
node -e "console.log(process.env.DEPLOYER_PRIVATE_KEY)"
```

3. **Load Explicitly:**
```javascript
require('dotenv').config();
```

---

## Emergency Procedures

### Contract Compromised

**Immediate Actions:**

1. **Pause Contracts:**
```bash
npx hardhat run scripts/emergency-pause.ts --network base
```

2. **Alert Team:**
   - Notify security team
   - Post public alert
   - Contact users

3. **Assess Damage:**
```bash
npx hardhat run scripts/assess-damage.ts --network base
```

4. **Execute Recovery:**
```bash
npx hardhat run scripts/emergency-recovery.ts --network base
```

---

### Lost Access to Multi-Sig

**Recovery Steps:**

1. **Check Remaining Signers:**
   - Contact other signers
   - Verify threshold

2. **Use Recovery Process:**
   - Follow multi-sig recovery
   - May need governance vote

3. **Update Security:**
   - Add new signers
   - Review access control

---

## Getting Additional Help

### Self-Service Resources

1. **Documentation:**
   - Read relevant docs
   - Check API reference
   - Review examples

2. **Search Issues:**
   - GitHub issues
   - Discord history
   - Stack Overflow

3. **Run Diagnostics:**
```bash
npx hardhat run scripts/ecosystem-manager.ts --network base health
npx hardhat run scripts/monitor.ts --network base report
```

### Community Support

**Discord:**
- Join #support channel
- Describe issue clearly
- Include error messages
- Share transaction hashes

**GitHub Issues:**
- Search existing issues
- Create new issue if needed
- Use issue templates
- Provide reproduction steps

### Professional Support

**Email:** dev@arcexchange.io
- For critical issues
- Security vulnerabilities
- Partnership inquiries

**Response Times:**
- Critical: 1-2 hours
- High: 4-6 hours
- Normal: 24 hours
- Low: 48 hours

---

## Prevention Tips

### Best Practices

1. **Always Test First:**
   - Use testnet
   - Test transactions
   - Verify results

2. **Monitor Continuously:**
```bash
# Regular health checks
npm run health

# Set up alerts
npm run monitor
```

3. **Keep Backups:**
   - Save deployment info
   - Backup configurations
   - Document changes

4. **Stay Updated:**
   - Update dependencies
   - Follow security advisories
   - Review changelogs

---

## Related Documentation

- [03_DEVELOPMENT.md](./03_DEVELOPMENT.md) - Development guide
- [07_SECURITY.md](./07_SECURITY.md) - Security practices
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide
- [10_SCRIPTS.md](./10_SCRIPTS.md) - Script documentation

---

## Appendix: Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `CALL_EXCEPTION` | Transaction failed | Check revert reason |
| `INSUFFICIENT_FUNDS` | Not enough gas/tokens | Add funds |
| `NONCE_EXPIRED` | Old transaction | Reset nonce |
| `NETWORK_ERROR` | Connection failed | Check RPC |
| `TIMEOUT` | Request timed out | Increase timeout |
| `INVALID_ARGUMENT` | Wrong parameters | Verify inputs |
| `UNPREDICTABLE_GAS_LIMIT` | Can't estimate gas | Check transaction |

---

**Last Updated:** 2026-01-17  
**Version:** 1.0.0

For updates to this guide, see [GitHub](https://github.com/Artifact-Virtual/ARC/docs/11_TROUBLESHOOTING.md)
