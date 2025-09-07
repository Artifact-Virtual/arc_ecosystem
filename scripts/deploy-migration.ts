// scripts/deploy-migration.ts
// Deploy ARCxMigration contract for token recovery

import { ethers } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork } from "./shared/utils";

async function main() {
  displayScriptHeader(
    "ARCx Migration Contract Deployment",
    "Deploying migration contract for token recovery"
  );

  await validateNetwork();

  const [deployer] = await ethers.getSigners();
  console.log(`🚀 Deployer: ${deployer.address}`);

  // Deploy ARCxMigration contract
  console.log("\n📦 Deploying ARCxMigration contract...");
  const ARCxMigration = await ethers.getContractFactory("ARCxMigration");
  const migrationContract = await ARCxMigration.deploy(
    CONTRACTS.ARCX_TOKEN,
    deployer.address
  );

  await migrationContract.waitForDeployment();
  const migrationAddress = await migrationContract.getAddress();

  console.log(`✅ ARCxMigration deployed at: ${migrationAddress}`);

  // Get migration statistics
  const stats = await migrationContract.getMigrationStats();
  console.log(`\n📊 MIGRATION STATS:`);
  console.log(`- Migration Enabled: ${stats.enabled}`);
  console.log(`- Old Token: ${stats.oldToken}`);
  console.log(`- New Token: ${stats.newToken || 'Not set'}`);
  console.log(`- Total Migrated: ${ethers.formatEther(stats.migrated)} ARCx`);
  console.log(`- Stuck in Old Contract: ${ethers.formatEther(stats.oldContractBalance)} ARCx`);

  console.log("\n🎯 MIGRATION WORKFLOW:");
  console.log("======================");
  console.log("1. Deploy new ARCx token contract (with upgradeable pattern)");
  console.log("2. Call enableMigration() with new contract address");
  console.log("3. Users can call migrateTokens() to move their tokens");
  console.log("4. For stuck tokens, use emergencyRecoverStuckTokens()");
  console.log("5. Complete migration and update ecosystem contracts");

  console.log("\n⚠️  IMPORTANT NOTES:");
  console.log("- Migration preserves all token balances");
  console.log("- New contract should have proper access controls");
  console.log("- Consider adding timelock for critical operations");
  console.log("- Test thoroughly on testnet before mainnet");

  console.log("\n🔧 CONTRACT FEATURES:");
  console.log("- Role-based access control");
  console.log("- Migration tracking per user");
  console.log("- Emergency recovery functions");
  console.log("- Migration statistics");

  // Check if deployer has required roles
  const adminRole = await migrationContract.DEFAULT_ADMIN_ROLE();
  const migratorRole = await migrationContract.MIGRATOR_ROLE();

  const hasAdminRole = await migrationContract.hasRole(adminRole, deployer.address);
  const hasMigratorRole = await migrationContract.hasRole(migratorRole, deployer.address);

  console.log(`\n🔑 PERMISSIONS:`);
  console.log(`- Admin Role: ${hasAdminRole}`);
  console.log(`- Migrator Role: ${hasMigratorRole}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
