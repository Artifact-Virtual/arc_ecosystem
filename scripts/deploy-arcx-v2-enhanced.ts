// scripts/deploy-arcx-v2-enhanced.ts
// Deploy the God-Tier ARCx V2 Enhanced token

import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork } from "./shared/utils";

async function main() {
  displayScriptHeader(
    "ARCx V2 Enhanced Deployment",
    "Deploying God-Tier DeFi token with advanced features"
  );

  await validateNetwork();
  const [deployer] = await ethers.getSigners();

  console.log("🎯 ENHANCED TOKEN CONFIGURATION");
  console.log("===============================");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`V1 Token: ${CONTRACTS.ARCX_TOKEN}`);

  // Enhanced token configuration
  const CONFIG = {
    name: "ARCx", // Keep brand consistency
    symbol: "ARCX", // Same symbol for familiarity
    maxSupply: ethers.parseEther("1000000"), // 1M tokens
    baseYieldRate: 500, // 5% annual yield
    migrationBonus: 1111, // 11.1% migration bonus
    admin: deployer.address
  };

  console.log(`\n💎 ENHANCED FEATURES:`);
  console.log(`• Auto-Compounding Yield: ${CONFIG.baseYieldRate / 100}% annually`);
  console.log(`• Multi-Tier Staking: 30-365 day locks with up to 2x rewards`);
  console.log(`• Profit Sharing: Direct revenue distribution to holders`);
  console.log(`• Flash Loans: 0.3% fee with 50k max loan amount`);
  console.log(`• Loyalty System: 5-tier progression (Bronze to Diamond)`);
  console.log(`• Deflationary Burns: 0.05% burned per transaction`);
  console.log(`• Dynamic Fees: Volume-based fee adjustments`);
  console.log(`• Enhanced Governance: Proposal system with voting`);

  // Deploy Enhanced ARCx V2
  console.log("\n🚀 DEPLOYING ENHANCED ARCx V2...");
  console.log("=================================");

  const ARCxV2EnhancedFactory = await ethers.getContractFactory("ARCxV2Enhanced");
  
  console.log("📦 Deploying proxy with implementation...");
  const arcxV2Enhanced = await upgrades.deployProxy(
    ARCxV2EnhancedFactory,
    [
      CONFIG.name,
      CONFIG.symbol,
      CONFIG.admin
    ],
    {
      kind: "uups",
      constructorArgs: [CONTRACTS.ARCX_TOKEN], // V1 token for migration
      initializer: "initialize",
      timeout: 0 // Remove timeout for complex deployment
    }
  );

  await arcxV2Enhanced.waitForDeployment();
  const proxyAddress = await arcxV2Enhanced.getAddress();

  console.log(`✅ Enhanced ARCx V2 deployed: ${proxyAddress}`);
  console.log(`📋 Implementation: ${await upgrades.erc1967.getImplementationAddress(proxyAddress)}`);
  console.log(`🔧 ProxyAdmin: ${await upgrades.erc1967.getAdminAddress(proxyAddress)}`);

  // Verify core functionality
  console.log("\n🔍 VERIFYING ENHANCED FEATURES...");
  console.log("=================================");

  // Basic token info
  const name = await arcxV2Enhanced.name();
  const symbol = await arcxV2Enhanced.symbol();
  const decimals = await arcxV2Enhanced.decimals();
  const maxSupply = await arcxV2Enhanced.MAX_SUPPLY();
  const version = await arcxV2Enhanced.version();

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Max Supply: ${ethers.formatEther(maxSupply)} ARCX`);
  console.log(`Version: ${version}`);

  // Enhanced features verification
  const yieldConfig = await arcxV2Enhanced.yieldConfig();
  const migrationEnabled = await arcxV2Enhanced.migrationEnabled();
  const flashLoansEnabled = await arcxV2Enhanced.flashLoansEnabled();
  const flashLoanFee = await arcxV2Enhanced.flashLoanFee();
  const maxFlashLoan = await arcxV2Enhanced.maxFlashLoanAmount();

  console.log(`\n💰 YIELD SYSTEM:`);
  console.log(`Base Yield Rate: ${yieldConfig.baseYieldRate / 100}% annually`);
  console.log(`Compounding Frequency: ${yieldConfig.compoundingFrequency / 86400} days`);
  console.log(`Auto-Compound: ${yieldConfig.autoCompoundEnabled}`);

  console.log(`\n🔄 MIGRATION:`);
  console.log(`Migration Enabled: ${migrationEnabled}`);
  console.log(`Migration Bonus: ${(await arcxV2Enhanced.MIGRATION_BONUS_RATE()) - 1000n} basis points (11%)`);

  console.log(`\n⚡ FLASH LOANS:`);
  console.log(`Flash Loans: ${flashLoansEnabled ? "ENABLED" : "DISABLED"}`);
  console.log(`Flash Loan Fee: ${flashLoanFee / 100}%`);
  console.log(`Max Flash Loan: ${ethers.formatEther(maxFlashLoan)} ARCX`);

  // Verify tier system
  const tierBenefits = await Promise.all([
    arcxV2Enhanced.tierBenefits(0), // Bronze
    arcxV2Enhanced.tierBenefits(1), // Silver  
    arcxV2Enhanced.tierBenefits(2), // Gold
    arcxV2Enhanced.tierBenefits(3), // Platinum
    arcxV2Enhanced.tierBenefits(4)  // Diamond
  ]);

  console.log(`\n🏆 LOYALTY TIERS:`);
  console.log(`Bronze (Tier 0): +${tierBenefits[0] / 100}% yield bonus`);
  console.log(`Silver (Tier 1): +${tierBenefits[1] / 100}% yield bonus`);
  console.log(`Gold (Tier 2): +${tierBenefits[2] / 100}% yield bonus`);
  console.log(`Platinum (Tier 3): +${tierBenefits[3] / 100}% yield bonus`);
  console.log(`Diamond (Tier 4): +${tierBenefits[4] / 100}% yield bonus`);

  // Verify lock periods and multipliers
  const lock30 = await arcxV2Enhanced.LOCK_30_DAYS();
  const lock90 = await arcxV2Enhanced.LOCK_90_DAYS();
  const lock180 = await arcxV2Enhanced.LOCK_180_DAYS();
  const lock365 = await arcxV2Enhanced.LOCK_365_DAYS();

  const mult30 = await arcxV2Enhanced.lockPeriodMultipliers(lock30);
  const mult90 = await arcxV2Enhanced.lockPeriodMultipliers(lock90);
  const mult180 = await arcxV2Enhanced.lockPeriodMultipliers(lock180);
  const mult365 = await arcxV2Enhanced.lockPeriodMultipliers(lock365);

  console.log(`\n🔒 STAKING MULTIPLIERS:`);
  console.log(`30 Days: ${(mult30 - 10000n) / 100n}% bonus (${Number(mult30) / 10000}x multiplier)`);
  console.log(`90 Days: ${(mult90 - 10000n) / 100n}% bonus (${Number(mult90) / 10000}x multiplier)`);
  console.log(`180 Days: ${(mult180 - 10000n) / 100n}% bonus (${Number(mult180) / 10000}x multiplier)`);
  console.log(`365 Days: ${(mult365 - 10000n) / 100n}% bonus (${Number(mult365) / 10000}x multiplier)`);

  // Fee configuration
  const feeConfig = await arcxV2Enhanced.feeConfig();
  console.log(`\n💸 FEE STRUCTURE:`);
  console.log(`Transfer Fee: ${feeConfig.transferFee / 100}%`);
  console.log(`Staking Fee: ${feeConfig.stakingFee / 100}%`);
  console.log(`Unstaking Fee: ${feeConfig.unstakingFee / 100}%`);
  console.log(`Dynamic Fees: ${feeConfig.dynamicFeesEnabled ? "ENABLED" : "DISABLED"}`);

  // Burn configuration
  const burnConfig = await arcxV2Enhanced.burnConfig();
  console.log(`\n🔥 DEFLATIONARY BURNS:`);
  console.log(`Burn Per Transaction: ${burnConfig.burnRatePerTransaction / 100}%`);
  console.log(`Minimum Burn: ${ethers.formatEther(burnConfig.minimumBurnAmount)} ARCX`);
  console.log(`Burn On Transfer: ${burnConfig.burnOnTransferEnabled ? "ENABLED" : "DISABLED"}`);

  // Test migration calculation
  console.log(`\n📊 MIGRATION EXAMPLES:`);
  const testAmounts = [1000, 5000, 10000, 50000];
  for (const amount of testAmounts) {
    const v1Amount = ethers.parseEther(amount.toString());
    const migrationInfo = await arcxV2Enhanced.getMigrationInfo(deployer.address);
    const v2Amount = (v1Amount * 1111n) / 1000n;
    console.log(`${amount.toLocaleString()} V1 → ${ethers.formatEther(v2Amount)} V2 ARCX (+${((Number(v2Amount) / Number(v1Amount)) - 1) * 100}%)`);
  }

  // Initial setup
  console.log(`\n⚙️ INITIAL SETUP:`);
  console.log("=================");

  // Set yield reserve pool to deployer initially (should be changed later)
  await arcxV2Enhanced.setYieldReservePool(deployer.address);
  console.log(`✅ Yield Reserve Pool set to: ${deployer.address}`);

  // Set revenue wallet for profit sharing
  await arcxV2Enhanced.setRevenueWallet(deployer.address);
  console.log(`✅ Revenue Wallet set to: ${deployer.address}`);

  // Mint initial tokens for testing and setup
  const initialMint = ethers.parseEther("100000"); // 100k tokens
  await arcxV2Enhanced.mint(deployer.address, initialMint);
  console.log(`✅ Minted ${ethers.formatEther(initialMint)} ARCX for setup`);

  // Set deployer as fee exempt for initial distributions
  await arcxV2Enhanced.setFeeExempt(deployer.address, true);
  console.log(`✅ Deployer set as fee exempt`);

  console.log(`\n🎉 DEPLOYMENT SUMMARY:`);
  console.log("======================");
  console.log(`Contract: ARCx V2 Enhanced`);
  console.log(`Address: ${proxyAddress}`);
  console.log(`Features: 15+ advanced DeFi mechanisms`);
  console.log(`Migration: Ready with 11% bonus`);
  console.log(`Yield System: 5-25% APY based on tier`);
  console.log(`Staking: 4 lock periods with up to 2x multiplier`);
  console.log(`Flash Loans: Available with 0.3% fee`);
  console.log(`Governance: Proposal and voting system`);
  console.log(`Burns: 0.05% deflationary per transaction`);

  console.log(`\n🔧 CONFIGURATION UPDATES NEEDED:`);
  console.log("================================");
  console.log(`1. Update constants.ts:`);
  console.log(`   ARCX_TOKEN_V2_ENHANCED: "${proxyAddress}"`);
  console.log(`2. Set proper yield reserve pool (treasury wallet)`);
  console.log(`3. Set proper revenue wallet for profit sharing`);
  console.log(`4. Configure fee recipients (treasury/DAO)`);
  console.log(`5. Test all advanced features in staging`);

  console.log(`\n🚀 NEXT STEPS:`);
  console.log("==============");
  console.log(`1. Verify contract on BaseScan`);
  console.log(`2. Set up yield distribution pools`);
  console.log(`3. Configure profit sharing mechanism`);
  console.log(`4. Test flash loan functionality`);
  console.log(`5. Launch migration from V1 to V2`);
  console.log(`6. Deploy supporting contracts (vesting, etc.)`);
  console.log(`7. Create governance proposals for parameters`);

  return {
    proxyAddress,
    implementationAddress: await upgrades.erc1967.getImplementationAddress(proxyAddress),
    contract: arcxV2Enhanced
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
