import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Deploy the gas-optimized advanced hook
    const ARCxAdvancedHookFactory = await ethers.getContractFactory("ARCxAdvancedHook");
    const hook = await ARCxAdvancedHookFactory.deploy();
    await hook.waitForDeployment();
    
    const hookAddress = await hook.getAddress();
    
    // Set initial optimized configuration
    await hook.updateConfig(
        25,  // 0.25% base fee 
        75,  // 0.75% max fee
        2,   // 2 second MEV delay
        3    // Max 3 trades per block
    );
    
    // Enable all advanced features
    await hook.toggleFeatures(
        true,  // Dynamic fees enabled
        true,  // Anti-sandwich enabled
        false  // Not paused
    );
    
    return {
        hook: hookAddress,
        deployer: deployer.address
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        throw error;
    });
