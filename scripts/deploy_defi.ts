import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MockPoolManager for ARCX Trading Bot");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name, "(Chain ID:", Number(network.chainId) + ")");
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Deploy MockPoolManager
  console.log("\n📦 Deploying MockPoolManager...");
  const MockPoolManager = await ethers.getContractFactory("MockPoolManager");
  const mockPoolManager = await MockPoolManager.deploy();
  await mockPoolManager.waitForDeployment();
  const poolManagerAddress = await mockPoolManager.getAddress();

  console.log("✅ MockPoolManager deployed at:", poolManagerAddress);

  // Deploy MockARCxToken
  console.log("\n📦 Deploying MockARCxToken...");
  const MockARCxToken = await ethers.getContractFactory("MockARCxToken");
  const initialSupply = ethers.parseEther("1000000"); // 1M tokens
  const mockARCxToken = await MockARCxToken.deploy(initialSupply);
  await mockARCxToken.waitForDeployment();
  const arcxTokenAddress = await mockARCxToken.getAddress();

  console.log("✅ MockARCxToken deployed at:", arcxTokenAddress);

  // Deploy MockWETH
  console.log("\n📦 Deploying MockWETH...");
  const MockWETH = await ethers.getContractFactory("MockWETH");
  const mockWETH = await MockWETH.deploy();
  await mockWETH.waitForDeployment();
  const wethAddress = await mockWETH.getAddress();

  console.log("✅ MockWETH deployed at:", wethAddress);

  // Update address.book
  const fs = require('fs');
  const path = require('path');

  const addressBookPath = path.join(__dirname, '..', 'address.book');
  const deploymentInfo = `\n## Testnet Deployment (Ganache - ${new Date().toISOString()})\n- MockPoolManager: ${poolManagerAddress} ✅ DEPLOYED\n- MockARCxToken: ${arcxTokenAddress} ✅ DEPLOYED\n- MockWETH: ${wethAddress} ✅ DEPLOYED\n`;

  fs.appendFileSync(addressBookPath, deploymentInfo);
  console.log("📝 Updated address.book with deployment info");

  console.log("\n🎉 Deployment Complete!");
  console.log("======================");
  console.log("MockPoolManager:", poolManagerAddress);
  console.log("Network: Ganache (Local Testnet)");
  console.log("Ready for ARCX trading bot testing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });