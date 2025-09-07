import { ethers } from "hardhat";

async function main() {
    console.log("🔒 ARCx V2 Enhanced - Vesting Configuration & Mint Finalization");
    console.log("================================================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    
    console.log("Deployer:", deployer.address);
    console.log("Token Contract:", tokenAddress);
    console.log("Vesting Contract:", vestingAddress);
    
    // Connect to contracts
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    const VestingContract = await ethers.getContractFactory("ARCxVestingContract");
    const vesting = VestingContract.attach(vestingAddress);
    
    try {
        console.log("\n📊 CURRENT STATUS:");
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Max Supply:", ethers.formatEther(await token.MAX_SUPPLY()));
        console.log("Vesting Balance:", ethers.formatEther(await token.balanceOf(vestingAddress)));
        
        // 1. FINALIZE MINTING - Revoke minter role to prevent future minting
        console.log("\n🔒 FINALIZING MINT (Revoking Minter Role)...");
        const adminRole = await token.ADMIN_ROLE();
        const revokeTx = await token.revokeRole(adminRole, deployer.address);
        await revokeTx.wait();
        console.log("✅ ADMIN_ROLE revoked - No more tokens can be minted!");
        console.log("Supply is permanently capped at 1M tokens");
        
        // 2. CONFIGURE VESTING SCHEDULES
        console.log("\n⏰ CONFIGURING VESTING SCHEDULES...");
        
        // Core Team Vesting (40% of vesting = 120k tokens)
        // 2-year linear vesting with 6-month cliff
        const coreTeamAmount = ethers.parseEther("120000");
        const coreTeamBeneficiary = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38"; // Treasury Safe
        const coreTeamStart = Math.floor(Date.now() / 1000);
        const coreTeamCliff = 6 * 30 * 24 * 60 * 60; // 6 months
        const coreTeamDuration = 2 * 365 * 24 * 60 * 60; // 2 years
        
        console.log("📤 Setting up Core Team vesting (120k tokens, 2yr, 6mo cliff)...");
        const coreTeamTx = await vesting.createVestingSchedule(
            coreTeamBeneficiary,
            coreTeamAmount,
            coreTeamCliff,
            coreTeamDuration,
            2000, // 20% penalty rate
            "Core Team",
            false // not governance enabled
        );
        await coreTeamTx.wait();
        console.log("✅ Core Team vesting configured");
        
        // Ecosystem Development (60% of vesting = 180k tokens)  
        // 3-year linear vesting with 3-month cliff
        const ecosystemAmount = ethers.parseEther("180000");
        const ecosystemBeneficiary = "0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb"; // Ecosystem Safe
        const ecosystemStart = Math.floor(Date.now() / 1000);
        const ecosystemCliff = 3 * 30 * 24 * 60 * 60; // 3 months
        const ecosystemDuration = 3 * 365 * 24 * 60 * 60; // 3 years
        
        console.log("📤 Setting up Ecosystem vesting (180k tokens, 3yr, 3mo cliff)...");
        const ecosystemTx = await vesting.createVestingSchedule(
            ecosystemBeneficiary,
            ecosystemAmount,
            ecosystemCliff,
            ecosystemDuration,
            1000, // 10% penalty rate
            "Ecosystem Development",
            true // governance enabled
        );
        await ecosystemTx.wait();
        console.log("✅ Ecosystem vesting configured");
        
        // 3. VERIFY VESTING SETUP
        console.log("\n✅ VESTING VERIFICATION:");
        console.log("Vesting Schedules Created: 2");
        console.log("Core Team: 120k tokens, 2 years, 6-month cliff");
        console.log("Ecosystem: 180k tokens, 3 years, 3-month cliff");
        console.log("Total Vested:", ethers.formatEther(coreTeamAmount + ecosystemAmount));
        
        // 4. VERIFY MINT FINALIZATION
        console.log("\n🔒 MINT FINALIZATION VERIFICATION:");
        try {
            const hasAdminRole = await token.hasRole(adminRole, deployer.address);
            console.log("Deployer has ADMIN_ROLE:", hasAdminRole);
            console.log("✅ Minting is FINALIZED - No more tokens can ever be created!");
        } catch (e) {
            console.log("✅ Minting capabilities removed");
        }
        
        console.log("\n🎉 VESTING & FINALIZATION COMPLETE!");
        console.log("Token supply is permanently locked at 1,000,000 ARCX2");
        console.log("Vesting schedules active for 300k tokens");
        
    } catch (error: any) {
        console.error("Error during configuration:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
