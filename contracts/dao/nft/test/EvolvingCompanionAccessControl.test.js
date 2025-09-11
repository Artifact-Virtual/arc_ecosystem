const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EvolvingCompanionUpgradeable with AccessControl", function () {
  let deployer, alice, bob, moduleMock;
  let companion, traitVault, mock;
  let MINTER_ROLE, MODULE_ROLE, DEFAULT_ADMIN_ROLE;

  beforeEach(async function () {
    [deployer, alice, bob, moduleMock] = await ethers.getSigners();

    // Deploy TokenBoundAccountRegistry
    const TBRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
    const tbr = await TBRegistry.deploy();

    // Deploy EvolvingCompanion
    const Companion = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
    companion = await upgrades.deployProxy(Companion, [tbr.address, deployer.address], {initializer: 'initialize'});

    // Deploy TraitVault
    const TraitVault = await ethers.getContractFactory("TraitVaultUpgradeable");
    traitVault = await upgrades.deployProxy(TraitVault, ["https://example.com/metadata/{id}.json", companion.address, deployer.address], {initializer: 'initialize'});

    // Deploy ModuleMock
    const ModuleMock = await ethers.getContractFactory("ModuleMock");
    mock = await ModuleMock.deploy(companion.address);

    // Get role constants
    MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    MODULE_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MODULE_ROLE"));
    DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
  });

  describe("Role-based Access Control", function () {
    it("Should prevent unauthorized minting", async function () {
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";

      // Alice should not be able to mint without MINTER_ROLE
      await expect(
        companion.connect(alice).mint(alice.address, sampleUri)
      ).to.be.revertedWith(/AccessControl: account .* is missing role/);
    });

    it("Should prevent unauthorized XP granting", async function () {
      // First mint a token with admin role
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";
      await companion.mint(alice.address, sampleUri);

      // Alice should not be able to grant XP without MODULE_ROLE
      await expect(
        companion.connect(alice).gainXP(1, 100)
      ).to.be.revertedWith(/AccessControl: account .* is missing role/);
    });

    it("Should allow minting with MINTER_ROLE", async function () {
      // Grant MINTER_ROLE to moduleMock
      await companion.grantRole(MINTER_ROLE, moduleMock.address);

      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";

      // moduleMock should be able to mint
      await mock.connect(moduleMock).saleMint(alice.address, sampleUri);

      expect(await companion.ownerOf(1)).to.equal(alice.address);
    });

    it("Should allow XP granting with MODULE_ROLE", async function () {
      // First mint a token
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";
      await companion.mint(alice.address, sampleUri);

      // Grant MODULE_ROLE to moduleMock
      await companion.grantRole(MODULE_ROLE, moduleMock.address);

      // moduleMock should be able to grant XP
      await mock.connect(moduleMock).grantXP(1, 100);

      expect(await companion.xp(1)).to.equal(100);
    });

    it("Should prevent non-admin from granting roles", async function () {
      // Alice should not be able to grant roles
      await expect(
        companion.connect(alice).grantRole(MINTER_ROLE, bob.address)
      ).to.be.revertedWith(/AccessControl: account .* is missing role/);
    });
  });

  describe("ModuleMock functionality", function () {
    beforeEach(async function () {
      // Grant roles to moduleMock
      await companion.grantRole(MINTER_ROLE, mock.address);
      await companion.grantRole(MODULE_ROLE, mock.address);
    });

    it("Should mint companion via ModuleMock", async function () {
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";

      await mock.saleMint(alice.address, sampleUri);

      expect(await companion.ownerOf(1)).to.equal(alice.address);
      expect(await companion.metadataURI(1)).to.equal(sampleUri);
    });

    it("Should grant XP via ModuleMock", async function () {
      // Mint first
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";
      await mock.saleMint(alice.address, sampleUri);

      // Grant XP
      await mock.grantXP(1, 50);

      expect(await companion.xp(1)).to.equal(50);
    });
  });

  describe("TraitVault custody mechanism", function () {
    beforeEach(async function () {
      // Grant roles to moduleMock
      await companion.grantRole(MINTER_ROLE, mock.address);
      await companion.grantRole(MODULE_ROLE, mock.address);

      // Mint a companion for alice
      const sampleUri = "ipfs://QmFakeMetadata/companion-explorer.json";
      await mock.saleMint(alice.address, sampleUri);

      // Mint some trait tokens for alice
      await traitVault.mintTrait(alice.address, 1001, 10, "Fire Wings");
    });

    it("Should attach trait to vault custody", async function () {
      // Alice approves trait vault to transfer tokens
      await traitVault.connect(alice).setApprovalForAll(traitVault.address, true);

      // Attach trait
      await traitVault.connect(alice).attachTrait(1, 1001, 5);

      expect(await traitVault.attached(1, 1001)).to.equal(true);
      expect(await traitVault.attachedBy(1, 1001)).to.equal(alice.address);
      expect(await traitVault.vaultBalance(1, 1001)).to.equal(5);
      expect(await traitVault.balanceOf(alice.address, 1001)).to.equal(5);
      expect(await traitVault.balanceOf(traitVault.address, 1001)).to.equal(5);
    });

    it("Should detach trait and return from vault custody", async function () {
      // Alice approves trait vault to transfer tokens
      await traitVault.connect(alice).setApprovalForAll(traitVault.address, true);

      // Attach trait
      await traitVault.connect(alice).attachTrait(1, 1001, 5);

      // Detach trait
      await traitVault.connect(alice).detachTrait(1, 1001, 3);

      expect(await traitVault.attached(1, 1001)).to.equal(false);
      expect(await traitVault.vaultBalance(1, 1001)).to.equal(2);
      expect(await traitVault.balanceOf(alice.address, 1001)).to.equal(8);
      expect(await traitVault.balanceOf(traitVault.address, 1001)).to.equal(2);
    });

    it("Should prevent non-owner from attaching traits", async function () {
      // Bob tries to attach alice's trait to alice's companion
      await traitVault.connect(bob).setApprovalForAll(traitVault.address, true);

      await expect(
        traitVault.connect(bob).attachTrait(1, 1001, 5)
      ).to.be.revertedWith("not companion owner");
    });

    it("Should prevent non-attacher from detaching traits", async function () {
      // Alice approves and attaches trait
      await traitVault.connect(alice).setApprovalForAll(traitVault.address, true);
      await traitVault.connect(alice).attachTrait(1, 1001, 5);

      // Bob tries to detach
      await expect(
        traitVault.connect(bob).detachTrait(1, 1001, 3)
      ).to.be.revertedWith("only attacher");
    });
  });
});
