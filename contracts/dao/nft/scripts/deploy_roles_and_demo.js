// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1) Deploy TokenBoundAccountRegistry
  const TBRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
  const tbr = await TBRegistry.deploy();
  await tbr.deployed();

  // 2) Deploy ModelRegistry (upgradeable)
  const ModelRegistry = await ethers.getContractFactory("ModelRegistryUpgradeableSimple");
  const mr = await upgrades.deployProxy(ModelRegistry, [ethers.constants.AddressZero], {initializer: 'initialize'});
  await mr.deployed();

  // 3) Deploy EvolvingCompanion (upgradeable) - admin = deployer
  const Companion = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
  const comp = await upgrades.deployProxy(Companion, [tbr.address, deployer.address], {initializer: 'initialize'});
  await comp.deployed();

  // 4) Deploy TraitVault (upgradeable)
  const TraitVault = await ethers.getContractFactory("TraitVaultUpgradeable");
  const tv = await upgrades.deployProxy(TraitVault, ["https://api.example.com/metadata/{id}.json", comp.address, deployer.address], {initializer: 'initialize'});
  await tv.deployed();

  // 5) Deploy ModuleMock, passing companion address
  const ModuleMock = await ethers.getContractFactory("ModuleMock");
  const mm = await ModuleMock.deploy(comp.address);
  await mm.deployed();

  // 6) Grant roles to module mock
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
  const MODULE_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MODULE_ROLE"));

  // Grant MINTER_ROLE and MODULE_ROLE to module mock
  let tx = await comp.grantRole(MINTER_ROLE, mm.address);
  await tx.wait();

  tx = await comp.grantRole(MODULE_ROLE, mm.address);
  await tx.wait();
}

main().catch((_error) => {
  process.exit(1);
});
