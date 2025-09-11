/* eslint-disable no-console */
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Core contract addresses
const ADDRESSES = {
  ARCX_TOKEN: "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437",
  VESTING_CONTRACT: "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600",
  AIRDROP_CONTRACT: "0x40fe447cf4B2af7aa41694a568d84F1065620298",
  UNISWAP_HOOK: "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0",
  TREASURY_SAFE: "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38",
  ECOSYSTEM_SAFE: "0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb",
  DEPLOYER_WALLET: "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B",
  // Uniswap V4
  POOL_MANAGER: "0x498581ff718922c3f8e6a244956af099b2652b2b",
  POSITION_MANAGER: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
  UNIVERSAL_ROUTER: "0x6ff5693b99212da76ad316178a184ab56d299b43",
  // Main LP Position
  MAIN_LP_POSITION: "242940"
};

async function generateEnvFile() {
  console.log("🔧 Generating Environment Configuration");
  console.log("=======================================");

  const envContent = `# ARC Ecosystem Environment Configuration
# Generated: ${new Date().toISOString()}

# Core Contracts
ARCX_TOKEN_ADDRESS=${ADDRESSES.ARCX_TOKEN}
VESTING_CONTRACT_ADDRESS=${ADDRESSES.VESTING_CONTRACT}
AIRDROP_CONTRACT_ADDRESS=${ADDRESSES.AIRDROP_CONTRACT}
UNISWAP_HOOK_ADDRESS=${ADDRESSES.UNISWAP_HOOK}

# Governance & Security
TREASURY_SAFE_ADDRESS=${ADDRESSES.TREASURY_SAFE}
ECOSYSTEM_SAFE_ADDRESS=${ADDRESSES.ECOSYSTEM_SAFE}
DEPLOYER_WALLET_ADDRESS=${ADDRESSES.DEPLOYER_WALLET}

# Uniswap V4 Infrastructure
UNISWAP_V4_POOL_MANAGER=${ADDRESSES.POOL_MANAGER}
UNISWAP_V4_POSITION_MANAGER=${ADDRESSES.POSITION_MANAGER}
UNISWAP_V4_UNIVERSAL_ROUTER=${ADDRESSES.UNIVERSAL_ROUTER}
MAIN_LP_POSITION_ID=${ADDRESSES.MAIN_LP_POSITION}

# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
BASESCAN_API_URL=https://api.basescan.org/api

# External Services
EAS_CONTRACT_ADDRESS=0x4200000000000000000000000000000000000021
WETH_BASE_ADDRESS=0x4200000000000000000000000000000000000006
USDC_BASE_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Script Configuration
DEFAULT_GAS_LIMIT=5000000
DEFAULT_GAS_PRICE=50000000
`;

  const envPath = path.join(process.cwd(), ".env.example");
  fs.writeFileSync(envPath, envContent);

  console.log(`✅ Environment file generated: ${envPath}`);
  console.log("Copy this to .env and fill in your private keys and API keys");
}

async function validateConfiguration() {
  console.log("🔍 Validating Configuration");
  console.log("===========================");

  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);

  if (network.chainId !== 8453n) {
    console.log("⚠️  Warning: Not connected to Base mainnet");
  }

  // Validate contract deployments
  console.log("\n🔍 Contract Validation:");
  const contracts = [
    { name: "ARCx Token", address: ADDRESSES.ARCX_TOKEN },
    { name: "Vesting Contract", address: ADDRESSES.VESTING_CONTRACT },
    { name: "Airdrop Contract", address: ADDRESSES.AIRDROP_CONTRACT },
    { name: "Uniswap Hook", address: ADDRESSES.UNISWAP_HOOK }
  ];

  for (const contract of contracts) {
    try {
      const code = await ethers.provider.getCode(contract.address);
      const isDeployed = code !== "0x";
      console.log(`  ${contract.name}: ${isDeployed ? '✅ Deployed' : '❌ Not Deployed'}`);
    } catch (error) {
      console.log(`  ${contract.name}: ❌ Error - ${(error as Error).message}`);
    }
  }

  // Validate Uniswap infrastructure
  console.log("\n🌊 Uniswap V4 Validation:");
  const uniswapContracts = [
    { name: "Pool Manager", address: ADDRESSES.POOL_MANAGER },
    { name: "Position Manager", address: ADDRESSES.POSITION_MANAGER },
    { name: "Universal Router", address: ADDRESSES.UNIVERSAL_ROUTER }
  ];

  for (const contract of uniswapContracts) {
    try {
      const code = await ethers.provider.getCode(contract.address);
      const isDeployed = code !== "0x";
      console.log(`  ${contract.name}: ${isDeployed ? '✅ Available' : '❌ Not Available'}`);
    } catch (error) {
      console.log(`  ${contract.name}: ❌ Error - ${(error as Error).message}`);
    }
  }

  // Validate LP position
  console.log("\n💰 LP Position Validation:");
  try {
    const positionManager = new ethers.Contract(
      ADDRESSES.POSITION_MANAGER,
      ["function ownerOf(uint256 tokenId) view returns (address)"],
      ethers.provider
    );

    const owner = await positionManager.ownerOf(ADDRESSES.MAIN_LP_POSITION);
    console.log(`  Position ${ADDRESSES.MAIN_LP_POSITION}: ${owner === ADDRESSES.DEPLOYER_WALLET ? '✅ Owned by Deployer' : `⚠️ Owned by ${owner}`}`);
  } catch (error) {
    console.log(`  LP Position: ❌ Error - ${(error as Error).message}`);
  }
}

