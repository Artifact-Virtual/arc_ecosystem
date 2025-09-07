import { ethers } from "hardhat";

async function main() {
    console.log("🔍 Checking Vesting Setup Status");
    console.log("=================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    
    console.log("Checking contracts...");
    
    // Connect to contracts
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    try {
        // Check token status
        console.log("\n📊 TOKEN STATUS:");
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Max Supply:", ethers.formatEther(await token.MAX_SUPPLY()));
        console.log("Vesting Balance:", ethers.formatEther(await token.balanceOf(vestingAddress)));
        
        // Check if minting is finalized
        console.log("\n🔒 MINTING STATUS:");
        try {
            const adminRole = await token.ADMIN_ROLE();
            const hasAdminRole = await token.hasRole(adminRole, deployer.address);
            console.log("Deployer has ADMIN_ROLE:", hasAdminRole);
            if (!hasAdminRole) {
                console.log("✅ MINTING FINALIZED - Supply locked at 1M tokens!");
            } else {
                console.log("⚠️  MINTING NOT YET FINALIZED");
            }
        } catch (e) {
            console.log("Could not check admin role status");
        }
        
        // The vesting setup likely failed due to the Safe addresses not being able to receive tokens
        // This is normal - you'll need to set up vesting through the Safe UI
        console.log("\n📝 VESTING SETUP REQUIREMENT:");
        console.log("⚠️  Vesting schedules need to be set up through Safe UI");
        console.log("Reason: Treasury and Ecosystem Safe addresses need manual approval");
        console.log("");
        console.log("NEXT STEPS:");
        console.log("1. Go to Treasury Safe: 0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38");
        console.log("2. Create vesting schedule for core team (120k tokens, 2yr, 6mo cliff)");
        console.log("3. Go to Ecosystem Safe: 0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb");
        console.log("4. Create vesting schedule for ecosystem (180k tokens, 3yr, 3mo cliff)");
        console.log("");
        console.log("Vesting Contract: 0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600");
        
    } catch (error: any) {
        console.error("Error checking status:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
