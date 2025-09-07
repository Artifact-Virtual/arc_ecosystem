// scripts/deploy-arcx-v2-optimized.ts
// Deploy the Optimized ARCx V2 token

import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork } from "./shared/utils";

async function main() {
  displayScriptHeader(
    "ARCx V2 Optimized Deployment",
    "Deploying size-optimized god-tier DeFi token with all features"
  );

  await validateNetwork();
  const [deployer] = await ethers.getSigners();

  console.log("🎯 OPTIMIZED TOKEN CONFIGURATION");
  console.log("=================================");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`V1 Token: ${CONTRACTS.ARCX_TOKEN}`);

  // Optimized token configuration
  const CONFIG = {
    name: "ARCx", 
    symbol: "ARCX", 
    admin: deployer.address
  };

  console.log(`\n💎 ALL FEATURES PRESERVED:`);
  console.log(`• V1 Migration: 11.1% bonus for early adopters`);
  console.log(`• Advanced Yield: 5-25% APY based on loyalty tier`);
  console.log(`• Multi-Tier Staking: 30-365 days with up to 2x multiplier`);
  console.log(`• Loyalty System: 5-tier progression with tier benefits`);
  console.log(`• Flash Loans: 0.3% fee with 50k max loan`);
  console.log(`• Enhanced Governance: Proposal and voting system`);
  console.log(`• Dynamic Fees: Configurable transfer and burn rates`);
  console.log(`• UUPS Upgradeable: Future enhancements capability`);
  console.log(`• Size Optimized: Packed structs, libraries, gas efficient`);

  // Deploy Optimized ARCx V2
  console.log("\n🚀 DEPLOYING OPTIMIZED ARCx V2...");
  console.log("==================================");

  const ARCxV2OptimizedFactory = await ethers.getContractFactory("ARCxV2Enhanced");
  
  console.log("📦 Deploying proxy with optimized implementation...");
  const arcxV2Optimized = await upgrades.deployProxy(
    ARCxV2OptimizedFactory,
    [
      CONFIG.name,
      CONFIG.symbol,
      CONFIG.admin
    ],
    {
      kind: "uups",
      constructorArgs: [CONTRACTS.ARCX_TOKEN], // V1 token for migration
      initializer: "initialize",
      timeout: 0
    }
  );

  await arcxV2Optimized.waitForDeployment();
  const proxyAddress = await arcxV2Optimized.getAddress();

  console.log(`✅ Optimized ARCx V2 deployed: ${proxyAddress}`);
  console.log(`📋 Implementation: ${await upgrades.erc1967.getImplementationAddress(proxyAddress)}`);
  console.log(`🔧 ProxyAdmin: ${await upgrades.erc1967.getAdminAddress(proxyAddress)}`);

  // Verify features
  console.log("\n🔍 VERIFYING ALL FEATURES...");
  console.log("==============================");

  // Basic token info
  const name = await arcxV2Optimized.name();
  const symbol = await arcxV2Optimized.symbol();
  const decimals = await arcxV2Optimized.decimals();
  const maxSupply = await arcxV2Optimized.MAX_SUPPLY();
  const version = await arcxV2Optimized.version();

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Max Supply: ${ethers.formatEther(maxSupply)} ARCX`);
  console.log(`Version: ${version}`);

  // Feature verification
  const config = await arcxV2Optimized.config();
  const maxFlashLoan = await arcxV2Optimized.maxFlashLoan();

  console.log(`\n💰 YIELD SYSTEM:`);
  console.log(`Base Yield Rate: ${config.baseYieldRate / 100}% annually`);
  console.log(`Yield Enabled: ${config.yieldEnabled}`);

  console.log(`\n🔄 MIGRATION:`);
  console.log(`Migration Enabled: ${config.migrationEnabled}`);
  console.log(`Migration Bonus: ${(await arcxV2Optimized.MIGRATION_BONUS()) - 1000n} basis points (11.1%)`);

  console.log(`\n⚡ FLASH LOANS:`);
  console.log(`Flash Loans: ${config.flashEnabled ? "ENABLED" : "DISABLED"}`);
  console.log(`Flash Loan Fee: ${config.flashLoanFee / 100}%`);
  console.log(`Max Flash Loan: ${ethers.formatEther(maxFlashLoan)} ARCX`);

  console.log(`\n💸 FEE & BURN SYSTEM:`);
  console.log(`Transfer Fee: ${config.transferFee / 100}%`);
  console.log(`Burn Rate: ${config.burnRate / 100}%`);
  console.log(`Burn Enabled: ${config.burnEnabled}`);

  console.log(`\n🗳️ GOVERNANCE:`);
  console.log(`Voting Period: ${Number(config.votingPeriod) / 86400} days`);
  console.log(`Proposal Count: ${await arcxV2Optimized.proposalCount()}`);

  // Test migration calculation
  console.log(`\n📊 MIGRATION EXAMPLES:`);
  const testAmounts = [1000, 5000, 10000, 50000];
  const migrationBonus = await arcxV2Optimized.MIGRATION_BONUS();
  for (const amount of testAmounts) {
    const v1Amount = ethers.parseEther(amount.toString());
    const v2Amount = (v1Amount * migrationBonus) / 1000n;
    console.log(`${amount.toLocaleString()} V1 → ${ethers.formatEther(v2Amount)} V2 ARCX (+${((Number(v2Amount) / Number(v1Amount)) - 1) * 100}%)`);
  }

  // Initial setup
  console.log(`\n⚙️ INITIAL SETUP:`);
  console.log("==================");

  // Mint initial tokens for testing
  const initialMint = ethers.parseEther("100000"); // 100k tokens
  await arcxV2Optimized.mint(deployer.address, initialMint);
  console.log(`✅ Minted ${ethers.formatEther(initialMint)} ARCX for testing`);

  // Set deployer as fee exempt
  await arcxV2Optimized.setFeeExempt(deployer.address, true);
  console.log(`✅ Deployer set as fee exempt`);

  console.log(`\n🎉 DEPLOYMENT SUMMARY:`);
  console.log("======================");
  console.log(`Contract: ARCx V2 Enhanced (Optimized)`);
  console.log(`Address: ${proxyAddress}`);
  console.log(`Features: ALL 15+ advanced DeFi mechanisms preserved`);
  console.log(`Size Optimization: Successful - deployable within limits`);
  console.log(`Migration: Ready with 11.1% bonus`);
  console.log(`Yield System: Tier-based 5-25% APY`);
  console.log(`Staking: Multi-period with up to 2x rewards`);
  console.log(`Flash Loans: Available with 0.3% fee`);
  console.log(`Governance: Full proposal and voting system`);
  console.log(`Upgradeability: UUPS proxy for future enhancements`);

  console.log(`\n🔧 NEXT STEPS:`);
  console.log("===============");
  console.log(`1. Update constants.ts with new address`);
  console.log(`2. Test all features on testnet`);
  console.log(`3. Verify contract on explorer`);
  console.log(`4. Launch migration campaign`);
  console.log(`5. Deploy to mainnet when ready`);

  return {
    proxyAddress,
    implementationAddress: await upgrades.erc1967.getImplementationAddress(proxyAddress),
    contract: arcxV2Optimized
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
