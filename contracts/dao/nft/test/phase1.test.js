const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Phase1 Enhanced: Self-Governing NFT Ecosystem", function () {
  let deployer, alice, bob, charlie;
  let tbr, companion, governance, traitVault;

  beforeEach(async () => {
    [deployer, alice, bob, charlie] = await ethers.getSigners();

    // Deploy TokenBoundAccountRegistry
    const TBRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
    tbr = await TBRegistry.deploy();
    await tbr.deployed();

    // Deploy TraitVault
    const TraitVault = await ethers.getContractFactory("TraitVault");
    traitVault = await TraitVault.deploy("https://example.com/{id}.json", ethers.constants.AddressZero);
    await traitVault.deployed();

    // Deploy implementations first
    const Companion = await ethers.getContractFactory("EvolvingCompanion");
    const companionImpl = await Companion.deploy();
    await companionImpl.deployed();

    const Governance = await ethers.getContractFactory("CompanionGovernance");
    const governanceImpl = await Governance.deploy();
    await governanceImpl.deployed();

    // Deploy upgradeable proxies
    const { upgrades } = require("hardhat");

    companion = await upgrades.deployProxy(
      Companion,
      [tbr.address, governanceImpl.address, "Evolving Companion", "EVC"],
      { initializer: 'initialize' }
    );
    await companion.deployed();

    governance = await upgrades.deployProxy(
      Governance,
      [companion.address],
      { initializer: 'initialize' }
    );
    await governance.deployed();

    // Authorize governance as a module
    await companion.authorizeModule(governance.address, true);
    await traitVault.authorizeModule(governance.address, true);
  });

  describe("Core NFT Functionality", () => {
    it("mint creates token and tokenBoundAccount", async () => {
      await companion.mint(alice.address, "ipfs://meta/1");
      const tokenId = 1;
      expect(await companion.ownerOf(tokenId)).to.equal(alice.address);
      const acct = await companion.getTokenBoundAccount(tokenId);
      expect(acct).to.properAddress;
      const regAcct = await tbr.getAccount(companion.address, tokenId);
      expect(acct).to.equal(regAcct);
    });

    it("auto-delegates voting power on mint", async () => {
      await companion.mint(alice.address, "ipfs://meta/1");
      const tokenId = 1;

      // Check that voting power is delegated to alice
      const power = await governance.votingPower(tokenId, alice.address);
      expect(power).to.equal(1);
    });
  });

  describe("Trait System Security", () => {
    beforeEach(async () => {
      await companion.mint(alice.address, "ipfs://meta/1");
      await traitVault.mintTrait(alice.address, 1001, 1, "Red Hat");
    });

    it("only token owner can attach traits", async () => {
      const tokenId = 1;
      await expect(
        traitVault.connect(bob).attachTrait(tokenId, 1001)
      ).to.be.revertedWith("Not token owner");
    });

    it("must own trait to attach", async () => {
      const tokenId = 1;
      await expect(
        traitVault.connect(alice).attachTrait(tokenId, 9999)
      ).to.be.revertedWith("Must own trait");
    });

    it("secure attach/detach works", async () => {
      const tokenId = 1;
      await traitVault.connect(alice).attachTrait(tokenId, 1001);
      expect(await traitVault.attached(tokenId, 1001)).to.be.true;

      await traitVault.connect(alice).detachTrait(tokenId, 1001);
      expect(await traitVault.attached(tokenId, 1001)).to.be.false;
    });

    it("authorized modules can force operations", async () => {
      const tokenId = 1;
      await traitVault.forceAttachTrait(tokenId, 1001);
      expect(await traitVault.attached(tokenId, 1001)).to.be.true;
    });
  });

  describe("Self-Governance System", () => {
    beforeEach(async () => {
      // Mint NFTs to create voting power
      await companion.mint(alice.address, "ipfs://meta/1");
      await companion.mint(bob.address, "ipfs://meta/2");
      await companion.mint(charlie.address, "ipfs://meta/3");
    });

    it("creates governance proposals", async () => {
      const proposalId = await governance.createProposal(
        "Test proposal",
        companion.address,
        companion.interface.encodeFunctionData("gainXP", [1, 100])
      );

      const proposal = await governance.getProposal(proposalId);
      expect(proposal.description).to.equal("Test proposal");
      expect(proposal.proposer).to.equal(alice.address);
    });

    it("allows voting on proposals", async () => {
      const proposalId = await governance.createProposal(
        "Test proposal",
        companion.address,
        companion.interface.encodeFunctionData("gainXP", [1, 100])
      );

      // Alice votes for
      await governance.connect(alice).castVote(proposalId, true);
      expect(await governance.hasVoted(proposalId, alice.address)).to.be.true;

      // Bob votes against
      await governance.connect(bob).castVote(proposalId, false);

      const proposal = await governance.getProposal(proposalId);
      expect(proposal.forVotes).to.equal(1); // Alice
      expect(proposal.againstVotes).to.equal(1); // Bob
    });

    it("executes proposals with majority", async () => {
      const proposalId = await governance.createProposal(
        "Test proposal",
        companion.address,
        companion.interface.encodeFunctionData("gainXP", [1, 100])
      );

      // All vote for (should pass)
      await governance.connect(alice).castVote(proposalId, true);
      await governance.connect(bob).castVote(proposalId, true);
      await governance.connect(charlie).castVote(proposalId, true);

      // Fast forward time past voting period
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); // 7 days
      await ethers.provider.send("evm_mine");

      await governance.executeProposal(proposalId);

      const proposal = await governance.getProposal(proposalId);
      expect(proposal.executed).to.be.true;

      // Check that XP was actually gained
      expect(await companion.xp(1)).to.equal(100);
    });

    it("rejects proposals without majority", async () => {
      const proposalId = await governance.createProposal(
        "Test proposal",
        companion.address,
        companion.interface.encodeFunctionData("gainXP", [1, 100])
      );

      // Mixed votes (should fail)
      await governance.connect(alice).castVote(proposalId, true);
      await governance.connect(bob).castVote(proposalId, false);
      await governance.connect(charlie).castVote(proposalId, false);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      await expect(
        governance.executeProposal(proposalId)
      ).to.be.revertedWith("Proposal rejected");
    });
  });

  describe("Transfer Continuity", () => {
    it("transfer preserves account and updates voting delegation", async () => {
      await companion.mint(alice.address, "ipfs://meta/1");
      const tokenId = 1;

      // Attach trait
      await traitVault.mintTrait(alice.address, 1001, 1, "Red Hat");
      await traitVault.connect(alice).attachTrait(tokenId, 1001);

      // Transfer companion to bob
      await companion.connect(alice).transferFrom(alice.address, bob.address, tokenId);
      expect(await companion.ownerOf(tokenId)).to.equal(bob.address);

      // Account should remain the same
      const acct = await companion.getTokenBoundAccount(tokenId);
      expect(acct).to.properAddress;

      // Voting power should be re-delegated to bob
      expect(await governance.votingPower(tokenId, bob.address)).to.equal(1);
      expect(await governance.votingPower(tokenId, alice.address)).to.equal(0);

      // Trait should still be attached
      expect(await traitVault.attached(tokenId, 1001)).to.be.true;
    });
  });
});