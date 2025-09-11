const ethers = require('ethers');

const DEPLOYER_WALLET = "0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B";
const POSITION_MANAGER = "0x498581fF718922c3f8e6A244956aF099B2652b2b";
const TREASURY_SAFE = "0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38";

async function checkPositions() {
  console.log("🔍 Checking Uniswap V4 Positions...");
  console.log("Deployer Wallet:", DEPLOYER_WALLET);
  console.log("Position Manager:", POSITION_MANAGER);
  console.log("Treasury Safe:", TREASURY_SAFE);

  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

  try {
    // Check contract code
    const code = await provider.getCode(POSITION_MANAGER);
    if (code === '0x') {
      console.log("❌ Position Manager contract not found");
      return;
    }
    console.log("✅ Position Manager contract exists");

    // Check what functions are available
    console.log("\n🔧 Checking contract interface...");

    // Try different possible interfaces
    const possibleInterfaces = [
      {
        name: "ERC721",
        abi: [
          "function balanceOf(address owner) view returns (uint256)",
          "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
          "function ownerOf(uint256 tokenId) view returns (address)"
        ]
      },
      {
        name: "Uniswap V4 Pool Manager",
        abi: [
          "function getPool(address token0, address token1, uint24 fee) view returns (address)",
          "function getPoolId(address token0, address token1, uint24 fee) view returns (bytes32)"
        ]
      }
    ];

    for (const iface of possibleInterfaces) {
      try {
        console.log(`\nTesting ${iface.name} interface...`);
        const contract = new ethers.Contract(POSITION_MANAGER, iface.abi, provider);

        if (iface.name === "ERC721") {
          const balance = await contract.balanceOf(DEPLOYER_WALLET);
          console.log(`✅ ERC721 balanceOf works: ${balance.toString()}`);
          break;
        } else if (iface.name === "Uniswap V4 Pool Manager") {
          // Try to get a pool
          const ARCX = "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437";
          const WETH = "0x4200000000000000000000000000000000000006";
          const pool = await contract.getPool(ARCX, WETH, 500); // 0.05% fee
          console.log(`✅ Pool Manager getPool works: ${pool}`);
          break;
        }
      } catch (error) {
        console.log(`❌ ${iface.name} interface failed:`, error.message);
      }
    }

    // Check deployer wallet
    console.log("\n📊 DEPLOYER WALLET POSITIONS:");
    const erc721Abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)"
    ];
    const positionManager = new ethers.Contract(POSITION_MANAGER, erc721Abi, provider);

    try {
      const deployerBalance = await positionManager.balanceOf(DEPLOYER_WALLET);
      console.log(`NFT Balance: ${deployerBalance.toString()}`);

      if (deployerBalance > 0) {
        for (let i = 0; i < deployerBalance; i++) {
          try {
            const tokenId = await positionManager.tokenOfOwnerByIndex(DEPLOYER_WALLET, i);
            console.log(`🎫 Position NFT #${tokenId.toString()}`);
          } catch (error) {
            console.log(`❌ Error getting token ${i}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Deployer wallet check failed:`, error.message);
    }

    // Check treasury safe
    console.log("\n🏦 TREASURY SAFE POSITIONS:");
    try {
      const treasuryBalance = await positionManager.balanceOf(TREASURY_SAFE);
      console.log(`NFT Balance: ${treasuryBalance.toString()}`);

      if (treasuryBalance > 0) {
        for (let i = 0; i < treasuryBalance; i++) {
          try {
            const tokenId = await positionManager.tokenOfOwnerByIndex(TREASURY_SAFE, i);
            console.log(`🎫 Position NFT #${tokenId.toString()}`);
          } catch (error) {
            console.log(`❌ Error getting token ${i}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Treasury safe check failed:`, error.message);
    }

    // Summary
    console.log("\n📋 SUMMARY:");
    console.log("Note: Variables may not be defined if checks failed");
    console.log("Check individual wallet results above");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkPositions();
