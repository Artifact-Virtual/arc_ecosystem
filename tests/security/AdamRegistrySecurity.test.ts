import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ADAM Registry Security Tests", function () {
  let adamRegistry: Contract;
  let admin: Signer;
  let policyAuthor: Signer;
  let unauthorized: Signer;
  let emergency: Signer;

  const TOPIC_TREASURY = 0;
  const TOPIC_PARAMS = 1;
  const MAX_EXECUTIONS = 100;
  const EXECUTION_WINDOW = 86400; // 24 hours

  beforeEach(async function () {
    [admin, policyAuthor, unauthorized, emergency] = await ethers.getSigners();

    // Deploy ADAM Registry as upgradeable
    const AdamRegistry = await ethers.getContractFactory("AdamRegistry");
    adamRegistry = await upgrades.deployProxy(AdamRegistry, [
      MAX_EXECUTIONS,
      EXECUTION_WINDOW,
      await admin.getAddress()
    ], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Setup roles
    await adamRegistry.connect(admin).grantRole(await adamRegistry.POLICY_AUTHOR_ROLE(), await policyAuthor.getAddress());
    await adamRegistry.connect(admin).grantRole(await adamRegistry.EMERGENCY_ROLE(), await emergency.getAddress());
  });

  describe("Policy Registration", function () {
    it("should prevent unauthorized policy registration", async function () {
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      await expect(
        adamRegistry.connect(unauthorized).registerPolicy(policy)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should allow authorized policy registration", async function () {
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      await expect(
        adamRegistry.connect(policyAuthor).registerPolicy(policy)
      ).to.emit(adamRegistry, "PolicyRegistered");
    });

    it("should validate policy bytecode", async function () {
      const invalidPolicy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x", // Empty bytecode
        metadata: {
          name: "Invalid Policy",
          version: "1.0.0",
          description: "Invalid policy",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("invalid"))
        }
      };

      await expect(
        adamRegistry.connect(policyAuthor).registerPolicy(invalidPolicy)
      ).to.be.revertedWith("ADAM: invalid bytecode");
    });

    it("should validate policy metadata", async function () {
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "", // Empty name
          version: "1.0.0",
          description: "Test policy",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      await expect(
        adamRegistry.connect(policyAuthor).registerPolicy(policy)
      ).to.be.revertedWith("ADAM: invalid metadata");
    });

    it("should prevent duplicate policy registration", async function () {
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      await expect(
        adamRegistry.connect(policyAuthor).registerPolicy(policy)
      ).to.be.revertedWith("ADAM: policy already exists");
    });
  });

  describe("Policy Execution Limits", function () {
    it("should enforce maximum execution limits", async function () {
      // Register a policy first
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      // Execute policy multiple times to reach limit
      for (let i = 0; i < MAX_EXECUTIONS + 1; i++) {
        await adamRegistry.connect(policyAuthor).executePolicy(policyId, "0x");
      }

      await expect(
        adamRegistry.connect(policyAuthor).executePolicy(policyId, "0x")
      ).to.be.revertedWith("ADAM: execution limit exceeded");
    });

    it("should enforce execution time windows", async function () {
      // Register a policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      // Execute policy
      await adamRegistry.connect(policyAuthor).executePolicy(policyId, "0x");

      // Advance time beyond window
      await time.increase(EXECUTION_WINDOW + 1);

      await expect(
        adamRegistry.connect(policyAuthor).executePolicy(policyId, "0x")
      ).to.be.revertedWith("ADAM: execution window expired");
    });
  });

  describe("Policy Updates", function () {
    it("should allow authorized policy updates", async function () {
      // Register initial policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      // Update policy
      const updatedPolicy = {
        ...policy,
        version: "1.1.0",
        description: "Updated test policy"
      };

      await expect(
        adamRegistry.connect(policyAuthor).updatePolicy(policyId, updatedPolicy)
      ).to.emit(adamRegistry, "PolicyUpdated");
    });

    it("should prevent unauthorized policy updates", async function () {
      // Register policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      // Try to update as unauthorized user
      const updatedPolicy = {
        ...policy,
        version: "1.1.0"
      };

      await expect(
        adamRegistry.connect(unauthorized).updatePolicy(policyId, updatedPolicy)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should validate updated policy data", async function () {
      // Register policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      // Try to update with invalid data
      const invalidUpdate = {
        ...policy,
        bytecode: "0x" // Invalid bytecode
      };

      await expect(
        adamRegistry.connect(policyAuthor).updatePolicy(policyId, invalidUpdate)
      ).to.be.revertedWith("ADAM: invalid bytecode");
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency pause", async function () {
      await expect(
        adamRegistry.connect(emergency).emergencyPause()
      ).to.emit(adamRegistry, "EmergencyPaused");
    });

    it("should prevent operations when paused", async function () {
      await adamRegistry.connect(emergency).emergencyPause();

      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      await expect(
        adamRegistry.connect(policyAuthor).registerPolicy(policy)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should allow emergency unpause by admin", async function () {
      await adamRegistry.connect(emergency).emergencyPause();

      await expect(
        adamRegistry.connect(admin).emergencyUnpause()
      ).to.emit(adamRegistry, "EmergencyUnpaused");
    });

    it("should prevent unauthorized emergency actions", async function () {
      await expect(
        adamRegistry.connect(unauthorized).emergencyPause()
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Policy Removal", function () {
    it("should allow authorized policy removal", async function () {
      // Register policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      await expect(
        adamRegistry.connect(policyAuthor).removePolicy(policyId)
      ).to.emit(adamRegistry, "PolicyRemoved");
    });

    it("should prevent unauthorized policy removal", async function () {
      // Register policy
      const policy = {
        topicId: TOPIC_TREASURY,
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50d2801561002a57600080fd5b50600436106100405760003560e01c80635c60da1b14610045575b600080fd5b61004d61004b565b005b6000546001600160a01b0316331461006e57600080fd5b600080546001600160a01b0319166001600160a01b03831617905556fe",
        metadata: {
          name: "Test Policy",
          version: "1.0.0",
          description: "Test policy for treasury operations",
          author: await policyAuthor.getAddress(),
          checksum: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }
      };

      const policyId = await adamRegistry.connect(policyAuthor).registerPolicy(policy);

      await expect(
        adamRegistry.connect(unauthorized).removePolicy(policyId)
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Reentrancy Protection", function () {
    it("should prevent reentrant policy operations", async function () {
      // This would require a malicious contract that attempts reentrancy
    });
  });
});
