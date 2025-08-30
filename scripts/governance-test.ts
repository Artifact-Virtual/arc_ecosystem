import { ethers } from "hardhat";
import type { Contract } from "ethers";

async function roleMembers(contract: Contract, roleName: string) {
  try {
    const role = await contract[roleName]();
    const count = (await contract.getRoleMemberCount?.(role)) ?? (await contract.getRoleMemberCount(role));
    const members = [];
    for (let i = 0; i < Number(count); i++) {
      members.push(await contract.getRoleMember(role, i));
    }
    return { role, count: Number(count), members };
  } catch (e) {
    const error = e as Error;
    return { error: `unable to read ${roleName}: ${error.message}` };
  }
}

async function getImplementationAddress(address: string) {
  // EIP-1967 implementation slot
  const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const implRaw = await ethers.provider.getStorage(address, implSlot);
  if (implRaw === "0x0000000000000000000000000000000000000000000000000000000000000000") return null;
  return ethers.getAddress("0x" + implRaw.slice(26));
}

async function main() {
  const env = process.env;
  if (!env.DAO_GOVERNOR_ADDRESS || !env.DAO_TIMELOCK_ADDRESS || !env.DAO_DAO_ADDRESS) {
    console.error("Please set DAO_GOVERNOR_ADDRESS, DAO_TIMELOCK_ADDRESS, DAO_DAO_ADDRESS in env or scripts/shared/constants.ts");
    process.exit(1);
  }

  const governor = await ethers.getContractAt("ARCGovernor", env.DAO_GOVERNOR_ADDRESS);
  const timelock = await ethers.getContractAt("ARCTimelock", env.DAO_TIMELOCK_ADDRESS);
  const dao = await ethers.getContractAt("ARCDAO", env.DAO_DAO_ADDRESS);

  console.log("== Governor ==");

  // Roles to check (names expected to exist in ARCGovernor)
  const rolesToCheck = ["ADMIN_ROLE", "PROPOSER_ROLE", "EXECUTOR_ROLE", "PAUSER_ROLE"];
  for (const r of rolesToCheck) {
    const info = await roleMembers(governor, r);
    console.log(r, info);
  }

  // Config (voting delay/period/quorum/threshold)
  try {
    const cfg = await governor.config();
    console.log("governor.config:", cfg);
  } catch (e) {
    const error = e as Error;
    console.log("governor.config() read failed:", error.message);
  }

  console.log("\n== Timelock ==");
  try {
    const minDelay = (await timelock.getMinDelay?.()) ?? (await timelock.MIN_DELAY?.());
    console.log("minDelay:", minDelay.toString?.() ?? minDelay);
  } catch (e) {
    const error = e as Error;
    console.log("timelock delay read failed:", error.message);
  }

  // Executor allowlist / roles on timelock
  try {
    const EXECUTOR = await timelock.EXECUTOR_ROLE?.();
    const execCount = await timelock.getRoleMemberCount?.(EXECUTOR);
    const execs = [];
    if (execCount) {
      for (let i = 0; i < Number(execCount); i++) execs.push(await timelock.getRoleMember(EXECUTOR, i));
    }
    console.log("timelock EXECUTOR_ROLE:", { EXECUTOR, execCount: Number(execCount ?? 0), execs });
  } catch (e) {
    const error = e as Error;
    console.log("timelock executor role read failed:", error.message);
  }

  console.log("\n== Upgradeability checks ==");
  const govImpl = await getImplementationAddress(env.DAO_GOVERNOR_ADDRESS);
  console.log("Governor EIP-1967 impl:", govImpl);
  if (govImpl) {
    try {
      // try to detect UUPS by calling proxiableUUID on implementation
      const implCode = await ethers.provider.getCode(govImpl);
      console.log("Governor impl bytecode length:", implCode.length);
    } catch (e) {
      const error = e as Error;
      console.log("impl probe failed:", error.message);
    }
  } else {
    console.log("No implementation found in EIP-1967 slot (not proxied or zero).");
  }

  console.log("\n== DAO links ==");
  try {
    const linkedGovernor = await dao.governor();
    console.log("DAO.governor():", linkedGovernor);
  } catch (e) {
    const error = e as Error;
    console.log("dao.governor() failed:", error.message);
  }

  console.log("\n== Timelock pending operations sample (events) ==");
  // scan last 5k blocks for Queue/Execute events (best-effort)
  const latest = await ethers.provider.getBlockNumber();
  const from = Math.max(0, latest - 5000);
  try {
    const filterQueue = timelock.filters.CallScheduled?.() || timelock.filters.Queue?.();
    if (filterQueue) {
      const events = await timelock.queryFilter(filterQueue, from, latest);
      console.log(`Found ${events.length} queue events in last 5k blocks (showing up to 10):`, events.slice(0, 10).map(e => ({
        tx: e.transactionHash,
        args: 'args' in e ? e.args : 'No args available'
      })));
    } else {
      console.log("No queue filter available on timelock.");
    }
  } catch (e) {
    const error = e as Error;
    console.log("timelock event scan failed:", error.message);
  }

  console.log("\n== Recommendations (automated) ==");

  // Add recommendations based on findings
  const recommendations = [];

  if (!govImpl) {
    recommendations.push("Consider implementing upgradeable proxy pattern for governor contract");
  }

  try {
    const minDelay = await timelock.getMinDelay?.() ?? await timelock.MIN_DELAY?.();
    if (minDelay && minDelay.toString() === "0") {
      recommendations.push("Timelock delay is set to 0 - consider increasing for security");
    }
  } catch {
    recommendations.push("Unable to verify timelock delay configuration");
  }

  console.log("Security recommendations:");
  recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));

  if (recommendations.length === 0) {
    console.log("No immediate security concerns found in governance setup");
  }
}

main().catch(console.error);