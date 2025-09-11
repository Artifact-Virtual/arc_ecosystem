// scripts/upgrade.js - Example upgrade script for future versions
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading with", deployer.address);

  // Example: Upgrade EvolvingCompanion to V2
  const EvolvingCompanionV2 = await ethers.getContractFactory("EvolvingCompanionV2");

  // Get existing proxy address (from previous deployment)
  const companionProxyAddress = "0x..."; // Replace with actual proxy address

  console.log("Upgrading EvolvingCompanion...");
  const upgraded = await upgrades.upgradeProxy(companionProxyAddress, EvolvingCompanionV2);
  await upgraded.deployed();

  console.log("EvolvingCompanion upgraded to:", upgraded.address);

  // Example: Upgrade CompanionGovernance to V2
  const CompanionGovernanceV2 = await ethers.getContractFactory("CompanionGovernanceV2");

  const governanceProxyAddress = "0x..."; // Replace with actual proxy address

  console.log("Upgrading CompanionGovernance...");
  const governanceUpgraded = await upgrades.upgradeProxy(governanceProxyAddress, CompanionGovernanceV2);
  await governanceUpgraded.deployed();

  console.log("CompanionGovernance upgraded to:", governanceUpgraded.address);

  console.log("Upgrade complete! 🎉");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
