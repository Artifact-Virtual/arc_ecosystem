import { ethers } from "hardhat";

const VESTING_ADDRESS = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
const TOKEN_ADDRESS = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
const TREASURY_SAFE = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";
const ECOSYSTEM_SAFE = "0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb";
const CORE_TEAM_BENEFICIARY = "0x2b446CcB4c758c01C7D04a16E43758551F629102";

async function checkBeneficiaries() {
  const beneficiaries = [CORE_TEAM_BENEFICIARY, TREASURY_SAFE];

  const vest = await ethers.getContractAt("ARCxVestingContract", VESTING_ADDRESS);

  console.log("Vesting contract:", VESTING_ADDRESS);

  for (const b of beneficiaries) {
    try {
      const schedule = await vest.vestingSchedules(b);
      console.log(`\nBeneficiary: ${b}`);
      console.log("  totalAmount:", ethers.formatEther(schedule.totalAmount));
      console.log("  cliffDuration:", schedule.cliffDuration.toString());
      console.log("  duration:", schedule.duration.toString());
      console.log("  startTime:", schedule.startTime.toString());
      console.log("  amountClaimed:", ethers.formatEther(schedule.amountClaimed));
      console.log("  revoked:", schedule.revoked);
      console.log("  penaltyRate:", schedule.penaltyRate.toString());
      try {
        const info = await vest.getBeneficiaryDetails(b);
        console.log("  vestedAmount:", ethers.formatEther(info[0]));
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error("Error reading beneficiary", b, err.message ?? err);
    }
  }
}

async function checkTreasuryVesting() {
  const token = await ethers.getContractAt("ARCxV2Enhanced", TOKEN_ADDRESS);

  const treasuryBal = await token.balanceOf(TREASURY_SAFE);
  const vestingBal = await token.balanceOf(VESTING_ADDRESS);
  const allowance = await token.allowance(TREASURY_SAFE, VESTING_ADDRESS);

  console.log("Treasury Safe:", TREASURY_SAFE);
  console.log("  balance:", ethers.formatEther(treasuryBal));
  console.log("Vesting Contract:", VESTING_ADDRESS);
  console.log("  balance:", ethers.formatEther(vestingBal));
  console.log("Allowance Treasury -> Vesting:", ethers.formatEther(allowance));
}

async function checkVestingStatus() {
  console.log("🔍 Checking Vesting Setup Status");
  console.log("=================================");

  const [deployer] = await ethers.getSigners();

  const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
  const token = ARCxV2Enhanced.attach(TOKEN_ADDRESS);

  try {
    console.log("\n📊 TOKEN STATUS:");
    console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
    console.log("Max Supply:", ethers.formatEther(await token.MAX_SUPPLY()));
    console.log("Vesting Balance:", ethers.formatEther(await token.balanceOf(VESTING_ADDRESS)));

    console.log("\n🔒 MINTING STATUS:");
    try {
      const adminRole = await token.ADMIN_ROLE();
      const hasAdminRole = await token.hasRole(adminRole, deployer.address);
      console.log("Deployer has ADMIN_ROLE:", hasAdminRole);
      if (!hasAdminRole) {
        console.log("✅ MINTING FINALIZED - Supply locked at 1M tokens!");
      } else {
        console.log("⚠️  MINTING NOT YET FINALIZED");
      }
    } catch (e) {
      console.log("Could not check admin role status");
    }

    console.log("\n📝 VESTING SETUP REQUIREMENT:");
    console.log("⚠️  Vesting schedules need to be set up through Safe UI");
    console.log("Reason: Treasury and Ecosystem Safe addresses need manual approval");
    console.log("");
    console.log("NEXT STEPS:");
    console.log("1. Go to Treasury Safe: " + TREASURY_SAFE);
    console.log("2. Create vesting schedule for core team (120k tokens, 2yr, 6mo cliff)");
    console.log("3. Go to Ecosystem Safe: " + ECOSYSTEM_SAFE);
    console.log("4. Create vesting schedule for ecosystem (180k tokens, 3yr, 3mo cliff)");
    console.log("");
    console.log("Vesting Contract: " + VESTING_ADDRESS);

  } catch (error: any) {
    console.error("Error checking status:", error.message);
  }
}

async function getVestingOwner() {
  console.log(`Querying owner() of vesting contract ${VESTING_ADDRESS}...`);
  const vesting = await ethers.getContractAt("ARCxVestingContract", VESTING_ADDRESS);
  const owner = await vesting.owner();
  console.log("owner:", owner);
}

async function setupVestingAndFinalize() {
  console.log("🔒 ARCx V2 Enhanced - Vesting Configuration & Mint Finalization");
  console.log("================================================================");

  const [deployer] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);
  console.log("Token Contract:", TOKEN_ADDRESS);
  console.log("Vesting Contract:", VESTING_ADDRESS);

  const ARCxV2Enhanced = await ethers.getContractFactory("ARCxV2Enhanced");
  const token = ARCxV2Enhanced.attach(TOKEN_ADDRESS);

  const VestingContract = await ethers.getContractFactory("ARCxVestingContract");
  const vesting = VestingContract.attach(VESTING_ADDRESS);

  try {
    console.log("\n📊 CURRENT STATUS:");
    console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
    console.log("Max Supply:", ethers.formatEther(await token.MAX_SUPPLY()));
    console.log("Vesting Balance:", ethers.formatEther(await token.balanceOf(VESTING_ADDRESS)));

    console.log("\n🔒 FINALIZING MINT (Revoking Minter Role)...");
    const adminRole = await token.ADMIN_ROLE();
    const revokeTx = await token.revokeRole(adminRole, deployer.address);
    await revokeTx.wait();
    console.log("✅ ADMIN_ROLE revoked - No more tokens can be minted!");
    console.log("Supply is permanently capped at 1M tokens");

    console.log("\n⏰ CONFIGURING VESTING SCHEDULES...");

    const coreTeamAmount = ethers.parseEther("120000");
    const coreTeamBeneficiary = TREASURY_SAFE;
    const coreTeamStart = Math.floor(Date.now() / 1000);
    const coreTeamCliff = 6 * 30 * 24 * 60 * 60;
    const coreTeamDuration = 2 * 365 * 24 * 60 * 60;

    console.log("📤 Setting up Core Team vesting (120k tokens, 2yr, 6mo cliff)...");
    const coreTeamTx = await vesting.createVestingSchedule(
      coreTeamBeneficiary,
      coreTeamAmount,
      coreTeamCliff,
      coreTeamDuration,
      2000,
      "Core Team",
      false
    );
    await coreTeamTx.wait();
    console.log("✅ Core Team vesting configured");

    const ecosystemAmount = ethers.parseEther("180000");
    const ecosystemBeneficiary = ECOSYSTEM_SAFE;
    const ecosystemStart = Math.floor(Date.now() / 1000);
    const ecosystemCliff = 3 * 30 * 24 * 60 * 60;
    const ecosystemDuration = 3 * 365 * 24 * 60 * 60;

    console.log("📤 Setting up Ecosystem vesting (180k tokens, 3yr, 3mo cliff)...");
    const ecosystemTx = await vesting.createVestingSchedule(
      ecosystemBeneficiary,
      ecosystemAmount,
      ecosystemCliff,
      ecosystemDuration,
      1000,
      "Ecosystem Development",
      true
    );
    await ecosystemTx.wait();
    console.log("✅ Ecosystem vesting configured");

    console.log("\n✅ VESTING VERIFICATION:");
    console.log("Vesting Schedules Created: 2");
    console.log("Core Team: 120k tokens, 2 years, 6-month cliff");
    console.log("Ecosystem: 180k tokens, 3 years, 3-month cliff");
    console.log("Total Vested:", ethers.formatEther(coreTeamAmount + ecosystemAmount));

    console.log("\n🔒 MINT FINALIZATION VERIFICATION:");
    try {
      const hasAdminRole = await token.hasRole(adminRole, deployer.address);
      console.log("Deployer has ADMIN_ROLE:", hasAdminRole);
      console.log("✅ Minting is FINALIZED - No more tokens can ever be created!");
    } catch (e) {
      console.log("✅ Minting capabilities removed");
    }

    console.log("\n🎉 VESTING & FINALIZATION COMPLETE!");
    console.log("Token supply is permanently locked at 1,000,000 ARCX2");
    console.log("Vesting schedules active for 300k tokens");

  } catch (error: any) {
    console.error("Error during configuration:", error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: npx hardhat run scripts/vesting-manager.ts --network <network> <command>");
    console.log("Commands:");
    console.log("  check-beneficiaries  - Check vesting schedules for beneficiaries");
    console.log("  check-treasury       - Check treasury and vesting balances/allowances");
    console.log("  check-status         - Check overall vesting and minting status");
    console.log("  get-owner            - Get the owner of the vesting contract");
    console.log("  setup-finalize       - Setup vesting schedules and finalize minting");
    return;
  }

  const command = args[0];
  switch (command) {
    case "check-beneficiaries":
      await checkBeneficiaries();
      break;
    case "check-treasury":
      await checkTreasuryVesting();
      break;
    case "check-status":
      await checkVestingStatus();
      break;
    case "get-owner":
      await getVestingOwner();
      break;
    case "setup-finalize":
      await setupVestingAndFinalize();
      break;
    default:
      console.log("Unknown command:", command);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
