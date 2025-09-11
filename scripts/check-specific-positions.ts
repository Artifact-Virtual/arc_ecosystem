/* eslint-disable no-console */
import { ethers } from "ethers";

const POSITION_MANAGER = "0x7c5f5a4bbd8fd63184577525326123b519429bdc";
const ARCx_TOKEN = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const WETH = "0x4200000000000000000000000000000000000006";

const POSITION_IDS = [242432, 90981, 134827, 242940];

async function checkSpecificPositions() {
  console.log("🔍 Checking Specific Uniswap V4 Positions...");
  console.log("Position Manager:", POSITION_MANAGER);
  console.log("ARCx Token:", ARCx_TOKEN);
  console.log("WETH:", WETH);
  console.log("---");

  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

  try {
    const positionManager = new ethers.Contract(
      POSITION_MANAGER,
      [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)"
      ],
      provider
    );

    for (const positionId of POSITION_IDS) {
      console.log(`\n🎯 Checking Position ${positionId}:`);

      try {
        const owner = await positionManager.ownerOf(positionId);
        console.log(`  - Owner: ${owner}`);

        // Check if this is owned by deployer wallet
        const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
        if (owner.toLowerCase() === DEPLOYER_WALLET.toLowerCase()) {
          console.log(`  ✅ *** OWNED BY DEPLOYER WALLET ***`);
        }

        // Check if this is owned by treasury safe
        const TREASURY_SAFE = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
        if (owner.toLowerCase() === TREASURY_SAFE.toLowerCase()) {
          console.log(`  ✅ *** OWNED BY TREASURY SAFE ***`);
        }

        console.log(`  - Uniswap Link: https://app.uniswap.org/positions/v4/base/${positionId}`);

      } catch (error) {
        console.log(`  ❌ Error: ${(error as Error).message}`);
      }
    }

  } catch (error) {
    console.error("Error checking positions:", error);
  }
}

checkSpecificPositions();
