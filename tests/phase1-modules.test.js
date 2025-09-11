// test/phase1-modules.test.js
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Phase 1: Module System Integration", function () {
  let deployer, user1, user2, module1, module2;
  let moduleManager, registry, companion, traitVault, modelRegistry;

  beforeEach(async function () {
    [deployer, user1, user2, module1, module2] = await ethers.getSigners();

    // Deploy ModuleManager
    const ModuleManager = await ethers.getContractFactory("ModuleManager");
    moduleManager = await upgrades.deployProxy(ModuleManager, [], {
      initializer: 'initialize',
      kind: 'uups'
    });

    // Deploy TokenBoundAccountRegistry
    const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
    registry = await upgrades.deployProxy(TokenBoundAccountRegistry, [], {
      initializer: 'initialize',
      kind: 'uups'
    });

    // Deploy EvolvingCompanionUpgradeable
    const EvolvingCompanionUpgradeable = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
    companion = await upgrades.deployProxy(EvolvingCompanionUpgradeable, [registry.address], {
      initializer: 'initialize',
      kind: 'uups'
    });

    // Deploy TraitVaultUpgradeable
    const TraitVaultUpgradeable = await ethers.getContractFactory("TraitVaultUpgradeable");
    traitVault = await upgrades.deployProxy(TraitVaultUpgradeable, [companion.address, ""], {
      initializer: 'initialize',
      kind: 'uups'
    });

    // Deploy ModelRegistryUpgradeable
    const ModelRegistryUpgradeable = await ethers.getContractFactory("ModelRegistryUpgradeable");
    modelRegistry = await upgrades.deployProxy(ModelRegistryUpgradeable, [companion.address], {
      initializer: 'initialize',
      kind: 'uups'
    });

    // Set up module relationships
    await companion.setModuleManager(moduleManager.address);
    await traitVault.setModuleManager(moduleManager.address);
    await modelRegistry.setModuleManager(moduleManager.address);

    // Register modules
    await moduleManager.registerModule(companion.address);
    await moduleManager.registerModule(traitVault.address);
    await moduleManager.registerModule(modelRegistry.address);

    // Authorize deployer
    await traitVault.authorizeMinter(deployer.address, true);
    await modelRegistry.authorizeCreator(deployer.address, true);
  });

  describe("ModuleManager", function () {
    it("Should register and validate modules", async function () {
      expect(await moduleManager.isModule(companion.address)).to.be.true;
      expect(await moduleManager.isModule(traitVault.address)).to.be.true;
      expect(await moduleManager.isModule(modelRegistry.address)).to.be.true;
      expect(await moduleManager.isModule(user1.address)).to.be.false;
    });

    it("Should allow owner to register new modules", async function () {
      await moduleManager.registerModule(module1.address);
      expect(await moduleManager.isModule(module1.address)).to.be.true;
    });

    it("Should prevent non-owner from registering modules", async function () {
      await expect(
        moduleManager.connect(user1).registerModule(module1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("EvolvingCompanionUpgradeable", function () {
    it("Should mint NFT with token-bound account", async function () {
      const uri = "ipfs://test-uri";
      const tx = await companion.mint(user1.address, uri);
      const receipt = await tx.wait();

      // Extract tokenId from event
      const event = receipt.events.find(e => e.event === 'MintWithAccount');
      const tokenId = event.args.tokenId;

      expect(await companion.ownerOf(tokenId)).to.equal(user1.address);
      expect(await companion.metadataURI(tokenId)).to.equal(uri);

      const account = await companion.getTokenBoundAccount(tokenId);
      expect(account).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should allow module to update XP", async function () {
      // Mint NFT first
      const tx = await companion.mint(user1.address, "ipfs://test");
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'MintWithAccount');
      const tokenId = event.args.tokenId;

      // Update XP via module
      await companion.gainXP(tokenId, 100);
      expect(await companion.xp(tokenId)).to.equal(100);
    });

    it("Should reject non-module XP updates", async function () {
      const tx = await companion.mint(user1.address, "ipfs://test");
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'MintWithAccount');
      const tokenId = event.args.tokenId;

      await expect(
        companion.connect(user1).gainXP(tokenId, 100)
      ).to.be.revertedWith("Not authorized module");
    });

    it("Should support batch XP updates", async function () {
      // Mint multiple NFTs
      const tx1 = await companion.mint(user1.address, "ipfs://test1");
      const receipt1 = await tx1.wait();
      const event1 = receipt1.events.find(e => e.event === 'MintWithAccount');
      const tokenId1 = event1.args.tokenId;

      const tx2 = await companion.mint(user2.address, "ipfs://test2");
      const receipt2 = await tx2.wait();
      const event2 = receipt2.events.find(e => e.event === 'MintWithAccount');
      const tokenId2 = event2.args.tokenId;

      // Batch update XP
      await companion.batchGainXP([tokenId1, tokenId2], [50, 75]);

      expect(await companion.xp(tokenId1)).to.equal(50);
      expect(await companion.xp(tokenId2)).to.equal(75);
    });
  });

  describe("TraitVaultUpgradeable", function () {
    let traitId;

    beforeEach(async function () {
      // Create a trait
      await traitVault.createTrait(1, "Test Trait", 1000, 50);
      traitId = 1;
    });

    it("Should create and validate traits", async function () {
      const traitInfo = await traitVault.getTraitInfo(traitId);
      expect(traitInfo.metadata).to.equal("Test Trait");
      expect(traitInfo.supply).to.equal(1000);
      expect(traitInfo.rarity).to.equal(50);
      expect(traitInfo.active).to.be.true;
    });

    it("Should mint traits with signature validation", async function () {
      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "uint256", "uint256"],
          [traitId, user1.address, 10, (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));

      await traitVault.mintTrait(traitId, user1.address, 10, signature);
      expect(await traitVault.balanceOf(user1.address, traitId)).to.equal(10);
    });

    it("Should prevent signature replay", async function () {
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp;
      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "uint256", "uint256"],
          [traitId, user1.address, 10, timestamp]
        )
      );
      const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));

      // First mint should succeed
      await traitVault.mintTrait(traitId, user1.address, 10, signature);

      // Second mint with same signature should fail
      await expect(
        traitVault.mintTrait(traitId, user1.address, 10, signature)
      ).to.be.revertedWith("Signature already used");
    });

    it("Should support custodian transfers", async function () {
      // Set custodian
      await traitVault.setTraitCustodian(traitId, user2.address);

      // Mint to user1
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp;
      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "uint256", "uint256"],
          [traitId, user1.address, 10, timestamp]
        )
      );
      const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));
      await traitVault.mintTrait(traitId, user1.address, 10, signature);

      // Transfer to custodian
      await traitVault.connect(user1).transferToCustodian(traitId, 5);
      expect(await traitVault.balanceOf(user1.address, traitId)).to.equal(5);
      expect(await traitVault.balanceOf(user2.address, traitId)).to.equal(5);
      expect(await traitVault.custodianBalance(user2.address, traitId)).to.equal(5);
    });
  });

  describe("ModelRegistryUpgradeable", function () {
    it("Should create models with dependencies", async function () {
      const name = "Test Model";
      const description = "A test AI model";
      const ipfsHash = "ipfs://QmTest";
      const dependencies = [];

      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          [name, ipfsHash, (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));

      const tx = await modelRegistry.createModel(name, description, ipfsHash, dependencies, signature);
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'ModelCreated');
      const modelId = event.args.modelId;

      const modelInfo = await modelRegistry.getModelInfo(modelId);
      expect(modelInfo.name).to.equal(name);
      expect(modelInfo.description).to.equal(description);
      expect(modelInfo.ipfsHash).to.equal(ipfsHash);
      expect(modelInfo.creator).to.equal(deployer.address);
    });

    it("Should support model dependencies (DAG)", async function () {
      // Create first model
      const messageHash1 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          ["Base Model", "ipfs://QmBase", (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature1 = await deployer.signMessage(ethers.utils.arrayify(messageHash1));

      const tx1 = await modelRegistry.createModel("Base Model", "Base", "ipfs://QmBase", [], signature1);
      const receipt1 = await tx1.wait();
      const event1 = receipt1.events.find(e => e.event === 'ModelCreated');
      const baseModelId = event1.args.modelId;

      // Create dependent model
      const messageHash2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          ["Advanced Model", "ipfs://QmAdvanced", (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature2 = await deployer.signMessage(ethers.utils.arrayify(messageHash2));

      const tx2 = await modelRegistry.createModel("Advanced Model", "Advanced", "ipfs://QmAdvanced", [baseModelId], signature2);
      const receipt2 = await tx2.wait();
      const event2 = receipt2.events.find(e => e.event === 'ModelCreated');
      const advancedModelId = event2.args.modelId;

      // Check DAG relationships
      const children = await modelRegistry.getModelChildren(baseModelId);
      const parents = await modelRegistry.getModelParents(advancedModelId);

      expect(children).to.include(advancedModelId);
      expect(parents).to.include(baseModelId);
    });

    it("Should support model versioning", async function () {
      // Create initial model
      const messageHash1 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          ["Versioned Model", "ipfs://QmV1", (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature1 = await deployer.signMessage(ethers.utils.arrayify(messageHash1));

      const tx = await modelRegistry.createModel("Versioned Model", "Test", "ipfs://QmV1", [], signature1);
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'ModelCreated');
      const modelId = event.args.modelId;

      // Update model
      const messageHash2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "string", "uint256"],
          [modelId, "ipfs://QmV2", (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const signature2 = await deployer.signMessage(ethers.utils.arrayify(messageHash2));

      await modelRegistry.updateModel(modelId, "ipfs://QmV2", "Version 2", signature2);

      const modelInfo = await modelRegistry.getModelInfo(modelId);
      expect(modelInfo.version).to.equal(2);
      expect(modelInfo.ipfsHash).to.equal("ipfs://QmV2");

      const versionInfo = await modelRegistry.getModelVersion(modelId, 2);
      expect(versionInfo.ipfsHash).to.equal("ipfs://QmV2");
      expect(versionInfo.changelog).to.equal("Version 2");
    });
  });

  describe("Integration Tests", function () {
    it("Should support full NFT evolution workflow", async function () {
      // 1. Mint NFT
      const tx = await companion.mint(user1.address, "ipfs://companion");
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'MintWithAccount');
      const tokenId = event.args.tokenId;

      // 2. Create trait
      await traitVault.createTrait(1, "Evolution Trait", 100, 80);

      // 3. Mint trait
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp;
      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "uint256", "uint256"],
          [1, user1.address, 1, timestamp]
        )
      );
      const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));
      await traitVault.mintTrait(1, user1.address, 1, signature);

      // 4. Gain XP through evolution
      await companion.gainXP(tokenId, 1000);

      // 5. Create evolution model
      const modelMessageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          ["Evolution AI", "ipfs://QmEvolution", (await ethers.provider.getBlock('latest')).timestamp]
        )
      );
      const modelSignature = await deployer.signMessage(ethers.utils.arrayify(modelMessageHash));
      await modelRegistry.createModel("Evolution AI", "Evolution model", "ipfs://QmEvolution", [], modelSignature);

      // Verify final state
      expect(await companion.xp(tokenId)).to.equal(1000);
      expect(await traitVault.balanceOf(user1.address, 1)).to.equal(1);
      expect(await modelRegistry.totalModels()).to.equal(1);
    });
  });
});
