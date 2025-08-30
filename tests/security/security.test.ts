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

    // Deploy real ARCTimelock contract
    const ARCTimelock = await ethers.getContractFactory("ARCTimelock");
    timelockContract = await ARCTimelock.deploy();
    await timelockContract.waitForDeployment();

    // Initialize timelock with proper config (only if not already initialized)
    let timelockInitialized = false;
    try {
      const timelockConfig = {
        minDelay: 24 * 60 * 60, // 24 hours
        maxDelay: 30 * 24 * 60 * 60, // 30 days
        gracePeriod: 14 * 24 * 60 * 60, // 14 days
        emergencyDelay: 60 * 60, // 1 hour
        maxOperationsPerBatch: 10,
        emergencyEnabled: true,
        requiredApprovals: 1
      };

      await timelockContract.initialize(ctx.deployer.address, timelockConfig);
      timelockInitialized = true;
    } catch (error: any) {
      // Contract might already be initialized, continue
      if (!error.message.includes("already initialized")) {
        throw error;
      }
      console.log("Timelock already initialized");
    }

    // Deploy real ARCGovernor contract
    const ARCGovernor = await ethers.getContractFactory("ARCGovernor");
    governorContract = await ARCGovernor.deploy();
    await governorContract.waitForDeployment();

    // Initialize governor with proper config (only if not already initialized)
    let governorInitialized = false;
    try {
      const governorConfig = {
        votingDelay: 1, // 1 block
        votingPeriod: 50400, // ~7 days in blocks
        proposalThreshold: ethers.parseEther("1000"),
        quorumPercentage: 4, // 4%
        timelockDelay: 24 * 60 * 60, // 24 hours
        convictionGrowth: 100, // 1.0 growth rate
        emergencyThreshold: ethers.parseEther("10000"),
        quadraticVotingEnabled: false,
        convictionVotingEnabled: false
      };

      await governorContract.initialize(
        ctx.deployer.address,
        await tokenContract.getAddress(),
        await timelockContract.getAddress(),
        ctx.deployer.address, // treasury address
        governorConfig
      );
      governorInitialized = true;
    } catch (error: any) {
      // Contract might already be initialized, continue
      if (!error.message.includes("already initialized")) {
        throw error;
      }
      console.log("Governor already initialized");
    }

    // Setup proper roles for testing - ensure deployer has all necessary roles
    const proposerRole = await timelockContract.PROPOSER_ROLE();
    const executorRole = await timelockContract.EXECUTOR_ROLE();
    const adminRole = await timelockContract.ADMIN_ROLE();
    const cancellerRole = await timelockContract.CANCELLER_ROLE();
    const emergencyRole = await timelockContract.EMERGENCY_ROLE();

    // Check if deployer has DEFAULT_ADMIN_ROLE
    const defaultAdminRole = await timelockContract.DEFAULT_ADMIN_ROLE();
    const hasDefaultAdmin = await timelockContract.hasRole(defaultAdminRole, ctx.deployer.address);

    if (!hasDefaultAdmin) {
      // Try to grant DEFAULT_ADMIN_ROLE if possible
      try {
        await timelockContract.connect(ctx.deployer).grantRole(defaultAdminRole, ctx.deployer.address);
      } catch (error: any) {
        console.log("Cannot grant DEFAULT_ADMIN_ROLE - contract may be initialized by different admin");
      }
    }

    // Get the actual admin of the timelock contract
    // Note: getRoleMember may not be available in this contract version
    console.log("Contracts initialized, proceeding with tests");

    // Setup initial token balances for testing - ensure deployer has enough for proposal threshold
    const proposalThreshold = ethers.parseEther("1000");
    let deployerBalance = await tokenContract.balanceOf(ctx.deployer.address);

    // If deployer has no tokens, mint some
    if (deployerBalance == 0n) {
      try {
        await tokenContract.mint(ctx.deployer.address, ethers.parseEther("10000000"));
        deployerBalance = await tokenContract.balanceOf(ctx.deployer.address);
      } catch (error: any) {
        console.log("Cannot mint tokens - deployer may not have minter role");
      }
    }

    // Ensure deployer has enough tokens for proposal threshold
    if (deployerBalance < proposalThreshold) {
      const additionalTokens = proposalThreshold - deployerBalance + ethers.parseEther("1000"); // Extra buffer
      try {
        await tokenContract.mint(ctx.deployer.address, additionalTokens);
      } catch (error: any) {
        console.log("Cannot mint additional tokens");
      }
    }

    // Transfer tokens to other accounts if deployer has sufficient balance
    deployerBalance = await tokenContract.balanceOf(ctx.deployer.address);
    const transferAmount = ethers.parseEther("100000");

    if (deployerBalance >= transferAmount * 3n) {
      await tokenContract.connect(ctx.deployer).transfer(ctx.admin.address, transferAmount);
      await tokenContract.connect(ctx.deployer).transfer(ctx.proposer.address, transferAmount);
      await tokenContract.connect(ctx.deployer).transfer(ctx.executor.address, transferAmount);
    } else {
      console.log("Insufficient token balance for transfers - skipping account funding");
    }
  });

  describe("Access Control Security", function () {
    it("should prevent unauthorized role granting", async function () {
      const proposerRole = await timelockContract.PROPOSER_ROLE();

      // Stranger should not be able to grant roles
      await expect(
        timelockContract.connect(ctx.stranger).grantRole(proposerRole, ctx.stranger.address)
      ).to.be.reverted;
    });

    it("should prevent unauthorized role revocation", async function () {
      const proposerRole = await timelockContract.PROPOSER_ROLE();

      // Stranger should not be able to revoke roles
      await expect(
        timelockContract.connect(ctx.stranger).revokeRole(proposerRole, ctx.proposer.address)
      ).to.be.reverted;
    });

    it("should enforce role-based function access", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);

      // Test proposer role access for scheduling - use batch format
      await expect(
        timelockContract.connect(ctx.stranger).schedule(
          [await tokenContract.getAddress()], // targets array
          [0], // values array
          [callData], // datas array
          3600, // delay
          ethers.ZeroHash, // predecessor
          ethers.ZeroHash, // salt
          "Test operation" // description
        )
      ).to.be.reverted;
    });
  });

  describe("Timelock Security", function () {
    it("should enforce minimum delay requirements", async function () {
      // Try to grant PROPOSER_ROLE to deployer if needed
      const proposerRole = await timelockContract.PROPOSER_ROLE();
      const executorRole = await timelockContract.EXECUTOR_ROLE();

      try {
        const hasProposer = await timelockContract.hasRole(proposerRole, ctx.deployer.address);
        if (!hasProposer) {
          await timelockContract.connect(ctx.deployer).grantRole(proposerRole, ctx.deployer.address);
        }
        const hasExecutor = await timelockContract.hasRole(executorRole, ctx.deployer.address);
        if (!hasExecutor) {
          await timelockContract.connect(ctx.deployer).grantRole(executorRole, ctx.deployer.address);
        }
      } catch (error: any) {
        console.log("Could not grant roles, proceeding with test");
      }

      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-delay"));

      // Schedule operation using batch format
      await timelockContract.connect(ctx.deployer).schedule(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        3600, // delay
        ethers.ZeroHash, // predecessor
        salt, // salt
        "Test delay operation" // description
      );

      // Calculate operation ID for verification (not used in this test but kept for consistency)
      ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address[]", "uint256[]", "bytes[]", "bytes32", "bytes32"],
          [[await tokenContract.getAddress()], [0], [callData], ethers.ZeroHash, salt]
        )
      );

      // Try to execute immediately (should fail)
      await expect(
        timelockContract.connect(ctx.deployer).execute(
          [await tokenContract.getAddress()], // targets array
          [0], // values array
          [callData], // datas array
          ethers.ZeroHash, // predecessor
          salt // salt
        )
      ).to.be.revertedWith("TimelockController: operation is not ready");

      // Fast-forward past delay
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      // Now execution should succeed
      await expect(
        timelockContract.connect(ctx.deployer).execute(
          [await tokenContract.getAddress()], // targets array
          [0], // values array
          [callData], // datas array
          ethers.ZeroHash, // predecessor
          salt // salt
        )
      ).to.not.be.reverted;
    });

    it("should prevent operation replay", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-replay"));

      // Schedule and execute operation using batch format - use admin account
      await timelockContract.connect(ctx.admin).schedule(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        3600, // delay
        ethers.ZeroHash, // predecessor
        salt, // salt
        "Test replay operation" // description
      );

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      await timelockContract.connect(ctx.admin).execute(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        ethers.ZeroHash, // predecessor
        salt // salt
      );

      // Try to execute again (should fail)
      await expect(
        timelockContract.connect(ctx.admin).execute(
          [await tokenContract.getAddress()], // targets array
          [0], // values array
          [callData], // datas array
          ethers.ZeroHash, // predecessor
          salt // salt
        )
      ).to.be.revertedWith("TimelockController: operation already executed");
    });
  });

  describe("Governor Security", function () {
    it("should validate proposal parameters", async function () {
      // Test with empty targets (should fail)
      await expect(
        governorContract.connect(ctx.stranger).propose(
          0, // ProposalCategory.Treasury
          0, // VotingType.SingleChoice
          "Test Proposal", // title
          "Invalid description", // description
          "", // metadataURI
          [], // targets (empty)
          [], // values
          [], // calldatas
          ethers.parseEther("1000"), // proposalThreshold
          4, // quorumThreshold
          24 * 60 * 60 // timelockDelay
        )
      ).to.be.revertedWith("Empty proposal");
    });

    it("should enforce voting period limits", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);

      // Create a valid proposal using correct signature
      await governorContract.connect(ctx.deployer).propose(
        0, // ProposalCategory.Treasury
        0, // VotingType.SingleChoice
        "Test Proposal", // title
        "Test proposal", // description
        "", // metadataURI
        [await tokenContract.getAddress()], // targets
        [0], // values
        [callData], // calldatas
        ethers.parseEther("1000"), // proposalThreshold
        4, // quorumThreshold
        24 * 60 * 60 // timelockDelay
      );

      // Try to execute before voting period ends - need to get proposal ID first
      const proposalCount = await governorContract.proposalCount();
      const proposalId = proposalCount - 1n;

      await expect(
        governorContract.connect(ctx.deployer).execute(proposalId)
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
          [await tokenContract.getAddress()], // targets array
          [ethers.parseEther("1")], // values array with non-zero value
          ["0x"], // empty call data array
          3600, // delay
          ethers.ZeroHash, // predecessor
          ethers.ZeroHash, // salt
          "Test empty call data" // description
        ),
        "TimelockController: underlying transaction reverted"
      );
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency cancellation by authorized roles", async function () {
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("emergency-test"));

      // Schedule operation using batch format
      await timelockContract.connect(ctx.deployer).schedule(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        3600, // delay
        ethers.ZeroHash, // predecessor
        salt, // salt
        "Emergency test operation" // description
      );

      const operationId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address[]", "uint256[]", "bytes[]", "bytes32", "bytes32"],
          [[await tokenContract.getAddress()], [0], [callData], ethers.ZeroHash, salt]
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

      // Schedule operation using batch format
      await timelockContract.connect(ctx.deployer).schedule(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        3600, // delay
        ethers.ZeroHash, // predecessor
        salt, // salt
        "Gas test operation" // description
      );

      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);

      // Execute and check gas usage is reasonable
      const tx = await timelockContract.connect(ctx.deployer).execute(
        [await tokenContract.getAddress()], // targets array
        [0], // values array
        [callData], // datas array
        ethers.ZeroHash, // predecessor
        salt // salt
      );

      const receipt = await tx.wait();
      expect(receipt!.gasUsed).to.be.lt(300000); // Should be well under block gas limit
    });
  });
});
