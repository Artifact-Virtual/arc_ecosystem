// Simple ARCs Token Deployment Test
// scripts/test_deploy_arcs.ts

import { ethers } from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

async function main() {
  console.log("🚀 Testing ARCs Token Deployment on Local Network");
  console.log("=================================================");

  const [deployer] = await ethers.getSigners();
  console.log(`🔐 Deployer: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  // Deploy ARCs Token as upgradeable contract
  console.log("\n📋 Deploying ARCs Token (Upgradeable)...");
  const ARCsToken = await ethers.getContractFactory("ARCsToken");

  // Deploy as upgradeable proxy
  const arcsToken = await upgrades.deployProxy(ARCsToken, [deployer.address], {
    kind: 'uups',
    initializer: 'initialize'
  });

  await arcsToken.waitForDeployment();
  const arcsAddress = await arcsToken.getAddress();
  console.log(`✅ ARCs Token proxy deployed at: ${arcsAddress}`);

  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(arcsAddress);
  console.log(`📄 Implementation deployed at: ${implementationAddress}`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment:");
  console.log(`Name: ${await arcsToken.name()}`);
  console.log(`Symbol: ${await arcsToken.symbol()}`);
  console.log(`Total Supply: ${await arcsToken.totalSupply()}`);

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");

  // Grant VAULT_ROLE to deployer for testing
  const vaultRole = await arcsToken.VAULT_ROLE();
  await arcsToken.grantRole(vaultRole, deployer.address);
  console.log("✅ VAULT_ROLE granted to deployer");

  // Mint some tokens
  const mintAmount = ethers.parseEther("1000");
  await arcsToken.mint(deployer.address, mintAmount);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} ARCs tokens`);

  // Check balance
  const balance = await arcsToken.balanceOf(deployer.address);
  console.log(`💰 Deployer ARCs balance: ${ethers.formatEther(balance)}`);

  console.log("\n🎉 ARCs Token deployment test completed successfully!");
  console.log(`📄 Proxy Address: ${arcsAddress}`);
  console.log(`📄 Implementation Address: ${implementationAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
