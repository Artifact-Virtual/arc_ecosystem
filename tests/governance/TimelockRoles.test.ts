// tests/governance/TimelockRoles.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes, ZeroAddress } from "ethers";

describe("Timelock Roles & Governor integration", function () {
  let deployer: any, proposer: any, executor: any, stranger: any;
  let timelock: any, governor: any, receiver: any;

  beforeEach(async function () {
    [deployer, proposer, executor, stranger] = await ethers.getSigners();

    // Deploy real ARCTimelock contract
    const ARCTimelock = await ethers.getContractFactory("ARCTimelock");
    timelock = await ARCTimelock.deploy();
    await timelock.waitForDeployment();

    // Initialize timelock with proper config
    const timelockConfig = {
      minDelay: 2 * 24 * 3600, // 48 hours
      maxDelay: 30 * 24 * 60 * 60, // 30 days
      gracePeriod: 14 * 24 * 60 * 60, // 14 days
      emergencyDelay: 60 * 60, // 1 hour
      maxOperationsPerBatch: 10,
      emergencyEnabled: true,
      requiredApprovals: 1
    };

    await timelock.initialize(deployer.address, timelockConfig);

    // Deploy ARCxToken for governance
    const ARCxToken = await ethers.getContractFactory("ARCxToken");
    const token = await ARCxToken.deploy(
      "ARCx Token",
      "ARCX",
      ethers.parseEther("1000000000"),
      deployer.address
    );
    await token.waitForDeployment();

    // Deploy real ARCGovernor contract
    const ARCGovernor = await ethers.getContractFactory("ARCGovernor");
    governor = await ARCGovernor.deploy();
    await governor.waitForDeployment();

    // Initialize governor with proper config
    const governorConfig = {
      votingDelay: 1,
      votingPeriod: 50400,
      proposalThreshold: ethers.parseEther("1000"),
      quorumPercentage: 4,
      timelockDelay: 2 * 24 * 3600, // 48 hours
      convictionGrowth: 100,
      emergencyThreshold: ethers.parseEther("10000"),
      quadraticVotingEnabled: false,
      convictionVotingEnabled: false
    };

    await governor.initialize(
      deployer.address,
      await token.getAddress(),
      await timelock.getAddress(),
      deployer.address,
      governorConfig
    );

    // Grant roles
    await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governor.getAddress());
    await timelock.grantRole(await timelock.EXECUTOR_ROLE(), executor.address);

    // Deploy a simple test contract for execution testing
    const TestContract = await ethers.getContractFactory("ARCxToken");
    receiver = await TestContract.deploy("Test Token", "TEST", ethers.parseEther("1000000"), deployer.address);
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
