/*
  Scan ERC20 balances for a set of addresses on the current Hardhat network.

  Usage examples:
  - npx hardhat run scripts/scan-token-balances.ts --network base
  - npx hardhat run scripts/scan-token-balances.ts --network base --addresses <addr1,addr2>
  - npx hardhat run scripts/scan-token-balances.ts --network base --tokens <token1,token2>
  - npx hardhat run scripts/scan-token-balances.ts --network base --tokenlist docs/tokenlists/arcx.tokenlist.json

  Notes:
  - Defaults to ARCX2 token on Base and the known ARCx addresses (Treasury/Ecosystem Safes, Vesting, Airdrop).
  - If --tokenlist is provided, tokens will be sourced from that JSON for the current chainId.
*/

/* eslint-disable no-console */
import { ethers } from "hardhat";

type Address = string;

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Defaults (Base mainnet)
const DEFAULT_TOKEN_ARCX2 = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const DEFAULT_ADDRESSES: Address[] = [
  // Treasury Safe
  "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38",
  // Ecosystem Safe
  "0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb",
  // Vesting
  "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600",
  // Smart Airdrop
  "0x40fe447cf4B2af7aa41694a568d84F1065620298",
];

function parseCsvFlag(flag: string | undefined): string[] | undefined {
  if (!flag) return undefined;
  return flag
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function loadTokensFromTokenList(path: string, chainId: number): Promise<string[]> {
  const fs = await import("fs");
  const content = fs.readFileSync(path, "utf-8");
  const json = JSON.parse(content);
  const tokens: string[] = [];
  if (Array.isArray(json.tokens)) {
    for (const t of json.tokens) {
      if (t && Number(t.chainId) === chainId && typeof t.address === "string") {
        tokens.push(t.address);
      }
    }
  }
  return tokens;
}

async function getTokenMeta(token: string) {
  const erc20 = new ethers.Contract(token, ERC20_ABI, ethers.provider);
  let symbol = "?";
  let name = "?";
  let decimals = 18;
  try { symbol = await erc20.symbol(); } catch { /* ignore */ }
  try { name = await erc20.name(); } catch { /* ignore */ }
  try { decimals = Number(await erc20.decimals()); } catch { /* default 18 */ }
  return { erc20, symbol, name, decimals };
}

function formatUnits(amount: bigint, decimals: number): string {
  // Minimal formatter to avoid importing ethers utils formatting across versions
  const negative = amount < 0n;
  const n = negative ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const integer = n / base;
  const fraction = n % base;
  const fractionStr = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return (negative ? "-" : "") + integer.toString() + (fractionStr ? "." + fractionStr : "");
}

async function main() {
  // Parse CLI flags (very light parsing)
  const argv = process.argv.slice(2);
  const getFlag = (name: string) => {
    const idx = argv.findIndex((a) => a === `--${name}`);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };

  const addressesFlag = parseCsvFlag(getFlag("addresses"));
  const tokensFlag = parseCsvFlag(getFlag("tokens"));
  const tokenListPath = getFlag("tokenlist");

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId.toString());

  // Resolve addresses to scan
  const addresses: Address[] = addressesFlag && addressesFlag.length > 0
    ? addressesFlag
    : DEFAULT_ADDRESSES;

  // Resolve tokens to scan
  let tokens: string[] = [];
  if (tokenListPath) {
    tokens = await loadTokensFromTokenList(tokenListPath, chainId);
  } else if (tokensFlag && tokensFlag.length > 0) {
    tokens = tokensFlag;
  } else {
    tokens = [DEFAULT_TOKEN_ARCX2];
  }

  if (tokens.length === 0) {
    console.log("No tokens to scan.");
    return;
  }

  console.log(`Network chainId: ${chainId}`);
  console.log(`Addresses (${addresses.length}):`);
  for (const a of addresses) { console.log(`  - ${a}`); }
  console.log(`Tokens (${tokens.length}):`);
  for (const t of tokens) { console.log(`  - ${t}`); }
  console.log("");

  for (const token of tokens) {
    const meta = await getTokenMeta(token);
  console.log(`Token: ${meta.name} (${meta.symbol}) @ ${token} [decimals=${meta.decimals}]`);
    let sum = 0n;
    for (const addr of addresses) {
      let bal = 0n;
      try {
        bal = await meta.erc20.balanceOf(addr);
  } catch { /* ignore */ }
      sum += bal;
      console.log(`  ${addr} => ${formatUnits(bal, meta.decimals)} ${meta.symbol}`);
    }
    console.log(`  Total across provided addresses: ${formatUnits(sum, meta.decimals)} ${meta.symbol}`);
    console.log("");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
