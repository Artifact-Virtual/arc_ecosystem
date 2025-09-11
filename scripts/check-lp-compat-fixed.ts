/* eslint-disable no-console */
import { ethers } from "hardhat";

const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";
const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b";

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
  const [exHook, exPM] = await Promise.all([
    token.feeExempt(HOOK_ADDRESS),
    token.feeExempt(POOL_MANAGER),
  ]);

  const votingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);

  console.log("Signer:", signer.address);
  console.log("Has ADMIN_ROLE:", isAdmin);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("Hook:", HOOK_ADDRESS, "feeExempt:", exHook);
  console.log("PoolManager:", POOL_MANAGER, "feeExempt:", exPM);
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

checkLPCompat()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
