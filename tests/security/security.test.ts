// tests/security/security.test.ts
// Comprehensive security test suite for audit compliance using actual contracts

import { expect } from "chai";
import { ethers } from "hardhat";
import { setupTestContext, SecurityTests } from "../shared/test-helpers";
import { Contract } from "ethers";

// Global declarations for Mocha with proper types
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const beforeEach: (fn: () => void | Promise<void>) => void;

describe("Security Test Suite", function () {
  let ctx: Awaited<ReturnType<typeof setupTestContext>>;
  let tokenContract: any;
  let timelockContract: any;
  let governorContract: any;

  beforeEach(async function () {
    ctx = await setupTestContext();

    // Deploy actual contracts for security testing
    const ARCxToken = await ethers.getContractFactory("ARCxToken");
    tokenContract = await ARCxToken.deploy(
      "ARCx Token",
      "ARCX",
      ethers.parseEther("1000000000"), // 1 billion cap
      ctx.deployer.address
    );
    await tokenContract.waitForDeployment();

    // Use simplified mock contracts for testing complex governance features
    const MockTimelock = await ethers.getContractFactory("MockTimelock");
    timelockContract = await MockTimelock.deploy();
    await timelockContract.waitForDeployment();

    const MockGovernor = await ethers.getContractFactory("MockGovernor");
    governorContract = await MockGovernor.deploy(await timelockContract.getAddress());
    await governorContract.waitForDeployment();

    // Setup initial token balances for testing
    await tokenContract.connect(ctx.deployer).transfer(ctx.admin.address, ethers.parseEther("1000000"));
    await tokenContract.connect(ctx.deployer).transfer(ctx.proposer.address, ethers.parseEther("1000000"));
    await tokenContract.connect(ctx.deployer).transfer(ctx.executor.address, ethers.parseEther("1000000"));
  });

  describe("Access Control Security", function () {
    it("should prevent unauthorized role granting", async function () {
      const proposerRole = await timelockContract.PROPOSER_ROLE();

      // Stranger should not be able to grant roles
      await expect(
        timelockContract.connect(ctx.stranger).grantRole(proposerRole, ctx.stranger.address)
      ).to.be.revertedWith("AccessControl:");
    });

    it("should prevent unauthorized role revocation", async function () {
      const proposerRole = await timelockContract.PROPOSER_ROLE();

      // Stranger should not be able to revoke roles
      await expect(
        timelockContract.connect(ctx.stranger).revokeRole(proposerRole, ctx.proposer.address)
      ).to.be.revertedWith("AccessControl:");
    });

    it("should enforce role-based function access", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);

      // Test proposer role access for scheduling
      await expect(
        timelockContract.connect(ctx.stranger).schedule(
          await tokenContract.getAddress(),
          0,
          callData,
          ethers.ZeroHash,
          ethers.ZeroHash,
          3600
        )
      ).to.be.revertedWith("AccessControl:");
    });
  });

  describe("Timelock Security", function () {
    it("should enforce minimum delay requirements", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-delay"));

      // Schedule operation
      await timelockContract.connect(ctx.deployer).schedule(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt,
        3600 // 1 hour delay
      );

      const operationId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256", "bytes", "bytes32", "bytes32"],
          [await tokenContract.getAddress(), 0, callData, ethers.ZeroHash, salt]
        )
      );

      // Try to execute immediately (should fail)
      await expect(
        timelockContract.connect(ctx.deployer).execute(
          await tokenContract.getAddress(),
          0,
          callData,
          ethers.ZeroHash,
          salt
        )
      ).to.be.revertedWith("TimelockController: operation is not ready");

      // Fast-forward past delay
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      // Now execution should succeed
      await expect(
        timelockContract.connect(ctx.deployer).execute(
          await tokenContract.getAddress(),
          0,
          callData,
          ethers.ZeroHash,
          salt
        )
      ).to.not.be.reverted;
    });

    it("should prevent operation replay", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-replay"));

      // Schedule and execute operation
      await timelockContract.connect(ctx.deployer).schedule(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt,
        3600
      );

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      await timelockContract.connect(ctx.deployer).execute(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt
      );

      // Try to execute again (should fail)
      await expect(
        timelockContract.connect(ctx.deployer).execute(
          await tokenContract.getAddress(),
          0,
          callData,
          ethers.ZeroHash,
          salt
        )
      ).to.be.revertedWith("TimelockController: operation already executed");
    });
  });

  describe("Governor Security", function () {
    it("should validate proposal parameters", async function () {
      // Test invalid proposal threshold
      await expect(
        governorContract.connect(ctx.stranger).propose([], [], [], "Invalid description")
      ).to.be.revertedWith("Governor: proposer votes below proposal threshold");
    });

    it("should enforce voting period limits", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);

      // Create a valid proposal
      await governorContract.connect(ctx.deployer).propose(
        [await tokenContract.getAddress()],
        [0],
        [callData],
        "Test proposal"
      );

      // Try to execute before voting period ends
      await expect(
        governorContract.connect(ctx.deployer).execute(
          [await tokenContract.getAddress()],
          [0],
          [callData],
          ethers.keccak256(ethers.toUtf8Bytes("Test proposal"))
        )
      ).to.be.revertedWith("Governor: proposal not successful");
    });
  });

  describe("Input Validation", function () {
    it("should reject zero address inputs", async function () {
      await SecurityTests.testInputValidation(
        tokenContract,
        async () => tokenContract.connect(ctx.deployer).transfer(ethers.ZeroAddress, ethers.parseEther("100")),
        "ERC20: transfer to the zero address"
      );
    });

    it("should reject empty call data for non-zero value", async function () {
      await SecurityTests.testInputValidation(
        timelockContract,
        async () => timelockContract.connect(ctx.deployer).schedule(
          await tokenContract.getAddress(),
          ethers.parseEther("1"),
          "0x",
          ethers.ZeroHash,
          ethers.ZeroHash,
          3600
        ),
        "TimelockController: underlying transaction reverted"
      );
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency cancellation by authorized roles", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("emergency-test"));

      // Schedule operation
      await timelockContract.connect(ctx.deployer).schedule(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt,
        3600
      );

      const operationId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256", "bytes", "bytes32", "bytes32"],
          [await tokenContract.getAddress(), 0, callData, ethers.ZeroHash, salt]
        )
      );

      // Deployer (admin) should be able to cancel
      await expect(
        timelockContract.connect(ctx.deployer).cancel(operationId)
      ).to.not.be.reverted;
    });
  });

  describe("Gas Limit Protection", function () {
    it("should handle operations within gas limits", async function () {
      // This test ensures operations don't exceed reasonable gas limits
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("gas-test"));

      // Schedule operation
      await timelockContract.connect(ctx.deployer).schedule(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt,
        3600
      );

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      // Execute and check gas usage is reasonable
      const tx = await timelockContract.connect(ctx.deployer).execute(
        await tokenContract.getAddress(),
        0,
        callData,
        ethers.ZeroHash,
        salt
      );

      const receipt = await tx.wait();
      expect(receipt!.gasUsed).to.be.lt(300000); // Should be well under block gas limit
    });
  });
});
