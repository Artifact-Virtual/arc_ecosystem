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

async function monitorTokenSupply() {
  console.log("🪙 Token Supply Monitor");
  console.log("======================");

  try {
    const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);

    const totalSupply = await token.totalSupply();
    const maxSupply = await token.MAX_SUPPLY();
    const circulatingSupply = totalSupply; // For now, all minted tokens are circulating

    console.log(`Total Supply: ${ethers.formatEther(totalSupply)} ARCx`);
    console.log(`Max Supply: ${ethers.formatEther(maxSupply)} ARCx`);
    console.log(`Circulating: ${ethers.formatEther(circulatingSupply)} ARCx`);
    console.log(`Utilization: ${((Number(totalSupply) / Number(maxSupply)) * 100).toFixed(2)}%`);

    // Check major holders
    console.log("\n🏦 Major Holders:");
    const holders = [
      { name: "Treasury Safe", address: ADDRESSES.TREASURY_SAFE },
      { name: "Ecosystem Safe", address: ADDRESSES.ECOSYSTEM_SAFE },
      { name: "Vesting Contract", address: ADDRESSES.VESTING_CONTRACT },
      { name: "Airdrop Contract", address: ADDRESSES.AIRDROP_CONTRACT },
      { name: "Deployer Wallet", address: ADDRESSES.DEPLOYER_WALLET }
    ];

    for (const holder of holders) {
      const balance = await token.balanceOf(holder.address);
      if (balance > 0) {
        console.log(`  ${holder.name}: ${ethers.formatEther(balance)} ARCx`);
      }
    }

  } catch (error) {
    console.log(`❌ Error monitoring token supply: ${(error as Error).message}`);
  }
}

async function monitorVestingStatus() {
  console.log("⏰ Vesting Status Monitor");
  console.log("========================");

  try {
    const vesting = await ethers.getContractAt("ARCxVestingContract", ADDRESSES.VESTING_CONTRACT);
    const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);

    const vestingBalance = await token.balanceOf(ADDRESSES.VESTING_CONTRACT);
    console.log(`Vesting Contract Balance: ${ethers.formatEther(vestingBalance)} ARCx`);

    // Check beneficiaries
    const beneficiaries = [ADDRESSES.TREASURY_SAFE, ADDRESSES.ECOSYSTEM_SAFE];

    for (const beneficiary of beneficiaries) {
      try {
        const schedule = await vesting.vestingSchedules(beneficiary);
        if (schedule.totalAmount > 0) {
          const vestedAmount = await vesting.getVestedAmount(beneficiary);
          const claimableAmount = await vesting.getClaimableAmount(beneficiary);

          console.log(`\n${beneficiary === ADDRESSES.TREASURY_SAFE ? 'Treasury' : 'Ecosystem'} Vesting:`);
          console.log(`  Total: ${ethers.formatEther(schedule.totalAmount)} ARCx`);
          console.log(`  Vested: ${ethers.formatEther(vestedAmount)} ARCx`);
          console.log(`  Claimable: ${ethers.formatEther(claimableAmount)} ARCx`);
          console.log(`  Claimed: ${ethers.formatEther(schedule.amountClaimed)} ARCx`);
        }
      } catch (error) {
        console.log(`❌ Error checking ${beneficiary}: ${(error as Error).message}`);
      }
    }

  } catch (error) {
    console.log(`❌ Error monitoring vesting: ${(error as Error).message}`);
  }
}

async function monitorLiquidityPosition() {
  console.log("💰 Liquidity Position Monitor");
  console.log("============================");

  try {
    const positionManager = new ethers.Contract(
      ADDRESSES.POSITION_MANAGER,
      [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)"
      ],
      ethers.provider
    );

    const owner = await positionManager.ownerOf(ADDRESSES.MAIN_LP_POSITION);
    console.log(`Position ${ADDRESSES.MAIN_LP_POSITION} Owner: ${owner}`);

    if (owner === ADDRESSES.DEPLOYER_WALLET) {
      console.log("✅ Position owned by deployer wallet");
    } else if (owner === ADDRESSES.TREASURY_SAFE) {
      console.log("✅ Position owned by treasury safe");
    } else {
      console.log(`⚠️ Position owned by: ${owner}`);
    }

    console.log(`Uniswap URL: https://app.uniswap.org/positions/v4/base/${ADDRESSES.MAIN_LP_POSITION}`);

  } catch (error) {
    console.log(`❌ Error monitoring LP position: ${(error as Error).message}`);
  }
}

async function monitorSystemHealth() {
  console.log("🏥 System Health Monitor");
  console.log("=======================");

  const [signer] = await ethers.getSigners();
  console.log(`Monitor Account: ${signer.address}`);
  console.log(`ETH Balance: ${ethers.formatEther(await ethers.provider.getBalance(signer.address))}`);

  // Check contract accessibility
  const contracts = [
    { name: "ARCx Token", address: ADDRESSES.ARCX_TOKEN },
    { name: "Vesting Contract", address: ADDRESSES.VESTING_CONTRACT },
    { name: "Airdrop Contract", address: ADDRESSES.AIRDROP_CONTRACT },
    { name: "Uniswap Hook", address: ADDRESSES.UNISWAP_HOOK }
  ];

  console.log("\n🔍 Contract Accessibility:");
  for (const contract of contracts) {
    try {
      const code = await ethers.provider.getCode(contract.address);
      const isDeployed = code !== "0x";
      console.log(`  ${contract.name}: ${isDeployed ? '✅' : '❌'}`);
    } catch (error) {
      console.log(`  ${contract.name}: ❌ (${(error as Error).message})`);
    }
  }

  // Check Safe wallet balances
  console.log("\n🏦 Safe Wallet Balances:");
  const safes = [ADDRESSES.TREASURY_SAFE, ADDRESSES.ECOSYSTEM_SAFE];

  for (const safe of safes) {
    try {
      const ethBalance = await ethers.provider.getBalance(safe);
      const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);
      const arcxBalance = await token.balanceOf(safe);

      console.log(`  ${safe === ADDRESSES.TREASURY_SAFE ? 'Treasury' : 'Ecosystem'} Safe:`);
      console.log(`    ETH: ${ethers.formatEther(ethBalance)}`);
      console.log(`    ARCx: ${ethers.formatEther(arcxBalance)}`);
    } catch (error) {
      console.log(`  ${safe}: ❌ (${(error as Error).message})`);
    }
  }
}

async function generateReport() {
  console.log("📊 ARC Ecosystem Monitoring Report");
  console.log("===================================");
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log("");

  await monitorSystemHealth();
  console.log("");
  await monitorTokenSupply();
  console.log("");
  await monitorVestingStatus();
  console.log("");
  await monitorLiquidityPosition();
  console.log("");

  console.log("🎉 Monitoring Report Complete!");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("📊 ARC Ecosystem Monitor");
    console.log("========================");
    console.log("");
    console.log("Usage: npx hardhat run scripts/monitor.ts --network <network> <command>");
    console.log("");
    console.log("Commands:");
    console.log("  report     - Generate full monitoring report");
    console.log("  supply     - Monitor token supply and holders");
    console.log("  vesting    - Monitor vesting schedules");
    console.log("  liquidity  - Monitor liquidity position");
    console.log("  health     - Monitor system health");
    return;
  }

  const command = args[0];
  switch (command) {
    case "report":
      await generateReport();
      break;
    case "supply":
      await monitorTokenSupply();
      break;
    case "vesting":
      await monitorVestingStatus();
      break;
    case "liquidity":
      await monitorLiquidityPosition();
      break;
    case "health":
      await monitorSystemHealth();
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
