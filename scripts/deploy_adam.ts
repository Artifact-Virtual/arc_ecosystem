import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

/**
 * Deploy ADAM Constitutional Policy Engine
 * 
 * This script deploys:
 * 1. AdamRegistry - Policy chain management
 * 2. AdamHost - Constitutional policy evaluation engine
 * 3. Constitutional Policy Programs:
 *    - ParamsGuardPolicy
 *    - TreasuryLimiterPolicy
 *    - RWARecencyPolicy
 *    - Dual2FAPolicy
 * 4. Registers policies with the registry
 */

async function main() {
  console.log("\n🏛️  ADAM Constitutional Policy Engine Deployment\n");
  console.log("=" .repeat(70));

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Configuration
  const config = {
    fuelMax: 1_000_000,
    memoryMax: 262_144, // 256KB
    min2FA: 10,         // 10 blocks
    max2FA: 100,        // 100 blocks
    easAddress: process.env.EAS_ADDRESS || ethers.ZeroAddress,
    eligibilityAddress: process.env.ELIGIBILITY_ADDRESS || ethers.ZeroAddress,
    emergencyBrakeAddress: process.env.EMERGENCY_BRAKE_ADDRESS || ethers.ZeroAddress,
    treasuryAddress: process.env.TREASURY_ADDRESS || ethers.ZeroAddress,
    rwaRegistryAddress: process.env.RWA_REGISTRY_ADDRESS || ethers.ZeroAddress,
    epochBudgetCap: ethers.parseEther("1000000"),  // 1M tokens
    largeTxThreshold: ethers.parseEther("100000"), // 100K tokens
    minOperatorStake: ethers.parseEther("10000"),  // 10K tokens
    treasury2FAThreshold: ethers.parseEther("50000"), // 50K tokens
    paramChange2FAThreshold: ethers.parseUnits("10", 16), // 10% change
  };

  console.log("Configuration:");
  console.log("  Fuel Max:", config.fuelMax);
  console.log("  Memory Max:", config.memoryMax);
  console.log("  2FA Block Range:", config.min2FA, "-", config.max2FA);
  console.log("  Epoch Budget Cap:", ethers.formatEther(config.epochBudgetCap));
  console.log("  Large Tx Threshold:", ethers.formatEther(config.largeTxThreshold));
  console.log("  Min Operator Stake:", ethers.formatEther(config.minOperatorStake));
  console.log();

  // Step 1: Deploy AdamRegistry
  console.log("📋 Step 1: Deploying AdamRegistry...");
  const AdamRegistry = await ethers.getContractFactory("AdamRegistry");
  const adamRegistry = await upgrades.deployProxy(
    AdamRegistry,
    [],
    {
      kind: 'uups',
      initializer: 'initialize'
    }
  );
  await adamRegistry.waitForDeployment();
  const registryAddress = await adamRegistry.getAddress();
  console.log("✅ AdamRegistry deployed at:", registryAddress);
  console.log();

  // Step 2: Deploy AdamHost
  console.log("🏛️  Step 2: Deploying AdamHost...");
  const AdamHost = await ethers.getContractFactory("AdamHost");
  const adamHost = await upgrades.deployProxy(
    AdamHost,
    [
      registryAddress,
      config.easAddress,
      config.eligibilityAddress,
      config.emergencyBrakeAddress
    ],
    {
      kind: 'uups',
      initializer: 'initialize'
    }
  );
  await adamHost.waitForDeployment();
  const hostAddress = await adamHost.getAddress();
  console.log("✅ AdamHost deployed at:", hostAddress);
  console.log();

  // Step 3: Deploy Constitutional Policies
  console.log("📜 Step 3: Deploying Constitutional Policies...");
  
  // Generate placeholder Wasm hashes (in production, these would be real Wasm program hashes)
  const paramsGuardWasm = ethers.keccak256(ethers.toUtf8Bytes("ParamsGuardPolicy-v1.0.0"));
  const treasuryLimiterWasm = ethers.keccak256(ethers.toUtf8Bytes("TreasuryLimiterPolicy-v1.0.0"));
  const rwaRecencyWasm = ethers.keccak256(ethers.toUtf8Bytes("RWARecencyPolicy-v1.0.0"));
  const dual2FAWasm = ethers.keccak256(ethers.toUtf8Bytes("Dual2FAPolicy-v1.0.0"));

  // Deploy ParamsGuardPolicy
  console.log("  Deploying ParamsGuardPolicy...");
  const ParamsGuardPolicy = await ethers.getContractFactory("ParamsGuardPolicy");
  const paramsGuard = await ParamsGuardPolicy.deploy(deployer.address, paramsGuardWasm);
  await paramsGuard.waitForDeployment();
  const paramsGuardAddress = await paramsGuard.getAddress();
  console.log("  ✅ ParamsGuardPolicy deployed at:", paramsGuardAddress);

  // Deploy TreasuryLimiterPolicy
  console.log("  Deploying TreasuryLimiterPolicy...");
  const TreasuryLimiterPolicy = await ethers.getContractFactory("TreasuryLimiterPolicy");
  const treasuryLimiter = await TreasuryLimiterPolicy.deploy(
    deployer.address,
    config.treasuryAddress,
    treasuryLimiterWasm,
    config.epochBudgetCap,
    config.largeTxThreshold
  );
  await treasuryLimiter.waitForDeployment();
  const treasuryLimiterAddress = await treasuryLimiter.getAddress();
  console.log("  ✅ TreasuryLimiterPolicy deployed at:", treasuryLimiterAddress);

  // Deploy RWARecencyPolicy
  console.log("  Deploying RWARecencyPolicy...");
  const RWARecencyPolicy = await ethers.getContractFactory("RWARecencyPolicy");
  const rwaRecency = await RWARecencyPolicy.deploy(
    deployer.address,
    config.rwaRegistryAddress,
    rwaRecencyWasm,
    config.minOperatorStake
  );
  await rwaRecency.waitForDeployment();
  const rwaRecencyAddress = await rwaRecency.getAddress();
  console.log("  ✅ RWARecencyPolicy deployed at:", rwaRecencyAddress);

  // Deploy Dual2FAPolicy
  console.log("  Deploying Dual2FAPolicy...");
  const Dual2FAPolicy = await ethers.getContractFactory("Dual2FAPolicy");
  const dual2FA = await Dual2FAPolicy.deploy(
    deployer.address,
    dual2FAWasm,
    config.treasury2FAThreshold,
    config.paramChange2FAThreshold
  );
  await dual2FA.waitForDeployment();
  const dual2FAAddress = await dual2FA.getAddress();
  console.log("  ✅ Dual2FAPolicy deployed at:", dual2FAAddress);
  console.log();

  // Step 4: Approve Wasm hashes in registry
  console.log("🔐 Step 4: Approving Wasm hashes in registry...");
  await adamRegistry.approveWasmHash(paramsGuardWasm);
  console.log("  ✅ Approved ParamsGuard Wasm hash");
  await adamRegistry.approveWasmHash(treasuryLimiterWasm);
  console.log("  ✅ Approved TreasuryLimiter Wasm hash");
  await adamRegistry.approveWasmHash(rwaRecencyWasm);
  console.log("  ✅ Approved RWARecency Wasm hash");
  await adamRegistry.approveWasmHash(dual2FAWasm);
  console.log("  ✅ Approved Dual2FA Wasm hash");
  console.log();

  // Step 5: Register policy chains
  console.log("⛓️  Step 5: Registering policy chains...");
  
  // Get hook constants from AdamHost
  const HOOK_SUBMIT = await adamHost.HOOK_SUBMIT();
  const HOOK_TALLY = await adamHost.HOOK_TALLY();
  const HOOK_QUEUE = await adamHost.HOOK_QUEUE();
  const HOOK_EXECUTE = await adamHost.HOOK_EXECUTE();
  const HOOK_RWA_UPDATE = await adamHost.HOOK_RWA_UPDATE();

  // Topic constants
  const TOPIC_TREASURY = 0;
  const TOPIC_PARAMS = 1;
  const TOPIC_ENERGY = 2;
  const TOPIC_CARBON = 3;
  const TOPIC_GRANTS = 4;

  // Register TREASURY policies
  console.log("  Registering TREASURY policies...");
  await adamRegistry.setPolicy(TOPIC_TREASURY, HOOK_TALLY, treasuryLimiterWasm, 0);
  await adamRegistry.setPolicy(TOPIC_TREASURY, HOOK_QUEUE, dual2FAWasm, 0);
  console.log("  ✅ TREASURY policies registered");

  // Register PARAMS policies
  console.log("  Registering PARAMS policies...");
  await adamRegistry.setPolicy(TOPIC_PARAMS, HOOK_TALLY, paramsGuardWasm, 0);
  await adamRegistry.setPolicy(TOPIC_PARAMS, HOOK_QUEUE, dual2FAWasm, 0);
  console.log("  ✅ PARAMS policies registered");

  // Register ENERGY policies
  console.log("  Registering ENERGY policies...");
  await adamRegistry.setPolicy(TOPIC_ENERGY, HOOK_RWA_UPDATE, rwaRecencyWasm, 0);
  await adamRegistry.setPolicy(TOPIC_ENERGY, HOOK_RWA_UPDATE, dual2FAWasm, 1);
  console.log("  ✅ ENERGY policies registered");

  // Register CARBON policies
  console.log("  Registering CARBON policies...");
  await adamRegistry.setPolicy(TOPIC_CARBON, HOOK_RWA_UPDATE, rwaRecencyWasm, 0);
  await adamRegistry.setPolicy(TOPIC_CARBON, HOOK_RWA_UPDATE, dual2FAWasm, 1);
  console.log("  ✅ CARBON policies registered");

  console.log();

  // Summary
  console.log("=" .repeat(70));
  console.log("\n📋 DEPLOYMENT SUMMARY\n");
  console.log("Core Contracts:");
  console.log("  AdamRegistry:", registryAddress);
  console.log("  AdamHost:", hostAddress);
  console.log();
  console.log("Constitutional Policies:");
  console.log("  ParamsGuardPolicy:", paramsGuardAddress);
  console.log("  TreasuryLimiterPolicy:", treasuryLimiterAddress);
  console.log("  RWARecencyPolicy:", rwaRecencyAddress);
  console.log("  Dual2FAPolicy:", dual2FAAddress);
  console.log();
  console.log("Wasm Hashes:");
  console.log("  ParamsGuard:", paramsGuardWasm);
  console.log("  TreasuryLimiter:", treasuryLimiterWasm);
  console.log("  RWARecency:", rwaRecencyWasm);
  console.log("  Dual2FA:", dual2FAWasm);
  console.log();
  console.log("=" .repeat(70));
  console.log("\n✅ ADAM Constitutional Policy Engine deployment complete!\n");

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      adamRegistry: registryAddress,
      adamHost: hostAddress,
      policies: {
        paramsGuard: paramsGuardAddress,
        treasuryLimiter: treasuryLimiterAddress,
        rwaRecency: rwaRecencyAddress,
        dual2FA: dual2FAAddress,
      },
    },
    wasmHashes: {
      paramsGuard: paramsGuardWasm,
      treasuryLimiter: treasuryLimiterWasm,
      rwaRecency: rwaRecencyWasm,
      dual2FA: dual2FAWasm,
    },
    config,
  };

  console.log("Deployment info saved to memory.");
  console.log("\nNext steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Configure governance contracts to use AdamHost");
  console.log("3. Transfer admin roles to governance/timelock");
  console.log("4. Test policy evaluation with sample proposals");
  console.log();

  return deploymentInfo;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
