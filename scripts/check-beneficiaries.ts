import { ethers } from "hardhat";

async function main() {
  const vestingAddress = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
  const beneficiaries = [
    "0x2b446CcB4c758c01C7D04a16E43758551F629102",
    "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38",
  ];

  const vest = await ethers.getContractAt("ARCxVestingContract", vestingAddress);

  console.log("Vesting contract:", vestingAddress);

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
        // fallback: ignore
      }
    } catch (err: any) {
      console.error("Error reading beneficiary", b, err.message ?? err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
