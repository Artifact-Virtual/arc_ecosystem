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

    // Use unique deployment to avoid conflicts with already initialized contracts
    const uniqueId = Date.now() + Math.random();

    // Deploy fresh contracts with unique bytecode to ensure clean state
    const ARCxToken = await ethers.getContractFactory("ARCxToken");
    // Temporarily remove unique bytecode to test if that's the issue
    // const tokenBytecode = ARCxToken.bytecode + uniqueId.toString().slice(-4);
    // const tokenFactory = new ethers.ContractFactory(ARCxToken.interface, tokenBytecode, ctx.deployer);
    const tokenFactory = new ethers.ContractFactory(ARCxToken.interface, ARCxToken.bytecode, ctx.deployer);

    // Debug: Log deployer address
    console.log("Deployer address:", ctx.deployer.address);
    console.log("Deployer balance:", await ethers.provider.getBalance(ctx.deployer.address));

    tokenContract = await tokenFactory.deploy(
      "ARCx Token",
      "ARCX",
      ethers.parseEther("1000000000"), // 1 billion cap
      ctx.deployer.address
    );
    await tokenContract.waitForDeployment();

    // Deploy ARCTimelock with unique bytecode
    const ARCTimelock = await ethers.getContractFactory("ARCTimelock");
    const timelockBytecode = ARCTimelock.bytecode + uniqueId.toString().slice(-4);
    const timelockFactory = new ethers.ContractFactory(ARCTimelock.interface, timelockBytecode, ctx.deployer);
    timelockContract = await timelockFactory.deploy();
    await timelockContract.waitForDeployment();

    // Initialize timelock with deployer as admin and shorter delays for testing
    const timelockConfig = {
      minDelay: 60, // 1 minute for testing (reduced from 1 hour)
      maxDelay: 30 * 24 * 60 * 60, // 30 days
      gracePeriod: 14 * 24 * 60 * 60, // 14 days
      emergencyDelay: 30, // 30 seconds for testing (reduced from 5 minutes)
      maxOperationsPerBatch: 10,
      emergencyEnabled: true,
      requiredApprovals: 1
    };

    await timelockContract.initialize(ctx.deployer.address, timelockConfig);

    // Grant roles to test accounts using deployer (who is now the admin)
    const proposerRole = await timelockContract.PROPOSER_ROLE();
    const executorRole = await timelockContract.EXECUTOR_ROLE();
    const adminRole = await timelockContract.ADMIN_ROLE();

    // Grant roles to all test accounts
    await timelockContract.connect(ctx.deployer).grantRole(proposerRole, ctx.deployer.address);
    await timelockContract.connect(ctx.deployer).grantRole(executorRole, ctx.deployer.address);
    await timelockContract.connect(ctx.deployer).grantRole(proposerRole, ctx.proposer.address);
    await timelockContract.connect(ctx.deployer).grantRole(executorRole, ctx.executor.address);
    await timelockContract.connect(ctx.deployer).grantRole(adminRole, ctx.admin.address);

    // Deploy ARCGovernor with unique bytecode
    const ARCGovernor = await ethers.getContractFactory("ARCGovernor");
    const governorBytecode = ARCGovernor.bytecode + uniqueId.toString().slice(-4);
    const governorFactory = new ethers.ContractFactory(ARCGovernor.interface, governorBytecode, ctx.deployer);
    governorContract = await governorFactory.deploy();
    await governorContract.waitForDeployment();

    // Initialize governor with shorter voting periods for testing
    const governorConfig = {
      votingDelay: 1, // 1 block
      votingPeriod: 50, // Short period for testing (reduced from 100)
      proposalThreshold: ethers.parseEther("1000"),
      quorumPercentage: 4, // 4%
      timelockDelay: 60, // 1 minute (reduced from 1 hour)
      convictionGrowth: 100, // 1.0 growth rate
      emergencyThreshold: ethers.parseEther("10000"),
      quadraticVotingEnabled: false,
      convictionVotingEnabled: false
    };

    await governorContract.initialize(
      "ARC Governor",
      ctx.deployer.address,
      await tokenContract.getAddress(),
      await timelockContract.getAddress(),
      ctx.deployer.address, // treasury address
      governorConfig
    );

    // Grant MINTER_ROLE to deployer for token minting
    const minterRole = await tokenContract.MINTER_ROLE();
    await tokenContract.connect(ctx.deployer).grantRole(minterRole, ctx.deployer.address);

    // Setup test balances
    await setupTestBalances();
  });

  // Helper function to setup token balances
  async function setupTestBalances() {
    const proposalThreshold = ethers.parseEther("1000");

    // Ensure deployer has sufficient tokens
    let deployerBalance = await tokenContract.balanceOf(ctx.deployer.address);

    if (deployerBalance < proposalThreshold * 10n) { // Need plenty for all tests
      try {
        await tokenContract.mint(ctx.deployer.address, ethers.parseEther("10000000"));
        deployerBalance = await tokenContract.balanceOf(ctx.deployer.address);
      } catch {
        // Cannot mint tokens - deployer may not have minter role
      }
    }

    // Distribute tokens to test accounts
    const transferAmount = ethers.parseEther("1000000"); // 1M tokens each

    if (deployerBalance >= transferAmount * 4n) {
      const recipients = [ctx.admin, ctx.proposer, ctx.executor, ctx.stranger];
      for (const recipient of recipients) {
        try {
          await tokenContract.connect(ctx.deployer).transfer(recipient.address, transferAmount);
        } catch {
          // Could not transfer tokens, continue
        }
      }
    } else {
      // Insufficient token balance for distribution
    }
  }

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
      } catch {
        // Could not grant roles, proceeding with test
      }

      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-delay"));

      // Use deployer account which now has proper roles
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
      } catch {
        // Could not grant roles, proceeding with test
      }

      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-replay"));

      // Use deployer account which now has proper roles
      await timelockContract.connect(ctx.deployer).schedule(
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
      } catch {
        // Could not grant roles, proceeding with test
      }

      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("emergency-test"));

      // Use deployer account which now has proper roles
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
      } catch {
        // Could not grant roles, proceeding with test
      }

      // This test ensures operations don't exceed reasonable gas limits
      const callData = tokenContract.interface.encodeFunctionData("transfer", [ctx.stranger.address, ethers.parseEther("100")]);
      const salt = ethers.keccak256(ethers.toUtf8Bytes("gas-test"));

      // Use deployer account which now has proper roles
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
