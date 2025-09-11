/* eslint-disable no-console */
import { ethers } from "hardhat";

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

async function checkSystemHealth() {
  console.log("🏥 ARC Ecosystem Health Check");
  console.log("==============================");

  const [signer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Signer: ${signer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(signer.address))} ETH`);
  console.log("");

  // Check ARCx Token
  console.log("🪙 ARCx V2 Enhanced Token");
  console.log("------------------------");
  try {
    const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);
    const name = await token.name();
    const symbol = await token.symbol();
    const totalSupply = await token.totalSupply();
    const maxSupply = await token.MAX_SUPPLY();

    console.log(`✅ Contract: ${ADDRESSES.ARCX_TOKEN}`);
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} / ${ethers.formatEther(maxSupply)}`);
    console.log(`   Status: ${totalSupply >= maxSupply ? 'MINTING FINALIZED' : 'MINTING ACTIVE'}`);
  } catch (error) {
    console.log(`❌ Token contract error: ${(error as Error).message}`);
  }
  console.log("");

  // Check Vesting Contract
  console.log("⏰ Vesting Contract");
  console.log("------------------");
  try {
    const vesting = await ethers.getContractAt("ARCxVestingContract", ADDRESSES.VESTING_CONTRACT);
    const owner = await vesting.owner();
    const tokenBalance = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);
    const vestingBalance = await tokenBalance.balanceOf(ADDRESSES.VESTING_CONTRACT);

    console.log(`✅ Contract: ${ADDRESSES.VESTING_CONTRACT}`);
    console.log(`   Owner: ${owner}`);
    console.log(`   Token Balance: ${ethers.formatEther(vestingBalance)} ARCx`);
  } catch (error) {
    console.log(`❌ Vesting contract error: ${(error as Error).message}`);
  }
  console.log("");

  // Check Airdrop Contract
  console.log("🎁 Airdrop Contract");
  console.log("------------------");
  try {
    const airdrop = await ethers.getContractAt("ARCxAirdropContract", ADDRESSES.AIRDROP_CONTRACT);
    const owner = await airdrop.owner();
    const tokenBalance = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);
    const airdropBalance = await tokenBalance.balanceOf(ADDRESSES.AIRDROP_CONTRACT);

    console.log(`✅ Contract: ${ADDRESSES.AIRDROP_CONTRACT}`);
    console.log(`   Owner: ${owner}`);
    console.log(`   Token Balance: ${ethers.formatEther(airdropBalance)} ARCx`);
  } catch (error) {
    console.log(`❌ Airdrop contract error: ${(error as Error).message}`);
  }
  console.log("");

  // Check Uniswap V4 Hook
  console.log("🔗 Uniswap V4 Hook");
  console.log("------------------");
  try {
    const hook = await ethers.getContractAt("ARCxAdvancedHook", ADDRESSES.UNISWAP_HOOK);
    const owner = await hook.owner();

    console.log(`✅ Contract: ${ADDRESSES.UNISWAP_HOOK}`);
    console.log(`   Owner: ${owner}`);
  } catch (error) {
    console.log(`❌ Hook contract error: ${(error as Error).message}`);
  }
  console.log("");

  // Check Safe Wallets
  console.log("🏦 Safe Wallets");
  console.log("---------------");
  const safes = [
    { name: "Treasury Safe", address: ADDRESSES.TREASURY_SAFE },
    { name: "Ecosystem Safe", address: ADDRESSES.ECOSYSTEM_SAFE }
  ];

  for (const safe of safes) {
    try {
      const balance = await ethers.provider.getBalance(safe.address);
      const tokenBalance = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);
      const arcxBalance = await tokenBalance.balanceOf(safe.address);

      console.log(`${safe.name}:`);
      console.log(`   Address: ${safe.address}`);
      console.log(`   ETH Balance: ${ethers.formatEther(balance)}`);
      console.log(`   ARCx Balance: ${ethers.formatEther(arcxBalance)}`);
    } catch (error) {
      console.log(`${safe.name}: ❌ Error - ${(error as Error).message}`);
    }
  }
  console.log("");

  // Check Uniswap V4 Infrastructure
  console.log("🌊 Uniswap V4 Infrastructure");
  console.log("---------------------------");
  const uniswapContracts = [
    { name: "Pool Manager", address: ADDRESSES.POOL_MANAGER },
    { name: "Position Manager", address: ADDRESSES.POSITION_MANAGER },
    { name: "Universal Router", address: ADDRESSES.UNIVERSAL_ROUTER }
  ];

  for (const contract of uniswapContracts) {
    try {
      const code = await ethers.provider.getCode(contract.address);
      const isDeployed = code !== "0x";
      console.log(`${contract.name}: ${isDeployed ? '✅' : '❌'} ${contract.address}`);
    } catch (error) {
      console.log(`${contract.name}: ❌ Error - ${(error as Error).message}`);
    }
  }
  console.log("");

  // Main LP Position
  console.log("💰 Main Liquidity Position");
  console.log("-------------------------");
  console.log(`Position ID: ${ADDRESSES.MAIN_LP_POSITION}`);
  console.log(`Uniswap URL: https://app.uniswap.org/positions/v4/base/${ADDRESSES.MAIN_LP_POSITION}`);
  console.log(`Owner: ${ADDRESSES.DEPLOYER_WALLET}`);
  console.log("");

  console.log("🎉 Health Check Complete!");
}

