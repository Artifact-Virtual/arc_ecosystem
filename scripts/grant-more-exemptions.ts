/* eslint-disable no-console */
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b";
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";
  const PERMIT2 = process.env.PERMIT2_ADDRESS ?? "0x000000000022d473030f116ddee9f6b43ac78ba3"; // canonical Permit2
  const EXTRA = (process.env.EXTRA_FEE_EXEMPT ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const code = await ethers.provider.getCode(TOKEN_ADDRESS);
  if (code === "0x") throw new Error(`No contract at ARCX_TOKEN_ADDRESS: ${TOKEN_ADDRESS}`);

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);
  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");

  const hasAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
  if (!hasAdmin) {
    console.log("Signer is NOT ADMIN; cannot set exemptions:", signer.address);
    return;
  }

  const targets = [POOL_MANAGER, HOOK_ADDRESS, PERMIT2, ...EXTRA];
  const uniqueTargets = Array.from(new Set(targets.map((a) => a.toLowerCase())));

  console.log("Setting feeExempt=true for:");
  for (const addr of uniqueTargets) {
    if (!ethers.isAddress(addr)) {
      console.log("- skipped invalid:", addr);
      continue;
    }
    const checksummed = ethers.getAddress(addr);
    const already = await token.feeExempt(checksummed);
    if (already) {
      console.log("- already true:", checksummed);
      continue;
    }
    const tx = await token.setFeeExempt(checksummed, true);
    console.log("- set:", checksummed, "tx:", tx.hash);
    await tx.wait();
  }

  console.log("Verification:");
  for (const addr of uniqueTargets) {
    if (!ethers.isAddress(addr)) continue;
    const checksummed = ethers.getAddress(addr);
    const v = await token.feeExempt(checksummed);
    console.log(checksummed, "->", v);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
