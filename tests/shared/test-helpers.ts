// tests/shared/test-helpers.ts
// Shared test utilities for audit compliance and comprehensive testing

import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Contract } from "ethers";

export interface TestContext {
  deployer: SignerWithAddress;
  admin: SignerWithAddress;
  proposer: SignerWithAddress;
  executor: SignerWithAddress;
  stranger: SignerWithAddress;
  users: SignerWithAddress[];
}

export interface GovernanceContracts {
  governor?: Contract;
  timelock?: Contract;
  treasury?: Contract;
  token?: Contract;
}

/**
 * Setup test context with multiple signers
 */
export async function setupTestContext(): Promise<TestContext> {
  const [deployer, admin, proposer, executor, stranger, ...users] = await ethers.getSigners();

  return {
    deployer,
    admin,
    proposer,
    executor,
    stranger,
    users,
  };
}

/**
 * Fast-forward time in Hardhat network
 */
export async function increaseTime(seconds: number): Promise<void> {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}

/**
 * Set next block timestamp
 */
export async function setNextBlockTime(timestamp: number): Promise<void> {
  await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  await ethers.provider.send("evm_mine", []);
}

/**
 * Get current block timestamp
 */
export async function currentTime(): Promise<number> {
  const block = await ethers.provider.getBlock("latest");
  return block!.timestamp;
}

/**
 * Deploy contract with gas tracking
 */
export async function deployWithGasTracking(
  contractName: string,
  args: unknown[] = [],
  signer?: SignerWithAddress
): Promise<Contract> {
  const ContractFactory = await ethers.getContractFactory(contractName, signer);
  const contract = await ContractFactory.deploy(...args);
  await contract.waitForDeployment();

  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    const gasUsed = deploymentTx.gasLimit;
    const address = await contract.getAddress();
    // Gas tracking for audit purposes
    return contract;
  }

  return contract;
}

/**
 * Test helper for role-based access control
 */
export async function testRoleAccess(
  contract: Contract,
  roleName: string,
  roleHash: string,
  authorizedUser: SignerWithAddress,
  unauthorizedUser: SignerWithAddress,
  testFunction: () => Promise<void>
): Promise<void> {
  // Test authorized access
  await expect(testFunction.call(authorizedUser)).to.not.be.reverted;

  // Test unauthorized access
  await expect(testFunction.call(unauthorizedUser)).to.be.revertedWith(
    `AccessControl: account ${unauthorizedUser.address.toLowerCase()} is missing role ${roleHash}`
  );
}

/**
 * Test helper for timelock operations
 */
export async function testTimelockOperation(
  timelock: Contract,
  operationId: string,
  delay: number,
  executor: SignerWithAddress
): Promise<void> {
  // Check operation is scheduled
  expect(await timelock.isOperation(operationId)).to.be.true;
  expect(await timelock.isOperationPending(operationId)).to.be.true;
  expect(await timelock.isOperationReady(operationId)).to.be.false;

  // Try to execute too early
  await expect(timelock.connect(executor).execute([], [], [], operationId))
    .to.be.revertedWith("TimelockController: operation is not ready");

  // Fast-forward past delay
  await increaseTime(delay + 1);

  // Now execution should succeed
  expect(await timelock.isOperationReady(operationId)).to.be.true;
  await expect(timelock.connect(executor).execute([], [], [], operationId))
    .to.not.be.reverted;

  // Operation should be executed
  expect(await timelock.isOperationDone(operationId)).to.be.true;
}

/**
 * Security test helpers
 */
export const SecurityTests = {
  /**
   * Test for reentrancy protection
   */
  async testReentrancyProtection(
    contract: Contract,
    attackFunction: () => Promise<void>,
    shouldRevert: boolean = true
  ): Promise<void> {
    if (shouldRevert) {
      await expect(attackFunction()).to.be.revertedWith("ReentrancyGuard");
    } else {
      await expect(attackFunction()).to.not.be.reverted;
    }
  },

  /**
   * Test for access control
   */
  async testAccessControl(
    contract: Contract,
    restrictedFunction: () => Promise<void>,
    authorizedUser: SignerWithAddress,
    unauthorizedUser: SignerWithAddress
  ): Promise<void> {
    // Authorized user should succeed
    await expect(restrictedFunction.call(authorizedUser)).to.not.be.reverted;

    // Unauthorized user should fail
    await expect(restrictedFunction.call(unauthorizedUser)).to.be.reverted;
  },

  /**
   * Test for input validation
   */
  async testInputValidation(
    contract: Contract,
    functionCall: () => Promise<void>,
    expectedError: string
  ): Promise<void> {
    await expect(functionCall()).to.be.revertedWith(expectedError);
  },
};

/**
 * Gas usage tracking helper
 */
export async function trackGasUsage(
  tx: Promise<Contract>,
  label: string
): Promise<{ gasUsed: bigint; effectiveGasPrice: bigint }> {
  const transaction = await tx;
  const receipt = await transaction.deploymentTransaction()?.wait();

  if (receipt) {
    return {
      gasUsed: receipt.gasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice || 0n,
    };
  }

  return { gasUsed: 0n, effectiveGasPrice: 0n };
}

/**
 * Event emission tester
 */
export async function expectEvent(
  tx: Promise<Contract>,
  contract: Contract,
  eventName: string,
  expectedArgs: unknown[]
): Promise<void> {
  await expect(tx).to.emit(contract, eventName).withArgs(...expectedArgs);
}

/**
 * Balance change tester
 */
export async function expectBalanceChange(
  address: string,
  tx: Promise<Contract>,
  expectedChange: bigint
): Promise<void> {
  const balanceBefore = await ethers.provider.getBalance(address);
  await tx;
  const balanceAfter = await ethers.provider.getBalance(address);
  const actualChange = balanceAfter - balanceBefore;
  expect(actualChange).to.equal(expectedChange);
}
