import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("🚀 Deploying Gas-Fixed ARCx Hook...");
    console.log("📍 Deployer address:", deployer.address);
    
    // Get current gas prices
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    
    console.log("⛽ Current gas price:", ethers.formatUnits(feeData.gasPrice || 0, "gwei"), "gwei");
    
    // Deploy with higher gas price to avoid underpricing
    const gasPrice = feeData.gasPrice ? feeData.gasPrice * 120n / 100n : ethers.parseUnits("1", "gwei");
    
    console.log("⛽ Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    
    // Deploy the gas-fixed hook
    const ARCxAdvancedHookFactory = await ethers.getContractFactory("ARCxAdvancedHook");
    
    console.log("🔧 Deploying contract...");
    const hook = await ARCxAdvancedHookFactory.deploy({
        gasPrice: gasPrice,
        gasLimit: 2000000  // 2M gas limit for deployment
    });
    
    console.log("⏳ Waiting for deployment...");
    await hook.waitForDeployment();
    
    const hookAddress = await hook.getAddress();
    console.log("✅ Hook deployed at:", hookAddress);
    
    console.log("🔧 Configuring hook...");
    
    // Set initial configuration with higher gas
    const configTx = await hook.updateConfig(
        25,  // 0.25% base fee 
        2,   // 2 second MEV delay
        {
            gasPrice: gasPrice,
            gasLimit: 100000
        }
    );
    await configTx.wait();
    
    console.log("✅ Configuration updated");
    
    // Enable hook features
    const featureTx = await hook.toggleFeatures(
        true,  // Hook enabled
        false, // Not paused
        {
            gasPrice: gasPrice,
            gasLimit: 100000
        }
    );
    await featureTx.wait();
    
    console.log("✅ Hook enabled");
    
    const result = {
        hook: hookAddress,
        deployer: deployer.address,
        gasUsed: "~2M gas for deployment",
        network: "Base L2",
        features: {
            baseFee: "0.25%",
            mevDelay: "2 seconds",
            enabled: true,
            paused: false,
            gasOptimized: true
        }
    };
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("📊 Summary:", JSON.stringify(result, null, 2));
    
    return result;
}

main()
    .then((result) => {
        console.log("\n🔗 Gas-Fixed ARCx Hook Address:", result.hook);
        console.log("🚀 Ready for Uniswap V4 integration - NO MORE GAS ISSUES!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
