import { ethers } from "hardhat";

async function main() {
    console.log("🎯 ARCx V2 Token Status Check");
    console.log("==============================");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    // Connect to deployed ARCx V2 Enhanced contract
    const TOKEN_ADDRESS = "0xCa244C6dbAfF0219d0E40ab7942037a11302af33";
    const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS);
    
    console.log("\n📊 TOKEN STATUS:");
    console.log("=================");
    
    try {
        console.log("Name:", await token.name());
        console.log("Symbol:", await token.symbol());
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        
        // Try to mint 1M tokens if we can
        const TOTAL_TARGET = ethers.parseEther("1000000");
        const currentSupply = await token.totalSupply();
        
        if (currentSupply < TOTAL_TARGET) {
            const mintAmount = TOTAL_TARGET - currentSupply;
            console.log("\n🔧 MINTING TOKENS:");
            console.log("Need to mint:", ethers.formatEther(mintAmount));
            
            const mintTx = await token.mint(deployer.address, mintAmount);
            await mintTx.wait();
            console.log("✅ Minted tokens successfully!");
            
            console.log("New Total Supply:", ethers.formatEther(await token.totalSupply()));
            console.log("New Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        } else {
            console.log("✅ Target supply already reached");
        }
        
    } catch (error) {
        console.error("Error:", error.message);
        
        // Basic transfer test if minting fails
        try {
            console.log("\n🔄 CONTRACT IS BASIC ERC20 - CHECKING CAPABILITIES...");
            const balance = await token.balanceOf(deployer.address);
            console.log("Current balance:", ethers.formatEther(balance));
        } catch (e) {
            console.error("Contract may not be properly initialized");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