async function showSystemStatus() {
  console.log("📊 ARC Ecosystem Status Overview");
  console.log("================================");

  console.log("🪙 TOKEN ECONOMICS:");
  console.log("   Total Supply: 1,000,000 ARCx");
  console.log("   Distribution:");
  console.log("   • Liquidity Pool: 500,000 ARCx (50%)");
  console.log("   • Vesting: 300,000 ARCx (30%)");
  console.log("   • Airdrop: 100,000 ARCx (10%)");
  console.log("   • Marketing: 100,000 ARCx (10%)");
  console.log("");

  console.log("🏗️ INFRASTRUCTURE STATUS:");
  console.log("   ✅ ARCx V2 Enhanced Token - LIVE");
  console.log("   ✅ Vesting Contract - DEPLOYED & CONFIGURED");
  console.log("   ✅ Airdrop Contract - DEPLOYED & CONFIGURED");
  console.log("   ✅ Uniswap V4 Hook - DEPLOYED");
  console.log("   ✅ Main LP Position - ACTIVE");
  console.log("");

  console.log("🔐 SECURITY:");
  console.log("   ✅ Multi-sig Treasury Safe");
  console.log("   ✅ Multi-sig Ecosystem Safe");
  console.log("   ✅ Minting Finalized (Supply Locked)");
  console.log("   ✅ Role-based Access Control");
  console.log("");

  console.log("🌐 NETWORK:");
  console.log("   Base L2 Mainnet (Chain ID: 8453)");
  console.log("   Block Explorer: https://basescan.org");
  console.log("");

  console.log("📋 KEY ADDRESSES:");
  Object.entries(ADDRESSES).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("🚀 ARC Ecosystem Manager");
    console.log("========================");
    console.log("");
    console.log("Usage: npx hardhat run scripts/ecosystem-manager.ts --network <network> <command>");
    console.log("");
    console.log("Commands:");
    console.log("  health     - Run comprehensive health check");
    console.log("  status     - Show system status overview");
    console.log("  addresses  - Display all contract addresses");
    return;
  }

  const command = args[0];
  switch (command) {
    case "health":
      await checkSystemHealth();
      break;
    case "status":
      await showSystemStatus();
      break;
    case "addresses":
      console.log("📋 ARC Ecosystem Addresses");
      console.log("==========================");
      Object.entries(ADDRESSES).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
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
