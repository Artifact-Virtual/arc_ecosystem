/**
 * blockscout-agent.ts
 *
 * Scan token transfer history using an Etherscan-compatible explorer API (Blockscout/Etherscan)
 * to compute holder balances and report top holders. Falls back to RPC provider logs if the
 * explorer API is not available or rate-limited.
 *
 * Usage:
 *  npx hardhat run scripts/blockscout-agent.ts --network base --token <tokenAddress> [--apiUrl <apiBaseUrl>] [--top N]
 *
 * Notes:
 *  - apiUrl must be the explorer API root (for example: https://basescan.org/api or https://blockscout.com/base/mainnet/api)
 *  - The script expects the explorer to support the `module=account&action=tokentx&contractaddress=...` endpoint (Etherscan-compatible).
 *  - If the API path is not available, the script will try to read Transfer events using the configured provider (`ethers.provider.getLogs`).
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import hre from "hardhat";
import { URL } from "url";

const { ethers } = hre;
const ethersUtils = (ethers as any).utils;
type BigMap = Map<string, bigint>;

const TRANSFER_SIG = ethersUtils.id("Transfer(address,address,uint256)");

async function fetchExplorerTokenTxs(apiBase: string, token: string, page = 1, offset = 10000, apikey?: string) {
  const url = new URL(apiBase);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "tokentx");
  url.searchParams.set("contractaddress", token);
  url.searchParams.set("page", String(page));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("sort", "asc");
  if (apikey) url.searchParams.set("apikey", apikey);

  const res = await (globalThis as any).fetch(url.toString());
  if (!res.ok) throw new Error(`Explorer API request failed: ${res.status} ${res.statusText}`);
  const json: any = await res.json();
  // Etherscan-style response with status/result
  if (json && json.status === "0" && Array.isArray(json.result) && json.result.length === 0) {
    return [];
  }
  if (json && Array.isArray(json.result)) return json.result;
  // Some Blockscout instances return result directly without status field
  if (Array.isArray(json)) return json as any;
  throw new Error("Unexpected explorer API response format");
}

function addBalance(balances: BigMap, addr: string, amount: bigint) {
  const a = addr.toLowerCase();
  const prev = balances.get(a) ?? 0n;
  balances.set(a, prev + amount);
}

function subBalance(balances: BigMap, addr: string, amount: bigint) {
  const a = addr.toLowerCase();
  const prev = balances.get(a) ?? 0n;
  balances.set(a, prev - amount);
}

async function computeBalancesFromTxs(txs: any[]) {
  const balances: BigMap = new Map();
  for (const t of txs) {
    // etherscan/Blockscout tokentx fields: from, to, value
    const from = (t.from || t.fromAddress || "0x0000000000000000000000000000000000000000").toLowerCase();
    const to = (t.to || t.toAddress || "0x0000000000000000000000000000000000000000").toLowerCase();
    const value = BigInt(t.value || t.amount || "0");
    if (from !== "0x0000000000000000000000000000000000000000") {
      subBalance(balances, from, value);
    }
    addBalance(balances, to, value);
  }
  return balances;
}

async function computeBalancesFromLogs(token: string, startBlock?: number, endBlock?: number) {
  // Use provider.getLogs to gather Transfer events; may be heavy on long histories.
  const provider = ethers.provider;
  const filter: any = {
    address: token,
    topics: [TRANSFER_SIG],
  };
  if (startBlock) filter.fromBlock = startBlock;
  else filter.fromBlock = 0;
  if (endBlock) filter.toBlock = endBlock;
  else filter.toBlock = await provider.getBlockNumber();

  console.log(`Fetching logs from ${filter.fromBlock} to ${filter.toBlock} (may take time)`);
  const logs = await provider.getLogs(filter);
  const iface = new ethersUtils.Interface(["event Transfer(address indexed from, address indexed to, uint256 value)"]);
  const balances: BigMap = new Map();
  for (const log of logs) {
    const parsed = iface.parseLog(log);
    const from = (parsed.args.from as string).toLowerCase();
    const to = (parsed.args.to as string).toLowerCase();
    const value = BigInt(parsed.args.value.toString());
    if (from !== "0x0000000000000000000000000000000000000000") subBalance(balances, from, value);
    addBalance(balances, to, value);
  }
  return balances;
}

function sortBalances(balances: BigMap) {
  const arr = Array.from(balances.entries()).map(([addr, bal]) => ({ addr, bal }));
  arr.sort((a, b) => (a.bal > b.bal ? -1 : a.bal < b.bal ? 1 : 0));
  return arr;
}

function formatUnits(amount: bigint, decimals = 18) {
  const neg = amount < 0n;
  const a = neg ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const integer = a / base;
  const frac = a % base;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return (neg ? "-" : "") + integer.toString() + (fracStr ? "." + fracStr : "");
}

async function main() {
  const argv = process.argv.slice(2);
  const getFlag = (n: string) => {
    const i = argv.findIndex((a) => a === `--${n}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const token = getFlag("token");
  if (!token) {
    console.error("--token <tokenAddress> is required");
    process.exit(1);
  }
  const apiUrl = getFlag("apiUrl");
  const apikey = getFlag("apiKey");
  const topN = Number(getFlag("top") || "20");
  const startBlock = getFlag("startBlock") ? Number(getFlag("startBlock")) : undefined;
  const endBlock = getFlag("endBlock") ? Number(getFlag("endBlock")) : undefined;

  let balances: BigMap | null = null;

  if (apiUrl) {
    try {
      console.log(`Querying explorer API ${apiUrl} for token transfers (this may page)`);
      const pageSize = 10000;
      let page = 1;
      const allTxs: any[] = [];
      while (true) {
        const txs = await fetchExplorerTokenTxs(apiUrl, token, page, pageSize, apikey);
        if (!txs || txs.length === 0) break;
        allTxs.push(...txs);
        if (txs.length < pageSize) break;
        page += 1;
      }
      console.log(`Fetched ${allTxs.length} transfer records from explorer`);
      balances = await computeBalancesFromTxs(allTxs);
    } catch (e) {
      console.warn("Explorer API failed, falling back to RPC logs:", e && (e as any).message ? (e as any).message : String(e));
    }
  }

  if (!balances) {
    // Fallback to provider logs
    try {
      balances = await computeBalancesFromLogs(token, startBlock, endBlock);
    } catch (e) {
      console.error("RPC logs fetch failed:", (e as any).message || e);
      process.exit(1);
    }
  }

  const provider = ethers.provider;
  // Try to fetch token metadata
  let decimals = 18;
  let symbol = "TOKEN";
  try {
    const erc20 = new ethers.Contract(token, ["function decimals() view returns (uint8)", "function symbol() view returns (string)"], provider);
    decimals = Number(await erc20.decimals());
    symbol = String(await erc20.symbol());
  } catch (err) {
    console.warn("Failed to fetch token metadata, using defaults:", String(err));
  }

  const sorted = sortBalances(balances!);
  console.log(`Top ${topN} holders for ${symbol} (${token}):`);
  let i = 0;
  let total = 0n;
  for (const row of sorted) {
    if (row.bal === 0n) continue;
    total += row.bal;
    i += 1;
    if (i > topN) break;
    console.log(`${i}. ${row.addr} — ${formatUnits(row.bal, decimals)} ${symbol}`);
  }
  console.log(`Computed total (top ${topN} included): ${formatUnits(total, decimals)} ${symbol}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
