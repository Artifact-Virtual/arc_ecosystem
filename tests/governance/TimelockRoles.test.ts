// tests/governance/TimelockRoles.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes, ZeroAddress } from "ethers";

describe("Timelock Roles & Governor integration", function () {
  let deployer: any, proposer: any, executor: any, stranger: any;
  let timelock: any, governor: any, receiver: any;

  beforeEach(async function () {
    [deployer, proposer, executor, stranger] = await ethers.getSigners();

    // For this test, we'll use a simplified approach with direct contract deployment
    // Deploy a mock timelock for testing
    const MockTimelock = await ethers.getContractFactory("MockTimelock");
    timelock = await MockTimelock.deploy(2 * 24 * 3600); // 48h delay
    await timelock.waitForDeployment();

    // Deploy a mock governor for testing
    const MockGovernor = await ethers.getContractFactory("MockGovernor");
    governor = await MockGovernor.deploy(timelock.target);
    await governor.waitForDeployment();

    // Grant roles
    await timelock.grantRole(await timelock.PROPOSER_ROLE?.() || ethers.keccak256(ethers.toUtf8Bytes("PROPOSER_ROLE")), governor.target);
    await timelock.grantRole(await timelock.EXECUTOR_ROLE?.() || ethers.keccak256(ethers.toUtf8Bytes("EXECUTOR_ROLE")), executor.address);

    // Deploy mock receiver contract for testing
    const MockReceiver = await ethers.getContractFactory("MockReceiver");
    receiver = await MockReceiver.deploy();
    await receiver.deployed();
  });

  it("timelock should enforce delay and only governor queue/execute", async function () {
    // Build transaction payload
    const iface = receiver.interface;
    const callData = iface.encodeFunctionData("setFlag", [true]);
    const salt = keccak256(toUtf8Bytes("test-proposal"));

    // Queue via governor -> timelock flow
    await expect(governor.connect(proposer).queue(
      [receiver.address],
      [0],
      [callData],
      salt
    )).to.not.be.reverted;

    // Verify proposal is queued
    const proposalId = await timelock.hashOperationBatch(
      [receiver.address],
      [0],
      [callData],
      salt
    );

    expect(await timelock.isOperationPending(proposalId)).to.be.true;
    expect(await timelock.isOperationReady(proposalId)).to.be.false;

    // Fast-forward time less than delay -> cannot execute
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]); // +1 day
    await ethers.provider.send("evm_mine", []);

    expect(await timelock.isOperationReady(proposalId)).to.be.false;
    await expect(governor.connect(executor).execute(
      [receiver.address],
      [0],
      [callData],
      salt
    )).to.be.revertedWith("TimelockController: operation is not ready");

    // Fast-forward past delay
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 2]); // +2 more days
    await ethers.provider.send("evm_mine", []);

    expect(await timelock.isOperationReady(proposalId)).to.be.true;

    // Execute should now succeed
    await expect(governor.connect(executor).execute(
      [receiver.address],
      [0],
      [callData],
      salt
    )).to.not.be.reverted;

    // Verify execution
    expect(await receiver.flag()).to.equal(true);
  });

  it("should prevent unauthorized queuing", async function () {
    const iface = receiver.interface;
    const callData = iface.encodeFunctionData("setFlag", [true]);
    const salt = keccak256(toUtf8Bytes("unauthorized-test"));

    // Stranger should not be able to queue
    await expect(governor.connect(stranger).queue(
      [receiver.address],
      [0],
      [callData],
      salt
    )).to.be.revertedWith("Governor: proposer restricted");
  });

  it("should prevent unauthorized execution", async function () {
    const iface = receiver.interface;
    const callData = iface.encodeFunctionData("setFlag", [true]);
    const salt = keccak256(toUtf8Bytes("execution-test"));

    // Queue first
    await governor.connect(proposer).queue(
      [receiver.address],
      [0],
      [callData],
      salt
    );

    // Fast-forward past delay
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]);
    await ethers.provider.send("evm_mine", []);

    // Stranger should not be able to execute
    await expect(governor.connect(stranger).execute(
      [receiver.address],
      [0],
      [callData],
      salt
    )).to.be.revertedWith("Governor: executor restricted");
  });

  it("should enforce role-based access control", async function () {
    // Check initial roles
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();

    expect(await timelock.hasRole(PROPOSER_ROLE, governor.address)).to.be.true;
    expect(await timelock.hasRole(EXECUTOR_ROLE, executor.address)).to.be.true;
    expect(await timelock.hasRole(PROPOSER_ROLE, stranger.address)).to.be.false;
    expect(await timelock.hasRole(EXECUTOR_ROLE, stranger.address)).to.be.false;
  });

  it("should handle batch operations correctly", async function () {
    // Test multiple operations in one proposal
    const iface = receiver.interface;
    const callData1 = iface.encodeFunctionData("setFlag", [true]);
    const callData2 = iface.encodeFunctionData("setValue", [42]);
    const salt = keccak256(toUtf8Bytes("batch-test"));

    // Queue batch
    await expect(governor.connect(proposer).queue(
      [receiver.address, receiver.address],
      [0, 0],
      [callData1, callData2],
      salt
    )).to.not.be.reverted;

    // Fast-forward past delay
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]);
    await ethers.provider.send("evm_mine", []);

    // Execute batch
    await expect(governor.connect(executor).execute(
      [receiver.address, receiver.address],
      [0, 0],
      [callData1, callData2],
      salt
    )).to.not.be.reverted;

    // Verify both operations executed
    expect(await receiver.flag()).to.equal(true);
    expect(await receiver.value()).to.equal(42);
  });
});
