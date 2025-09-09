/* eslint-disable no-console */
import { ethers } from "hardhat";

// Read-only diagnostics: prints ARCx V2 config and feeExempt status for Uniswap V4 actors
// Env vars (PowerShell example):
//   $env:UNISWAP_V4_POOL_MANAGER="0x..."; $env:ARCX_HOOK_ADDRESS="0x..."; $env:ARCX_TOKEN_ADDRESS="0x..."

async function main() {
  const [signer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b"; // Base mainnet
  const POOL_ADDRESS = process.env.UNISWAP_V4_POOL_ADDRESS; // optional

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");

  const cfg = await token.config();
  let isAdmin = false;
  try {
    isAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
  } catch {
    // Older ABI or proxy route may not expose hasRole; proceed without admin check.
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

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
