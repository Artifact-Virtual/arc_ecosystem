import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Deploy the simplified hook
    const ARCxSimpleHookFactory = await ethers.getContractFactory("ARCxSimpleHook");
    const hook = await ARCxSimpleHookFactory.deploy();
    await hook.waitForDeployment();
    
    const hookAddress = await hook.getAddress();
    
    // Set initial configuration
    await hook.updateConfig(
        25,  // 0.25% base fee 
        50,  // 0.5% max fee
        2    // 2 second MEV delay
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
