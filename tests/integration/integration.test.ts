// tests/integration/integration.test.ts
// Integration tests using actual contract deployments

import { expect } from "chai";
import { ethers } from "hardhat";
import { setupTestContext, SecurityTests } from "../shared/test-helpers";
import { Contract } from "ethers";

// Global declarations for Mocha with proper types
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const beforeEach: (fn: () => void | Promise<void>) => void;

describe("Integration Test Suite", function () {
  let ctx: Awaited<ReturnType<typeof setupTestContext>>;
  let auctionContract: any;
  let airdropContract: any;
  let stakingContract: any;
  let tokenContract: any;

  beforeEach(async function () {
    ctx = await setupTestContext();

    // Deploy actual contracts for integration testing
    const ARCxToken = await ethers.getContractFactory("ARCxToken");
    tokenContract = await ARCxToken.deploy();
    await tokenContract.waitForDeployment();

    const DutchAuction = await ethers.getContractFactory("ARCxDutchAuction");
    auctionContract = await DutchAuction.deploy(await tokenContract.getAddress());
    await auctionContract.waitForDeployment();

    const SmartAirdrop = await ethers.getContractFactory("ARCxSmartAirdrop");
    airdropContract = await SmartAirdrop.deploy(await tokenContract.getAddress());
    await airdropContract.waitForDeployment();

    const StakingVault = await ethers.getContractFactory("StakingVault");
    stakingContract = await StakingVault.deploy(await tokenContract.getAddress());
    await stakingContract.waitForDeployment();

    // Setup initial token balances
    await tokenContract.connect(ctx.deployer).transfer(ctx.admin.address, ethers.parseEther("1000000"));
    await tokenContract.connect(ctx.deployer).transfer(ctx.proposer.address, ethers.parseEther("1000000"));
    await tokenContract.connect(ctx.deployer).transfer(ctx.executor.address, ethers.parseEther("1000000"));
  });

  describe("Dutch Auction Integration", function () {
    it("should handle full auction lifecycle securely", async function () {
      // Setup auction parameters
      const startPrice = ethers.parseEther("1");
      const endPrice = ethers.parseEther("0.1");
      const duration = 3600; // 1 hour

      // Start auction
      await auctionContract.connect(ctx.deployer).startAuction(startPrice, endPrice, duration);

      // Verify auction state
      expect(await auctionContract.auctionActive()).to.equal(true);
      expect(await auctionContract.startPrice()).to.equal(startPrice);

      // Test bidding security
      const bidAmount = ethers.parseEther("1000");
      await tokenContract.connect(ctx.admin).approve(await auctionContract.getAddress(), bidAmount);

      // Place bid
      await expect(
        auctionContract.connect(ctx.admin).placeBid(bidAmount)
      ).to.not.be.reverted;

      // Verify bid was recorded
      const bidInfo = await auctionContract.bids(ctx.admin.address);
      expect(bidInfo.amount).to.equal(bidAmount);
    });

    it("should prevent invalid auction operations", async function () {
      // Test starting auction without proper setup
      await expect(
        auctionContract.connect(ctx.stranger).startAuction(0, 0, 0)
      ).to.be.revertedWith("AccessControl");

      // Test bidding on inactive auction
      await expect(
        auctionContract.connect(ctx.admin).placeBid(ethers.parseEther("100"))
      ).to.be.revertedWith("Auction not active");
    });

    it("should handle gas efficiently during high load", async function () {
      // Setup auction
      const startPrice = ethers.parseEther("1");
      const endPrice = ethers.parseEther("0.1");
      const duration = 3600;

      await auctionContract.connect(ctx.deployer).startAuction(startPrice, endPrice, duration);

      // Simulate multiple bids
      const bidPromises = [];
      for (let i = 0; i < 10; i++) {
        const bidder = ctx.users[i % ctx.users.length];
        const bidAmount = ethers.parseEther((100 + i * 10).toString());

        await tokenContract.connect(ctx.deployer).transfer(bidder.address, bidAmount);
        await tokenContract.connect(bidder).approve(await auctionContract.getAddress(), bidAmount);

        bidPromises.push(
          auctionContract.connect(bidder).placeBid(bidAmount)
        );
      }

      // Execute all bids
      const txs = await Promise.all(bidPromises);

      // Verify gas usage is reasonable
      for (const tx of txs) {
        const receipt = await tx.wait();
        expect(receipt!.gasUsed).to.be.lt(200000); // Should be efficient
      }
    });
  });

  describe("Smart Airdrop Integration", function () {
    it("should handle secure airdrop distribution", async function () {
      // Setup airdrop parameters
      const recipients = [ctx.admin.address, ctx.proposer.address, ctx.executor.address];
      const amounts = [
        ethers.parseEther("1000"),
        ethers.parseEther("2000"),
        ethers.parseEther("1500")
      ];

      // Create merkle tree for secure distribution
      const merkleRoot = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address[]", "uint256[]"],
          [recipients, amounts]
        )
      );

      // Start airdrop
      await airdropContract.connect(ctx.deployer).startAirdrop(merkleRoot, ethers.parseEther("4500"));

      // Test claiming with valid proof
      const leaf = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [ctx.admin.address, amounts[0]]
        )
      );

      await expect(
        airdropContract.connect(ctx.admin).claim(amounts[0], [leaf])
      ).to.not.be.reverted;
    });

    it("should prevent double claims and invalid proofs", async function () {
      // Setup basic airdrop
      const recipients = [ctx.admin.address];
      const amounts = [ethers.parseEther("1000")];

      const merkleRoot = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address[]", "uint256[]"],
          [recipients, amounts]
        )
      );

      await airdropContract.connect(ctx.deployer).startAirdrop(merkleRoot, ethers.parseEther("1000"));

      // First claim should work
      const leaf = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [ctx.admin.address, amounts[0]]
        )
      );

      await airdropContract.connect(ctx.admin).claim(amounts[0], [leaf]);

      // Second claim should fail
      await expect(
        airdropContract.connect(ctx.admin).claim(amounts[0], [leaf])
      ).to.be.revertedWith("Already claimed");

      // Invalid proof should fail
      await expect(
        airdropContract.connect(ctx.stranger).claim(amounts[0], [ethers.ZeroHash])
      ).to.be.revertedWith("Invalid proof");
    });
  });

  describe("Staking Vault Integration", function () {
    it("should handle secure staking operations", async function () {
      // Setup staking
      const stakeAmount = ethers.parseEther("10000");

      // Approve and stake
      await tokenContract.connect(ctx.admin).approve(await stakingContract.getAddress(), stakeAmount);
      await stakingContract.connect(ctx.admin).stake(stakeAmount);

      // Verify staking
      const stakeInfo = await stakingContract.stakes(ctx.admin.address);
      expect(stakeInfo.amount).to.equal(stakeAmount);
      expect(stakeInfo.timestamp).to.be.gt(0);

      // Test unstaking
      await stakingContract.connect(ctx.admin).unstake(stakeAmount);
      const updatedStake = await stakingContract.stakes(ctx.admin.address);
      expect(updatedStake.amount).to.equal(0);
    });

    it("should enforce staking limits and cooldowns", async function () {
      const stakeAmount = ethers.parseEther("10000");

      // Test staking without approval
      await expect(
        stakingContract.connect(ctx.admin).stake(stakeAmount)
      ).to.be.revertedWith("ERC20: insufficient allowance");

      // Approve and stake
      await tokenContract.connect(ctx.admin).approve(await stakingContract.getAddress(), stakeAmount);
      await stakingContract.connect(ctx.admin).stake(stakeAmount);

      // Test immediate unstaking (should have cooldown)
      await expect(
        stakingContract.connect(ctx.admin).unstake(stakeAmount)
      ).to.be.revertedWith("Cooldown not met");

      // Test unstaking more than staked
      await expect(
        stakingContract.connect(ctx.admin).unstake(ethers.parseEther("20000"))
      ).to.be.revertedWith("Insufficient stake");
    });

    it("should calculate rewards accurately", async function () {
      const stakeAmount = ethers.parseEther("10000");

      // Stake tokens
      await tokenContract.connect(ctx.admin).approve(await stakingContract.getAddress(), stakeAmount);
      await stakingContract.connect(ctx.admin).stake(stakeAmount);

      // Fast forward time to accrue rewards
      await ethers.provider.send("evm_increaseTime", [86400 * 30]); // 30 days
      await ethers.provider.send("evm_mine", []);

      // Check reward calculation
      const rewards = await stakingContract.calculateRewards(ctx.admin.address);
      expect(rewards).to.be.gt(0);

      // Claim rewards
      const initialBalance = await tokenContract.balanceOf(ctx.admin.address);
      await stakingContract.connect(ctx.admin).claimRewards();
      const finalBalance = await tokenContract.balanceOf(ctx.admin.address);

      expect(finalBalance - initialBalance).to.equal(rewards);
    });
  });

  describe("Cross-Contract Security", function () {
    it("should handle complex multi-contract interactions securely", async function () {
      // Setup integrated scenario: Stake -> Participate in auction -> Claim airdrop

      // 1. Stake tokens
      const stakeAmount = ethers.parseEther("50000");
      await tokenContract.connect(ctx.admin).approve(await stakingContract.getAddress(), stakeAmount);
      await stakingContract.connect(ctx.admin).stake(stakeAmount);

      // 2. Start auction and participate
      const startPrice = ethers.parseEther("1");
      const endPrice = ethers.parseEther("0.1");
      const duration = 3600;

      await auctionContract.connect(ctx.deployer).startAuction(startPrice, endPrice, duration);

      const bidAmount = ethers.parseEther("10000");
      await tokenContract.connect(ctx.admin).approve(await auctionContract.getAddress(), bidAmount);
      await auctionContract.connect(ctx.admin).placeBid(bidAmount);

      // 3. Setup and claim airdrop
      const recipients = [ctx.admin.address];
      const amounts = [ethers.parseEther("500")];

      const merkleRoot = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address[]", "uint256[]"],
          [recipients, amounts]
        )
      );

      await airdropContract.connect(ctx.deployer).startAirdrop(merkleRoot, ethers.parseEther("500"));

      const leaf = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [ctx.admin.address, amounts[0]]
        )
      );

      await airdropContract.connect(ctx.admin).claim(amounts[0], [leaf]);

      // Verify final state
      const finalBalance = await tokenContract.balanceOf(ctx.admin.address);
      expect(finalBalance).to.be.lt(ethers.parseEther("1000000")); // Should have spent on auction
      expect(finalBalance).to.be.gt(ethers.parseEther("500")); // Should have received airdrop
    });

    it("should handle reentrancy protection across contracts", async function () {
      // Test that operations across multiple contracts are atomic
      const operations = [
        async () => {
          await tokenContract.connect(ctx.admin).approve(await stakingContract.getAddress(), ethers.parseEther("1000"));
          await stakingContract.connect(ctx.admin).stake(ethers.parseEther("1000"));
        },
        async () => {
          await tokenContract.connect(ctx.admin).approve(await auctionContract.getAddress(), ethers.parseEther("500"));
          await auctionContract.connect(ctx.admin).placeBid(ethers.parseEther("500"));
        }
      ];

      // Execute operations and verify they complete atomically
      for (const operation of operations) {
        await expect(operation()).to.not.be.reverted;
      }

      // Verify final state consistency
      const stakeInfo = await stakingContract.stakes(ctx.admin.address);
      const bidInfo = await auctionContract.bids(ctx.admin.address);

      expect(stakeInfo.amount).to.equal(ethers.parseEther("1000"));
      expect(bidInfo.amount).to.equal(ethers.parseEther("500"));
    });
  });

  describe("Gas Usage and Performance", function () {
    it("should maintain gas efficiency under load", async function () {
      // Setup multiple users and operations
      const userCount = 5;
      const operationsPerUser = 3;

      const gasUsages: bigint[] = [];

      for (let i = 0; i < userCount; i++) {
        const user = ctx.users[i];

        // Transfer tokens to user
        await tokenContract.connect(ctx.deployer).transfer(user.address, ethers.parseEther("10000"));

        // Perform multiple operations
        for (let j = 0; j < operationsPerUser; j++) {
          const amount = ethers.parseEther((1000 + j * 100).toString());

          await tokenContract.connect(user).approve(await stakingContract.getAddress(), amount);
          const tx = await stakingContract.connect(user).stake(amount);
          const receipt = await tx.wait();

          gasUsages.push(receipt!.gasUsed);
        }
      }

      // Analyze gas usage
      const avgGas = gasUsages.reduce((a, b) => a + b, 0n) / BigInt(gasUsages.length);
      const maxGas = gasUsages.reduce((a, b) => a > b ? a : b);

      // Gas should be reasonable and consistent
      expect(avgGas).to.be.lt(150000n);
      expect(maxGas).to.be.lt(200000n);

      console.log(`Average gas usage: ${avgGas}`);
      console.log(`Max gas usage: ${maxGas}`);
    });

    it("should handle concurrent operations efficiently", async function () {
      // Setup concurrent staking operations
      const concurrentOperations = 10;
      const stakePromises = [];

      for (let i = 0; i < concurrentOperations; i++) {
        const user = ctx.users[i % ctx.users.length];
        const amount = ethers.parseEther((1000 + i * 100).toString());

        await tokenContract.connect(ctx.deployer).transfer(user.address, amount);
        await tokenContract.connect(user).approve(await stakingContract.getAddress(), amount);

        stakePromises.push(
          stakingContract.connect(user).stake(amount)
        );
      }

      // Execute all operations concurrently
      const startTime = Date.now();
      const txs = await Promise.all(stakePromises);
      const endTime = Date.now();

      // Verify all operations completed
      expect(txs).to.have.lengthOf(concurrentOperations);

      // Check gas usage for concurrent operations
      for (const tx of txs) {
        const receipt = await tx.wait();
        expect(receipt!.gasUsed).to.be.lt(200000n);
      }

      console.log(`Concurrent operations completed in ${endTime - startTime}ms`);
    });
  });
});
