import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import * as fs from "fs";
import * as path from "path";

/**
 * Comprehensive test deployment suite for the entire ARC ecosystem
 * Deploys all contracts to Ganache/Hardhat with funded test wallets
 * Purpose: System validation and integration testing
 */

interface DeploymentResult {
  name: string;
  address: string;
  deployer: string;
  gasUsed: string;
  timestamp: number;
}

interface TestWallet {
  address: string;
  privateKey: string;
  role: string;
  initialBalance: string;
}

class TestDeploymentSuite {
  private deployer!: SignerWithAddress;
  private testWallets: TestWallet[] = [];
  private deployments: DeploymentResult[] = [];
  private totalGasUsed: bigint = BigInt(0);

  async run() {
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("  ARC Ecosystem - Comprehensive Test Deployment Suite");
    console.log("═══════════════════════════════════════════════════════════\n");

    // Step 1: Setup test wallets
    await this.setupTestWallets();

    // Step 2: Deploy core token contracts
    await this.deployTokenContracts();

    // Step 3: Deploy governance contracts
    await this.deployGovernanceContracts();

    // Step 4: Deploy DeFi infrastructure
    await this.deployDeFiContracts();

    // Step 5: Deploy NFT & SBT contracts
    await this.deployNFTContracts();

    // Step 6: Deploy AI & Attestation contracts
    await this.deployAIContracts();

    // Step 7: Configure and wire contracts
    await this.configureContracts();

    // Step 8: Fund test accounts
    await this.fundTestAccounts();

    // Step 9: Run validation tests
    await this.runValidationTests();

    // Step 10: Generate deployment report
    await this.generateReport();

    console.log("\n✅ Test deployment completed successfully!\n");
  }

  private async setupTestWallets() {
    console.log("\n📝 Setting up test wallets...");

    const signers = await ethers.getSigners();
    this.deployer = signers[0];

    // Define test wallet roles
    const roles = [
      "Deployer",
      "DAO Treasury",
      "Governance Admin",
      "Token Manager",
      "NFT Minter",
      "SBT Issuer",
      "AI Attester",
      "Liquidity Provider",
      "Test User 1",
      "Test User 2",
      "Test User 3",
      "Test User 4",
      "Test User 5",
    ];

    for (let i = 0; i < Math.min(roles.length, signers.length); i++) {
      const signer = signers[i];
      const balance = await ethers.provider.getBalance(signer.address);

      this.testWallets.push({
        address: signer.address,
        privateKey: "See hardhat.config.ts",
        role: roles[i],
        initialBalance: ethers.formatEther(balance),
      });

      console.log(
        `  ${roles[i].padEnd(20)} ${signer.address} (${ethers.formatEther(
          balance
        )} ETH)`
      );
    }
  }

  private async deployTokenContracts() {
    console.log("\n🪙 Deploying token contracts...");

    try {
      // Deploy ARCx V2 Enhanced Token
      const ARCxV2 = await ethers.getContractFactory("ARCxV2");
      const arcx = await ARCxV2.deploy(
        "ARCx V2 Enhanced",
        "ARCX2",
        ethers.parseEther("1000000") // 1M total supply
      );
      await arcx.waitForDeployment();
      await this.recordDeployment("ARCx V2 Token", await arcx.getAddress(), arcx.deploymentTransaction()!);

      // Deploy ARCxMath library
      const ARCxMath = await ethers.getContractFactory("ARCxMath");
      const arcxMath = await ARCxMath.deploy();
      await arcxMath.waitForDeployment();
      await this.recordDeployment("ARCxMath Library", await arcxMath.getAddress(), arcxMath.deploymentTransaction()!);

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("ARCxVestingContract");
      const vesting = await Vesting.deploy(await arcx.getAddress());
      await vesting.waitForDeployment();
      await this.recordDeployment("Vesting Contract", await vesting.getAddress(), vesting.deploymentTransaction()!);

      // Deploy Airdrop Contract
      const Airdrop = await ethers.getContractFactory("ARCxAirdropContract");
      const airdrop = await Airdrop.deploy(
        await arcx.getAddress(),
        ethers.ZeroHash // Empty merkle root initially
      );
      await airdrop.waitForDeployment();
      await this.recordDeployment("Airdrop Contract", await airdrop.getAddress(), airdrop.deploymentTransaction()!);

      console.log("  ✅ Token contracts deployed successfully");
    } catch (error: any) {
      console.error("  ❌ Error deploying token contracts:", error.message);
      throw error;
    }
  }

