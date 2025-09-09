// Transfer tokens from vesting contract to Treasury Safe
const { ethers } = require("hardhat");

async function main() {
    console.log("💰 TRANSFERRING TOKENS FROM VESTING TO TREASURY SAFE");
    console.log("====================================================");
    
    const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    const treasurySafe = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
    const tokenAddress = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    
    // Get current signer
    const [signer] = await ethers.getSigners();
    console.log("Current signer:", signer.address);
    
    // Connect to contracts
    const vesting = await ethers.getContractAt("ARCxVestingContract", vestingAddress);
    const token = await ethers.getContractAt("ARCxV2Enhanced", tokenAddress);
    
    try {
        // Check current balances
        const vestingBalance = await token.balanceOf(vestingAddress);
        const treasuryBalance = await token.balanceOf(treasurySafe);
        
        console.log("📊 CURRENT BALANCES:");
        console.log("Vesting contract balance:", ethers.formatEther(vestingBalance), "ARCX2");
        console.log("Treasury Safe balance:", ethers.formatEther(treasuryBalance), "ARCX2");
        
        if (vestingBalance == 0) {
            console.log("❌ No tokens in vesting contract to transfer!");
            return;
        }
        
        // Check if we can do emergency withdraw
        const owner = await vesting.owner();
        console.log("Vesting contract owner:", owner);
        
        if (owner.toLowerCase() !== signer.address.toLowerCase()) {
            console.log("❌ ERROR: You are not the owner of the vesting contract!");
            console.log("Owner:", owner);
            console.log("Your address:", signer.address);
            console.log("💡 You need to run this from the Treasury Safe or set emergency mode first");
            return;
        }
        
        console.log("🚨 Setting emergency mode...");
        let tx = await vesting.setEmergencyMode(true);
        await tx.wait();
        
        console.log("💸 Emergency withdrawing tokens...");
        tx = await vesting.emergencyWithdraw();
        let receipt = await tx.wait();
        
        console.log("✅ Emergency withdrawal completed! Block:", receipt.blockNumber);
        
        console.log("🔄 Disabling emergency mode...");
        tx = await vesting.setEmergencyMode(false);
        await tx.wait();
        
        // Check final balances
        const finalVestingBalance = await token.balanceOf(vestingAddress);
        const finalTreasuryBalance = await token.balanceOf(treasurySafe);
        
        console.log("📊 FINAL BALANCES:");
        console.log("Vesting contract balance:", ethers.formatEther(finalVestingBalance), "ARCX2");
        console.log("Treasury Safe balance:", ethers.formatEther(finalTreasuryBalance), "ARCX2");
        
        console.log("🎉 SUCCESS! Tokens transferred to Treasury Safe!");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.message.includes("caller is not the owner")) {
            console.log("💡 Make sure you're running this from the Treasury Safe wallet");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
