import { ethers } from "hardhat";

const ADDR = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";

async function main() {
  const provider = ethers.provider;
  const code = await provider.getCode(ADDR);
  if (code && code !== "0x") {
    console.log(`${ADDR} is a contract; bytecode length: ${code.length}`);
  } else {
    console.log(`${ADDR} is an EOA (no bytecode)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
