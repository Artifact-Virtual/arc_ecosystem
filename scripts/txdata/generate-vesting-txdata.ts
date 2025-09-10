/* eslint-disable no-console */
// Generate raw calldata for Safe transactions to manage ARCx Vesting workflow
// Outputs JSON blocks: { to, value, data, description }

import { ethers } from "ethers";

// Addresses (Base mainnet)
const ARCX2 = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const VESTING = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
const TREASURY_SAFE = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
const ECOSYSTEM_SAFE = "0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb";

// Minimal ABIs
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

const VESTING_ABI = [
  "function setEmergencyMode(bool _emergencyMode)",
  "function emergencyWithdraw()",
  "function createVestingSchedule(address beneficiary,uint256 totalAmount,uint256 cliffDuration,uint256 duration,uint256 penaltyRate,string role,bool governanceEnabled)",
  "function owner() view returns (address)",
];

function encode(iface: ethers.Interface, fn: string, args: any[] = []) {
  return iface.encodeFunctionData(fn, args);
}

function wei(n: string) {
  return ethers.parseEther(n).toString();
}

function printTx(to: string, data: string, description: string) {
  const tx = { to, value: "0", data, description };
  console.log(JSON.stringify(tx, null, 2));
  console.log("");
}

async function main() {
  const erc20 = new ethers.Interface(ERC20_ABI);
  const vesting = new ethers.Interface(VESTING_ABI);

  console.log("\n=== Option A: Reclaim tokens from Vesting, then schedule from Treasury Safe ===\n");

  // 1) setEmergencyMode(true)
  printTx(
    VESTING,
    encode(vesting, "setEmergencyMode", [true]),
    "Vesting: setEmergencyMode(true)"
  );

  // 2) emergencyWithdraw() -> transfers ARCX2 from Vesting to owner() (Treasury Safe)
  printTx(
    VESTING,
    encode(vesting, "emergencyWithdraw", []),
    "Vesting: emergencyWithdraw() (sends all ARCX2 to owner/Treasury Safe)"
  );

  // 3) Approve Vesting to spend ARCX2 from Treasury Safe (use MAX for convenience)
  printTx(
    ARCX2,
    encode(erc20, "approve", [VESTING, ethers.MaxUint256]),
    "ARCX2: approve(vesting, MAX_UINT256)"
  );

  // 4) Create schedules (fits current 299,850 balance): 120,000 + 179,850
  const coreTeam = {
    beneficiary: TREASURY_SAFE,
    amount: wei("120000"),
    cliff: 6 * 30 * 24 * 60 * 60, // ~6 months
    duration: 2 * 365 * 24 * 60 * 60, // 2 years
    penalty: 2000, // 20%
    role: "Core Team",
    gov: false,
  };
  const ecosystemNow = {
    beneficiary: ECOSYSTEM_SAFE,
    amount: wei("179850"), // fits 299,850 total
    cliff: 3 * 30 * 24 * 60 * 60, // ~3 months
    duration: 3 * 365 * 24 * 60 * 60, // 3 years
    penalty: 1000, // 10%
    role: "Ecosystem Development",
    gov: true,
  };

  printTx(
    VESTING,
    encode(vesting, "createVestingSchedule", [
      coreTeam.beneficiary,
      coreTeam.amount,
      coreTeam.cliff,
      coreTeam.duration,
      coreTeam.penalty,
      coreTeam.role,
      coreTeam.gov,
    ]),
    "Vesting: createVestingSchedule(Core Team, 120,000 ARCX2, 6mo cliff, 2y duration, 20% penalty, gov=false)"
  );

  printTx(
    VESTING,
    encode(vesting, "createVestingSchedule", [
      ecosystemNow.beneficiary,
      ecosystemNow.amount,
      ecosystemNow.cliff,
      ecosystemNow.duration,
      ecosystemNow.penalty,
      ecosystemNow.role,
      ecosystemNow.gov,
    ]),
    "Vesting: createVestingSchedule(Ecosystem, 179,850 ARCX2, 3mo cliff, 3y duration, 10% penalty, gov=true)"
  );

  console.log("\n=== Option B: If you top up Treasury by +150 ARCX2 to reach 300,000 total ===\n");

  // Alternative approval (exact amount 300,000)
  printTx(
    ARCX2,
    encode(erc20, "approve", [VESTING, wei("300000")]),
    "ARCX2: approve(vesting, 300,000e18)"
  );

  const ecosystemFull = { ...ecosystemNow, amount: wei("180000") };

  printTx(
    VESTING,
    encode(vesting, "createVestingSchedule", [
      coreTeam.beneficiary,
      coreTeam.amount,
      coreTeam.cliff,
      coreTeam.duration,
      coreTeam.penalty,
      coreTeam.role,
      coreTeam.gov,
    ]),
    "Vesting: createVestingSchedule(Core Team, 120,000 ARCX2, 6mo cliff, 2y duration, 20% penalty, gov=false)"
  );

  printTx(
    VESTING,
    encode(vesting, "createVestingSchedule", [
      ecosystemFull.beneficiary,
      ecosystemFull.amount,
      ecosystemFull.cliff,
      ecosystemFull.duration,
      ecosystemFull.penalty,
      ecosystemFull.role,
      ecosystemFull.gov,
    ]),
    "Vesting: createVestingSchedule(Ecosystem, 180,000 ARCX2, 3mo cliff, 3y duration, 10% penalty, gov=true)"
  );

  console.log("\nNotes:\n- All values use 18 decimals.\n- createVestingSchedule sets startTime = block.timestamp at execution.\n- Run these from the Treasury Safe (owner of Vesting).\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