  private async deployGovernanceContracts() {
    console.log("\n🏛️ Deploying governance contracts...");

    try {
      // Get ARCx token address
      const arcxAddress = this.deployments.find((d) => d.name === "ARCx V2 Token")?.address;

      // Deploy ARCTimelock
      const Timelock = await ethers.getContractFactory("ARCTimelock");
      const timelock = await Timelock.deploy(
        172800, // 2 days in seconds
        [this.deployer.address],
        [this.deployer.address],
        this.deployer.address
      );
      await timelock.waitForDeployment();
      await this.recordDeployment("ARCTimelock", await timelock.getAddress(), timelock.deploymentTransaction()!);

      // Deploy ARCGovernor
      const Governor = await ethers.getContractFactory("ARCGovernor");
      const governor = await Governor.deploy(
        arcxAddress,
        await timelock.getAddress(),
        "ARC Governor"
      );
      await governor.waitForDeployment();
      await this.recordDeployment("ARCGovernor", await governor.getAddress(), governor.deploymentTransaction()!);

      // Deploy ARCDAO
      const DAO = await ethers.getContractFactory("ARCDAO");
      const dao = await DAO.deploy(
        await governor.getAddress(),
        await timelock.getAddress(),
        arcxAddress
      );
      await dao.waitForDeployment();
      await this.recordDeployment("ARCDAO", await dao.getAddress(), dao.deploymentTransaction()!);

      // Deploy ARCTreasury
      const Treasury = await ethers.getContractFactory("ARCTreasury");
      const treasury = await Treasury.deploy(await dao.getAddress());
      await treasury.waitForDeployment();
      await this.recordDeployment("ARCTreasury", await treasury.getAddress(), treasury.deploymentTransaction()!);

      // Deploy ARCVoting
      const Voting = await ethers.getContractFactory("ARCVoting");
      const voting = await Voting.deploy(arcxAddress, await dao.getAddress());
      await voting.waitForDeployment();
      await this.recordDeployment("ARCVoting", await voting.getAddress(), voting.deploymentTransaction()!);

      console.log("  ✅ Governance contracts deployed successfully");
    } catch (error: any) {
      console.error("  ❌ Error deploying governance contracts:", error.message);
      throw error;
    }
  }

  private async deployDeFiContracts() {
    console.log("\n💰 Deploying DeFi contracts...");

    try {
      // Get ARCx token address
      const arcxAddress = this.deployments.find((d) => d.name === "ARCx V2 Token")?.address;

      // Deploy MockPoolManager (for testing)
      const MockPoolManager = await ethers.getContractFactory("MockPoolManager");
      const poolManager = await MockPoolManager.deploy();
      await poolManager.waitForDeployment();
      await this.recordDeployment("Mock Pool Manager", await poolManager.getAddress(), poolManager.deploymentTransaction()!);

      // Deploy ARCSwap
      const ARCSwap = await ethers.getContractFactory("ARCSwap");
      const arcSwap = await ARCSwap.deploy(
        await poolManager.getAddress(),
        arcxAddress
      );
      await arcSwap.waitForDeployment();
      await this.recordDeployment("ARCSwap", await arcSwap.getAddress(), arcSwap.deploymentTransaction()!);

      // Deploy StakingVault
      const StakingVault = await ethers.getContractFactory("StakingVault");
      const stakingVault = await StakingVault.deploy(arcxAddress);
      await stakingVault.waitForDeployment();
      await this.recordDeployment("Staking Vault", await stakingVault.getAddress(), stakingVault.deploymentTransaction()!);

      // Deploy ARCBridge
      const ARCBridge = await ethers.getContractFactory("ARCBridge");
      const bridge = await ARCBridge.deploy(arcxAddress);
      await bridge.waitForDeployment();
      await this.recordDeployment("ARCBridge", await bridge.getAddress(), bridge.deploymentTransaction()!);

      console.log("  ✅ DeFi contracts deployed successfully");
    } catch (error: any) {
      console.error("  ❌ Error deploying DeFi contracts:", error.message);
      throw error;
    }
  }

