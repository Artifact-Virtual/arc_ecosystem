import { ethers } from "hardhat";

async function main() {
    console.log("📊 ARCx V2 Enhanced Token Distribution");
    console.log("======================================");
    
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    
    console.log("Deployer:", deployer.address);
    console.log("Token Contract:", tokenAddress);
    
    // Connect to the properly deployed token
    const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
    const token = ARCxV2Enhanced.attach(tokenAddress);
    
    // Distribution wallets/contracts (you'll need to create these)
    const LIQUIDITY_POOL_WALLET = "0x0000000000000000000000000000000000000001"; // Placeholder
    const VESTING_CONTRACT = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
    const AIRDROP_CONTRACT = "0x40fe447cf4B2af7aa41694a568d84F1065620298";
    const MARKETING_WALLET = deployer.address; // For now, keep in deployer wallet
    
    try {
        // Check current balance
        const balance = await token.balanceOf(deployer.address);
        console.log("\n📊 CURRENT STATUS:");
        console.log("Deployer Balance:", ethers.formatEther(balance));
        
        if (balance < ethers.parseEther("1000000")) {
            console.log("❌ Insufficient tokens for distribution!");
            return;
        }
        
        console.log("\n💰 EXECUTING DISTRIBUTION PLAN:");
        console.log("Total: 1,000,000 ARCX2");
        console.log("• 50% (500k) → Liquidity Pool");
        console.log("• 30% (300k) → Vesting Contract");
        console.log("• 10% (100k) → Airdrop Contract");
        console.log("• 10% (100k) → Marketing Reserve");
        
        // Distribution amounts
        const liquidityAmount = ethers.parseEther("500000");   // 500k
        const vestingAmount = ethers.parseEther("300000");     // 300k
        const airdropAmount = ethers.parseEther("100000");     // 100k
        const marketingAmount = ethers.parseEther("100000");   // 100k
        
        // Execute transfers
        console.log("\n🚀 STARTING DISTRIBUTION...");
        
        // 1. Transfer to Vesting Contract
        console.log("📤 Transferring 300k to Vesting Contract...");
        const vestingTx = await token.transfer(VESTING_CONTRACT, vestingAmount);
        await vestingTx.wait();
        console.log("✅ Vesting transfer complete:", vestingTx.hash);
        
        // 2. Transfer to Airdrop Contract
        console.log("📤 Transferring 100k to Airdrop Contract...");
        const airdropTx = await token.transfer(AIRDROP_CONTRACT, airdropAmount);
        await airdropTx.wait();
        console.log("✅ Airdrop transfer complete:", airdropTx.hash);
        
        // 3. Liquidity and Marketing remain with deployer for now
        console.log("📤 500k for Liquidity + 100k for Marketing remaining in deployer wallet");
        console.log("   (Will be transferred when Uniswap V4 pool is ready)");
        
        // Verify distribution
        console.log("\n✅ DISTRIBUTION VERIFICATION:");
        console.log("Deployer Balance:", ethers.formatEther(await token.balanceOf(deployer.address)));
        console.log("Vesting Contract:", ethers.formatEther(await token.balanceOf(VESTING_CONTRACT)));
        console.log("Airdrop Contract:", ethers.formatEther(await token.balanceOf(AIRDROP_CONTRACT)));
        
        console.log("\n🎉 DISTRIBUTION COMPLETE!");
        console.log("Ready for next phase:");
        console.log("• Deploy Uniswap V4 Pool with hooks");
        console.log("• Set up vesting schedules");
        console.log("• Create airdrop merkle trees");
        
    } catch (error: any) {
        console.error("Error during distribution:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
