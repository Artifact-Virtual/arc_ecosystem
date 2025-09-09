/* eslint-disable no-console */
import { ethers } from "hardhat";

const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";
const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b";
const POOL_ADDRESS = process.env.UNISWAP_V4_POOL_ADDRESS;

async function checkLPCompat() {
  const [signer] = await ethers.getSigners();

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");

  const cfg = await token.config();
  let isAdmin = false;
  try {
    isAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
  } catch {
    isAdmin = false;
  }
  const [exHook, exPM, exPool] = await Promise.all([
    token.feeExempt(HOOK_ADDRESS),
    token.feeExempt(POOL_MANAGER),
    POOL_ADDRESS ? token.feeExempt(POOL_ADDRESS) : Promise.resolve(false),
  ]);

  const votingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);

  console.log("Signer:", signer.address);
  console.log("Has ADMIN_ROLE:", isAdmin);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("Hook:", HOOK_ADDRESS, "feeExempt:", exHook);
  console.log("PoolManager:", POOL_MANAGER, "feeExempt:", exPM);
  if (POOL_ADDRESS) console.log("Pool:", POOL_ADDRESS, "feeExempt:", exPool);
  console.log("--- Config ---");
  console.log({
    baseYieldRate: cfg.baseYieldRate.toString(),
    flashLoanFee: cfg.flashLoanFee.toString(),
    transferFee: cfg.transferFee.toString(),
    burnRate: cfg.burnRate.toString(),
    votingPeriodSeconds: Number(cfg.votingPeriod),
    votingPeriodDays: votingDays,
    yieldEnabled: cfg.yieldEnabled,
    flashEnabled: cfg.flashEnabled,
    migrationEnabled: cfg.migrationEnabled,
    burnEnabled: cfg.burnEnabled,
  });
}

async function configureLPCompat() {
  const [signer] = await ethers.getSigners();

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");
  const hasAdmin = await token.hasRole(ADMIN_ROLE, signer.address);

  const cfg = await token.config();

  if (hasAdmin && cfg.burnEnabled) {
    await (await token.toggleFeatures(cfg.yieldEnabled, cfg.flashEnabled, cfg.migrationEnabled, false)).wait();
  }

  const currentVotingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);
  if (hasAdmin && (Number(cfg.transferFee) !== 0 || Number(cfg.burnRate) !== 0)) {
    await (
      await token.updateConfig(
        cfg.baseYieldRate,
        cfg.flashLoanFee,
        0,
        0,
        Math.max(1, Math.floor(currentVotingDays))
      )
    ).wait();
  }

  const addressesToExempt = [HOOK_ADDRESS, POOL_MANAGER].concat(POOL_ADDRESS ? [POOL_ADDRESS] : []);
  if (hasAdmin) {
    for (const addr of addressesToExempt) {
      const exempt = await token.feeExempt(addr);
      if (!exempt) {
        await (await token.setFeeExempt(addr, true)).wait();
      }
    }
  }

  if (!hasAdmin) {
    console.log("Signer lacks ADMIN_ROLE. Ask an admin to run this script, or execute these calls:");
    console.log("- toggleFeatures(yield, flash, migration, false)");
    console.log("- updateConfig(baseYieldRate, flashFee, 0, 0, votingDays)");
    console.log("- setFeeExempt(hook, true); setFeeExempt(poolManager, true); [pool optional]");
  }
}

async function revertLPCompat() {
  const [signer] = await ethers.getSigners();

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");
  const hasAdmin = await token.hasRole(ADMIN_ROLE, signer.address);

  console.log("Signer:", signer.address);
  console.log("Has ADMIN_ROLE:", hasAdmin);

  const cfg = await token.config();
  const currentVotingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);

  if (!hasAdmin) {
    console.log("Signer lacks ADMIN_ROLE. Please execute the following with an admin:")
    console.log("- toggleFeatures(", cfg.yieldEnabled, ",", cfg.flashEnabled, ",", cfg.migrationEnabled, ", true)");
    console.log("- updateConfig(baseYieldRate, flashLoanFee, 0, 5, votingDays)");
  } else {
    if (!cfg.burnEnabled) {
      const tx = await token.toggleFeatures(cfg.yieldEnabled, cfg.flashEnabled, cfg.migrationEnabled, true);
      console.log("toggleFeatures(..., burn=true) ->", tx.hash);
      await tx.wait();
    }
    const needsCfgUpdate = Number(cfg.transferFee) !== 0 || Number(cfg.burnRate) !== 5;
    if (needsCfgUpdate) {
      const tx = await token.updateConfig(
        cfg.baseYieldRate,
        cfg.flashLoanFee,
        0,
        5,
        Math.max(1, Math.floor(currentVotingDays))
      );
      console.log("updateConfig(..., transferFee=0, burnRate=5) ->", tx.hash);
      await tx.wait();
    }
  }

  const targets = [HOOK_ADDRESS, POOL_MANAGER]
    .concat(POOL_ADDRESS ? [POOL_ADDRESS] : []);

  if (!hasAdmin) {
    console.log("- For each address below, call setFeeExempt(addr, false):");
    for (const t of targets) console.log("  ", t);
  } else {
    for (const addr of targets) {
      const checksummed = ethers.getAddress(addr);
      const isExempt: boolean = await token.feeExempt(checksummed);
      if (isExempt) {
        const tx = await token.setFeeExempt(checksummed, false);
        console.log("setFeeExempt(", checksummed, ", false) ->", tx.hash);
        await tx.wait();
      } else {
        console.log("feeExempt already false:", checksummed);
      }
    }
  }

  const [exHook, exPM, exPool] = await Promise.all([
    token.feeExempt(HOOK_ADDRESS),
    token.feeExempt(POOL_MANAGER),
    POOL_ADDRESS ? token.feeExempt(POOL_ADDRESS) : Promise.resolve(false),
  ]);

  console.log("--- Post-Revert State ---");
  const newCfg = await token.config();
  console.log({
    transferFee: Number(newCfg.transferFee),
    burnRate: Number(newCfg.burnRate),
    burnEnabled: newCfg.burnEnabled,
    hookExempt: exHook,
    poolManagerExempt: exPM,
    poolExempt: exPool,
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: npx hardhat run scripts/lp-manager.ts --network <network> <command>");
    console.log("Commands:");
    console.log("  check     - Check LP compatibility status");
    console.log("  configure - Configure for LP compatibility");
    console.log("  revert    - Revert LP compatibility changes");
    return;
  }

  const command = args[0];
  switch (command) {
    case "check":
      await checkLPCompat();
      break;
    case "configure":
      await configureLPCompat();
      break;
    case "revert":
      await revertLPCompat();
      break;
    default:
      console.log("Unknown command:", command);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