async function updateConstantsFile() {
  console.log("📝 Updating Constants File");
  console.log("==========================");

  const constantsPath = path.join(process.cwd(), "scripts", "shared", "constants.ts");

  if (!fs.existsSync(constantsPath)) {
    console.log("❌ Constants file not found");
    return;
  }

  let constantsContent = fs.readFileSync(constantsPath, "utf8");

  // Update addresses in constants file
  const updates = [
    { pattern: /POOL_MANAGER: "[^"]*"/, replacement: `POOL_MANAGER: "${ADDRESSES.POOL_MANAGER}"` },
    { pattern: /POSITION_MANAGER: "[^"]*"/, replacement: `POSITION_MANAGER: "${ADDRESSES.POSITION_MANAGER}"` },
    { pattern: /UNIVERSAL_ROUTER: "[^"]*"/, replacement: `UNIVERSAL_ROUTER: "${ADDRESSES.UNIVERSAL_ROUTER}"` },
    { pattern: /ARCX_TOKEN: "[^"]*"/, replacement: `ARCX_TOKEN: "${ADDRESSES.ARCX_TOKEN}"` },
    { pattern: /VESTING_CONTRACT: "[^"]*"/, replacement: `VESTING_CONTRACT: "${ADDRESSES.VESTING_CONTRACT}"` },
    { pattern: /AIRDROP_CONTRACT: "[^"]*"/, replacement: `AIRDROP_CONTRACT: "${ADDRESSES.AIRDROP_CONTRACT}"` },
    { pattern: /TREASURY_SAFE: "[^"]*"/, replacement: `TREASURY_SAFE: "${ADDRESSES.TREASURY_SAFE}"` },
    { pattern: /ECOSYSTEM_SAFE: "[^"]*"/, replacement: `ECOSYSTEM_SAFE: "${ADDRESSES.ECOSYSTEM_SAFE}"` }
  ];

  for (const update of updates) {
    constantsContent = constantsContent.replace(new RegExp(update.pattern), update.replacement);
  }

  fs.writeFileSync(constantsPath, constantsContent);
  console.log("✅ Constants file updated");
}

async function showConfiguration() {
  console.log("📋 ARC Ecosystem Configuration");
  console.log("==============================");

  console.log("🪙 CORE CONTRACTS:");
  console.log(`   ARCx Token: ${ADDRESSES.ARCX_TOKEN}`);
  console.log(`   Vesting Contract: ${ADDRESSES.VESTING_CONTRACT}`);
  console.log(`   Airdrop Contract: ${ADDRESSES.AIRDROP_CONTRACT}`);
  console.log(`   Uniswap Hook: ${ADDRESSES.UNISWAP_HOOK}`);
  console.log("");

  console.log("🏦 GOVERNANCE:");
  console.log(`   Treasury Safe: ${ADDRESSES.TREASURY_SAFE}`);
  console.log(`   Ecosystem Safe: ${ADDRESSES.ECOSYSTEM_SAFE}`);
  console.log(`   Deployer Wallet: ${ADDRESSES.DEPLOYER_WALLET}`);
  console.log("");

  console.log("🌊 UNISWAP V4:");
  console.log(`   Pool Manager: ${ADDRESSES.POOL_MANAGER}`);
  console.log(`   Position Manager: ${ADDRESSES.POSITION_MANAGER}`);
  console.log(`   Universal Router: ${ADDRESSES.UNIVERSAL_ROUTER}`);
  console.log(`   Main LP Position: ${ADDRESSES.MAIN_LP_POSITION}`);
  console.log("");

  console.log("🔗 USEFUL LINKS:");
  console.log(`   BaseScan: https://basescan.org`);
  console.log(`   Uniswap: https://app.uniswap.org`);
  console.log(`   LP Position: https://app.uniswap.org/positions/v4/base/${ADDRESSES.MAIN_LP_POSITION}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("⚙️ ARC Configuration Manager");
    console.log("===========================");
    console.log("");
    console.log("Usage: npx hardhat run scripts/config.ts --network <network> <command>");
    console.log("");
    console.log("Commands:");
    console.log("  show       - Display current configuration");
    console.log("  validate   - Validate contract deployments");
    console.log("  env        - Generate .env.example file");
    console.log("  update     - Update constants file with current addresses");
    return;
  }

  const command = args[0];
  switch (command) {
    case "show":
      await showConfiguration();
      break;
    case "validate":
      await validateConfiguration();
      break;
    case "env":
      await generateEnvFile();
      break;
    case "update":
      await updateConstantsFile();
      break;
    default:
      console.log("Unknown command:", command);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
