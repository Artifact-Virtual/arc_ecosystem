import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("TreasuryLimiterPolicy - Budget Reservation Tests", function () {
  let policy: Contract;
  let admin: Signer;
  let treasury: Signer;
  let other: Signer;
  
  const EPOCH_CAP = ethers.parseEther("1000000"); // 1M tokens
  const LARGE_TX = ethers.parseEther("100000");   // 100K tokens
  const WASM_HASH = ethers.keccak256(ethers.toUtf8Bytes("TreasuryLimiter-v1"));

  beforeEach(async function () {
    [admin, treasury, other] = await ethers.getSigners();

    const TreasuryLimiterPolicy = await ethers.getContractFactory("TreasuryLimiterPolicy");
    policy = await TreasuryLimiterPolicy.deploy(
      await admin.getAddress(),
      await treasury.getAddress(),
      WASM_HASH,
      EPOCH_CAP,
      LARGE_TX
    );
  });

  describe("Budget Reservation", function () {
    it("should reserve budget for a proposal", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");

      await expect(
        policy.connect(treasury).reserveBudget(proposalId, amount)
      ).to.emit(policy, "BudgetReserved")
        .withArgs(proposalId, amount, amount);

      expect(await policy.epochReserved()).to.equal(amount);
      expect(await policy.proposalReservations(proposalId)).to.equal(amount);
    });

    it("should prevent non-treasury from reserving budget", async function () {
      await expect(
        policy.connect(other).reserveBudget(1, ethers.parseEther("1000"))
      ).to.be.revertedWith("TreasuryLimiter: only treasury");
    });

    it("should prevent double reservation for same proposal", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");

      await policy.connect(treasury).reserveBudget(proposalId, amount);

      await expect(
        policy.connect(treasury).reserveBudget(proposalId, amount)
      ).to.be.revertedWith("TreasuryLimiter: already reserved");
    });

    it("should prevent reservation that exceeds budget", async function () {
      const amount = EPOCH_CAP + BigInt(1);

      await expect(
        policy.connect(treasury).reserveBudget(1, amount)
      ).to.be.revertedWith("TreasuryLimiter: reservation would exceed budget");
    });

    it("should handle multiple reservations correctly", async function () {
      const amount1 = ethers.parseEther("30000");
      const amount2 = ethers.parseEther("40000");

      await policy.connect(treasury).reserveBudget(1, amount1);
      await policy.connect(treasury).reserveBudget(2, amount2);

      expect(await policy.epochReserved()).to.equal(amount1 + amount2);
    });
  });

  describe("Budget Release", function () {
    beforeEach(async function () {
      await policy.connect(treasury).reserveBudget(1, ethers.parseEther("50000"));
    });

    it("should release budget for a proposal", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");

      await expect(
        policy.connect(treasury).releaseBudget(proposalId)
      ).to.emit(policy, "BudgetReleased")
        .withArgs(proposalId, amount, 0);

      expect(await policy.epochReserved()).to.equal(0);
      expect(await policy.proposalReservations(proposalId)).to.equal(0);
    });

    it("should prevent releasing non-existent reservation", async function () {
      await expect(
        policy.connect(treasury).releaseBudget(999)
      ).to.be.revertedWith("TreasuryLimiter: no reservation");
    });
  });

  describe("Record Spending with Reservation", function () {
    it("should record spending and release reservation", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");

      await policy.connect(treasury).reserveBudget(proposalId, amount);
      await policy.connect(treasury).recordSpending(proposalId, amount);

      expect(await policy.epochSpent()).to.equal(amount);
      expect(await policy.epochReserved()).to.equal(0);
      expect(await policy.proposalReservations(proposalId)).to.equal(0);
    });

    it("should handle spending without reservation", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");

      await policy.connect(treasury).recordSpending(proposalId, amount);

      expect(await policy.epochSpent()).to.equal(amount);
    });
  });

  describe("Race Condition Prevention", function () {
    it("should prevent concurrent proposals from exceeding budget", async function () {
      const amount = ethers.parseEther("600000"); // 60% of budget

      // Reserve for proposal 1
      await policy.connect(treasury).reserveBudget(1, amount);

      // Try to reserve for proposal 2 - should fail
      await expect(
        policy.connect(treasury).reserveBudget(2, amount)
      ).to.be.revertedWith("TreasuryLimiter: reservation would exceed budget");
    });

    it("should allow sequential execution after release", async function () {
      const amount = ethers.parseEther("600000");

      // Reserve, execute, and release for proposal 1
      await policy.connect(treasury).reserveBudget(1, amount);
      await policy.connect(treasury).recordSpending(1, amount);

      // Now proposal 2 should be able to reserve remaining budget
      const remaining = EPOCH_CAP - amount;
      await expect(
        policy.connect(treasury).reserveBudget(2, remaining)
      ).to.not.be.reverted;
    });
  });

  describe("ABI Encoding Context", function () {
    it("should evaluate with ABI-encoded context", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");
      const recipient = await other.getAddress();
      const grantId = ethers.ZeroHash;

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address", "bytes32"],
        [proposalId, amount, recipient, grantId]
      );

      const [verdict, data] = await policy.evaluate(ctx);
      expect(verdict).to.equal(0); // VERDICT_ALLOW
    });

    it("should reject when budget exceeded", async function () {
      const proposalId = 1;
      const amount = EPOCH_CAP + BigInt(1);
      const recipient = await other.getAddress();
      const grantId = ethers.ZeroHash;

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address", "bytes32"],
        [proposalId, amount, recipient, grantId]
      );

      const [verdict, data] = await policy.evaluate(ctx);
      expect(verdict).to.equal(1); // VERDICT_DENY
    });
  });
});
