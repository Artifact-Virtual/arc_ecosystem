import { ethers } from "hardhat";

async function main() {
    console.log("🔧 ARCx V2 Enhanced Token Initialization");
    console.log("=========================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xCa244C6dbAfF0219d0E40ab7942037a11302af33";
    
    console.log("Deployer:", deployer.address);
    console.log("Token Contract:", tokenAddress);
    
    // Connect to the deployed token
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    try {
        console.log("\n🚀 INITIALIZING TOKEN...");
        
        // Check if already initialized
        try {
            const name = await token.name();
            if (name && name.length > 0) {
                console.log("Token already initialized:", name);
                return;
            }
        } catch (e) {
            // Continue with initialization
        }
        
        // Initialize the token with proper configuration
        const initTx = await token.initialize(
            "ARCx V2 Enhanced", // name
            "ARCX2", // symbol
            deployer.address // admin
        );
        
        console.log("Initialization transaction:", initTx.hash);
        const receipt = await initTx.wait();
        console.log("Initialization confirmed in block:", receipt?.blockNumber);
        
        // Verify initialization
        console.log("\n✅ VERIFICATION:");
        console.log("Name:", await token.name());
        console.log("Symbol:", await token.symbol());
        console.log("Max Supply:", ethers.formatEther(await token.maxSupply()));
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        
        // Now mint initial supply to deployer
        console.log("\n💰 MINTING INITIAL SUPPLY...");
        const mintTx = await token.mint(deployer.address, ethers.parseEther("1000000"));
        console.log("Mint transaction:", mintTx.hash);
        await mintTx.wait();
        
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        
        console.log("\n🎉 TOKEN INITIALIZATION COMPLETE!");
        
    } catch (error: any) {
        console.error("Error during initialization:", error.message);
        
        // Try alternative initialization method
        console.log("\nTrying alternative initialization...");
        try {
            // Direct function call approach
            const data = token.interface.encodeFunctionData("initialize");
            const tx = await deployer.sendTransaction({
                to: tokenAddress,
                data: data
            });
            console.log("Alternative init tx:", tx.hash);
            await tx.wait();
        } catch (altError: any) {
            console.error("Alternative method failed:", altError.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
