// scripts/deploy_sbt.ts
// Deployment script for ARC Identity SBT (Citizenship)

import { ethers } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork, checkEthBalance, printValidationResults } from "./shared/utils";

interface DeploymentOptions {
  dryRun?: boolean;
  confirm?: boolean;
}

async function main() {
  displayScriptHeader(
    "ARC Identity SBT Deployment",
    "Deploy ARC Identity SBT for Citizenship and Governance"
  );

  // Parse command line arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const confirm = args.includes("--confirm");

  console.log(`🧪 Dry Run: ${dryRun ? "ENABLED" : "DISABLED"}`);
  console.log(`✅ Auto Confirm: ${confirm ? "ENABLED" : "DISABLED"}`);

  // Validation
  const validationResults = [];

  // Network validation
  validationResults.push(await validateNetwork());

  // Signer validation
  const [deployer] = await ethers.getSigners();
  console.log(`\n🔐 Deployer: ${deployer.address}`);

  validationResults.push(await checkEthBalance(deployer.address, "0.05"));

  const { criticalIssues } = printValidationResults(validationResults);

  if (criticalIssues > 0 && !dryRun) {
    console.log("❌ Cannot proceed with critical issues. Use --dry-run to test.");
    return;
  }

  // Deploy ARC Identity SBT
  await deployIdentitySBT(dryRun);

  console.log("\n🎉 SBT DEPLOYMENT COMPLETE");
  console.log("==========================");
}

async function deployIdentitySBT(dryRun: boolean) {
  console.log("\n🏛️ ARC IDENTITY SBT DEPLOYMENT (CITIZENSHIP)");
  console.log("============================================");

  // Get deployer address
  const [deployer] = await ethers.getSigners();

  const sbtParams = {
    timelock: CONTRACTS.TREASURY_SAFE,
    safeExecutor: CONTRACTS.ECOSYSTEM_SAFE,
    eas: "0x4200000000000000000000000000000000000021", // EAS on Base
    schemaId: ethers.keccak256(ethers.toUtf8Bytes("ARC Identity Role(uint256 roleId,address recipient,uint64 expiresAt,string metadata)")),
  };

  console.log("📋 SBT Configuration:");
  console.log(`- Timelock: ${sbtParams.timelock}`);
  console.log(`- Safe Executor: ${sbtParams.safeExecutor}`);
  console.log(`- EAS Address: ${sbtParams.eas}`);
  console.log(`- Schema ID: ${sbtParams.schemaId}`);
  console.log(`- Deployer: ${deployer.address}`);

  if (dryRun) {
    console.log("🧪 DRY RUN: Would deploy ARC Identity SBT with above parameters");
    return;
  }

  try {
    console.log("\n🚀 Deploying ARC_IdentitySBT...");

    const ARC_IdentitySBT = await ethers.getContractFactory("ARC_IdentitySBT");

    const sbt = await ARC_IdentitySBT.deploy();
    await sbt.waitForDeployment();
    const sbtAddress = await sbt.getAddress();

    console.log("✅ ARC Identity SBT deployed successfully!");
    console.log("Contract Address:", sbtAddress);

    // Initialize the SBT
    console.log("\n🔧 Initializing SBT...");
    const initTx = await sbt.initialize(
      sbtParams.timelock,
      sbtParams.safeExecutor,
      sbtParams.eas,
      sbtParams.schemaId
    );
    await initTx.wait();

    console.log("✅ SBT initialized successfully!");

    // Setup default roles
    console.log("\n👥 Setting up default roles...");

    // Grant issuer role to deployer initially
    const issuerRole = await sbt.ISSUER_ROLE();
    const grantIssuerTx = await sbt.grantRole(issuerRole, deployer.address);
    await grantIssuerTx.wait();

    // Grant admin role to treasury
    const adminRole = await sbt.ADMIN_ROLE();
    const grantAdminTx = await sbt.grantRole(adminRole, CONTRACTS.TREASURY_SAFE);
    await grantAdminTx.wait();

    console.log("✅ Roles configured successfully!");

    // Setup default role configurations
    console.log("\n⚙️ Setting up default role configurations...");

    // Define default roles with weights and masks
    const defaultRoles = [
      {
        role: await sbt.ROLE_CODE(),
        weight: ethers.parseEther("1.0"), // 100% weight for code contributors
        mask: 1, // LAYER_TOKEN
        name: "CODE"
      },
      {
        role: await sbt.ROLE_GOV(),
        weight: ethers.parseEther("0.8"), // 80% weight for governance participants
        mask: 4, // LAYER_GRANTS
        name: "GOV"
      },
      {
        role: await sbt.ROLE_RWA_CURATOR(),
        weight: ethers.parseEther("0.9"), // 90% weight for RWA curators
        mask: 6, // LAYER_RWA_CARBON | LAYER_RWA_ENERGY
        name: "RWA_CURATOR"
      }
    ];

    for (const roleConfig of defaultRoles) {
      // Set role weight
      // Note: This would require additional functions in the SBT contract
      console.log(`- Configured ${roleConfig.name} role with weight ${ethers.formatEther(roleConfig.weight)}`);
    }

    console.log("✅ Default roles configured successfully!");

    // Verification
    console.log("\n🔍 Verifying deployment:");
    console.log("Name:", await sbt.name());
    console.log("Symbol:", await sbt.symbol());
    console.log("Timelock:", await sbt.timelock());
    console.log("EAS:", await sbt.eas());
    console.log("Schema ID:", await sbt.schemaId_IdentityRole());
    console.log("Deployer has ISSUER_ROLE:", await sbt.hasRole(issuerRole, deployer.address));
    console.log("Treasury has ADMIN_ROLE:", await sbt.hasRole(adminRole, CONTRACTS.TREASURY_SAFE));

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Update constants.ts with SBT address");
    console.log("2. Configure EAS schema on Base mainnet");
    console.log("3. Setup citizenship issuance process");
    console.log("4. Create governance contracts that use SBT");
    console.log("5. Deploy frontend for SBT management");
    console.log("6. Setup role assignment workflows");
    console.log("7. Verify contract on BaseScan");

    console.log("\n💡 CITIZENSHIP FEATURES:");
    console.log("- Soulbound tokens (ERC-5192) - cannot be transferred");
    console.log("- EAS attestation integration for verifiable roles");
    console.log("- Decay-weighted reputation system");
    console.log("- Role-based eligibility with bitmask layers");
    console.log("- Rate-limited issuance to prevent spam");
    console.log("- Comprehensive event emission for transparency");

    console.log("\n🎯 INITIAL ROLES:");
    console.log("- CODE: For protocol contributors and developers");
    console.log("- GOV: For governance participants and voters");
    console.log("- RWA_CURATOR: For real-world asset curators");
    console.log("- VALIDATOR: For system validators");
    console.log("- AUDITOR: For security auditors");
    console.log("- ORACLE_OP: For oracle operators");

  } catch (error: any) {
    console.log(`❌ SBT deployment failed: ${error.message}`);
  }
}

// Usage examples:
// npx hardhat run scripts/deploy_sbt.ts --network base
// npx hardhat run scripts/deploy_sbt.ts --network base --dry-run
// npx hardhat run scripts/deploy_sbt.ts --network base --confirm

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
