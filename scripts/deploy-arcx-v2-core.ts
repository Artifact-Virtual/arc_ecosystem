// scripts/deploy-arcx-v2-core.ts
// Deploy the Core ARCx V2 token (deployable size)

import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork } from "./shared/utils";

async function main() {
  displayScriptHeader(
    "ARCx V2 Core Deployment",
    "Deploying essential DeFi token features within size limits"
  );

  await validateNetwork();
  const [deployer] = await ethers.getSigners();

  console.log("🎯 CORE TOKEN CONFIGURATION");
  console.log("============================");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`V1 Token: ${CONTRACTS.ARCX_TOKEN}`);

  // Core token configuration
  const CONFIG = {
    name: "ARCx", // Keep brand consistency
    symbol: "ARCX", // Same symbol for familiarity
    maxSupply: ethers.parseEther("1000000"), // 1M tokens
    admin: deployer.address
  };

  console.log(`\n💎 CORE FEATURES:`);
  console.log(`• V1 Migration: 11% bonus for early adopters`);
  console.log(`• Basic Yield: 5% annual base rate`);
  console.log(`• Staking System: 30-365 day locks with up to 2x multiplier`);
  console.log(`• Governance: Voting and proposal capabilities`);
  console.log(`• UUPS Upgradeable: Future feature additions`);
  console.log(`• Emergency Controls: Pause/unpause functionality`);

  // Deploy Core ARCx V2
  console.log("\n🚀 DEPLOYING CORE ARCx V2...");
  console.log("=============================");

  const ARCxV2CoreFactory = await ethers.getContractFactory("ARCxV2Core");
  
  console.log("📦 Deploying proxy with implementation...");
  const arcxV2Core = await upgrades.deployProxy(
    ARCxV2CoreFactory,
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

  await arcxV2Core.waitForDeployment();
  const proxyAddress = await arcxV2Core.getAddress();

  console.log(`✅ Core ARCx V2 deployed: ${proxyAddress}`);
  console.log(`📋 Implementation: ${await upgrades.erc1967.getImplementationAddress(proxyAddress)}`);
  console.log(`🔧 ProxyAdmin: ${await upgrades.erc1967.getAdminAddress(proxyAddress)}`);

  // Verify core functionality
  console.log("\n🔍 VERIFYING CORE FEATURES...");
  console.log("===============================");

  // Basic token info
  const name = await arcxV2Core.name();
  const symbol = await arcxV2Core.symbol();
  const decimals = await arcxV2Core.decimals();
  const maxSupply = await arcxV2Core.MAX_SUPPLY();
  const version = await arcxV2Core.version();

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Max Supply: ${ethers.formatEther(maxSupply)} ARCX`);
  console.log(`Version: ${version}`);

  // Core features verification
  const yieldConfig = await arcxV2Core.yieldConfig();
  const migrationEnabled = await arcxV2Core.migrationEnabled();

  console.log(`\n💰 YIELD SYSTEM:`);
  console.log(`Base Yield Rate: ${yieldConfig.baseYieldRate / 100}% annually`);
  console.log(`Yield Enabled: ${yieldConfig.yieldEnabled}`);

  console.log(`\n🔄 MIGRATION:`);
  console.log(`Migration Enabled: ${migrationEnabled}`);
  console.log(`Migration Bonus: ${(await arcxV2Core.MIGRATION_BONUS_RATE()) - 1000n} basis points (11%)`);

  // Verify staking multipliers
  const lock30 = await arcxV2Core.LOCK_30_DAYS();
  const lock90 = await arcxV2Core.LOCK_90_DAYS();
  const lock180 = await arcxV2Core.LOCK_180_DAYS();
  const lock365 = await arcxV2Core.LOCK_365_DAYS();

  const mult30 = await arcxV2Core.lockPeriodMultipliers(lock30);
  const mult90 = await arcxV2Core.lockPeriodMultipliers(lock90);
  const mult180 = await arcxV2Core.lockPeriodMultipliers(lock180);
  const mult365 = await arcxV2Core.lockPeriodMultipliers(lock365);

  console.log(`\n🔒 STAKING MULTIPLIERS:`);
  console.log(`30 Days: ${(mult30 - 10000n) / 100n}% bonus (${Number(mult30) / 10000}x multiplier)`);
  console.log(`90 Days: ${(mult90 - 10000n) / 100n}% bonus (${Number(mult90) / 10000}x multiplier)`);
  console.log(`180 Days: ${(mult180 - 10000n) / 100n}% bonus (${Number(mult180) / 10000}x multiplier)`);
  console.log(`365 Days: ${(mult365 - 10000n) / 100n}% bonus (${Number(mult365) / 10000}x multiplier)`);

  // Test migration calculation
  console.log(`\n📊 MIGRATION EXAMPLES:`);
  const testAmounts = [1000, 5000, 10000, 50000];
  for (const amount of testAmounts) {
    const v1Amount = ethers.parseEther(amount.toString());
    const v2Amount = (v1Amount * 1111n) / 1000n;
    console.log(`${amount.toLocaleString()} V1 → ${ethers.formatEther(v2Amount)} V2 ARCX (+${((Number(v2Amount) / Number(v1Amount)) - 1) * 100}%)`);
  }

  // Initial setup
  console.log(`\n⚙️ INITIAL SETUP:`);
  console.log("==================");

  // Set yield reserve pool to deployer initially
  await arcxV2Core.setYieldReservePool(deployer.address);
  console.log(`✅ Yield Reserve Pool set to: ${deployer.address}`);

  // Mint initial tokens for testing and setup
  const initialMint = ethers.parseEther("100000"); // 100k tokens
  await arcxV2Core.mint(deployer.address, initialMint);
  console.log(`✅ Minted ${ethers.formatEther(initialMint)} ARCX for setup`);

  console.log(`\n🎉 DEPLOYMENT SUMMARY:`);
  console.log("======================");
  console.log(`Contract: ARCx V2 Core`);
  console.log(`Address: ${proxyAddress}`);
  console.log(`Features: Essential DeFi mechanisms`);
  console.log(`Migration: Ready with 11% bonus`);
  console.log(`Yield System: 5% base APY`);
  console.log(`Staking: 4 lock periods with up to 2x multiplier`);
  console.log(`Upgradeability: UUPS proxy for future enhancements`);

  console.log(`\n🔧 CONFIGURATION UPDATES NEEDED:`);
  console.log("=================================");
  console.log(`1. Update constants.ts:`);
  console.log(`   ARCX_TOKEN_V2_CORE: "${proxyAddress}"`);
  console.log(`2. Set proper yield reserve pool (treasury wallet)`);
  console.log(`3. Test all core features in staging`);

  console.log(`\n🚀 NEXT STEPS:`);
  console.log("===============");
  console.log(`1. Verify contract on BaseScan`);
  console.log(`2. Test migration from V1 to V2 Core`);
  console.log(`3. Set up yield distribution`);
  console.log(`4. Test staking mechanisms`);
  console.log(`5. Plan enhanced features upgrade (flash loans, profit sharing, etc.)`);
  console.log(`6. Launch migration campaign`);

  return {
    proxyAddress,
    implementationAddress: await upgrades.erc1967.getImplementationAddress(proxyAddress),
    contract: arcxV2Core
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
