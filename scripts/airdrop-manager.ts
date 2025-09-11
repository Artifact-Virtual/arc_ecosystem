/* eslint-disable no-console */
import { ethers } from "hardhat";

// Core contract addresses
const ADDRESSES = {
  ARCX_TOKEN: "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437",
  AIRDROP_CONTRACT: "0x40fe447cf4B2af7aa41694a568d84F1065620298",
  TREASURY_SAFE: "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38"
};

async function checkAirdropStatus() {
  console.log("🎁 Airdrop Status Check");
  console.log("======================");

  try {
    const airdrop = await ethers.getContractAt("ARCxAirdropContract", ADDRESSES.AIRDROP_CONTRACT);
    const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);

    // Check contract state
    const owner = await airdrop.owner();
    const airdropBalance = await token.balanceOf(ADDRESSES.AIRDROP_CONTRACT);
    const totalAllocated = await airdrop.totalAllocated();
    const totalClaimed = await airdrop.totalClaimed();

    console.log(`Owner: ${owner}`);
    console.log(`Token Balance: ${ethers.formatEther(airdropBalance)} ARCx`);
    console.log(`Total Allocated: ${ethers.formatEther(totalAllocated)} ARCx`);
    console.log(`Total Claimed: ${ethers.formatEther(totalClaimed)} ARCx`);
    console.log(`Remaining: ${ethers.formatEther(totalAllocated - totalClaimed)} ARCx`);

    // Check if airdrop is active
    const isActive = await airdrop.airdropActive();
    console.log(`Airdrop Active: ${isActive}`);

    if (isActive) {
      const merkleRoot = await airdrop.merkleRoot();
      console.log(`Merkle Root: ${merkleRoot}`);
    }

  } catch (error) {
    console.log(`❌ Error checking airdrop status: ${(error as Error).message}`);
  }
}

async function setupAirdrop() {
  console.log("🚀 Setting Up Airdrop");
  console.log("====================");

  const [signer] = await ethers.getSigners();

  try {
    const airdrop = await ethers.getContractAt("ARCxAirdropContract", ADDRESSES.AIRDROP_CONTRACT);
    const token = await ethers.getContractAt("ARCxV2Enhanced", ADDRESSES.ARCX_TOKEN);

    // Check if we have permission to setup
    const owner = await airdrop.owner();
    if (owner !== signer.address) {
      console.log(`❌ Not authorized. Owner is: ${owner}`);
      return;
    }

    // Fund the airdrop contract
    const airdropAmount = ethers.parseEther("100000"); // 100k ARCx for airdrop
    console.log(`Funding airdrop with ${ethers.formatEther(airdropAmount)} ARCx...`);

    const transferTx = await token.transfer(ADDRESSES.AIRDROP_CONTRACT, airdropAmount);
    await transferTx.wait();
    console.log("✅ Airdrop funded");

    // Set up merkle root (placeholder - would need actual merkle root)
    const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
    console.log("Setting up merkle root...");

    const setupTx = await airdrop.setupAirdrop(merkleRoot, airdropAmount);
    await setupTx.wait();
    console.log("✅ Airdrop setup complete");

    // Activate airdrop
    const activateTx = await airdrop.setAirdropActive(true);
    await activateTx.wait();
    console.log("✅ Airdrop activated");

  } catch (error) {
    console.log(`❌ Error setting up airdrop: ${(error as Error).message}`);
  }
}

async function claimAirdrop() {
  console.log("🎁 Claiming Airdrop");
  console.log("===================");

  const [signer] = await ethers.getSigners();

  try {
    const airdrop = await ethers.getContractAt("ARCxAirdropContract", ADDRESSES.AIRDROP_CONTRACT);

    // Check if user is eligible
    const isEligible = await airdrop.isEligible(signer.address);
    if (!isEligible) {
      console.log("❌ Not eligible for airdrop");
      return;
    }

    // Check claim amount
    const claimAmount = await airdrop.getClaimAmount(signer.address);
    console.log(`Claim Amount: ${ethers.formatEther(claimAmount)} ARCx`);

    // Check if already claimed
    const hasClaimed = await airdrop.hasClaimed(signer.address);
    if (hasClaimed) {
      console.log("❌ Already claimed airdrop");
      return;
    }

    // Generate merkle proof (placeholder - would need actual proof)
    const proof: string[] = [];
    const claimTx = await airdrop.claim(proof);
    await claimTx.wait();

    console.log("✅ Airdrop claimed successfully");

  } catch (error) {
    console.log(`❌ Error claiming airdrop: ${(error as Error).message}`);
  }
}

async function emergencyWithdraw() {
  console.log("🚨 Emergency Airdrop Withdraw");
  console.log("=============================");

  const [signer] = await ethers.getSigners();

  try {
    const airdrop = await ethers.getContractAt("ARCxAirdropContract", ADDRESSES.AIRDROP_CONTRACT);

    // Check if we have permission
    const owner = await airdrop.owner();
    if (owner !== signer.address) {
      console.log(`❌ Not authorized. Owner is: ${owner}`);
      return;
    }

    const emergencyTx = await airdrop.emergencyWithdraw();
    await emergencyTx.wait();

    console.log("✅ Emergency withdrawal completed");

  } catch (error) {
    console.log(`❌ Error performing emergency withdrawal: ${(error as Error).message}`);
  }
}

async function generateMerkleTree() {
  console.log("🌳 Generating Merkle Tree");
  console.log("=========================");

  // This would generate a merkle tree for airdrop recipients
  // Placeholder implementation
  console.log("Merkle tree generation would happen here...");
  console.log("This would process a CSV of eligible addresses and amounts");
  console.log("Output would be merkle root and proofs for each recipient");

  // Example structure
  const recipients = [
    { address: "0x1234567890123456789012345678901234567890", amount: "1000" },
    { address: "0x0987654321098765432109876543210987654321", amount: "500" }
  ];

  console.log("Recipients:", recipients.length);
  console.log("Sample recipient:", recipients[0]);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("🎁 ARC Airdrop Manager");
    console.log("====================");
    console.log("");
    console.log("Usage: npx hardhat run scripts/airdrop-manager.ts --network <network> <command>");
    console.log("");
    console.log("Commands:");
    console.log("  status     - Check airdrop status");
    console.log("  setup      - Setup airdrop (owner only)");
    console.log("  claim      - Claim airdrop tokens");
    console.log("  withdraw   - Emergency withdraw (owner only)");
    console.log("  merkle     - Generate merkle tree");
    return;
  }

  const command = args[0];
  switch (command) {
    case "status":
      await checkAirdropStatus();
      break;
    case "setup":
      await setupAirdrop();
      break;
    case "claim":
      await claimAirdrop();
      break;
    case "withdraw":
      await emergencyWithdraw();
      break;
    case "merkle":
      await generateMerkleTree();
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
