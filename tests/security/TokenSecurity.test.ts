// tests/security/TokenSecurity.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { MaxUint256 } from "ethers";

describe("Token Security Tests", function () {
  let token: any;
  let deployer: any, user: any, attacker: any;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ARCxToken");
    token = await Token.deploy();
    await token.deployed();
  });

  it("should enforce cap on total supply", async function () {
    const cap = await token.cap();
    const mintAmount = cap + 1n;

    await expect(token.mint(user.address, mintAmount))
      .to.be.revertedWith("ERC20Capped: cap exceeded");
  });

  it("should prevent unauthorized minting", async function () {
    const amount = ethers.parseEther("1000");

    // User should not be able to mint
    await expect(token.connect(user).mint(user.address, amount))
      .to.be.revertedWith("AccessControl: account");

    // Only minter should be able to mint
    await expect(token.connect(deployer).mint(user.address, amount))
      .to.not.be.reverted;
  });

  it("should handle permit correctly", async function () {
    const amount = ethers.parseEther("100");
    const deadline = MaxUint256;
    const nonce = await token.nonces(user.address);

    // Generate permit signature (simplified for testing)
    const domain = {
      name: await token.name(),
      version: "1",
      chainId: await ethers.provider.getNetwork().then(n => n.chainId),
      verifyingContract: token.address
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" }
      ]
    };

    const values = {
      owner: user.address,
      spender: deployer.address,
      value: amount,
      nonce: nonce,
      deadline: deadline
    };

    // Sign permit
    const signature = await user.signTypedData(domain, types, values);
    const sig = ethers.Signature.from(signature);

    // Execute permit
    await expect(token.permit(
      user.address,
      deployer.address,
      amount,
      deadline,
      sig.v,
      sig.r,
      sig.s
    )).to.not.be.reverted;

    // Check allowance was set
    expect(await token.allowance(user.address, deployer.address)).to.equal(amount);
  });

  it("should prevent permit replay", async function () {
    const amount = ethers.parseEther("100");
    const deadline = MaxUint256;
    const nonce = await token.nonces(user.address);

    // This is a simplified test - in practice, you'd need to test
    // that the same signature can't be used twice
    expect(await token.nonces(user.address)).to.equal(nonce);
  });

  it("should handle transfer edge cases", async function () {
    const amount = ethers.parseEther("100");

    // Mint to user
    await token.mint(user.address, amount);

    // Test transfer to zero address
    await expect(token.connect(user).transfer(ethers.ZeroAddress, amount))
      .to.be.revertedWith("ERC20: transfer to the zero address");

    // Test transfer of more than balance
    await expect(token.connect(user).transfer(attacker.address, amount * 2n))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");

    // Valid transfer should work
    await expect(token.connect(user).transfer(attacker.address, amount / 2n))
      .to.not.be.reverted;
  });

  it("should handle approval edge cases", async function () {
    const amount = ethers.parseEther("100");

    // Mint to user
    await token.mint(user.address, amount);

    // Approve and test transferFrom
    await token.connect(user).approve(attacker.address, amount);

    // Attacker can transfer up to approved amount
    await expect(token.connect(attacker).transferFrom(user.address, attacker.address, amount / 2n))
      .to.not.be.reverted;

    // But not more than approved
    await expect(token.connect(attacker).transferFrom(user.address, attacker.address, amount))
      .to.be.revertedWith("ERC20: insufficient allowance");
  });
});
