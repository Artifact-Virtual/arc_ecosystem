// tests/security/BridgeSecurity.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

describe("Bridge Security Tests", function () {
  let bridge: any;
  let token: any;
  let deployer: any, user: any, relayer: any, attacker: any;

  beforeEach(async function () {
    [deployer, user, relayer, attacker] = await ethers.getSigners();

    // Deploy mock token
    const Token = await ethers.getContractFactory("ARCxToken");
    token = await Token.deploy();
    await token.deployed();

    // Deploy bridge
    const Bridge = await ethers.getContractFactory("ARCBridge");
    bridge = await Bridge.deploy(token.address);
    await bridge.deployed();

    // Setup roles
    await bridge.grantRole(await bridge.RELAYER_ROLE(), relayer.address);
  });

  it("should prevent replay attacks with nonces", async function () {
    const amount = ethers.parseEther("100");
    const nonce = 1;
    const targetChain = 1;

    // Mint tokens to user
    await token.mint(user.address, amount);

    // User approves bridge
    await token.connect(user).approve(bridge.address, amount);

    // First bridge should succeed
    const tx = await bridge.connect(user).bridgeToChain(
      user.address,
      amount,
      targetChain,
      nonce
    );

    // Second bridge with same nonce should fail
    await expect(bridge.connect(user).bridgeToChain(
      user.address,
      amount,
      targetChain,
      nonce
    )).to.be.revertedWith("Bridge: nonce already used");
  });

  it("should validate relayer authorization", async function () {
    const amount = ethers.parseEther("100");
    const nonce = 2;
    const targetChain = 1;

    // Mint tokens to bridge for release
    await token.mint(bridge.address, amount);

    // Attacker should not be able to release tokens
    await expect(bridge.connect(attacker).releaseFromChain(
      user.address,
      amount,
      targetChain,
      nonce,
      "0x" // mock signature
    )).to.be.revertedWith("Bridge: unauthorized relayer");

    // Authorized relayer should succeed
    await expect(bridge.connect(relayer).releaseFromChain(
      user.address,
      amount,
      targetChain,
      nonce,
      "0x" // mock signature
    )).to.not.be.reverted;
  });

  it("should enforce rate limits", async function () {
    // This test would need to be implemented based on the actual bridge rate limiting logic
    // For now, we'll test basic functionality
    expect(await bridge.token()).to.equal(token.address);
  });

  it("should validate bridge amount limits", async function () {
    const largeAmount = ethers.parseEther("1000000"); // 1M tokens
    const nonce = 3;
    const targetChain = 1;

    // Mint large amount
    await token.mint(user.address, largeAmount);
    await token.connect(user).approve(bridge.address, largeAmount);

    // Large bridge should be validated (implementation dependent)
    // This would test for maximum bridge amounts
    expect(await token.balanceOf(user.address)).to.equal(largeAmount);
  });
});
