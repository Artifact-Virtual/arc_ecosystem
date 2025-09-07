import { ethers } from "hardhat";

// Configure ARCx V2 token for Uniswap V4 LP compatibility without redeployments
// Reads addresses from environment variables to avoid hardcoding.
// Required env vars (PowerShell example):
//   $env:UNISWAP_V4_POOL_MANAGER="0x..."; $env:ARCX_HOOK_ADDRESS="0x..."; npx hardhat run scripts/configure-lp-compat.ts --network base

async function main() {
  const [signer] = await ethers.getSigners();

  // Addresses
  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437"; // live V2
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0"; // deployed hook
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER; // required
  const POOL_ADDRESS = process.env.UNISWAP_V4_POOL_ADDRESS; // optional

  if (!POOL_MANAGER) {
    throw new Error("UNISWAP_V4_POOL_MANAGER env var is required");
  }

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);

  // Fetch current config
  const cfg = await token.config();

  // 1) Ensure no transfer-side overhead for Uniswap: fee exempt and disable burn
  // Disable burn feature if enabled
  if (cfg.burnEnabled) {
    await (await token.toggleFeatures(cfg.yieldEnabled, cfg.flashEnabled, cfg.migrationEnabled, false)).wait();
  }

  // Set fees to 0 if not already (transfer fee + burn rate)
  const currentVotingDays = Number(cfg.votingPeriod) / (24 * 60 * 60);
  if (Number(cfg.transferFee) !== 0 || Number(cfg.burnRate) !== 0) {
    await (
      await token.updateConfig(
        cfg.baseYieldRate,
        cfg.flashLoanFee,
        0, // transferFee
        0, // burnRate
        Math.max(1, Math.floor(currentVotingDays)) // preserve voting period (min 1 day)
      )
    ).wait();
  }

  // Mark Uniswap actors as fee exempt
  const addressesToExempt = [HOOK_ADDRESS, POOL_MANAGER].concat(POOL_ADDRESS ? [POOL_ADDRESS] : []);
  for (const addr of addressesToExempt) {
    const exempt = await token.feeExempt(addr);
    if (!exempt) {
      await (await token.setFeeExempt(addr, true)).wait();
    }
  }

  // Done
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
