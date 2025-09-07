/* eslint-disable no-console */
import { ethers } from "hardhat";

// One-off helper: set feeExempt for Uniswap V4 PoolManager and ARCx Hook
// Env (PowerShell examples):
//   $env:ARCX_TOKEN_ADDRESS = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437"
//   $env:UNISWAP_V4_POOL_MANAGER = "0x498581ff718922c3f8e6a244956af099b2652b2b"  # Base mainnet
//   $env:ARCX_HOOK_ADDRESS = "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0"

async function main() {
  const [signer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b";
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";

  const code = await ethers.provider.getCode(TOKEN_ADDRESS);
  if (code === "0x") throw new Error(`No contract at ARCX_TOKEN_ADDRESS: ${TOKEN_ADDRESS}`);

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");

  let hasAdmin = false;
  if (process.env.BYPASS_ADMIN_CHECK === "true") {
    console.log("BYPASS_ADMIN_CHECK=true -> skipping hasRole() check");
    hasAdmin = true;
  } else {
    try {
      hasAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
    } catch (e) {
      console.log("Warning: hasRole() check failed. You can set BYPASS_ADMIN_CHECK=true to skip this.");
      throw e;
    }
    if (!hasAdmin) {
      console.log("Signer is NOT an ADMIN on ARCx token:", signer.address);
      console.log("Please run this script with an ADMIN wallet or use BaseScan Write as admin:");
      console.log("- setFeeExempt(POOL_MANAGER, true) ->", POOL_MANAGER);
      console.log("- setFeeExempt(HOOK_ADDRESS, true) ->", HOOK_ADDRESS);
      process.exit(1);
    }
  }

  const targets = [POOL_MANAGER, HOOK_ADDRESS];
  for (const addr of targets) {
    if (!ethers.isAddress(addr)) throw new Error(`Invalid address: ${addr}`);
  }

  console.log("Admin:", signer.address);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("PoolManager:", POOL_MANAGER);
  console.log("Hook:", HOOK_ADDRESS);

  for (const addr of targets) {
    const already = await token.feeExempt(addr);
    if (already) {
      console.log("feeExempt already true:", addr);
      continue;
    }
    const tx = await token.setFeeExempt(addr, true);
    console.log("setFeeExempt sent:", addr, "tx:", tx.hash);
    await tx.wait();
    console.log("confirmed.");
  }

  // Verify
  const pm = await token.feeExempt(POOL_MANAGER);
  const hk = await token.feeExempt(HOOK_ADDRESS);
  console.log("Verification -> PoolManager:", pm, "Hook:", hk);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
