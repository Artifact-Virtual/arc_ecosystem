import { ethers } from "hardhat";

async function main() {
    console.log("🏗️ ARCx Infrastructure Deployment");
    console.log("===================================");
    
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("Deployer:", deployer.address);
    console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    
    const TOKEN_ADDRESS = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
    console.log("ARCx Token:", TOKEN_ADDRESS);
    
    console.log("\n📦 DEPLOYING VESTING CONTRACT...");
    console.log("=================================");
    
    const ARCxVestingContract = await ethers.getContractFactory("ARCxVestingContract");
    const vestingContract = await ARCxVestingContract.deploy(TOKEN_ADDRESS);
    await vestingContract.waitForDeployment();
    const vestingAddress = await vestingContract.getAddress();
    
    console.log("✅ Vesting Contract deployed:", vestingAddress);
    
    console.log("\n🎁 DEPLOYING AIRDROP CONTRACT...");
    console.log("=================================");
    
    const ARCxAirdropContract = await ethers.getContractFactory("ARCxAirdropContract");
    const airdropContract = await ARCxAirdropContract.deploy(TOKEN_ADDRESS);
    await airdropContract.waitForDeployment();
    const airdropAddress = await airdropContract.getAddress();
    
    console.log("✅ Airdrop Contract deployed:", airdropAddress);
    
    console.log("\n🔗 DEPLOYING UNISWAP V4 HOOK...");
    console.log("================================");
    
    // Note: These addresses need to be updated with actual Uniswap V4 contracts on Base
    const POOL_MANAGER = "0x0000000000000000000000000000000000000000"; // Placeholder
    const REWARD_DISTRIBUTOR = vestingAddress; // Use vesting contract as reward distributor
    
    const ARCxAdvancedHook = await ethers.getContractFactory("ARCxAdvancedHook");
    const hookContract = await ARCxAdvancedHook.deploy(
        TOKEN_ADDRESS,
        POOL_MANAGER,
        REWARD_DISTRIBUTOR
    );
    await hookContract.waitForDeployment();
    const hookAddress = await hookContract.getAddress();
    
    console.log("✅ Advanced Hook deployed:", hookAddress);
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("========================");
    console.log("ARCx Token:", TOKEN_ADDRESS);
    console.log("Vesting Contract:", vestingAddress);
    console.log("Airdrop Contract:", airdropAddress);
    console.log("Advanced Hook:", hookAddress);
    
    console.log("\n📝 ADDRESS BOOK UPDATE:");
    console.log("=======================");
    console.log(`- Vesting Contract: ${vestingAddress} ✅ DEPLOYED`);
    console.log(`- Airdrop Contract: ${airdropAddress} ✅ DEPLOYED`);
    console.log(`- Uniswap V4 Hook: ${hookAddress} ✅ DEPLOYED`);
    
    console.log("\n📋 NEXT STEPS:");
    console.log("==============");
    console.log("1. Update address.book with new contract addresses");
    console.log("2. Set up token permissions for minting/distribution");
    console.log("3. Create vesting schedules for team & ecosystem");
    console.log("4. Set up airdrop merkle trees");
    console.log("5. Deploy Uniswap V4 pool with hooks");
    console.log("6. Import token to wallet for LP provisioning");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
