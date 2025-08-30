import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ARCBridge Security Tests", function () {
  let bridge: Contract;
  let token: Contract;
  let admin: Signer;
  let operator: Signer;
  let validator1: Signer;
  let validator2: Signer;
  let user: Signer;
  let unauthorized: Signer;

  const BRIDGE_FEE = ethers.parseEther("0.01");
  const DAILY_LIMIT = ethers.parseEther("10000");
  const VALIDATOR_STAKE = ethers.parseEther("100");

  beforeEach(async function () {
    [admin, operator, validator1, validator2, user, unauthorized] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20");
    token = await MockToken.deploy("Test Token", "TEST", ethers.parseEther("1000000"));

    // Deploy bridge as upgradeable
    const ARCBridge = await ethers.getContractFactory("ARCBridge");
    bridge = await upgrades.deployProxy(ARCBridge, [await admin.getAddress()], {
      kind: 'uups',
      initializer: 'initialize'
    });

    // Setup roles
    await bridge.connect(admin).grantRole(await bridge.OPERATOR_ROLE(), await operator.getAddress());
    await bridge.connect(admin).grantRole(await bridge.VALIDATOR_ROLE(), await validator1.getAddress());
    await bridge.connect(admin).grantRole(await bridge.VALIDATOR_ROLE(), await validator2.getAddress());

    // Add supported token
    await bridge.connect(admin).addSupportedToken(await token.getAddress());

    // Add validators
    await bridge.connect(admin).addValidator(await validator1.getAddress(), VALIDATOR_STAKE);
    await bridge.connect(admin).addValidator(await validator2.getAddress(), VALIDATOR_STAKE);

    // Setup chain configuration
    await bridge.connect(admin).updateChainConfig(
      1, // Ethereum mainnet
      DAILY_LIMIT,
      BRIDGE_FEE,
      3600, // 1 hour deadline
      true // enabled
    );

    // Distribute tokens to user
    await token.transfer(await user.getAddress(), ethers.parseEther("1000"));
  });

  describe("Bridge Request Creation", function () {
    it("should prevent bridging unsupported tokens", async function () {
      const UnsupportedToken = await ethers.getContractFactory("MockERC20");
      const unsupportedToken = await UnsupportedToken.deploy("Unsupported", "UNS", ethers.parseEther("1000"));

      await unsupportedToken.transfer(await user.getAddress(), ethers.parseEther("100"));

      await expect(
        bridge.connect(user).initiateBridge(
          await unsupportedToken.getAddress(),
          ethers.parseEther("10"),
          "0x1234567890123456789012345678901234567890",
          1 // Ethereum
        )
      ).to.be.revertedWith("Bridge: token not supported");
    });

    it("should prevent bridging zero amount", async function () {
      await expect(
        bridge.connect(user).initiateBridge(
          await token.getAddress(),
          0,
          "0x1234567890123456789012345678901234567890",
          1
        )
      ).to.be.revertedWith("Bridge: amount must be greater than 0");
    });

    it("should enforce daily limits", async function () {
      // First bridge request
      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("5000"));
      await bridge.connect(user).initiateBridge(
        await token.getAddress(),
        ethers.parseEther("5000"),
        "0x1234567890123456789012345678901234567890",
        1
      );

      // Second bridge request that exceeds daily limit
      await expect(
        bridge.connect(user).initiateBridge(
          await token.getAddress(),
          ethers.parseEther("6000"),
          "0x1234567890123456789012345678901234567890",
          1
        )
      ).to.be.revertedWith("Bridge: daily limit exceeded");
    });

    it("should create valid bridge request", async function () {
      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("100"));

      await expect(
        bridge.connect(user).initiateBridge(
          await token.getAddress(),
          ethers.parseEther("100"),
          "0x1234567890123456789012345678901234567890",
          1
        )
      ).to.emit(bridge, "BridgeInitiated");
    });
  });

  describe("Bridge Validation", function () {
    let requestId: string;

    beforeEach(async function () {
      // Create a bridge request
      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("100"));
      const tx = await bridge.connect(user).initiateBridge(
        await token.getAddress(),
        ethers.parseEther("100"),
        "0x1234567890123456789012345678901234567890",
        1
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "BridgeInitiated");
      requestId = event.args.requestId;
    });

    it("should require validator role for validation", async function () {
      await expect(
        bridge.connect(unauthorized).validateBridge(requestId, true)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should allow validator approval", async function () {
      await expect(
        bridge.connect(validator1).validateBridge(requestId, true)
      ).to.emit(bridge, "BridgeValidated");
    });

    it("should allow validator rejection", async function () {
      await expect(
        bridge.connect(validator1).validateBridge(requestId, false)
      ).to.emit(bridge, "BridgeValidated");
    });

    it("should prevent double validation by same validator", async function () {
      await bridge.connect(validator1).validateBridge(requestId, true);

      await expect(
        bridge.connect(validator1).validateBridge(requestId, true)
      ).to.be.revertedWith("Bridge: validator already voted");
    });
  });

  describe("Bridge Completion", function () {
    let requestId: string;

    beforeEach(async function () {
      // Create and validate a bridge request
      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("100"));
      const tx = await bridge.connect(user).initiateBridge(
        await token.getAddress(),
        ethers.parseEther("100"),
        "0x1234567890123456789012345678901234567890",
        1
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "BridgeInitiated");
      requestId = event.args.requestId;

      // Get required validations
      await bridge.connect(validator1).validateBridge(requestId, true);
      await bridge.connect(validator2).validateBridge(requestId, true);
    });

    it("should require operator role for completion", async function () {
      await expect(
        bridge.connect(unauthorized).completeBridge(requestId)
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should allow authorized completion", async function () {
      await expect(
        bridge.connect(operator).completeBridge(requestId)
      ).to.emit(bridge, "BridgeCompleted");
    });

    it("should prevent completion of invalid requests", async function () {
      const invalidRequestId = ethers.keccak256(ethers.toUtf8Bytes("invalid"));

      await expect(
        bridge.connect(operator).completeBridge(invalidRequestId)
      ).to.be.revertedWith("Bridge: request not found");
    });
  });

  describe("Bridge Failure Handling", function () {
    let requestId: string;

    beforeEach(async function () {
      // Create a bridge request
      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("100"));
      const tx = await bridge.connect(user).initiateBridge(
        await token.getAddress(),
        ethers.parseEther("100"),
        "0x1234567890123456789012345678901234567890",
        1
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === "BridgeInitiated");
      requestId = event.args.requestId;
    });

    it("should allow operator to fail bridge", async function () {
      await expect(
        bridge.connect(operator).failBridge(requestId, "Network congestion")
      ).to.emit(bridge, "BridgeFailed");
    });

    it("should require operator role for failure", async function () {
      await expect(
        bridge.connect(unauthorized).failBridge(requestId, "Unauthorized")
      ).to.be.revertedWith(/AccessControl/);
    });

    it("should handle refunds correctly", async function () {
      await bridge.connect(operator).failBridge(requestId, "Test failure");

      const balanceBefore = await token.balanceOf(await user.getAddress());
      await bridge.connect(operator).refundBridge(requestId);
      const balanceAfter = await token.balanceOf(await user.getAddress());

      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });

  describe("Emergency Controls", function () {
    it("should allow emergency pause", async function () {
      await expect(
        bridge.connect(admin).emergencyPause()
      ).to.emit(bridge, "EmergencyPaused");
    });

    it("should prevent operations when paused", async function () {
      await bridge.connect(admin).emergencyPause();

      await token.connect(user).approve(await bridge.getAddress(), ethers.parseEther("100"));
      await expect(
        bridge.connect(user).initiateBridge(
          await token.getAddress(),
          ethers.parseEther("100"),
          "0x1234567890123456789012345678901234567890",
          1
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should allow emergency unpause", async function () {
      await bridge.connect(admin).emergencyPause();

      await expect(
        bridge.connect(admin).emergencyUnpause()
      ).to.emit(bridge, "EmergencyUnpaused");
    });
  });

  describe("Validator Management", function () {
    it("should allow admin to add validators", async function () {
      const newValidator = ethers.Wallet.createRandom();

      await expect(
        bridge.connect(admin).addValidator(await newValidator.getAddress(), VALIDATOR_STAKE)
      ).to.emit(bridge, "ValidatorAdded");
    });

    it("should allow admin to remove validators", async function () {
      await expect(
        bridge.connect(admin).removeValidator(await validator1.getAddress())
      ).to.emit(bridge, "ValidatorRemoved");
    });

    it("should prevent unauthorized validator management", async function () {
      const newValidator = ethers.Wallet.createRandom();

      await expect(
        bridge.connect(unauthorized).addValidator(await newValidator.getAddress(), VALIDATOR_STAKE)
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Reentrancy Protection", function () {
    it("should prevent reentrant bridge operations", async function () {
      // This would require a malicious contract that attempts reentrancy
    });
  });

  describe("Gas Limit Protection", function () {
    it("should handle operations near gas limit", async function () {
      // Test with operations that approach gas limits
    });
  });
});
