// scripts/check-governance.ts
// Governance configuration and environment verification script
// Checks governance setup without requiring deployed contracts

import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface CheckResult {
  check: string;
  status: "PASS" | "FAIL" | "WARN" | "INFO";
  message: string;
  details?: any;
}

class GovernanceChecker {
  private results: CheckResult[] = [];

  async runAllChecks() {
    console.log("🔍 ARC Constitutional DAO - Governance Contract Verification");
    console.log("============================================================");

    await this.checkEnvironmentConfiguration();
    await this.checkContractArtifacts();
    await this.checkNetworkConfiguration();
    await this.checkDeploymentScripts();

    this.displayResults();
  }

  private async checkEnvironmentConfiguration() {
    console.log("\n🔧 Checking Environment Configuration...");

    // Check for .env file
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      this.results.push({
        check: "Environment File",
        status: "PASS",
        message: ".env file exists"
      });

      // Check for governance-related environment variables
      const envContent = fs.readFileSync(envPath, "utf8");
      const requiredVars = [
        "DAO_GOVERNOR_ADDRESS",
        "DAO_TIMELOCK_ADDRESS",
        "DAO_PROPOSAL_ADDRESS",
        "DAO_VOTING_ADDRESS",
        "DAO_TREASURY_ADDRESS",
        "DAO_CORE_ADDRESS"
      ];

      for (const varName of requiredVars) {
        if (envContent.includes(varName)) {
          this.results.push({
            check: `${varName} Configuration`,
            status: "INFO",
            message: `${varName} is configured in environment`
          });
        } else {
          this.results.push({
            check: `${varName} Configuration`,
            status: "WARN",
            message: `${varName} not found in environment (may be configured elsewhere)`
          });
        }
      }
    } else {
      this.results.push({
        check: "Environment File",
        status: "WARN",
        message: ".env file not found - governance addresses may be hardcoded"
      });
    }
  }

  private async checkContractArtifacts() {
    console.log("\n� Checking Contract Artifacts...");

    const artifactsDir = path.join(process.cwd(), "artifacts", "contracts");

    if (!fs.existsSync(artifactsDir)) {
      this.results.push({
        check: "Contract Artifacts",
        status: "FAIL",
        message: "artifacts/contracts directory not found"
      });
      return;
    }

    // Check for governance contract artifacts
    const governanceContracts = [
      "ARCGovernor",
      "ARCTimelock",
      "ARCProposal",
      "ARCVoting",
      "ARCTreasury",
      "ARCDAO"
    ];

    for (const contractName of governanceContracts) {
      const contractDir = path.join(artifactsDir, contractName + ".sol");
      if (fs.existsSync(contractDir)) {
        this.results.push({
          check: `${contractName} Artifact`,
          status: "PASS",
          message: `${contractName} contract artifact exists`
        });
      } else {
        this.results.push({
          check: `${contractName} Artifact`,
          status: "FAIL",
          message: `${contractName} contract artifact not found`
        });
      }
    }
  }

  private async checkNetworkConfiguration() {
    console.log("\n🌐 Checking Network Configuration...");

    const hardhatConfigPath = path.join(process.cwd(), "hardhat.config.ts");
    if (fs.existsSync(hardhatConfigPath)) {
      const configContent = fs.readFileSync(hardhatConfigPath, "utf8");

      // Check for Base network configuration
      if (configContent.includes("base")) {
        this.results.push({
          check: "Base Network Configuration",
          status: "PASS",
          message: "Base network is configured in Hardhat config"
        });
      } else {
        this.results.push({
          check: "Base Network Configuration",
          status: "WARN",
          message: "Base network configuration not found in Hardhat config"
        });
      }

      // Check for other governance-related network settings
      if (configContent.includes("timelock") || configContent.includes("governor")) {
        this.results.push({
          check: "Governance Network Settings",
          status: "PASS",
          message: "Governance-related network settings found"
        });
      } else {
        this.results.push({
          check: "Governance Network Settings",
          status: "INFO",
          message: "No specific governance network settings found"
        });
      }
    } else {
      this.results.push({
        check: "Hardhat Configuration",
        status: "FAIL",
        message: "hardhat.config.ts not found"
      });
    }
  }

  private async checkDeploymentScripts() {
    console.log("\n🚀 Checking Deployment Scripts...");

    const scriptsDir = path.join(process.cwd(), "scripts");

    // Check for governance deployment scripts
    const deploymentScripts = [
      "deploy-governance.ts",
      "deploy_dao.ts",
      "governance-test.ts"
    ];

    for (const scriptName of deploymentScripts) {
      const scriptPath = path.join(scriptsDir, scriptName);
      if (fs.existsSync(scriptPath)) {
        this.results.push({
          check: `${scriptName} Script`,
          status: "PASS",
          message: `${scriptName} deployment script exists`
        });
      } else {
        this.results.push({
          check: `${scriptName} Script`,
          status: "WARN",
          message: `${scriptName} deployment script not found`
        });
      }
    }
  }

  private displayResults() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 GOVERNANCE CHECK RESULTS");
    console.log("=".repeat(60));

    const passed = this.results.filter(r => r.status === "PASS").length;
    const failed = this.results.filter(r => r.status === "FAIL").length;
    const warnings = this.results.filter(r => r.status === "WARN").length;
    const info = this.results.filter(r => r.status === "INFO").length;

    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log(`⚠️ WARNINGS: ${warnings}`);
    console.log(`ℹ️ INFO: ${info}`);
    console.log("");

    for (const result of this.results) {
      const icon = result.status === "PASS" ? "✅" : result.status === "FAIL" ? "❌" : result.status === "WARN" ? "⚠️" : "ℹ️";
      console.log(`${icon} ${result.check}: ${result.message}`);
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    }

    console.log("\n" + "=".repeat(60));

    if (failed > 0) {
      console.log("❌ GOVERNANCE CHECKS FAILED - REVIEW ISSUES ABOVE");
      process.exit(1);
    } else if (warnings > 0) {
      console.log("⚠️ GOVERNANCE CHECKS COMPLETED WITH WARNINGS");
    } else {
      console.log("✅ ALL GOVERNANCE CHECKS PASSED");
    }
  }
}

// Main execution
async function main() {
  const checker = new GovernanceChecker();
  await checker.runAllChecks();
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("\n🎉 Governance check completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Governance check failed:", error);
      process.exit(1);
    });
}

export { GovernanceChecker };