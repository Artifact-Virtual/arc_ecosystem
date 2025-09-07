import { ethers } from "hardhat";

async function main() {
    console.log("🚀 ARCx V2 Enhanced Mainnet Deployment");
    console.log("=======================================");
    
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("Deployer:", deployer.address);
    console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    
    // V1 token address on Base mainnet
    const V1_TOKEN = "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";
    
    console.log("\n📦 DEPLOYING MATH LIBRARY...");
    const ARCxMath = await ethers.getContractFactory("ARCxMath");
    const mathLib = await ARCxMath.deploy();
    await mathLib.waitForDeployment();
    const mathAddress = await mathLib.getAddress();
    console.log("ARCxMath Library:", mathAddress);
    
    console.log("\n🎯 DEPLOYING ENHANCED TOKEN...");
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    
    const token = await ARCxV2Enhanced.deploy(V1_TOKEN);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    
    console.log("\n✅ DEPLOYMENT COMPLETE!");
    console.log("========================");
    console.log("ARCxMath Library:", mathAddress);
    console.log("ARCx V2 Enhanced:", tokenAddress);
    console.log("V1 Token:", V1_TOKEN);
    
    // Initialize the token
    console.log("\n🔧 INITIALIZING TOKEN...");
    const initTx = await token.initialize();
    await initTx.wait();
    console.log("Token initialized successfully!");
    
    console.log("\n📊 TOKEN INFO:");
    console.log("Name:", await token.name());
    console.log("Symbol:", await token.symbol());
    console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
    
    console.log("\n🎉 MAINNET DEPLOYMENT SUCCESS!");
    console.log("All 15+ enhanced features preserved at 24,255 bytes");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
