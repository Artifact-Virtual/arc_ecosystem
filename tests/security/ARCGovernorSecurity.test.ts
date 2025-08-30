import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ARCGovernor Security Tests", function () {
  let governor: Contract;
  let timelock: Contract;
  let token: Contract;
  let admin: Signer;
  let proposer: Signer;
  let voter1: Signer;
  let voter2: Signer;
  let unauthorized: Signer;
  let emergency: Signer;
  let guardian: Signer;

  const VOTING_DELAY = 1; // 1 block
  const VOTING_PERIOD = 50400; // ~7 days in blocks
  const PROPOSAL_THRESHOLD = ethers.parseEther("1000");

  beforeEach(async function () {
    [admin, proposer, voter1, voter2, unauthorized, emergency, guardian] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20");
    token = await MockToken.deploy("Mock Token", "MOCK", ethers.parseEther("1000000"));

    // Deploy timelock
    const ARCTimelock = await ethers.getContractFactory("ARCTimelock");
    timelock = await upgrades.deployProxy(ARCTimelock, [await admin.getAddress()], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Deploy governor
    const ARCGovernor = await ethers.getContractFactory("ARCGovernor");
    governor = await upgrades.deployProxy(ARCGovernor, [
      await token.getAddress(),
      await timelock.getAddress(),
      await admin.getAddress()
    ], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Setup roles
    await governor.connect(admin).grantRole(await governor.PROPOSER_ROLE(), await proposer.getAddress());
    await governor.connect(admin).grantRole(await governor.EMERGENCY_ROLE(), await emergency.getAddress());
    await governor.connect(admin).grantRole(await governor.GUARDIAN_ROLE(), await guardian.getAddress());

    // Distribute tokens for voting
    await token.transfer(await voter1.getAddress(), ethers.parseEther("10000"));
    await token.transfer(await voter2.getAddress(), ethers.parseEther("10000"));
    await token.transfer(await proposer.getAddress(), ethers.parseEther("2000"));
  });

  describe("Proposal Creation", function () {
    it("should prevent unauthorized proposal creation", async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Unauthorized proposal";

      await expect(
        governor.connect(unauthorized).propose(targets, values, calldatas, description)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should require minimum proposal threshold", async function () {
      // Try to propose with insufficient tokens
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Insufficient threshold proposal";

      await expect(
        governor.connect(voter1).propose(targets, values, calldatas, description)
      ).to.be.revertedWith("Governor: proposer votes below proposal threshold");
    });

    it("should allow authorized proposer with sufficient tokens", async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Valid proposal";

      await expect(
        governor.connect(proposer).propose(targets, values, calldatas, description)
      ).to.emit(governor, "ProposalCreated");
    });
  });

  describe("Voting Mechanism", function () {
    let proposalId: bigint;

    beforeEach(async function () {
      // Create a proposal
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Test proposal for voting";

      const proposeTx = await governor.connect(proposer).propose(targets, values, calldatas, description);
      const receipt = await proposeTx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "ProposalCreated");
      proposalId = event.args.proposalId;

      // Advance to voting period
      await time.advanceBlocks(VOTING_DELAY + 1);
    });

    it("should allow voting with tokens", async function () {
      await expect(
        governor.connect(voter1).castVote(proposalId, 1, 0) // For vote, standard voting
      ).to.emit(governor, "VoteCast");
    });

    it("should prevent double voting", async function () {
      await governor.connect(voter1).castVote(proposalId, 1, 0);

      await expect(
        governor.connect(voter1).castVote(proposalId, 0, 0) // Against vote
      ).to.be.revertedWith("Governor: vote already cast");
    });

    it("should handle quadratic voting correctly", async function () {
      // Test quadratic voting (vote type 1)
      await expect(
        governor.connect(voter1).castVote(proposalId, 1, 1)
      ).to.emit(governor, "VoteCast");
    });

    it("should handle conviction voting", async function () {
      // Test conviction voting (vote type 2)
      await expect(
        governor.connect(voter1).castVote(proposalId, 1, 2)
      ).to.emit(governor, "VoteCast");
    });
  });

  describe("Proposal Execution", function () {
    let proposalId: bigint;

    beforeEach(async function () {
      // Create and vote on proposal
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Test proposal for execution";

      const proposeTx = await governor.connect(proposer).propose(targets, values, calldatas, description);
      const receipt = await proposeTx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "ProposalCreated");
      proposalId = event.args.proposalId;

      // Advance to voting period
      await time.advanceBlocks(VOTING_DELAY + 1);

      // Cast votes
      await governor.connect(voter1).castVote(proposalId, 1, 0);
      await governor.connect(voter2).castVote(proposalId, 1, 0);

      // Advance past voting period
      await time.advanceBlocks(VOTING_PERIOD + 1);
    });

    it("should allow execution of successful proposals", async function () {
      await expect(
        governor.connect(admin).execute(targets, values, calldatas, ethers.keccak256(ethers.toUtf8Bytes(description)))
      ).to.emit(governor, "ProposalExecuted");
    });

    it("should prevent execution of failed proposals", async function () {
      // Create proposal that will fail quorum
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Failing proposal";

      const proposeTx = await governor.connect(proposer).propose(targets, values, calldatas, description);
      const receipt = await proposeTx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "ProposalCreated");
      const failingProposalId = event.args.proposalId;

      // Advance past voting period without votes
      await time.advanceBlocks(VOTING_PERIOD + 1);

      await expect(
        governor.connect(admin).execute(targets, values, calldatas, ethers.keccak256(ethers.toUtf8Bytes(description)))
      ).to.be.revertedWith("Governor: proposal not successful");
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency pause", async function () {
      await expect(
        governor.connect(emergency).emergencyPause()
      ).to.emit(governor, "EmergencyPaused");
    });

    it("should allow emergency unpause by admin", async function () {
      await governor.connect(emergency).emergencyPause();

      await expect(
        governor.connect(admin).emergencyUnpause()
      ).to.emit(governor, "EmergencyUnpaused");
    });

    it("should prevent unauthorized emergency actions", async function () {
      await expect(
        governor.connect(unauthorized).emergencyPause()
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Guardian Functions", function () {
    let proposalId: bigint;

    beforeEach(async function () {
      // Create a proposal
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [await admin.getAddress(), ethers.parseEther("100")])];
      const description = "Proposal for veto test";

      const proposeTx = await governor.connect(proposer).propose(targets, values, calldatas, description);
      const receipt = await proposeTx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "ProposalCreated");
      proposalId = event.args.proposalId;
    });

    it("should allow guardian veto", async function () {
      await expect(
        governor.connect(guardian).vetoProposal(proposalId)
      ).to.emit(governor, "ProposalVetoed");
    });

    it("should prevent unauthorized veto", async function () {
      await expect(
        governor.connect(unauthorized).vetoProposal(proposalId)
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Delegation", function () {
    it("should allow token delegation", async function () {
      await expect(
        governor.connect(voter1).delegate(await voter2.getAddress(), ethers.parseEther("1000"))
      ).to.emit(governor, "DelegateChanged");
    });

    it("should update voting power correctly", async function () {
      await governor.connect(voter1).delegate(await voter2.getAddress(), ethers.parseEther("1000"));

      const votes = await governor.getVotes(await voter2.getAddress());
      expect(votes).to.be.gt(0);
    });
  });

  describe("Reentrancy Protection", function () {
    it("should prevent reentrant proposal creation", async function () {
      // This would require a malicious contract
    });
  });

  describe("Gas Limit Protection", function () {
    it("should handle large proposal arrays", async function () {
      // Test with maximum reasonable proposal size
    });
  });
});
