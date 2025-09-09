import { ethers } from "hardhat";

const VESTING = "0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600";

async function main() {
  console.log(`Querying owner() of vesting contract ${VESTING}...`);
  const vesting = await ethers.getContractAt("ARCxVestingContract", VESTING);
  const owner = await vesting.owner();
  console.log("owner:", owner);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
