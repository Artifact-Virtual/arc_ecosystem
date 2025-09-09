/* eslint-disable no-console */
import { ethers } from "hardhat";

// Revert temporary LP-compat changes:
// - Re-enable burn feature and restore default fee config
// - Remove feeExempt flags for Uniswap actors (PoolManager, Hook, optional Pool, optional extras)
//
// Usage (PowerShell example):
//   $env:ARCX_TOKEN_ADDRESS="0x...";
//   $env:UNISWAP_V4_POOL_MANAGER="0x...";
//   $env:ARCX_HOOK_ADDRESS="0x...";
//   # Optional: $env:UNISWAP_V4_POOL_ADDRESS="0x..."; $env:EXTRA_FEE_EXEMPT="0xabc,0xdef"
//   npx hardhat run scripts/revert-lp-compat.ts --network base

async function main() {
  const [signer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437"; // live V2
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0"; // deployed hook
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER; // required for exemption revert
  const POOL_ADDRESS = process.env.UNISWAP_V4_POOL_ADDRESS; // optional
  const EXTRA = (process.env.EXTRA_FEE_EXEMPT ?? "")
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (!POOL_MANAGER) {
    throw new Error("UNISWAP_V4_POOL_MANAGER env var is required");
  }

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");
  const hasAdmin = await token.hasRole(ADMIN_ROLE, signer.address);

  console.log("Signer:", signer.address);
  console.log("Has ADMIN_ROLE:", hasAdmin);

  const cfg = await token.config();
  const currentVotingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);

  // 1) Restore default fee config: transferFee=0, burnRate=5 (0.05%), burnEnabled=true
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
        0, // transferFee (default)
        5, // burnRate (0.05%) default
        Math.max(1, Math.floor(currentVotingDays)) // preserve voting period (min 1 day)
      );
      console.log("updateConfig(..., transferFee=0, burnRate=5) ->", tx.hash);
      await tx.wait();
    }
  }

  // 2) Remove feeExempt for Uniswap actors and any extras provided
  const targets = [HOOK_ADDRESS, POOL_MANAGER]
    .concat(POOL_ADDRESS ? [POOL_ADDRESS] : [])
    .concat(EXTRA);

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

  // 3) Summary
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

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