  private async deployNFTContracts() {
    console.log("\n🎨 Deploying NFT & SBT contracts...");

    try {
      // Deploy EvolvingCompanion (Upgradeable)
      const EvolvingCompanion = await ethers.getContractFactory("EvolvingCompanionUpgradeable");
      const companion = await upgrades.deployProxy(
        EvolvingCompanion,
        ["ARC Companion", "ARCC", this.deployer.address],
        { initializer: "initialize" }
      );
      await companion.waitForDeployment();
      await this.recordDeployment("Evolving Companion NFT", await companion.getAddress(), companion.deploymentTransaction()!);

      // Deploy ModelRegistry (Upgradeable)
      const ModelRegistry = await ethers.getContractFactory("ModelRegistryUpgradeable");
      const modelRegistry = await upgrades.deployProxy(
        ModelRegistry,
        [this.deployer.address],
        { initializer: "initialize" }
      );
      await modelRegistry.waitForDeployment();
      await this.recordDeployment("Model Registry", await modelRegistry.getAddress(), modelRegistry.deploymentTransaction()!);

      // Deploy TraitVault (Upgradeable)
      const TraitVault = await ethers.getContractFactory("TraitVaultUpgradeable");
      const traitVault = await upgrades.deployProxy(
        TraitVault,
        [await companion.getAddress()],
        { initializer: "initialize" }
      );
      await traitVault.waitForDeployment();
      await this.recordDeployment("Trait Vault", await traitVault.getAddress(), traitVault.deploymentTransaction()!);

      // Deploy ARC_IdentitySBT
      const IdentitySBT = await ethers.getContractFactory("ARC_IdentitySBT");
      const identitySBT = await IdentitySBT.deploy("ARC Identity SBT", "ARC-ID");
      await identitySBT.waitForDeployment();
      await this.recordDeployment("Identity SBT", await identitySBT.getAddress(), identitySBT.deploymentTransaction()!);

      // Deploy ARC_Eligibility
      const Eligibility = await ethers.getContractFactory("ARC_Eligibility");
      const eligibility = await Eligibility.deploy(await identitySBT.getAddress());
      await eligibility.waitForDeployment();
      await this.recordDeployment("Eligibility Contract", await eligibility.getAddress(), eligibility.deploymentTransaction()!);

      console.log("  ✅ NFT & SBT contracts deployed successfully");
    } catch (error: any) {
      console.error("  ❌ Error deploying NFT contracts:", error.message);
      throw error;
    }
  }

  private async deployAIContracts() {
    console.log("\n🤖 Deploying AI & Attestation contracts...");

    try {
      // Deploy AIAttestation (Upgradeable)
      const AIAttestation = await ethers.getContractFactory("AIAttestation");
      const attestation = await upgrades.deployProxy(
        AIAttestation,
        [this.deployer.address],
        { initializer: "initialize" }
      );
      await attestation.waitForDeployment();
      await this.recordDeployment("AI Attestation", await attestation.getAddress(), attestation.deploymentTransaction()!);

      // Deploy AdamHost
      const AdamHost = await ethers.getContractFactory("AdamHost");
      const adamHost = await AdamHost.deploy();
      await adamHost.waitForDeployment();
      await this.recordDeployment("ADAM Host", await adamHost.getAddress(), adamHost.deploymentTransaction()!);

      // Deploy AdamRegistry
      const AdamRegistry = await ethers.getContractFactory("AdamRegistry");
      const adamRegistry = await AdamRegistry.deploy();
      await adamRegistry.waitForDeployment();
      await this.recordDeployment("ADAM Registry", await adamRegistry.getAddress(), adamRegistry.deploymentTransaction()!);

      console.log("  ✅ AI contracts deployed successfully");
    } catch (error: any) {
      console.error("  ❌ Error deploying AI contracts:", error.message);
      throw error;
    }
  }

  private async configureContracts() {
    console.log("\n⚙️ Configuring contracts and roles...");

    try {
      // Get contract instances
      const arcxAddress = this.deployments.find((d) => d.name === "ARCx V2 Token")?.address;
      const governorAddress = this.deployments.find((d) => d.name === "ARCGovernor")?.address;
      const timelockAddress = this.deployments.find((d) => d.name === "ARCTimelock")?.address;

      // Configure Timelock roles
      const timelock = await ethers.getContractAt("ARCTimelock", timelockAddress!);
      const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
      const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();

      // Grant roles to Governor
      await timelock.grantRole(PROPOSER_ROLE, governorAddress);
      await timelock.grantRole(EXECUTOR_ROLE, governorAddress);

      console.log("  ✅ Governance roles configured");

      // Configure AI Attestation roles
      const attestationAddress = this.deployments.find((d) => d.name === "AI Attestation")?.address;
      const attestation = await ethers.getContractAt("AIAttestation", attestationAddress!);
      
      const signers = await ethers.getSigners();
      if (signers.length > 6) {
        const ATTESTER_ROLE = await attestation.ATTESTER_ROLE();
        await attestation.grantRole(ATTESTER_ROLE, signers[6].address);
        console.log("  ✅ AI Attestation roles configured");
      }

      console.log("  ✅ All contracts configured successfully");
    } catch (error: any) {
      console.error("  ❌ Error configuring contracts:", error.message);
      throw error;
    }
  }

