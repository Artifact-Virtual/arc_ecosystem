/* eslint-disable no-console */
import { ethers } from "ethers";

const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
const POSITION_MANAGER = "0x7c5f5a4bbd8fd63184577525326123b519429bdc";
const TARGET_WALLET = "0x2b446CcB4c758c01C7D04a16E43758551F629102";

// Positions to transfer (the incorrect ones)
const POSITIONS_TO_TRANSFER = [242432, 90981, 134827];

async function transferPositions() {
  console.log("🔄 Transferring Uniswap V4 Positions...");
  console.log("From:", DEPLOYER_WALLET);
  console.log("To:", TARGET_WALLET);
  console.log("Position Manager:", POSITION_MANAGER);
  console.log("---");

  // This would need to be run with a signer that has access to the deployer wallet
  // For now, let's create the script structure

  console.log("\n📋 Positions to transfer:");
  POSITIONS_TO_TRANSFER.forEach(id => {
    console.log(`- Position ${id}: https://app.uniswap.org/positions/v4/base/${id}`);
  });

  console.log("\n⚠️  MANUAL TRANSFER REQUIRED");
  console.log("Since we don't have direct access to the deployer wallet private key,");
  console.log("please transfer these positions manually using a wallet interface:");
  console.log("");
  console.log("1. Connect to Uniswap with the deployer wallet");
  console.log("2. Go to each position URL above");
  console.log("3. Click 'Transfer' and send to:", TARGET_WALLET);
  console.log("");
  console.log("Or use the Position Manager contract directly:");
  console.log("- Contract:", POSITION_MANAGER);
  console.log("- Function: transferFrom(from, to, tokenId)");
  console.log("- From:", DEPLOYER_WALLET);
  console.log("- To:", TARGET_WALLET);

  POSITIONS_TO_TRANSFER.forEach(id => {
    console.log(`- Token ID: ${id}`);
  });
}

transferPositions();
