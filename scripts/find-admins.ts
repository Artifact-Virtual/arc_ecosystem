/* eslint-disable no-console */
import { ethers } from "hardhat";

async function main() {
  const TOKEN_ADDRESS = process.env.ARCX_TOKEN_ADDRESS ?? "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const provider = ethers.provider;
  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS);

  const ADMIN_ROLE = ethers.id("ADMIN_ROLE");
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash; // keccak256("") per OZ

  const filter = token.filters.RoleGranted();
  const current = await provider.getBlockNumber();

  // Query from block 0 to current (may be slow); chunk if needed
  const CHUNK = 200_000; // safe chunk size for Base
  const holders: Record<string, Set<string>> = {
    [ADMIN_ROLE]: new Set<string>(),
    [DEFAULT_ADMIN_ROLE]: new Set<string>(),
  };

  for (let from = 0; from <= current; from += CHUNK + 1) {
    const to = Math.min(current, from + CHUNK);
    const logs = await token.queryFilter(filter, from, to);
    for (const ev of logs) {
      // event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
      let role = "";
      let account = "";
      if (ev instanceof ethers.EventLog) {
        role = ev.args.role;
        account = ev.args.account;
      } else {
        // decode from topics
        // topics[0] = event sig, [1]=role, [2]=account, [3]=sender
        role = ev.topics?.[1] ?? "";
        account = ev.topics?.[2] ? ethers.getAddress("0x" + ev.topics[2].slice(26)) : "";
      }
      if (role === ADMIN_ROLE || role === DEFAULT_ADMIN_ROLE) {
        holders[role].add(account);
      }
    }
  }

  const toArr = (s: Set<string>) => Array.from(s);
  console.log("ADMIN_ROLE holders:", toArr(holders[ADMIN_ROLE]));
  console.log("DEFAULT_ADMIN_ROLE holders:", toArr(holders[DEFAULT_ADMIN_ROLE]));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
