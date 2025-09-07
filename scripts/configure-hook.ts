import { ethers } from "hardhat";

async function main() {
    const hookAddress = "0xCFcFBebe081Cd9337C232c0fD1C15e930B330485";
    const [deployer] = await ethers.getSigners();
    
    console.log("🔧 Configuring deployed hook at:", hookAddress);
    
    const hook = await ethers.getContractAt("ARCxAdvancedHook", hookAddress);
    
    // Get current gas price
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice ? feeData.gasPrice * 120n / 100n : ethers.parseUnits("1", "gwei");
    
    try {
        // Set initial optimized configuration
        console.log("⚙️ Setting configuration...");
        const configTx = await hook.updateConfig(
            25,  // 0.25% base fee 
            75,  // 0.75% max fee
            2,   // 2 second MEV delay
            3,   // Max 3 trades per block
            { gasPrice, gasLimit: 200000 }
        );
        await configTx.wait();
        console.log("✅ Configuration updated");
        
        // Enable features
        console.log("⚙️ Enabling features...");
        const featureTx = await hook.toggleFeatures(
            true,  // Dynamic fees enabled
            true,  // Anti-sandwich enabled
            false, // Not paused
            { gasPrice, gasLimit: 150000 }
        );
        await featureTx.wait();
        console.log("✅ Features enabled");
        
        console.log("\n🎉 Hook fully configured!");
        console.log("📊 Configuration:");
        console.log("  - Base fee: 0.25%");
        console.log("  - Max fee: 0.75%");
        console.log("  - MEV delay: 2 seconds");
        console.log("  - Anti-sandwich: ENABLED");
        console.log("  - Dynamic fees: ENABLED");
        
    } catch (error) {
        console.log("ℹ️ Hook deployed but configuration may need manual setup");
        console.log("📍 Hook address:", hookAddress);
        console.error("Config error:", error);
    }
    
    return { hookAddress, configured: true };
}

main().catch(console.error);