  private async fundTestAccounts() {
    console.log("\n💸 Funding test accounts with tokens...");

    try {
      const arcxAddress = this.deployments.find((d) => d.name === "ARCx V2 Token")?.address;
      const arcx = await ethers.getContractAt("ARCxV2", arcxAddress!);

      const signers = await ethers.getSigners();
      const fundingAmounts = [
        0, // Deployer already has all
        ethers.parseEther("100000"), // DAO Treasury
        ethers.parseEther("50000"),  // Governance Admin
        ethers.parseEther("25000"),  // Token Manager
        ethers.parseEther("10000"),  // NFT Minter
        ethers.parseEther("10000"),  // SBT Issuer
        ethers.parseEther("10000"),  // AI Attester
        ethers.parseEther("50000"),  // Liquidity Provider
        ethers.parseEther("1000"),   // Test User 1
        ethers.parseEther("1000"),   // Test User 2
        ethers.parseEther("1000"),   // Test User 3
        ethers.parseEther("1000"),   // Test User 4
        ethers.parseEther("1000"),   // Test User 5
      ];

      for (let i = 1; i < Math.min(fundingAmounts.length, signers.length); i++) {
        if (fundingAmounts[i] > 0) {
          await arcx.transfer(signers[i].address, fundingAmounts[i]);
          console.log(
            `  ✅ Funded ${this.testWallets[i].role}: ${ethers.formatEther(
              fundingAmounts[i]
            )} ARCX2`
          );
        }
      }

      console.log("  ✅ All test accounts funded successfully");
    } catch (error: any) {
      console.error("  ❌ Error funding accounts:", error.message);
      throw error;
    }
  }

  private async runValidationTests() {
    console.log("\n🧪 Running validation tests...");

    try {
      // Test 1: Token functionality
      console.log("  Testing token functionality...");
      const arcxAddress = this.deployments.find((d) => d.name === "ARCx V2 Token")?.address;
      const arcx = await ethers.getContractAt("ARCxV2", arcxAddress!);
      const totalSupply = await arcx.totalSupply();
      console.log(`    Total supply: ${ethers.formatEther(totalSupply)} ARCX2`);

      // Test 2: Governance
      console.log("  Testing governance setup...");
      const governorAddress = this.deployments.find((d) => d.name === "ARCGovernor")?.address;
      const governor = await ethers.getContractAt("ARCGovernor", governorAddress!);
      const votingPeriod = await governor.votingPeriod();
      console.log(`    Voting period: ${votingPeriod} blocks`);

      // Test 3: AI Attestation
      console.log("  Testing AI attestation...");
      const attestationAddress = this.deployments.find((d) => d.name === "AI Attestation")?.address;
      const attestation = await ethers.getContractAt("AIAttestation", attestationAddress!);
      const totalAttestations = await attestation.getTotalAttestations();
      console.log(`    Total attestations: ${totalAttestations}`);

      console.log("  ✅ All validation tests passed");
    } catch (error: any) {
      console.error("  ❌ Error running validation tests:", error.message);
      throw error;
    }
  }

  private async recordDeployment(name: string, address: string, tx: any) {
    const receipt = await tx.wait();
    
    this.deployments.push({
      name,
      address,
      deployer: this.deployer.address,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: Date.now(),
    });

    this.totalGasUsed += receipt.gasUsed;

    console.log(`  ✅ ${name.padEnd(30)} ${address}`);
  }

  private async generateReport() {
    console.log("\n📊 Generating deployment report...");

    const report = {
      network: {
        name: (await ethers.provider.getNetwork()).name,
        chainId: (await ethers.provider.getNetwork()).chainId.toString(),
      },
      deployment: {
        timestamp: new Date().toISOString(),
        deployer: this.deployer.address,
        totalContracts: this.deployments.length,
        totalGasUsed: this.totalGasUsed.toString(),
      },
      testWallets: this.testWallets,
      contracts: this.deployments,
    };

    // Save to file
    const reportPath = path.join(process.cwd(), "deployment", "testnet", "test-deployment-report.json");
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`  ✅ Report saved to: ${reportPath}`);

    // Print summary
    console.log("\n" + "═".repeat(60));
    console.log("  DEPLOYMENT SUMMARY");
    console.log("═".repeat(60));
    console.log(`  Total Contracts:   ${this.deployments.length}`);
    console.log(`  Total Gas Used:    ${this.totalGasUsed.toString()}`);
    console.log(`  Test Wallets:      ${this.testWallets.length}`);
    console.log(`  Network:           ${report.network.name} (${report.network.chainId})`);
    console.log("═".repeat(60));
  }
}

// Main execution
async function main() {
  const suite = new TestDeploymentSuite();
  await suite.run();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
