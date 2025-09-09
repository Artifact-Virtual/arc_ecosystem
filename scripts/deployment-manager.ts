import { ethers, upgrades } from "hardhat";

async function deployInfrastructure() {
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

  const POOL_MANAGER = "0x0000000000000000000000000000000000000000"; // Placeholder
  const REWARD_DISTRIBUTOR = vestingAddress;

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

async function deployToken() {
  console.log("🚀 ARCx V2 Enhanced - PROPER Deployment");
  console.log("========================================");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  const V1_TOKEN = "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";

  console.log("\n📦 DEPLOYING WITH UPGRADES PLUGIN...");

  const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");

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

  console.log("\n🔧 VERIFYING INITIALIZATION:");
  console.log("Name:", await proxy.name());
  console.log("Symbol:", await proxy.symbol());
  console.log("Total Supply:", ethers.formatEther(await proxy.totalSupply()));

  console.log("\n💰 MINTING 1M TOKENS...");
  const mintTx = await proxy.mint(deployer.address, ethers.parseEther("1000000"));
  await mintTx.wait();

  console.log("Deployer Balance:", ethers.formatEther(await proxy.balanceOf(deployer.address)));

  console.log("\n🎉 PROPER DEPLOYMENT SUCCESS!");
  console.log("New Token Address:", proxyAddress);
  console.log("Ready for distribution and liquidity provisioning!");

  console.log("\n📝 UPDATE YOUR ADDRESS BOOK:");
  console.log("Replace old address with:", proxyAddress);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: npx hardhat run scripts/deployment-manager.ts --network <network> <command>");
    console.log("Commands:");
    console.log("  infrastructure - Deploy vesting, airdrop, and hook contracts");
    console.log("  token          - Deploy the ARCx V2 Enhanced token");
    return;
  }

  const command = args[0];
  switch (command) {
    case "infrastructure":
      await deployInfrastructure();
      break;
    case "token":
      await deployToken();
      break;
    default:
      console.log("Unknown command:", command);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
