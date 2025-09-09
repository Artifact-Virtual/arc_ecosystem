// Quick debug script for vesting contract ownership
const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 DEBUGGING VESTING CONTRACT OWNERSHIP");
    console.log("======================================");
    
    const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    const treasurySafe = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
    const tokenAddress = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    
    // Get current signer (who's trying to execute)
    const [signer] = await ethers.getSigners();
    console.log("Current signer:", signer.address);
    
    // Connect to contracts
    const vesting = await ethers.getContractAt("ARCxVestingContract", vestingAddress);
    const token = await ethers.getContractAt("ARCxV2Enhanced", tokenAddress);
    
    try {
        // Check vesting contract owner
        const owner = await vesting.owner();
        console.log("Vesting contract owner:", owner);
        console.log("Treasury Safe:", treasurySafe);
        console.log("Owner matches Treasury Safe:", owner.toLowerCase() === treasurySafe.toLowerCase());
        
        // Check if signer is the owner
        console.log("Current signer is owner:", owner.toLowerCase() === signer.address.toLowerCase());
        
        // Check token balances
        const treasuryBalance = await token.balanceOf(treasurySafe);
        const vestingBalance = await token.balanceOf(vestingAddress);
        
        console.log("\n📊 TOKEN BALANCES:");
        console.log("Treasury Safe balance:", ethers.formatEther(treasuryBalance), "ARCX2");
        console.log("Vesting contract balance:", ethers.formatEther(vestingBalance), "ARCX2");
        
        // Check allowance
        const allowance = await token.allowance(treasurySafe, vestingAddress);
        console.log("Treasury → Vesting allowance:", ethers.formatEther(allowance), "ARCX2");
        
        // Check if schedules already exist
        const treasury_beneficiary = "0x2b446CcB4c758c01C7D04a16E43758551F629102";
        const ecosystem_beneficiary = treasurySafe;
        
        console.log("\n🗓️ CHECKING EXISTING SCHEDULES:");
        try {
            const treasurySchedule = await vesting.vestingSchedules(treasury_beneficiary);
            console.log("Treasury beneficiary schedule exists:", treasurySchedule.totalAmount > 0);
            if (treasurySchedule.totalAmount > 0) {
                console.log("  Amount:", ethers.formatEther(treasurySchedule.totalAmount), "ARCX2");
            }
        } catch (e) {
            console.log("Treasury beneficiary schedule: NOT FOUND");
        }
        
        try {
            const ecosystemSchedule = await vesting.vestingSchedules(ecosystem_beneficiary);
            console.log("Ecosystem beneficiary schedule exists:", ecosystemSchedule.totalAmount > 0);
            if (ecosystemSchedule.totalAmount > 0) {
                console.log("  Amount:", ethers.formatEther(ecosystemSchedule.totalAmount), "ARCX2");
            }
        } catch (e) {
            console.log("Ecosystem beneficiary schedule: NOT FOUND");
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
    
    console.log("\n💡 RECOMMENDATIONS:");
    if (owner.toLowerCase() !== treasurySafe.toLowerCase()) {
        console.log("❌ PROBLEM: Vesting contract owner is NOT the Treasury Safe!");
        console.log("   Need to transfer ownership to Treasury Safe first");
    } else if (signer.address.toLowerCase() !== treasurySafe.toLowerCase()) {
        console.log("❌ PROBLEM: You're not executing from the Treasury Safe!");
        console.log("   Execute the JSON from the Treasury Safe, not the deployer wallet");
    } else {
        console.log("✅ Ownership looks correct. Check if schedules already exist.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
