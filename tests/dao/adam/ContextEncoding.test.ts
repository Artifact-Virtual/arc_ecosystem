import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("Policy Context Encoding Tests", function () {
  let paramsGuard: Contract;
  let treasuryLimiter: Contract;
  let rwaRecency: Contract;
  let dual2FA: Contract;
  let admin: Signer;
  let treasury: Signer;
  
  const WASM_HASH = ethers.keccak256(ethers.toUtf8Bytes("Test-v1"));
  const EPOCH_CAP = ethers.parseEther("1000000");
  const LARGE_TX = ethers.parseEther("100000");
  const MIN_STAKE = ethers.parseEther("10000");

  beforeEach(async function () {
    [admin, treasury] = await ethers.getSigners();

    // Deploy policies
    const ParamsGuardPolicy = await ethers.getContractFactory("ParamsGuardPolicy");
    paramsGuard = await ParamsGuardPolicy.deploy(await admin.getAddress(), WASM_HASH);

    const TreasuryLimiterPolicy = await ethers.getContractFactory("TreasuryLimiterPolicy");
    treasuryLimiter = await TreasuryLimiterPolicy.deploy(
      await admin.getAddress(),
      await treasury.getAddress(),
      WASM_HASH,
      EPOCH_CAP,
      LARGE_TX
    );

    const RWARecencyPolicy = await ethers.getContractFactory("RWARecencyPolicy");
    rwaRecency = await RWARecencyPolicy.deploy(
      await admin.getAddress(),
      await treasury.getAddress(),
      WASM_HASH,
      MIN_STAKE
    );

    const Dual2FAPolicy = await ethers.getContractFactory("Dual2FAPolicy");
    dual2FA = await Dual2FAPolicy.deploy(
      await admin.getAddress(),
      WASM_HASH,
      ethers.parseEther("50000"),
      ethers.parseUnits("10", 16)
    );
  });

  describe("ParamsGuardPolicy ABI Encoding", function () {
    it("should accept ABI-encoded parameter changes", async function () {
      const paramKey = ethers.keccak256(ethers.toUtf8Bytes("TEST_PARAM"));
      
      // Set bounds first
      await paramsGuard.connect(admin).setParamBounds(
        paramKey,
        0,
        1000,
        false,
        false
      );

      // Encode context
      const keys = [paramKey];
      const oldValues = [100];
      const newValues = [200];
      
      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes32[]", "uint256[]", "uint256[]"],
        [keys, oldValues, newValues]
      );

      const [verdict, data] = await paramsGuard.evaluate(ctx);
      expect(verdict).to.equal(0); // VERDICT_ALLOW
    });

    it("should handle multiple parameter changes", async function () {
      const param1 = ethers.keccak256(ethers.toUtf8Bytes("PARAM1"));
      const param2 = ethers.keccak256(ethers.toUtf8Bytes("PARAM2"));
      
      await paramsGuard.connect(admin).setParamBounds(param1, 0, 1000, false, false);
      await paramsGuard.connect(admin).setParamBounds(param2, 0, 2000, false, false);

      const keys = [param1, param2];
      const oldValues = [100, 500];
      const newValues = [200, 600];
      
      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes32[]", "uint256[]", "uint256[]"],
        [keys, oldValues, newValues]
      );

      const [verdict, data] = await paramsGuard.evaluate(ctx);
      expect(verdict).to.equal(0);
    });

    it("should reject malformed context", async function () {
      const ctx = "0x1234"; // Invalid encoding
      
      await expect(
        paramsGuard.evaluate(ctx)
      ).to.be.reverted;
    });
  });

  describe("TreasuryLimiterPolicy ABI Encoding", function () {
    it("should accept ABI-encoded treasury action", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("50000");
      const recipient = await admin.getAddress();
      const grantId = ethers.ZeroHash;

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address", "bytes32"],
        [proposalId, amount, recipient, grantId]
      );

      const [verdict, data] = await treasuryLimiter.evaluate(ctx);
      expect(verdict).to.equal(0);
    });

    it("should require 2FA for large transactions", async function () {
      const proposalId = 1;
      const amount = ethers.parseEther("150000"); // Above threshold
      const recipient = await admin.getAddress();
      const grantId = ethers.ZeroHash;

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address", "bytes32"],
        [proposalId, amount, recipient, grantId]
      );

      const [verdict, data] = await treasuryLimiter.evaluate(ctx);
      expect(verdict).to.equal(3); // VERDICT_REQUIRE_2FA
    });
  });

  describe("RWARecencyPolicy ABI Encoding", function () {
    beforeEach(async function () {
      // Configure policy
      await rwaRecency.connect(admin).setRecencyWindow(2, 3600); // 1 hour for ENERGY topic
      await rwaRecency.connect(admin).setMinOracles(2, 2);
      await rwaRecency.connect(admin).setMinSLA(2, 9500);
      
      // Register operators
      await rwaRecency.connect(admin).registerOperator(
        await admin.getAddress(),
        MIN_STAKE,
        9500
      );
      await rwaRecency.connect(admin).registerOperator(
        await treasury.getAddress(),
        MIN_STAKE,
        9500
      );
    });

    it("should accept ABI-encoded RWA update", async function () {
      const topicId = 2; // ENERGY
      const timestamp = Math.floor(Date.now() / 1000);
      const operators = [await admin.getAddress(), await treasury.getAddress()];

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address[]"],
        [topicId, timestamp, operators]
      );

      const [verdict, data] = await rwaRecency.evaluate(ctx);
      expect(verdict).to.equal(0);
    });

    it("should reject old oracle data", async function () {
      const topicId = 2;
      const timestamp = Math.floor(Date.now() / 1000) - 7200; // 2 hours ago
      const operators = [await admin.getAddress(), await treasury.getAddress()];

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address[]"],
        [topicId, timestamp, operators]
      );

      const [verdict, data] = await rwaRecency.evaluate(ctx);
      expect(verdict).to.equal(1); // VERDICT_DENY
    });
  });

  describe("Dual2FAPolicy ABI Encoding", function () {
    it("should accept ABI-encoded action", async function () {
      const topicId = 0; // TREASURY
      const actionType = 1;
      const identifier = ethers.ZeroHash;
      const value = ethers.parseEther("30000"); // Below threshold

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "bytes32", "uint256"],
        [topicId, actionType, identifier, value]
      );

      const [verdict, data] = await dual2FA.evaluate(ctx);
      expect(verdict).to.equal(0); // VERDICT_ALLOW
    });

    it("should require 2FA for large treasury action", async function () {
      const topicId = 0;
      const actionType = 1;
      const identifier = ethers.ZeroHash;
      const value = ethers.parseEther("60000"); // Above threshold

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "bytes32", "uint256"],
        [topicId, actionType, identifier, value]
      );

      const [verdict, data] = await dual2FA.evaluate(ctx);
      expect(verdict).to.equal(3); // VERDICT_REQUIRE_2FA
    });

    it("should require 2FA for critical parameters", async function () {
      const topicId = 1; // PARAMS
      const actionType = 1;
      const identifier = ethers.keccak256(ethers.toUtf8Bytes("QUORUM_PCT")); // Critical param
      const value = ethers.parseUnits("5", 16); // 5% change

      const ctx = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "bytes32", "uint256"],
        [topicId, actionType, identifier, value]
      );

      const [verdict, data] = await dual2FA.evaluate(ctx);
      expect(verdict).to.equal(3); // VERDICT_REQUIRE_2FA
    });
  });
});
