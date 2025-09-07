/* eslint-disable no-console */
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const POOL_MANAGER = process.env.UNISWAP_V4_POOL_MANAGER ?? "0x498581ff718922c3f8e6a244956af099b2652b2b";
  const HOOK_ADDRESS = process.env.ARCX_HOOK_ADDRESS ?? "0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0";

  const code = await ethers.provider.getCode(TOKEN_ADDRESS);
  if (code === "0x") throw new Error(`No contract at ARCX_TOKEN_ADDRESS: ${TOKEN_ADDRESS}`);

  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS, signer);

  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");
  const roleAdmin = await token.getRoleAdmin(ADMIN_ROLE);

  const isAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
  const canGrant = await token.hasRole(roleAdmin, signer.address);

  console.log("Signer:", signer.address);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("Role admin for ADMIN_ROLE:", roleAdmin);
  console.log("Signer is ADMIN:", isAdmin, "Signer can grant:", canGrant);

  if (!isAdmin && canGrant) {
    const tx = await token.grantRole(ADMIN_ROLE, signer.address);
    console.log("grantRole(ADMIN_ROLE, signer) tx:", tx.hash);
    await tx.wait();
    console.log("grantRole confirmed.");
  }

  // Re-check
  const nowAdmin = await token.hasRole(ADMIN_ROLE, signer.address);
  console.log("Now ADMIN:", nowAdmin);

  if (!nowAdmin) {
    console.log("Signer cannot obtain ADMIN_ROLE (lacks role admin). Exiting without exemptions.");
    return;
  }

  // Set exemptions
  const targets = [POOL_MANAGER, HOOK_ADDRESS];
  for (const addr of targets) {
    if (!ethers.isAddress(addr)) throw new Error(`Invalid address: ${addr}`);
    const already = await token.feeExempt(addr);
    if (already) {
      console.log("feeExempt already true:", addr);
      continue;
    }
    const tx = await token.setFeeExempt(addr, true);
    console.log("setFeeExempt ->", addr, "tx:", tx.hash);
    await tx.wait();
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
