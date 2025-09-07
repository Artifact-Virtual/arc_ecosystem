import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("🚀 Deploying ARCx Advanced Hook...");
    console.log("📍 Deployer address:", deployer.address);
    
    // Get current gas prices
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    
    console.log("⛽ Current gas price:", ethers.formatUnits(feeData.gasPrice || 0, "gwei"), "gwei");
    
    // Deploy with higher gas price to avoid underpricing
    const gasPrice = feeData.gasPrice ? feeData.gasPrice * 120n / 100n : ethers.parseUnits("1", "gwei");
    
    console.log("⛽ Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    
    // Deploy the gas-optimized advanced hook
    const ARCxAdvancedHookFactory = await ethers.getContractFactory("ARCxAdvancedHook");
    
    console.log("🔧 Deploying contract...");
    const hook = await ARCxAdvancedHookFactory.deploy({
        gasPrice: gasPrice,
        gasLimit: 5000000  // 5M gas limit for deployment
    });
    
    console.log("⏳ Waiting for deployment...");
    await hook.waitForDeployment();
    
    const hookAddress = await hook.getAddress();
    console.log("✅ Hook deployed at:", hookAddress);
    
    // Wait for a few confirmations before configuration
    console.log("⏳ Waiting for confirmations...");
    await provider.waitForTransaction(hook.deploymentTransaction()?.hash || "", 2);
    
    console.log("🔧 Configuring hook...");
    
    // Set initial optimized configuration with higher gas
    const configTx = await hook.updateConfig(
        25,  // 0.25% base fee 
        75,  // 0.75% max fee
        2,   // 2 second MEV delay
        3,   // Max 3 trades per block
        {
            gasPrice: gasPrice,
            gasLimit: 200000
        }
    );
    await configTx.wait();
    
    console.log("✅ Configuration updated");
    
    // Enable all advanced features
    const featureTx = await hook.toggleFeatures(
        true,  // Dynamic fees enabled
        true,  // Anti-sandwich enabled
        false, // Not paused
        {
            gasPrice: gasPrice,
            gasLimit: 150000
        }
    );
    await featureTx.wait();
    
    console.log("✅ Features enabled");
    
    const result = {
        hook: hookAddress,
        deployer: deployer.address,
        gasUsed: "~5M gas for deployment",
        network: "Base L2",
        features: {
            baseFee: "0.25%",
            maxFee: "0.75%", 
            mevDelay: "2 seconds",
            maxTradesPerBlock: 3,
            dynamicFees: true,
            antiSandwich: true,
            paused: false
        }
    };
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("📊 Summary:", JSON.stringify(result, null, 2));
    
    return result;
}

main()
    .then((result) => {
        console.log("\n🔗 ARCx Advanced Hook Address:", result.hook);
        console.log("🚀 Ready for Uniswap V4 integration!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
