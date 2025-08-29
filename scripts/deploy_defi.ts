// scripts/deploy_defi.ts
// Deployment script for DeFi contracts (Staking Vault, etc.)

import { ethers } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork, checkEthBalance, printValidationResults } from "./shared/utils";
import { isContractDeployed } from "./shared/utils";

interface DeploymentOptions {
  component: "staking" | "all";
  dryRun?: boolean;
  confirm?: boolean;
}

async function main() {
  displayScriptHeader(
    "ARC DeFi Deployment",
    "Deploy DeFi contracts for staking and liquidity"
  );

  // Parse command line arguments
  const args = process.argv.slice(2);
  const component = args[0] as DeploymentOptions["component"] || "all";
  const dryRun = args.includes("--dry-run");
  const confirm = args.includes("--confirm");

  console.log(`🎯 Deployment Mode: ${component.toUpperCase()}`);
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

  // Deploy components based on selection
  if (component === "staking" || component === "all") {
    await deployStakingVault(dryRun);
  }

  console.log("\n🎉 DeFi DEPLOYMENT COMPLETE");
  console.log("===========================");
}

async function deployStakingVault(dryRun: boolean) {
  console.log("\n🏦 STAKING VAULT DEPLOYMENT");
  console.log("============================");

  // CRITICAL: Check if ARCs token is deployed
  if (CONTRACTS.ARCS_TOKEN === CONTRACTS.NULL_ADDRESS) {
    console.log("❌ CRITICAL ERROR: ARCs token address not set in constants!");
    console.log("   Please deploy ARCs token first and update CONTRACTS.ARCS_TOKEN");
    console.log("   Run: npm run deploy:arcs");
    return;
  }

  // Validate ARCx token exists
  const arcxDeployed = await isContractDeployed(CONTRACTS.ARCX_TOKEN);
  if (!arcxDeployed) {
    console.log("❌ CRITICAL ERROR: ARCx token not found at specified address!");
    console.log(`   Address: ${CONTRACTS.ARCX_TOKEN}`);
    console.log("   Please verify ARCx token is deployed and address is correct");
    return;
  }

  // Validate ARCs token exists
  const arcsDeployed = await isContractDeployed(CONTRACTS.ARCS_TOKEN);
  if (!arcsDeployed) {
    console.log("❌ CRITICAL ERROR: ARCs token not found at specified address!");
    console.log(`   Address: ${CONTRACTS.ARCS_TOKEN}`);
    console.log("   Please verify ARCs token is deployed and address is correct");
    return;
  }

  console.log("✅ ARCx token validated at:", CONTRACTS.ARCX_TOKEN);
  console.log("✅ ARCs token validated at:", CONTRACTS.ARCS_TOKEN);

  // Validate critical addresses are valid Ethereum addresses
  if (!ethers.isAddress(CONTRACTS.TREASURY_SAFE)) {
    console.log("❌ CRITICAL ERROR: Invalid treasury safe address!");
    console.log(`   Address: ${CONTRACTS.TREASURY_SAFE}`);
    return;
  }

  console.log("✅ Treasury Safe:", CONTRACTS.TREASURY_SAFE);

  const vaultParams = {
    arcxToken: CONTRACTS.ARCX_TOKEN,
    arcsToken: CONTRACTS.ARCS_TOKEN,
    admin: CONTRACTS.TREASURY_SAFE,
    rewardRate: ethers.parseEther("0.001"), // 0.001 ARCs per second per ARCx staked
    lockDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    maxStakePerUser: ethers.parseEther("100000"), // 100k ARCx max per user
  };

  console.log("📋 Staking Vault Configuration:");
  console.log(`- ARCx Token: ${vaultParams.arcxToken}`);
  console.log(`- ARCs Token: ${vaultParams.arcsToken}`);
  console.log(`- Admin: ${vaultParams.admin}`);
  console.log(`- Reward Rate: ${ethers.formatEther(vaultParams.rewardRate)} ARCs/sec per ARCx`);
  console.log(`- Lock Duration: ${vaultParams.lockDuration / (24 * 60 * 60)} days`);
  console.log(`- Max Stake/User: ${ethers.formatEther(vaultParams.maxStakePerUser)} ARCx`);

  if (dryRun) {
    console.log("🧪 DRY RUN: Would deploy Staking Vault with above parameters");
    return;
  }

  try {
    console.log("\n🚀 Deploying ARCxStakingVault...");

    const ARCxStakingVault = await ethers.getContractFactory("ARCxStakingVault");

    const stakingVault = await ARCxStakingVault.deploy();
    await stakingVault.waitForDeployment();
    const vaultAddress = await stakingVault.getAddress();

    console.log("✅ Staking Vault deployed successfully!");
    console.log("Contract Address:", vaultAddress);

    // Initialize the vault
    console.log("\n🔧 Initializing Staking Vault...");
    const initTx = await stakingVault.initialize(
      vaultParams.arcxToken,
      vaultParams.arcsToken,
      vaultParams.admin
    );
    await initTx.wait();

    console.log("✅ Staking Vault initialized successfully!");

    // Configure staking parameters
    console.log("\n⚙️ Configuring staking parameters...");

    const updateRewardTx = await stakingVault.updateRewardRate(vaultParams.rewardRate);
    await updateRewardTx.wait();

    const updateLockTx = await stakingVault.updateLockDuration(vaultParams.lockDuration);
    await updateLockTx.wait();

    console.log("✅ Staking parameters configured successfully!");

    // Setup roles
    console.log("\n👥 Setting up roles...");

    // Grant operator role to ecosystem safe for operational management
    const operatorRole = await stakingVault.OPERATOR_ROLE();
    const grantOperatorTx = await stakingVault.grantRole(operatorRole, CONTRACTS.ECOSYSTEM_SAFE);
    await grantOperatorTx.wait();

    console.log("✅ Roles configured successfully!");

    // Verification
    console.log("\n🔍 Verifying deployment:");
    console.log("ARCx Token:", await stakingVault.arcxToken());
    console.log("ARCs Token:", await stakingVault.arcsToken());
    console.log("Reward Rate:", ethers.formatEther(await stakingVault.rewardRate()));
    console.log("Lock Duration:", (await stakingVault.lockDuration()).toString(), "seconds");
    console.log("Admin has ADMIN_ROLE:", await stakingVault.hasRole(await stakingVault.ADMIN_ROLE(), vaultParams.admin));

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Update constants.ts with staking vault address");
    console.log("2. Fund the vault with initial ARCs tokens for rewards");
    console.log("3. Setup frontend integration");
    console.log("4. Create staking dashboard");
    console.log("5. Verify contract on BaseScan");
    console.log("6. Setup monitoring and alerts");

    console.log("\n💡 STAKING MECHANICS:");
    console.log("- Users stake ARCx tokens to receive ARCs rewards");
    console.log("- Rewards are calculated continuously based on stake amount and time");
    console.log("- 7-day lock period prevents immediate unstaking");
    console.log("- Maximum 100k ARCx per user to ensure broad distribution");

  } catch (error: any) {
    console.log(`❌ Staking Vault deployment failed: ${error.message}`);
  }
}

// Usage examples:
// npx hardhat run scripts/deploy_defi.ts --network base staking
// npx hardhat run scripts/deploy_defi.ts --network base all --dry-run
// npx hardhat run scripts/deploy_defi.ts --network base all --confirm

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
  });
