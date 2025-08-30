import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ARCTimelock Security Tests", function () {
  let timelock: Contract;
  let admin: Signer;
  let proposer: Signer;
  let executor: Signer;
  let canceller: Signer;
  let emergency: Signer;
  let unauthorized: Signer;
  let mockTarget: Contract;

  const MIN_DELAY = 86400; // 1 day
  const MAX_DELAY = 604800; // 7 days

  beforeEach(async function () {
    [admin, proposer, executor, canceller, emergency, unauthorized] = await ethers.getSigners();

    // Deploy mock target contract
    const MockTarget = await ethers.getContractFactory("MockTarget");
    mockTarget = await MockTarget.deploy();

    // Deploy timelock as upgradeable
    const ARCTimelock = await ethers.getContractFactory("ARCTimelock");
    timelock = await upgrades.deployProxy(ARCTimelock, [await admin.getAddress()], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Setup roles
    await timelock.connect(admin).grantRole(await timelock.PROPOSER_ROLE(), await proposer.getAddress());
    await timelock.connect(admin).grantRole(await timelock.EXECUTOR_ROLE(), await executor.getAddress());
    await timelock.connect(admin).grantRole(await timelock.CANCELLER_ROLE(), await canceller.getAddress());
    await timelock.connect(admin).grantRole(await timelock.EMERGENCY_ROLE(), await emergency.getAddress());
  });

  describe("Access Control", function () {
    it("should prevent unauthorized scheduling", async function () {
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("testFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await expect(
        timelock.connect(unauthorized).schedule(
          targets,
          values,
          calldatas,
          predecessor,
          salt,
          MIN_DELAY
        )
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should allow authorized proposer to schedule", async function () {
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("testFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await expect(
        timelock.connect(proposer).schedule(
          targets,
          values,
          calldatas,
          predecessor,
          salt,
          MIN_DELAY
        )
      ).to.emit(timelock, "OperationScheduled");
    });

    it("should prevent execution before delay", async function () {
      // Schedule operation
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("testFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await timelock.connect(proposer).schedule(
        targets,
        values,
        calldatas,
        predecessor,
        salt,
        MIN_DELAY
      );

      // Try to execute immediately
      await expect(
        timelock.connect(executor).execute(targets, values, calldatas, predecessor, salt)
      ).to.be.revertedWith("Timelock: operation is not ready");
    });

    it("should allow execution after delay", async function () {
      // Schedule operation
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("testFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await timelock.connect(proposer).schedule(
        targets,
        values,
        calldatas,
        predecessor,
        salt,
        MIN_DELAY
      );

      // Fast forward time
      await time.increase(MIN_DELAY + 1);

      // Execute
      await expect(
        timelock.connect(executor).execute(targets, values, calldatas, predecessor, salt)
      ).to.emit(timelock, "OperationExecuted");
    });
  });

  describe("Emergency Functions", function () {
    it("should allow emergency execution bypass", async function () {
      // Schedule operation
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("emergency"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("emergencyFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await timelock.connect(proposer).schedule(
        targets,
        values,
        calldatas,
        predecessor,
        salt,
        MIN_DELAY
      );

      // Emergency execute before delay
      await expect(
        timelock.connect(emergency).emergencyExecute(
          targets,
          values,
          calldatas,
          predecessor,
          salt,
          "Emergency: critical fix required"
        )
      ).to.emit(timelock, "EmergencyAction");
    });

    it("should prevent unauthorized emergency execution", async function () {
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("emergencyFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await expect(
        timelock.connect(unauthorized).emergencyExecute(
          targets,
          values,
          calldatas,
          predecessor,
          salt,
          "Unauthorized emergency"
        )
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Operation Cancellation", function () {
    it("should allow authorized cancellation", async function () {
      // Schedule operation
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("cancel"));
      const targets = [await mockTarget.getAddress()];
      const values = [0];
      const calldatas = [mockTarget.interface.encodeFunctionData("testFunction")];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await timelock.connect(proposer).schedule(
        targets,
        values,
        calldatas,
        predecessor,
        salt,
        MIN_DELAY
      );

      // Cancel operation
      await expect(
        timelock.connect(canceller).cancel(operationId)
      ).to.emit(timelock, "OperationCancelled");
    });

    it("should prevent unauthorized cancellation", async function () {
      const operationId = ethers.keccak256(ethers.toUtf8Bytes("unauthorized"));

      await expect(
        timelock.connect(unauthorized).cancel(operationId)
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Batch Operations", function () {
    it("should handle batch scheduling correctly", async function () {
      const targets = [await mockTarget.getAddress(), await mockTarget.getAddress()];
      const values = [0, 0];
      const calldatas = [
        mockTarget.interface.encodeFunctionData("testFunction"),
        mockTarget.interface.encodeFunctionData("testFunction2")
      ];
      const predecessor = ethers.ZeroHash;
      const salt = ethers.ZeroHash;

      await expect(
        timelock.connect(proposer).scheduleBatch(
          targets,
          values,
          calldatas,
          predecessor,
          salt,
          MIN_DELAY,
          "Batch operation test"
        )
      ).to.emit(timelock, "BatchScheduled");
    });
  });

  describe("Reentrancy Protection", function () {
    it("should prevent reentrant calls", async function () {
      // This would require a malicious contract that attempts reentrancy
      // Test implementation would depend on the specific reentrancy scenario
    });
  });

  describe("Gas Limit Protection", function () {
    it("should handle operations near gas limit", async function () {
      // Test with operations that approach gas limits
    });
  });
});
