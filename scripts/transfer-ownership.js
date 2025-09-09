// Transfer vesting contract ownership to Treasury Safe
const { ethers } = require("hardhat");

async function main() {
    console.log("🔄 TRANSFERRING VESTING CONTRACT OWNERSHIP");
    console.log("==========================================");
    
    const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    const treasurySafe = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
    
    // Get current signer (should be deployer)
    const [signer] = await ethers.getSigners();
    console.log("Current signer:", signer.address);
    
    // Connect to vesting contract
    const vesting = await ethers.getContractAt("ARCxVestingContract", vestingAddress);
    
    try {
        // Check current owner
        const currentOwner = await vesting.owner();
        console.log("Current owner:", currentOwner);
        console.log("Target owner:", treasurySafe);
        
        if (currentOwner.toLowerCase() === treasurySafe.toLowerCase()) {
            console.log("✅ Ownership already transferred to Treasury Safe!");
            return;
        }
        
        if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
            console.log("❌ ERROR: You are not the current owner!");
            console.log("Current owner:", currentOwner);
            console.log("Your address:", signer.address);
            return;
        }
        
        console.log("📡 Transferring ownership to Treasury Safe...");
        
        // Transfer ownership
        const tx = await vesting.transferOwnership(treasurySafe);
        console.log("Transaction hash:", tx.hash);
        
        console.log("⏳ Waiting for confirmation...");
        const receipt = await tx.wait();
        
        console.log("✅ Transaction confirmed! Block:", receipt.blockNumber);
        
        // Verify ownership transfer
        const newOwner = await vesting.owner();
        console.log("New owner:", newOwner);
        
        if (newOwner.toLowerCase() === treasurySafe.toLowerCase()) {
            console.log("🎉 SUCCESS! Ownership transferred to Treasury Safe!");
        } else {
            console.log("❌ ERROR: Ownership transfer failed!");
        }
        
    } catch (error) {
        console.error("❌ Error transferring ownership:", error.message);
        if (error.message.includes("caller is not the owner")) {
            console.log("💡 Make sure you're running this from the current owner wallet");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
