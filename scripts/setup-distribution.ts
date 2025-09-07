import { ethers } from "hardhat";

async function main() {
    console.log("🎯 ARCx V2 Token Distribution Setup");
    console.log("==================================");
    
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("Deployer:", deployer.address);
    console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    
    // Connect to deployed ARCx V2 Enhanced contract
    const TOKEN_ADDRESS = "0xCa244C6dbAfF0219d0E40ab7942037a11302af33";
    const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS);
    
    console.log("\n📊 CURRENT TOKEN STATE:");
    console.log("=======================");
    console.log("Name:", await token.name());
    console.log("Symbol:", await token.symbol());
    console.log("Current Supply:", ethers.formatEther(await token.totalSupply()));
    console.log("Owner:", await token.owner());
    
    // Define distribution amounts (1M total)
    const TOTAL_SUPPLY = ethers.parseEther("1000000"); // 1M tokens
    const LIQUIDITY_AMOUNT = ethers.parseEther("500000"); // 50%
    const VESTING_AMOUNT = ethers.parseEther("300000");   // 30%
    const AIRDROP_AMOUNT = ethers.parseEther("100000");   // 10%
    const MARKETING_AMOUNT = ethers.parseEther("100000");  // 10%
    
    console.log("\n💎 TOKEN DISTRIBUTION PLAN:");
    console.log("============================");
    console.log("Total Supply:", ethers.formatEther(TOTAL_SUPPLY));
    console.log("Liquidity Pool:", ethers.formatEther(LIQUIDITY_AMOUNT), "(50%)");
    console.log("Vesting:", ethers.formatEther(VESTING_AMOUNT), "(30%)");
    console.log("Airdrop:", ethers.formatEther(AIRDROP_AMOUNT), "(10%)");
    console.log("Marketing:", ethers.formatEther(MARKETING_AMOUNT), "(10%)");
    
    // Check if we need to mint additional tokens
    const currentSupply = await token.totalSupply();
    console.log("\n🔧 MINTING SETUP:");
    console.log("==================");
    
    if (currentSupply < TOTAL_SUPPLY) {
        const mintAmount = TOTAL_SUPPLY - currentSupply;
        console.log("Need to mint:", ethers.formatEther(mintAmount), "additional tokens");
        
        // Mint remaining tokens to deployer
        const mintTx = await token.mint(deployer.address, mintAmount);
        await mintTx.wait();
        console.log("✅ Minted additional tokens to deployer");
    } else {
        console.log("✅ Sufficient tokens already minted");
    }
    
    // Finalize minting (no more tokens can ever be created)
    try {
        const finalizeTx = await token.finalizeMinting();
        await finalizeTx.wait();
        console.log("🔒 Minting finalized - no more tokens can be created");
    } catch (error) {
        console.log("ℹ️ Minting may already be finalized or function not available");
    }
    
    console.log("\n✅ TOKEN DISTRIBUTION READY!");
    console.log("==============================");
    console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
    console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
    
    console.log("\n📋 NEXT STEPS:");
    console.log("==============");
    console.log("1. Deploy vesting contracts");
    console.log("2. Deploy airdrop system");
    console.log("3. Create Uniswap V4 pool with hooks");
    console.log("4. Transfer tokens to respective contracts");
    
    console.log("\n🎉 SETUP COMPLETE!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
