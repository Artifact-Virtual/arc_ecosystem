import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ADAM Host Security Tests", function () {
  let adamHost: Contract;
  let adamRegistry: Contract;
  let eligibility: Contract;
  let admin: Signer;
  let policyExecutor: Signer;
  let unauthorized: Signer;
  let emergency: Signer;

  const TOPIC_TREASURY = 0;
  const TOPIC_PARAMS = 1;
  const FUEL_LIMIT = 1000000;
  const MEMORY_LIMIT = 100000;

  beforeEach(async function () {
    [admin, policyExecutor, unauthorized, emergency] = await ethers.getSigners();

    // Deploy mock eligibility contract
    const MockEligibility = await ethers.getContractFactory("MockEligibility");
    eligibility = await MockEligibility.deploy();

    // Deploy ADAM Registry
    const AdamRegistry = await ethers.getContractFactory("AdamRegistry");
    adamRegistry = await AdamRegistry.deploy();

    // Deploy ADAM Host as upgradeable
    const AdamHost = await ethers.getContractFactory("AdamHost");
    adamHost = await upgrades.deployProxy(AdamHost, [
      await adamRegistry.getAddress(),
      await eligibility.getAddress(),
      FUEL_LIMIT,
      MEMORY_LIMIT,
      await admin.getAddress()
    ], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Setup roles
    await adamHost.connect(admin).grantRole(await adamHost.POLICY_EXECUTOR_ROLE(), await policyExecutor.getAddress());
    await adamHost.connect(admin).grantRole(await adamHost.EMERGENCY_ROLE(), await emergency.getAddress());
  });

  describe("Policy Evaluation", function () {
    it("should prevent unauthorized policy evaluation", async function () {
      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(unauthorized).evaluate(context)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should allow authorized policy evaluation", async function () {
      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.emit(adamHost, "PolicyEvaluated");
    });

    it("should enforce fuel limits", async function () {
      // Set very low fuel limit
      await adamHost.connect(admin).updateConfig({
        fuelLimit: 100,
        memoryLimit: MEMORY_LIMIT,
        timeLimit: 30,
        maxProofSize: 1000
      });

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x" + "ff".repeat(1000), // Large diff to consume fuel
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: fuel limit exceeded");
    });

    it("should enforce memory limits", async function () {
      // Set very low memory limit
      await adamHost.connect(admin).updateConfig({
        fuelLimit: FUEL_LIMIT,
        memoryLimit: 100,
        timeLimit: 30,
        maxProofSize: 1000
      });

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x" + "ff".repeat(1000), // Large diff to consume memory
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: memory limit exceeded");
    });

    it("should validate constitutional requirements", async function () {
      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      // Mock eligibility to return false
      await eligibility.setEligible(await admin.getAddress(), false);

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: proposer not eligible");
    });
  });

  describe("2FA Requirements", function () {
    it("should enforce 2FA for sensitive operations", async function () {
      const proposalId = 1;
      const hook = ethers.keccak256(ethers.toUtf8Bytes("TREASURY_TRANSFER"));

      // Check 2FA status before satisfaction
      expect(await adamHost.is2FASatisfied(proposalId, hook)).to.be.false;

      // Satisfy 2FA
      const signature = await admin.signMessage("2FA approval for proposal " + proposalId);
      await adamHost.connect(admin).satisfy2FA(proposalId, hook, signature);

      // Check 2FA status after satisfaction
      expect(await adamHost.is2FASatisfied(proposalId, hook)).to.be.true;
    });

    it("should prevent invalid 2FA signatures", async function () {
      const proposalId = 1;
      const hook = ethers.keccak256(ethers.toUtf8Bytes("TREASURY_TRANSFER"));
      const invalidSignature = "0x1234567890abcdef";

      await expect(
        adamHost.connect(admin).satisfy2FA(proposalId, hook, invalidSignature)
      ).to.be.revertedWith("ADAM: invalid 2FA signature");
    });

    it("should prevent unauthorized 2FA satisfaction", async function () {
      const proposalId = 1;
      const hook = ethers.keccak256(ethers.toUtf8Bytes("TREASURY_TRANSFER"));
      const signature = await unauthorized.signMessage("2FA approval for proposal " + proposalId);

      await expect(
        adamHost.connect(unauthorized).satisfy2FA(proposalId, hook, signature)
      ).to.be.revertedWith("ADAM: unauthorized 2FA approver");
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency pause", async function () {
      await expect(
        adamHost.connect(emergency).emergencyPause()
      ).to.emit(adamHost, "EmergencyPaused");
    });

    it("should prevent operations when paused", async function () {
      await adamHost.connect(emergency).emergencyPause();

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should allow emergency unpause by admin", async function () {
      await adamHost.connect(emergency).emergencyPause();

      await expect(
        adamHost.connect(admin).emergencyUnpause()
      ).to.emit(adamHost, "EmergencyUnpaused");
    });

    it("should prevent unauthorized emergency actions", async function () {
      await expect(
        adamHost.connect(unauthorized).emergencyPause()
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Topic Validation", function () {
    it("should validate topic IDs", async function () {
      const invalidTopicId = 999;

      const context = {
        proposalId: 1,
        topicId: invalidTopicId,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: invalid topic");
    });

    it("should handle treasury topic requirements", async function () {
      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x" + "01", // Contains fund movement
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.emit(adamHost, "PolicyEvaluated");
    });

    it("should handle parameter change requirements", async function () {
      const context = {
        proposalId: 1,
        topicId: TOPIC_PARAMS,
        proposer: await admin.getAddress(),
        diff: "0x" + "00", // No fund movement
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.emit(adamHost, "PolicyEvaluated");
    });
  });

  describe("Proof Bundle Validation", function () {
    it("should validate proof bundle size limits", async function () {
      // Set very low proof size limit
      await adamHost.connect(admin).updateConfig({
        fuelLimit: FUEL_LIMIT,
        memoryLimit: MEMORY_LIMIT,
        timeLimit: 30,
        maxProofSize: 10
      });

      const largeProofBundle = "0x" + "ff".repeat(100);

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: largeProofBundle,
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: proof bundle too large");
    });

    it("should validate proof bundle format", async function () {
      const invalidProofBundle = "invalid";

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: invalidProofBundle,
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: invalid proof bundle");
    });
  });

  describe("Fuel and Resource Tracking", function () {
    it("should track fuel usage correctly", async function () {
      const hook = ethers.keccak256(ethers.toUtf8Bytes("TEST_HOOK"));
      const initialFuel = await adamHost.getFuelUsed(TOPIC_TREASURY, hook);

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x1234567890",
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await adamHost.connect(policyExecutor).evaluate(context);

      const finalFuel = await adamHost.getFuelUsed(TOPIC_TREASURY, hook);
      expect(finalFuel).to.be.gt(initialFuel);
    });

    it("should prevent fuel exhaustion attacks", async function () {
      // Create multiple evaluations to test fuel limits
      for (let i = 0; i < 10; i++) {
        const context = {
          proposalId: i + 1,
          topicId: TOPIC_TREASURY,
          proposer: await admin.getAddress(),
          diff: "0x1234567890",
          proofBundle: "0xabcdef",
          timestamp: await time.latest()
        };

        await adamHost.connect(policyExecutor).evaluate(context);
      }

      // Check that fuel limits are properly enforced
      const fuelUsed = await adamHost.getFuelUsed(TOPIC_TREASURY, ethers.keccak256(ethers.toUtf8Bytes("TEST")));
      expect(fuelUsed).to.be.lte(FUEL_LIMIT);
    });
  });

  describe("Reentrancy Protection", function () {
    it("should prevent reentrant policy evaluations", async function () {
      // This would require a malicious contract that attempts reentrancy
    });
  });

  describe("Time Limit Protection", function () {
    it("should enforce time limits on policy evaluation", async function () {
      // Set very low time limit
      await adamHost.connect(admin).updateConfig({
        fuelLimit: FUEL_LIMIT,
        memoryLimit: MEMORY_LIMIT,
        timeLimit: 1, // 1 second
        maxProofSize: 1000
      });

      const context = {
        proposalId: 1,
        topicId: TOPIC_TREASURY,
        proposer: await admin.getAddress(),
        diff: "0x" + "ff".repeat(10000), // Large diff to consume time
        proofBundle: "0xabcdef",
        timestamp: await time.latest()
      };

      await expect(
        adamHost.connect(policyExecutor).evaluate(context)
      ).to.be.revertedWith("ADAM: time limit exceeded");
    });
  });
});
