/* eslint-disable no-console */
import { ethers } from "ethers";

const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
const POSITION_MANAGER = "0x7c5f5a4bbd8fd63184577525326123b519429bdc"; // Correct Uniswap V4 Position Manager
const ARCx_TOKEN = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const WETH = "0x4200000000000000000000000000000000000006";

async function checkDeployerNFTs() {
  console.log("🔍 Checking Deployer Wallet NFTs...");
  console.log("Deployer:", DEPLOYER_WALLET);
  console.log("Position Manager:", POSITION_MANAGER);
  console.log("---");

  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

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
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)"
      ],
      provider
    );

    const balanceNFT = await positionManager.balanceOf(DEPLOYER_WALLET);
    console.log("Uniswap V4 Position NFTs owned:", balanceNFT.toString());

    if (balanceNFT > 0) {
      console.log("\n📊 Position Details:");
      for (let i = 0; i < balanceNFT; i++) {
        try {
          const tokenId = await positionManager.tokenOfOwnerByIndex(DEPLOYER_WALLET, i);
          console.log(`\n🎯 Position ${tokenId.toString()}:`);
          
          // Check ownership
          const owner = await positionManager.ownerOf(tokenId);
          console.log(`  - Owner: ${owner}`);
          
          // Get token URI for metadata
          try {
            const tokenURI = await positionManager.tokenURI(tokenId);
            console.log(`  - Token URI: ${tokenURI}`);
          } catch (uriError) {
            console.log(`  - Token URI: Not available`);
          }
          
          // Check if this matches the user's mentioned positions
          const positionIds = [242432, 90981, 134827, 242940];
          if (positionIds.includes(Number(tokenId))) {
            console.log(`  ✅ *** THIS MATCHES USER'S LIST ***`);
          }
          
        } catch (error) {
          console.log(`  ❌ Error getting details for position ${i}:`, (error as Error).message);
        }
      }
    } else {
      console.log("❌ No Uniswap V4 positions found in deployer wallet");
    }

    // Check transaction count
    const txCount = await provider.getTransactionCount(DEPLOYER_WALLET);
    console.log("\n📈 Total transactions:", txCount);

    console.log("\n🔗 BaseScan Link:");
    console.log(`https://basescan.org/address/${DEPLOYER_WALLET}`);

  } catch (error) {
    console.error("Error checking deployer NFTs:", error);
  }
}

checkDeployerNFTs();
