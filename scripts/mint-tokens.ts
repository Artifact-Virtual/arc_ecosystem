import { ethers } from "hardhat";

async function main() {
    console.log("💰 ARCx V2 Enhanced Token Minting");
    console.log("==================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xCa244C6dbAfF0219d0E40ab7942037a11302af33";
    
    console.log("Deployer:", deployer.address);
    console.log("Token Contract:", tokenAddress);
    
    // Connect to the deployed token
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    try {
        // Check current status
        console.log("\n📊 CURRENT STATUS:");
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        
        // Check roles
        try {
            const hasAdminRole = await token.hasRole(await token.ADMIN_ROLE(), deployer.address);
            console.log("Has ADMIN_ROLE:", hasAdminRole);
            
            const hasDefaultAdminRole = await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), deployer.address);
            console.log("Has DEFAULT_ADMIN_ROLE:", hasDefaultAdminRole);
        } catch (e) {
            console.log("Could not check roles");
        }
        
        // Try to mint tokens
        console.log("\n💰 ATTEMPTING TO MINT 1M TOKENS...");
        
        const mintAmount = ethers.parseEther("1000000"); // 1M tokens
        const mintTx = await token.mint(deployer.address, mintAmount);
        console.log("Mint transaction:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Mint confirmed in block:", receipt?.blockNumber);
        
        // Verify mint
        console.log("\n✅ MINT VERIFICATION:");
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        
        console.log("\n🎉 MINTING COMPLETE!");
        console.log("Ready for distribution:");
        console.log("• 500k for Liquidity Pool");
        console.log("• 300k for Vesting (ecosystem + dev)");
        console.log("• 100k for Airdrop");
        console.log("• 100k for Marketing");
        
    } catch (error: any) {
        console.error("Error during minting:", error.message);
        
        // If we can't mint, let's see what we can do
        console.log("\n🔍 TROUBLESHOOTING...");
        try {
            // Check if we need to grant ourselves admin role
            const defaultAdmin = await token.DEFAULT_ADMIN_ROLE();
            const currentAdmin = await token.getRoleMember(defaultAdmin, 0);
            console.log("Current default admin:", currentAdmin);
            
            if (currentAdmin.toLowerCase() === deployer.address.toLowerCase()) {
                // We are admin, let's grant ourselves ADMIN_ROLE
                const grantTx = await token.grantRole(await token.ADMIN_ROLE(), deployer.address);
                await grantTx.wait();
                console.log("Granted ADMIN_ROLE to deployer");
                
                // Try minting again
                const mintTx = await token.mint(deployer.address, ethers.parseEther("1000000"));
                await mintTx.wait();
                console.log("Minting successful after role grant!");
            }
        } catch (troubleError: any) {
            console.error("Troubleshooting failed:", troubleError.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
