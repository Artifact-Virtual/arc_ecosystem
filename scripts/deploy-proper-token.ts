import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("🚀 ARCx V2 Enhanced - PROPER Deployment");
    console.log("========================================");
    
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("Deployer:", deployer.address);
    console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    
    // V1 token address on Base mainnet
    const V1_TOKEN = "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";
    
    console.log("\n📦 DEPLOYING WITH UPGRADES PLUGIN...");
    
    // Get the contract factory
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    
    // Deploy using OpenZeppelin upgrades plugin
    const proxy = await upgrades.deployProxy(
        ARCxV2Enhanced,
        [
            "ARCx V2 Enhanced",
            "ARCX2", 
            deployer.address
        ],
        {
            initializer: 'initialize',
            kind: 'uups',
            constructorArgs: [V1_TOKEN]
        }
    );
    
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();
    
    console.log("\n✅ PROXY DEPLOYMENT COMPLETE!");
    console.log("=========================");
    console.log("Proxy Address:", proxyAddress);
    
    // Verify initialization
    console.log("\n🔧 VERIFYING INITIALIZATION:");
    console.log("Name:", await proxy.name());
    console.log("Symbol:", await proxy.symbol());
    console.log("Total Supply:", ethers.formatEther(await proxy.totalSupply()));
    
    // Mint 1M tokens
    console.log("\n💰 MINTING 1M TOKENS...");
    const mintTx = await proxy.mint(deployer.address, ethers.parseEther("1000000"));
    await mintTx.wait();
    
    console.log("Deployer Balance:", ethers.formatEther(await proxy.balanceOf(deployer.address)));
    
    console.log("\n🎉 PROPER DEPLOYMENT SUCCESS!");
    console.log("New Token Address:", proxyAddress);
    console.log("Ready for distribution and liquidity provisioning!");
    
    // Update address book entry
    console.log("\n📝 UPDATE YOUR ADDRESS BOOK:");
    console.log("Replace old address with:", proxyAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
