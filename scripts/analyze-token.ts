import { ethers } from "hardhat";

async function main() {
    console.log("🔍 ARCx V2 Enhanced Token Analysis");
    console.log("===================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xCa244C6dbAfF0219d0E40ab7942037a11302af33";
    
    console.log("Deployer:", deployer.address);
    console.log("Token Contract:", tokenAddress);
    
    // Connect to the deployed token
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    try {
        console.log("\n📊 TOKEN STATUS:");
        console.log("Name:", await token.name());
        console.log("Symbol:", await token.symbol());
        console.log("Decimals:", await token.decimals());
        console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        
        // Check if we can mint
        console.log("\n🔧 PERMISSIONS CHECK:");
        try {
            const hasRole = await token.hasRole(await token.MINTER_ROLE(), deployer.address);
            console.log("Has Minter Role:", hasRole);
        } catch (e) {
            console.log("Minter role check not available - checking alternative methods");
        }
        
        // Check if token has owner/admin functions
        try {
            const owner = await token.owner();
            console.log("Owner:", owner);
        } catch (e) {
            console.log("No owner() function - checking for admin roles");
        }
        
        // Check configuration
        try {
            console.log("\n⚙️ TOKEN CONFIGURATION:");
            // This will help us understand the current state
            const config = await token.config();
            console.log("Base Yield Rate:", config.baseYieldRate.toString());
            console.log("Flash Loan Fee:", config.flashLoanFee.toString());
            console.log("Transfer Fee:", config.transferFee.toString());
            console.log("Max Supply:", ethers.formatEther(config.maxSupply));
        } catch (e) {
            console.log("Config not accessible - token may need initialization");
        }
        
    } catch (error) {
        console.error("Error analyzing token:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
