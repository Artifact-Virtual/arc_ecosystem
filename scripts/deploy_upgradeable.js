// scripts/deploy_upgradeable.js
const { ethers, upgrades, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ModuleManager first (no dependencies)
  console.log("Deploying ModuleManager...");
  const ModuleManager = await ethers.getContractFactory("ModuleManager");
  const moduleManager = await upgrades.deployProxy(ModuleManager, [], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await moduleManager.deployed();
  console.log("ModuleManager deployed to:", moduleManager.address);

  // Deploy TokenBoundAccountRegistry
  console.log("Deploying TokenBoundAccountRegistry...");
  const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
  const registry = await upgrades.deployProxy(TokenBoundAccountRegistry, [], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await registry.deployed();
  console.log("TokenBoundAccountRegistry deployed to:", registry.address);

  // Deploy EvolvingCompanionUpgradeable
  console.log("Deploying EvolvingCompanionUpgradeable...");
  const EvolvingCompanionUpgradeable = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
  const companion = await upgrades.deployProxy(EvolvingCompanionUpgradeable, [registry.address], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await companion.deployed();
  console.log("EvolvingCompanionUpgradeable deployed to:", companion.address);

  // Deploy TraitVaultUpgradeable
  console.log("Deploying TraitVaultUpgradeable...");
  const TraitVaultUpgradeable = await ethers.getContractFactory("TraitVaultUpgradeable");
  const traitVault = await upgrades.deployProxy(TraitVaultUpgradeable, [companion.address, ""], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await traitVault.deployed();
  console.log("TraitVaultUpgradeable deployed to:", traitVault.address);

  // Deploy ModelRegistryUpgradeable
  console.log("Deploying ModelRegistryUpgradeable...");
  const ModelRegistryUpgradeable = await ethers.getContractFactory("ModelRegistryUpgradeable");
  const modelRegistry = await upgrades.deployProxy(ModelRegistryUpgradeable, [companion.address], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await modelRegistry.deployed();
  console.log("ModelRegistryUpgradeable deployed to:", modelRegistry.address);

  // Set up module relationships
  console.log("Setting up module relationships...");

  // Set ModuleManager in all contracts
  await companion.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in EvolvingCompanionUpgradeable");

  await traitVault.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in TraitVaultUpgradeable");

  await modelRegistry.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in ModelRegistryUpgradeable");

  // Register modules in ModuleManager
  await moduleManager.registerModule(companion.address);
  await moduleManager.registerModule(traitVault.address);
  await moduleManager.registerModule(modelRegistry.address);
  console.log("Modules registered in ModuleManager");

  // Authorize deployer as minter in TraitVault
  await traitVault.authorizeMinter(deployer.address, true);
  console.log("Deployer authorized as minter in TraitVault");

  // Authorize deployer as creator in ModelRegistry
  await modelRegistry.authorizeCreator(deployer.address, true);
  console.log("Deployer authorized as creator in ModelRegistry");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      ModuleManager: moduleManager.address,
      TokenBoundAccountRegistry: registry.address,
      EvolvingCompanionUpgradeable: companion.address,
      TraitVaultUpgradeable: traitVault.address,
      ModelRegistryUpgradeable: modelRegistry.address
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Etherscan if on mainnet/testnet
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n=== VERIFYING CONTRACTS ===");
    try {
      await hre.run("verify:verify", {
        address: moduleManager.address,
        constructorArguments: [],
      });
      console.log("ModuleManager verified");

      await hre.run("verify:verify", {
        address: registry.address,
        constructorArguments: [],
      });
      console.log("TokenBoundAccountRegistry verified");

      await hre.run("verify:verify", {
        address: companion.address,
        constructorArguments: [registry.address],
      });
      console.log("EvolvingCompanionUpgradeable verified");

      await hre.run("verify:verify", {
        address: traitVault.address,
        constructorArguments: [companion.address, ""],
      });
      console.log("TraitVaultUpgradeable verified");

      await hre.run("verify:verify", {
        address: modelRegistry.address,
        constructorArguments: [companion.address],
      });
      console.log("ModelRegistryUpgradeable verified");

    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ModuleManager first (no dependencies)
  console.log("Deploying ModuleManager...");
  const ModuleManager = await ethers.getContractFactory("ModuleManager");
  const moduleManager = await upgrades.deployProxy(ModuleManager, [], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await moduleManager.deployed();
  console.log("ModuleManager deployed to:", moduleManager.address);

  // Deploy TokenBoundAccountRegistry
  console.log("Deploying TokenBoundAccountRegistry...");
  const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
  const registry = await upgrades.deployProxy(TokenBoundAccountRegistry, [], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await registry.deployed();
  console.log("TokenBoundAccountRegistry deployed to:", registry.address);

  // Deploy EvolvingCompanionUpgradeable
  console.log("Deploying EvolvingCompanionUpgradeable...");
  const EvolvingCompanionUpgradeable = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
  const companion = await upgrades.deployProxy(EvolvingCompanionUpgradeable, [registry.address], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await companion.deployed();
  console.log("EvolvingCompanionUpgradeable deployed to:", companion.address);

  // Deploy TraitVaultUpgradeable
  console.log("Deploying TraitVaultUpgradeable...");
  const TraitVaultUpgradeable = await ethers.getContractFactory("TraitVaultUpgradeable");
  const traitVault = await upgrades.deployProxy(TraitVaultUpgradeable, [companion.address, ""], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await traitVault.deployed();
  console.log("TraitVaultUpgradeable deployed to:", traitVault.address);

  // Deploy ModelRegistryUpgradeable
  console.log("Deploying ModelRegistryUpgradeable...");
  const ModelRegistryUpgradeable = await ethers.getContractFactory("ModelRegistryUpgradeable");
  const modelRegistry = await upgrades.deployProxy(ModelRegistryUpgradeable, [companion.address], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await modelRegistry.deployed();
  console.log("ModelRegistryUpgradeable deployed to:", modelRegistry.address);

  // Set up module relationships
  console.log("Setting up module relationships...");

  // Set ModuleManager in all contracts
  await companion.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in EvolvingCompanionUpgradeable");

  await traitVault.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in TraitVaultUpgradeable");

  await modelRegistry.setModuleManager(moduleManager.address);
  console.log("ModuleManager set in ModelRegistryUpgradeable");

  // Register modules in ModuleManager
  await moduleManager.registerModule(companion.address);
  await moduleManager.registerModule(traitVault.address);
  await moduleManager.registerModule(modelRegistry.address);
  console.log("Modules registered in ModuleManager");

  // Authorize deployer as minter in TraitVault
  await traitVault.authorizeMinter(deployer.address, true);
  console.log("Deployer authorized as minter in TraitVault");

  // Authorize deployer as creator in ModelRegistry
  await modelRegistry.authorizeCreator(deployer.address, true);
  console.log("Deployer authorized as creator in ModelRegistry");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      ModuleManager: moduleManager.address,
      TokenBoundAccountRegistry: registry.address,
      EvolvingCompanionUpgradeable: companion.address,
      TraitVaultUpgradeable: traitVault.address,
      ModelRegistryUpgradeable: modelRegistry.address
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Etherscan if on mainnet/testnet
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n=== VERIFYING CONTRACTS ===");
    try {
      await hre.run("verify:verify", {
        address: moduleManager.address,
        constructorArguments: [],
      });
      console.log("ModuleManager verified");

      await hre.run("verify:verify", {
        address: registry.address,
        constructorArguments: [],
      });
      console.log("TokenBoundAccountRegistry verified");

      await hre.run("verify:verify", {
        address: companion.address,
        constructorArguments: [registry.address],
      });
      console.log("EvolvingCompanionUpgradeable verified");

      await hre.run("verify:verify", {
        address: traitVault.address,
        constructorArguments: [companion.address, ""],
      });
      console.log("TraitVaultUpgradeable verified");

      await hre.run("verify:verify", {
        address: modelRegistry.address,
        constructorArguments: [companion.address],
      });
      console.log("ModelRegistryUpgradeable verified");

    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
