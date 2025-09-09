import { ethers } from "hardhat";

async function main() {
  const tokenAddr = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
  const vestingAddr = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";
  const treasurySafe = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";

  const token = await ethers.getContractAt("ARCxV2Enhanced", tokenAddr);

  const treasuryBal = await token.balanceOf(treasurySafe);
  const vestingBal = await token.balanceOf(vestingAddr);
  const allowance = await token.allowance(treasurySafe, vestingAddr);

  console.log("Treasury Safe:", treasurySafe);
  console.log("  balance:", ethers.formatEther(treasuryBal));
  console.log("Vesting Contract:", vestingAddr);
  console.log("  balance:", ethers.formatEther(vestingBal));
  console.log("Allowance Treasury -> Vesting:", ethers.formatEther(allowance));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
