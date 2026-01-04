import { ethers } from "hardhat";

/**
 * Setup ADAM Policy Chains
 * 
 * This script configures the policy chains for the ADAM constitutional engine.
 * Run this after deploying ADAM contracts to set up or modify policy chains.
 */

interface PolicyConfig {
  topicId: number;
  hook: string;
  policyHash: string;
  order: number;
}

async function main() {
  console.log("\n⚙️  ADAM Policy Chain Setup\n");
  console.log("=" .repeat(70));

  const [admin] = await ethers.getSigners();
  console.log("Admin address:", admin.address);
  console.log("Admin balance:", ethers.formatEther(await ethers.provider.getBalance(admin.address)), "ETH\n");

  // Load deployed contract addresses (update these with your deployment)
  const ADAM_REGISTRY_ADDRESS = process.env.ADAM_REGISTRY_ADDRESS || "";
  
  if (!ADAM_REGISTRY_ADDRESS) {
    console.error("❌ Error: ADAM_REGISTRY_ADDRESS not set in environment");
    console.log("\nSet it in .env file or export it:");
    console.log("  export ADAM_REGISTRY_ADDRESS=0x...");
    process.exit(1);
  }

  console.log("Loading AdamRegistry at:", ADAM_REGISTRY_ADDRESS);
  const adamRegistry = await ethers.getContractAt("AdamRegistry", ADAM_REGISTRY_ADDRESS);
  console.log("✅ AdamRegistry loaded\n");

  // Get current chains
  console.log("📋 Current Policy Chains:");
  const allChains = await adamRegistry.getAllChains();
  
  if (allChains[0].length === 0) {
    console.log("  No policies registered yet\n");
  } else {
    for (let i = 0; i < allChains[0].length; i++) {
      const topicId = allChains[0][i];
      const hook = allChains[1][i];
      const chain = allChains[2][i];
      console.log(`  Topic ${topicId}, Hook ${hook}:`);
      chain.forEach((policy: string, index: number) => {
        console.log(`    ${index}: ${policy}`);
      });
    }
    console.log();
  }

  // Example: Add a new policy or update existing ones
  const action = process.argv[2] || "status";

  if (action === "status") {
    console.log("✅ Status check complete");
    console.log("\nAvailable actions:");
    console.log("  npx hardhat run scripts/setup_adam_policies.ts --network <network> status");
    console.log("  npx hardhat run scripts/setup_adam_policies.ts --network <network> add-policy");
    console.log("  npx hardhat run scripts/setup_adam_policies.ts --network <network> remove-policy");
  } else if (action === "add-policy") {
    console.log("Adding policy configuration...");
    
    // Example policy configuration
    // Modify these based on your needs
    const policyConfigs: PolicyConfig[] = [
      // Add more policies here as needed
      // {
      //   topicId: 0,
      //   hook: "0x12345678", // Hook selector
      //   policyHash: "0xabcdef...", // Policy Wasm hash
      //   order: 0
      // }
    ];

    if (policyConfigs.length === 0) {
      console.log("⚠️  No policies configured. Edit the script to add policy configurations.");
      return;
    }

    for (const config of policyConfigs) {
      console.log(`Adding policy for topic ${config.topicId}, hook ${config.hook}...`);
      const tx = await adamRegistry.setPolicy(
        config.topicId,
        config.hook,
        config.policyHash,
        config.order
      );
      await tx.wait();
      console.log(`✅ Policy added: ${tx.hash}`);
    }
    
    console.log("\n✅ Policy configuration complete!");
  } else if (action === "remove-policy") {
    console.log("⚠️  Remove policy functionality");
    console.log("Specify the policy to remove by editing the script.");
    
    // Example: Remove a policy
    // const topicId = 0;
    // const hook = "0x12345678";
    // const policyHash = "0xabcdef...";
    // 
    // const tx = await adamRegistry.removePolicy(topicId, hook, policyHash);
    // await tx.wait();
    // console.log(`✅ Policy removed: ${tx.hash}`);
  } else {
    console.error(`❌ Unknown action: ${action}`);
    console.log("Available actions: status, add-policy, remove-policy");
  }

  console.log("\n" + "=" .repeat(70));
  console.log("\n✅ ADAM policy setup complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
