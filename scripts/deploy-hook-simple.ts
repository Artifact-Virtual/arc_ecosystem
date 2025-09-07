import { ethers } from "hardhat";

async function main() {
    console.log("🚀 Deploying ARCx Simple Hook...");
    
    const [deployer] = await ethers.getSigners();
    console.log("📍 Deployer:", deployer.address);
    
    // Deploy hook with fixed gas limit to avoid estimation
    const ARCxHook = await ethers.getContractFactory("ARCxHook");
    
    console.log("⏳ Deploying with fixed gas limit...");
    const hook = await ARCxHook.deploy({
        gasLimit: 2000000  // Fixed 2M gas limit to avoid estimation
    });
    
    console.log("⏳ Waiting for confirmation...");
    await hook.waitForDeployment();
    
    const address = await hook.getAddress();
    console.log("✅ ARCx Hook deployed at:", address);
    
    // Verify the deployment worked
    const owner = await hook.owner();
    const baseFee = await hook.BASE_FEE();
    const isPaused = await hook.paused();
    
    console.log("📊 Hook Details:");
    console.log("  - Address:", address);
    console.log("  - Owner:", owner);
    console.log("  - Base Fee:", baseFee.toString(), "bps (0.25%)");
    console.log("  - Paused:", isPaused);
    console.log("  - MEV Delay: 2 seconds");
    
    return {
        hook: address,
        owner: owner,
        baseFee: baseFee.toString(),
        paused: isPaused
    };
}

main()
    .then((result) => {
        console.log("\n🎉 DEPLOYMENT SUCCESS!");
        console.log("🔗 Hook Address:", result.hook);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error.message);
        process.exit(1);
    });
