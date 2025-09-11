/* eslint-disable no-console */
import { ethers } from "hardhat";

const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
const POSITION_MANAGER = "0x7c5f5a4bbd8fd63184577525326123b519429bdc"; // Correct Uniswap V4 Position Manager

async function checkUniswapPositions() {
  const [signer] = await ethers.getSigners();

  console.log("Checking Uniswap V4 positions for deployer wallet...");
  console.log("Deployer Wallet:", DEPLOYER_WALLET);
  console.log("Position Manager:", POSITION_MANAGER);

  try {
    // Get the Position Manager contract
    const positionManager = await ethers.getContractAt("IPositionManager", POSITION_MANAGER, signer);

    // Check if the contract has a balanceOf function (ERC721)
    const balance = await positionManager.balanceOf(DEPLOYER_WALLET);
    console.log(`\nPosition NFTs owned by deployer: ${balance.toString()}`);

    if (balance > 0) {
      console.log("\nPosition Token IDs:");
      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await positionManager.tokenOfOwnerByIndex(DEPLOYER_WALLET, i);
          console.log(`- Token ID: ${tokenId.toString()}`);

          // Try to get position info
          try {
            const position = await positionManager.positions(tokenId);
            console.log(`  Pool: ${position.pool}`);
            console.log(`  Owner: ${position.owner}`);
            console.log(`  Tick Lower: ${position.tickLower}`);
            console.log(`  Tick Upper: ${position.tickUpper}`);
            console.log(`  Liquidity: ${position.liquidity.toString()}`);
          } catch (posError: unknown) {
            console.log(`  Could not fetch position details: ${posError instanceof Error ? posError.message : String(posError)}`);
          }
        } catch (error: unknown) {
          console.log(`  Error getting token ${i}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    } else {
      console.log("\nNo Uniswap V4 position NFTs found in deployer wallet");
    }

    // Also check Treasury Safe
    const TREASURY_SAFE = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
    console.log(`\nChecking Treasury Safe: ${TREASURY_SAFE}`);
    const treasuryBalance = await positionManager.balanceOf(TREASURY_SAFE);
    console.log(`Position NFTs owned by Treasury Safe: ${treasuryBalance.toString()}`);

    if (treasuryBalance > 0) {
      console.log("\nTreasury Safe Position Token IDs:");
      for (let i = 0; i < treasuryBalance; i++) {
        try {
          const tokenId = await positionManager.tokenOfOwnerByIndex(TREASURY_SAFE, i);
          console.log(`- Token ID: ${tokenId.toString()}`);
        } catch (error: unknown) {
          console.log(`  Error getting token ${i}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

  } catch (error: unknown) {
    console.error("Error checking positions:", error instanceof Error ? error.message : String(error));

    // Try alternative approach - check if contract exists
    try {
      const code = await ethers.provider.getCode(POSITION_MANAGER);
      if (code === "0x") {
        console.log("Position Manager contract not found at this address");
      } else {
        console.log("Position Manager contract exists but interface might be different");
      }
    } catch (codeError: unknown) {
      console.log("Could not verify contract existence:", codeError instanceof Error ? codeError.message : String(codeError));
    }
  }
}

checkUniswapPositions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
