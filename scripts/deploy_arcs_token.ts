// scripts/deploy_arcs_token.ts
// Deployment script for ARCs Token (Staking derivative of ARCx)

import { ethers } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork, checkEthBalance, printValidationResults } from "./shared/utils";

interface DeploymentOptions {
  confirm?: boolean;
}

async function main() {
  displayScriptHeader(
    "ARCs Token Deployment",
    "Deploy ARCs Token (ARCx Staking Derivative)"
  );

  // Parse command line arguments
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm");

  console.log(`✅ Auto Confirm: ${confirm ? "ENABLED" : "DISABLED"}`);

  // Validation
  const validationResults = [];

  // Network validation
  validationResults.push(await validateNetwork());

  // Signer validation
  const [deployer] = await ethers.getSigners();
  console.log(`\n🔐 Deployer: ${deployer.address}`);

  // Check network to determine required balance
  const network = await ethers.provider.getNetwork();
  const isTestnet = network.chainId === 84532n; // Base Sepolia
  const requiredBalance = isTestnet ? "0.001" : "0.05"; // Lower requirement for testnet

  validationResults.push(await checkEthBalance(deployer.address, requiredBalance));

  const { criticalIssues } = printValidationResults(validationResults);

  if (criticalIssues > 0) {
    console.log("❌ Cannot proceed with critical issues.");
    return;
  }

  // Deploy ARCs Token
  await deployARCsToken();

  console.log("\n🎉 ARCs TOKEN DEPLOYMENT COMPLETE");
  console.log("==================================");
}

async function deployARCsToken() {
  console.log("\n🪙 ARCs TOKEN DEPLOYMENT");
  console.log("========================");

  // Validate critical addresses are valid Ethereum addresses
  if (!ethers.isAddress(CONTRACTS.TREASURY_SAFE)) {
    console.log("❌ CRITICAL ERROR: Invalid treasury safe address!");
    console.log(`   Address: ${CONTRACTS.TREASURY_SAFE}`);
    return;
  }

  if (!ethers.isAddress(CONTRACTS.ECOSYSTEM_SAFE)) {
    console.log("❌ CRITICAL ERROR: Invalid ecosystem safe address!");
    console.log(`   Address: ${CONTRACTS.ECOSYSTEM_SAFE}`);
    return;
  }

  console.log("✅ Treasury Safe:", CONTRACTS.TREASURY_SAFE);
  console.log("✅ Ecosystem Safe:", CONTRACTS.ECOSYSTEM_SAFE);

  const tokenParams = {
    admin: CONTRACTS.TREASURY_SAFE,
  };

  console.log("📋 Token Configuration:");
  console.log(`- Admin: ${tokenParams.admin}`);
  console.log("- Name: ARCx Staked");
  console.log("- Symbol: ARCs");

  try {
    console.log("\n🚀 Deploying ARCs Token...");

    const ARCsToken = await ethers.getContractFactory("ARCsToken");

    const arcsToken = await ARCsToken.deploy();
    await arcsToken.waitForDeployment();
    const arcsAddress = await arcsToken.getAddress();

    console.log("✅ ARCs Token deployed successfully!");
    console.log("Contract Address:", arcsAddress);

    // Initialize the token
    console.log("\n🔧 Initializing ARCs Token...");
    const initTx = await arcsToken.initialize(tokenParams.admin);
    await initTx.wait();

    console.log("✅ ARCs Token initialized successfully!");

    // Setup roles
    console.log("\n👥 Setting up roles...");

    // Grant vault role to treasury (for minting/burning staked tokens)
    const vaultRole = await arcsToken.VAULT_ROLE();
    const grantVaultTx = await arcsToken.grantRole(vaultRole, CONTRACTS.TREASURY_SAFE);
    await grantVaultTx.wait();

    // Grant upgrader role to ecosystem safe
    const upgraderRole = await arcsToken.UPGRADER_ROLE();
    const grantUpgraderTx = await arcsToken.grantRole(upgraderRole, CONTRACTS.ECOSYSTEM_SAFE);
    await grantUpgraderTx.wait();

    console.log("✅ Roles configured successfully!");

    // Verification
    console.log("\n🔍 Verifying deployment:");
    console.log("Name:", await arcsToken.name());
    console.log("Symbol:", await arcsToken.symbol());
    console.log("Admin has UPGRADER_ROLE:", await arcsToken.hasRole(upgraderRole, tokenParams.admin));
    console.log("Treasury has VAULT_ROLE:", await arcsToken.hasRole(vaultRole, CONTRACTS.TREASURY_SAFE));

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Update constants.ts with ARCs token address");
    console.log("2. Deploy staking vault contract");
    console.log("3. Setup initial liquidity");
    console.log("4. Verify contract on BaseScan");
    console.log("5. Update documentation");

    console.log("\n💡 USAGE:");
    console.log("- ARCs tokens are minted when users stake ARCx");
    console.log("- ARCs tokens are burned when users unstake ARCx");
    console.log("- Treasury can mint/burn for rewards and penalties");

  } catch (error: unknown) {
    console.log(`❌ ARCs Token deployment failed: ${error}`);
  }
}

// Usage examples:
// npx hardhat run scripts/deploy_arcs_token.ts --network base
// npx hardhat run scripts/deploy_arcs_token.ts --network base --dry-run
// npx hardhat run scripts/deploy_arcs_token.ts --network base --confirm

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
