import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    
    console.log("🔍 BALANCE CHECK");
    console.log("================");
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    
    const requiredGas = ethers.parseEther("0.12"); // ~120M gas at current prices
    if (balance < requiredGas) {
        console.log("❌ INSUFFICIENT FUNDS");
        console.log("Need:", ethers.formatEther(requiredGas), "ETH");
        console.log("Missing:", ethers.formatEther(requiredGas - balance), "ETH");
        console.log("\n🚰 GET TESTNET ETH:");
        console.log("https://faucet.quicknode.com/base/sepolia");
        console.log("https://www.alchemy.com/faucets/base-sepolia");
    } else {
        console.log("✅ SUFFICIENT FUNDS FOR DEPLOYMENT");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
