/* eslint-disable no-console */
import { ethers } from "hardhat";

const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
const POSITION_MANAGER = "0x7c5f5a4bbd8fd63184577525326123b519429bdc"; // Correct Uniswap V4 Position Manager

async function checkDeployerNFTs() {
  console.log("🔍 Checking Deployer Wallet NFTs...");
  console.log("Deployer:", DEPLOYER_WALLET);
  console.log("Position Manager:", POSITION_MANAGER);
  console.log("---");

  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org");

  try {
    // Check balance of the deployer wallet
    const balance = await provider.getBalance(DEPLOYER_WALLET);
    console.log("ETH Balance:", ethers.formatEther(balance));

    // Check if deployer owns any positions in the Position Manager
    const positionManager = new ethers.Contract(
      POSITION_MANAGER,
      [
        "function balanceOf(address owner) view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function positions(uint256 tokenId) view returns (uint128 liquidity, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 tokensOwed0, uint128 tokensOwed1)"
      ],
      provider
    );

    const balanceNFT = await positionManager.balanceOf(DEPLOYER_WALLET);
    console.log("Uniswap V4 Position NFTs owned:", balanceNFT.toString());

    if (balanceNFT > 0) {
      console.log("\n📊 Position Details:");
      for (let i = 0; i < balanceNFT; i++) {
        const tokenId = await positionManager.tokenOfOwnerByIndex(DEPLOYER_WALLET, i);
        const position = await positionManager.positions(tokenId);

        console.log(`Position ${tokenId.toString()}:`);
        console.log(`  - Liquidity: ${position.liquidity.toString()}`);
        console.log(`  - Token0: ${position.token0}`);
        console.log(`  - Token1: ${position.token1}`);
        console.log(`  - Fee: ${position.fee}`);
        console.log(`  - Tick Range: ${position.tickLower} to ${position.tickUpper}`);
        console.log(`  - Tokens Owed: ${position.tokensOwed0.toString()} / ${position.tokensOwed1.toString()}`);
        console.log("");
      }
    }

    // Check transaction history for any contract deployments
    console.log("🔍 Checking transaction count...");

    // Check recent transactions from deployer
    const txCount = await provider.getTransactionCount(DEPLOYER_WALLET);
    console.log("Total transactions:", txCount);

    console.log("\n� To get full transaction history, check BaseScan:");
    console.log(`https://basescan.org/address/${DEPLOYER_WALLET}`);

  } catch (error) {
    console.error("Error checking deployer NFTs:", error);
  }
}

checkDeployerNFTs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
