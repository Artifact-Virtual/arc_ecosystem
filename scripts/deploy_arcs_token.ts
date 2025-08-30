// scripts/deploy_arcs_token.ts
// Deployment script for ARCs Token (Staking derivative of ARCx)

import { ethers } from "hardhat";
import { CONTRACTS } from "./shared/constants";
import { displayScriptHeader, validateNetwork, checkEthBalance, printValidationResults } from "./shared/utils";

interface DeploymentOptions {
  confirm?: boolean;
  vaultAddress?: string;
  multisigAddress?: string;
}

async function main() {
  displayScriptHeader(
    "ARCs Token Deployment",
    "Deploy ARCs Token (ARCx Staking Derivative)"
  );

  // Parse command line arguments
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm");

  // Parse vault and multisig addresses from environment or args
  const vaultAddress = process.env.STAKING_VAULT_ADDRESS || CONTRACTS.ARC_STAKING_VAULT;
  const multisigAddress = process.env.MULTISIG_ADDRESS || CONTRACTS.TREASURY_SAFE; // Treasury is already a multisig

  console.log(`✅ Auto Confirm: ${confirm ? "ENABLED" : "DISABLED"}`);
  console.log(`🏦 Vault Address: ${vaultAddress}`);
  console.log(`🔐 Multisig Address: ${multisigAddress} (Treasury Safe - Multisig)`);

  // Validation
  const validationResults = [];

  // Network validation
  validationResults.push(await validateNetwork());

  // Signer validation
  const [deployer] = await ethers.getSigners();
  console.log(`\n🔐 Deployer: ${deployer.address}`);

  // Check network to determine required balance
  const network = await ethers.provider.getNetwork();
  const isTestnet = network.chainId === BigInt(84532); // Base Sepolia
  const requiredBalance = isTestnet ? "0.001" : "0.05"; // Lower requirement for testnet

  validationResults.push(await checkEthBalance(deployer.address, requiredBalance));

  const { criticalIssues } = printValidationResults(validationResults);

  if (criticalIssues > 0) {
    console.log("❌ Cannot proceed with critical issues.");
    return;
  }

  // Deploy ARCs Token
  await deployARCsToken(vaultAddress, multisigAddress);

  console.log("\n🎉 ARCs TOKEN DEPLOYMENT COMPLETE");
  console.log("==================================");
}

async function deployARCsToken(vaultAddress: string, multisigAddress: string) {
  console.log("\n🪙 ARCs TOKEN DEPLOYMENT");
  console.log("========================");

  // Get deployer signer
  const [deployer] = await ethers.getSigners();

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

  // Validate vault and multisig addresses
  if (!ethers.isAddress(vaultAddress)) {
    console.log("❌ CRITICAL ERROR: Invalid vault address!");
    console.log(`   Address: ${vaultAddress}`);
    return;
  }

  if (!ethers.isAddress(multisigAddress)) {
    console.log("❌ CRITICAL ERROR: Invalid multisig address!");
    console.log(`   Address: ${multisigAddress}`);
    return;
  }

  console.log("✅ Treasury Safe:", CONTRACTS.TREASURY_SAFE);
  console.log("✅ Ecosystem Safe:", CONTRACTS.ECOSYSTEM_SAFE);
  console.log("✅ Vault Address:", vaultAddress);
  console.log("✅ Multisig Address:", multisigAddress);

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

    // Initialize the token with admin and optional vault
    console.log("\n🔧 Initializing ARCs Token...");
    const initTx = await arcsToken.initialize(multisigAddress, vaultAddress);
    await initTx.wait();

    console.log("✅ ARCs Token initialized successfully!");
    console.log(`   Admin: ${multisigAddress} (Multisig)`);
    console.log(`   Vault: ${vaultAddress !== ethers.ZeroAddress ? vaultAddress : 'Deferred to post-deployment'}`);

    // Setup additional roles if vault was not provided during initialization
    if (vaultAddress === ethers.ZeroAddress) {
        console.log("\n👥 Setting up roles...");

        // Grant vault role to the staking vault contract (NOT treasury)
        const vaultRole = await arcsToken.VAULT_ROLE();
        const grantVaultTx = await arcsToken.grantRole(vaultRole, CONTRACTS.ARC_STAKING_VAULT);
        await grantVaultTx.wait();

        console.log("✅ Roles configured successfully!");
    } else {
        console.log("✅ Vault role granted during initialization");
    }

    // CRITICAL SECURITY: Ensure multisig has full control
    console.log("\n🔐 Verifying multisig control...");
    const defaultAdminRole = await arcsToken.DEFAULT_ADMIN_ROLE();
    const multisigHasAdmin = await arcsToken.hasRole(defaultAdminRole, multisigAddress);
    const deployerHasAdmin = await arcsToken.hasRole(defaultAdminRole, deployer.address);

    if (!multisigHasAdmin) {
        console.log("❌ Multisig does not have admin role - this is a security issue!");
        return;
    }

    if (deployerHasAdmin) {
        console.log("⚠️  Deployer still has admin role - revoke via multisig after deployment");
    } else {
        console.log("✅ Deployer admin role already revoked");
    }

    // Verification
    console.log("\n🔍 Verifying deployment:");
    console.log("Name:", await arcsToken.name());
    console.log("Symbol:", await arcsToken.symbol());

    // Get role constants
    const upgraderRole = await arcsToken.UPGRADER_ROLE();
    const vaultRole = await arcsToken.VAULT_ROLE();

    console.log("Multisig has DEFAULT_ADMIN_ROLE:", await arcsToken.hasRole(defaultAdminRole, multisigAddress));
    console.log("Ecosystem has UPGRADER_ROLE:", await arcsToken.hasRole(upgraderRole, CONTRACTS.ECOSYSTEM_SAFE));
    if (vaultAddress !== ethers.ZeroAddress) {
        console.log("Vault has VAULT_ROLE:", await arcsToken.hasRole(vaultRole, vaultAddress));
    } else {
        console.log("Vault role: Deferred to post-deployment");
    }
    console.log("Deployer has DEFAULT_ADMIN_ROLE:", await arcsToken.hasRole(defaultAdminRole, deployer.address));

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Update constants.ts with ARCs token address");
    console.log("2. Deploy staking vault contract (if not already deployed)");
    console.log("3. Setup initial liquidity");
    console.log("4. Verify contract on BaseScan");
    console.log("5. Update documentation");

    console.log("\n💡 USAGE:");
    console.log("- ARCs tokens are minted when users stake ARCx (by vault contract)");
    console.log("- ARCs tokens are burned when users unstake ARCx (by vault contract)");
    console.log("- Only the designated vault contract can mint/burn tokens");
    console.log("- Multisig controls all admin functions (upgrade, roles)");
    console.log("- Deployer has no admin privileges after deployment");

  } catch (error: unknown) {
    console.log(`❌ ARCs Token deployment failed: ${error}`);
  }
}

// Usage examples:
// Set environment variables:
// export STAKING_VAULT_ADDRESS="0x..."  # Your staking vault contract address
// export MULTISIG_ADDRESS="0x..."       # Your multisig safe address
//
// npx hardhat run scripts/deploy_arcs_token.ts --network base
// npx hardhat run scripts/deploy_arcs_token.ts --network base --confirm
//
// Or use command line arguments (future enhancement):
// npx hardhat run scripts/deploy_arcs_token.ts --network base --vault 0x... --multisig 0x...

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
