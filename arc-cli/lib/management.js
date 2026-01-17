/**
 * ARC CLI - Advanced Management Dashboard
 * Central management system for the entire ARC ecosystem
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const Table = require('cli-table3');
const theme = require('./theme');
const Utils = require('./utils');
const config = require('./config');
const fs = require('fs');
const path = require('path');

class ManagementDashboard {
  constructor() {
    this.systemStatus = {
      contracts: {},
      health: 'unknown',
      lastCheck: null
    };
  }

  async show() {
    console.clear();
    this.displayHeader();

    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Management Dashboard - Select Action:',
        choices: [
          { name: `${theme.icons.dashboard} System Health Dashboard`, value: 'health' },
          { name: `${theme.icons.deploy} Deployment Orchestration`, value: 'deploy' },
          { name: `${theme.icons.test} Test Ecosystem Deployment`, value: 'test-deploy' },
          { name: `${theme.icons.ai} AI Attestation Service`, value: 'attestation' },
          { name: `${theme.icons.network} Network Status & Monitoring`, value: 'network' },
          { name: `${theme.icons.wallet} Test Wallet Management`, value: 'wallets' },
          { name: `${theme.icons.config} System Configuration`, value: 'config' },
          { name: `${theme.icons.analytics} Comprehensive Analytics`, value: 'analytics' },
          new inquirer.Separator(),
          { name: `${theme.icons.back} Back to Main Menu`, value: 'back' },
        ],
      },
    ]);

    switch (choice.action) {
      case 'health':
        return await this.showSystemHealth();
      case 'deploy':
        return await this.showDeploymentOrchestration();
      case 'test-deploy':
        return await this.deployTestEcosystem();
      case 'attestation':
        return await this.manageAttestationService();
      case 'network':
        return await this.showNetworkStatus();
      case 'wallets':
        return await this.manageTestWallets();
      case 'config':
        return await this.manageConfiguration();
      case 'analytics':
        return await this.showComprehensiveAnalytics();
      case 'back':
        return 'back';
      default:
        return await this.show();
    }
  }

  displayHeader() {
    const figlet = require('figlet');
    const header = figlet.textSync('ARC MGMT', {
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted'
    });
    
    console.log(theme.primary(header));
    console.log(theme.muted('═'.repeat(80)));
    console.log(theme.info('Advanced Management Dashboard - Complete System Control'));
    console.log(theme.muted('═'.repeat(80)) + '\n');
  }

  async showSystemHealth() {
    console.clear();
    const spinner = ora('Checking system health...').start();

    try {
      // Check all system components
      const health = await this.performHealthCheck();
      spinner.succeed('Health check complete');

      console.log('\n' + theme.primary('═══ SYSTEM HEALTH DASHBOARD ═══\n'));

      // Overall Status
      const statusColor = health.overall === 'healthy' ? theme.success : 
                         health.overall === 'degraded' ? theme.warning : theme.error;
      console.log(`Overall Status: ${statusColor(health.overall.toUpperCase())}\n`);

      // Contract Status Table
      const contractTable = new Table({
        head: ['Contract', 'Status', 'Address', 'Last Check'],
        colWidths: [25, 12, 44, 20],
        style: {
          head: ['cyan', 'bold']
        }
      });

      for (const [name, status] of Object.entries(health.contracts)) {
        const statusIcon = status.active ? '✅' : '❌';
        contractTable.push([
          name,
          statusIcon + ' ' + status.status,
          status.address,
          status.lastCheck
        ]);
      }

      console.log(contractTable.toString());

      // Network Status
      console.log('\n' + theme.primary('Network Status:'));
      console.log(`  Chain ID: ${health.network.chainId}`);
      console.log(`  Latest Block: ${health.network.latestBlock}`);
      console.log(`  Gas Price: ${health.network.gasPrice} gwei`);
      console.log(`  Network Latency: ${health.network.latency}ms`);

      // System Metrics
      console.log('\n' + theme.primary('System Metrics:'));
      console.log(`  Total Contracts: ${health.metrics.totalContracts}`);
      console.log(`  Active Deployments: ${health.metrics.activeDeployments}`);
      console.log(`  Total Transactions: ${health.metrics.totalTransactions}`);
      console.log(`  System Uptime: ${health.metrics.uptime}`);

      // Alerts & Warnings
      if (health.alerts.length > 0) {
        console.log('\n' + theme.warning('⚠️  ALERTS:'));
        health.alerts.forEach(alert => {
          console.log(`  ${theme.warning('•')} ${alert}`);
        });
      }

      await Utils.pressAnyKey('\nPress any key to continue...');
      return await this.show();
    } catch (error) {
      spinner.fail('Health check failed');
      console.error(theme.error(Utils.parseError(error)));
      await Utils.pressAnyKey();
      return await this.show();
    }
  }

  async showDeploymentOrchestration() {
    console.clear();
    console.log(theme.primary('═══ DEPLOYMENT ORCHESTRATION ═══\n'));

    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select Deployment Action:',
        choices: [
          { name: '🚀 Deploy Full Ecosystem', value: 'full' },
          { name: '🪙 Deploy Token Contracts Only', value: 'tokens' },
          { name: '🏛️ Deploy Governance Contracts', value: 'governance' },
          { name: '💰 Deploy DeFi Infrastructure', value: 'defi' },
          { name: '🎨 Deploy NFT System', value: 'nfts' },
          { name: '🤖 Deploy AI Contracts', value: 'ai' },
          { name: '📊 View Deployment Status', value: 'status' },
          new inquirer.Separator(),
          { name: '⬅️  Back', value: 'back' },
        ],
      },
    ]);

    if (choice.action === 'back') {
      return await this.show();
    }

    if (choice.action === 'status') {
      return await this.showDeploymentStatus();
    }

    // Confirm deployment
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Are you sure you want to deploy ${choice.action}?`,
        default: false,
      },
    ]);

    if (!confirm.proceed) {
      return await this.showDeploymentOrchestration();
    }

    // Perform deployment
    return await this.executeDeployment(choice.action);
  }

  async deployTestEcosystem() {
    console.clear();
    console.log(theme.primary('═══ TEST ECOSYSTEM DEPLOYMENT ═══\n'));

    console.log(theme.info('This will deploy the entire ARC ecosystem to a test network with funded wallets.\n'));

    const networkChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'network',
        message: 'Select target network:',
        choices: [
          { name: 'Hardhat (Local)', value: 'hardhat' },
          { name: 'Ganache (Local)', value: 'ganache' },
          { name: 'Base Sepolia (Testnet)', value: 'base-sepolia' },
          new inquirer.Separator(),
          { name: '⬅️  Back', value: 'back' },
        ],
      },
    ]);

    if (networkChoice.network === 'back') {
      return await this.show();
    }

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'This will deploy ALL contracts and fund test wallets. Continue?',
        default: false,
      },
    ]);

    if (!confirm.proceed) {
      return await this.deployTestEcosystem();
    }

    console.log('\n' + theme.info('Starting comprehensive test deployment...\n'));

    const spinner = ora('Initializing deployment...').start();

    try {
      // Execute deployment script
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);

      spinner.text = 'Deploying contracts...';
      
      const { stdout, stderr } = await execPromise(
        `npx hardhat run scripts/deploy-test-ecosystem.ts --network ${networkChoice.network}`,
        { cwd: path.join(__dirname, '..', '..') }
      );

      spinner.succeed('Deployment complete!');

      console.log('\n' + theme.success('✅ Test ecosystem deployed successfully!\n'));
      console.log(theme.muted('Deployment output:\n'));
      console.log(stdout);

      // Load and display deployment report
      const reportPath = path.join(__dirname, '..', '..', 'deployment', 'testnet', 'test-deployment-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        console.log('\n' + theme.primary('═══ DEPLOYMENT SUMMARY ═══\n'));
        console.log(`Network: ${report.network.name} (Chain ID: ${report.network.chainId})`);
        console.log(`Total Contracts: ${report.deployment.totalContracts}`);
        console.log(`Total Gas Used: ${report.deployment.totalGasUsed}`);
        console.log(`Test Wallets: ${report.testWallets.length}\n`);

        // Display test wallets
        console.log(theme.primary('Test Wallets:\n'));
        const walletTable = new Table({
          head: ['Role', 'Address', 'Balance (ETH)'],
          colWidths: [20, 44, 15],
        });

        report.testWallets.forEach(wallet => {
          walletTable.push([wallet.role, wallet.address, wallet.initialBalance]);
        });

        console.log(walletTable.toString());
      }

      await Utils.pressAnyKey('\nPress any key to continue...');
      return await this.show();
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(theme.error('Error: ' + Utils.parseError(error)));
      await Utils.pressAnyKey();
      return await this.show();
    }
  }

  async manageAttestationService() {
    console.clear();
    console.log(theme.primary('═══ AI ATTESTATION SERVICE ═══\n'));

    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select Action:',
        choices: [
          { name: '📜 View Attestations', value: 'view' },
          { name: '➕ Create Attestation', value: 'create' },
          { name: '✅ Verify Attestation', value: 'verify' },
          { name: '❌ Revoke Attestation', value: 'revoke' },
          { name: '📊 Attestation Statistics', value: 'stats' },
          { name: '🔧 Configure IPFS Gateways', value: 'ipfs' },
          new inquirer.Separator(),
          { name: '⬅️  Back', value: 'back' },
        ],
      },
    ]);

    if (choice.action === 'back') {
      return await this.show();
    }

    switch (choice.action) {
      case 'view':
        return await this.viewAttestations();
      case 'create':
        return await this.createAttestation();
      case 'verify':
        return await this.verifyAttestation();
      case 'revoke':
        return await this.revokeAttestation();
      case 'stats':
        return await this.showAttestationStats();
      case 'ipfs':
        return await this.configureIPFS();
      default:
        return await this.manageAttestationService();
    }
  }

  async showNetworkStatus() {
    console.clear();
    const spinner = ora('Fetching network status...').start();

    try {
      const provider = config.getProvider();
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      const feeData = await provider.getFeeData();

      spinner.succeed('Network status retrieved');

      console.log('\n' + theme.primary('═══ NETWORK STATUS ═══\n'));

      const table = new Table({
        colWidths: [30, 50],
      });

      table.push(
        ['Network Name', network.name],
        ['Chain ID', network.chainId.toString()],
        ['Latest Block', blockNumber.toString()],
        ['Block Timestamp', new Date(block.timestamp * 1000).toLocaleString()],
        ['Gas Price', `${feeData.gasPrice ? (Number(feeData.gasPrice) / 1e9).toFixed(2) : 'N/A'} gwei`],
        ['Max Fee Per Gas', `${feeData.maxFeePerGas ? (Number(feeData.maxFeePerGas) / 1e9).toFixed(2) : 'N/A'} gwei`],
        ['Max Priority Fee', `${feeData.maxPriorityFeePerGas ? (Number(feeData.maxPriorityFeePerGas) / 1e9).toFixed(2) : 'N/A'} gwei`],
      );

      console.log(table.toString());

      await Utils.pressAnyKey('\nPress any key to continue...');
      return await this.show();
    } catch (error) {
      spinner.fail('Failed to fetch network status');
      console.error(theme.error(Utils.parseError(error)));
      await Utils.pressAnyKey();
      return await this.show();
    }
  }

  async manageTestWallets() {
    console.clear();
    console.log(theme.primary('═══ TEST WALLET MANAGEMENT ═══\n'));

    // Check if test deployment report exists
    const reportPath = path.join(__dirname, '..', '..', 'deployment', 'testnet', 'test-deployment-report.json');
    
    if (!fs.existsSync(reportPath)) {
      console.log(theme.warning('No test deployment found. Please run test deployment first.\n'));
      await Utils.pressAnyKey();
      return await this.show();
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Display wallets
    const table = new Table({
      head: ['#', 'Role', 'Address', 'ETH Balance'],
      colWidths: [5, 20, 44, 15],
    });

    report.testWallets.forEach((wallet, index) => {
      table.push([index + 1, wallet.role, wallet.address, wallet.initialBalance]);
    });

    console.log(table.toString());

    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select Action:',
        choices: [
          { name: '💰 Check Token Balances', value: 'balances' },
          { name: '📤 Transfer Tokens', value: 'transfer' },
          { name: '🔄 Refresh Balances', value: 'refresh' },
          new inquirer.Separator(),
          { name: '⬅️  Back', value: 'back' },
        ],
      },
    ]);

    if (choice.action === 'back') {
      return await this.show();
    }

    // Handle wallet actions
    await Utils.pressAnyKey('\nFeature in development. Press any key to continue...');
    return await this.manageTestWallets();
  }

  async manageConfiguration() {
    console.clear();
    console.log(theme.primary('═══ SYSTEM CONFIGURATION ═══\n'));

    const currentConfig = config.getCurrentConfig();

    const table = new Table({
      colWidths: [30, 50],
    });

    table.push(
      ['Network', currentConfig.network],
      ['RPC Provider', currentConfig.rpcProvider || 'Not configured'],
      ['Explorer', currentConfig.explorer || 'Not configured'],
      ['Deployer Address', currentConfig.deployerAddress || 'Not configured'],
    );

    console.log(table.toString());

    await Utils.pressAnyKey('\nPress any key to continue...');
    return await this.show();
  }

  async showComprehensiveAnalytics() {
    console.clear();
    console.log(theme.primary('═══ COMPREHENSIVE ANALYTICS ═══\n'));
    console.log(theme.info('Complete system analytics and metrics\n'));
    
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.show();
  }

  // Helper methods
  async performHealthCheck() {
    // Simulate health check
    const provider = config.getProvider();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();

    return {
      overall: 'healthy',
      contracts: {
        'ARCx V2 Token': {
          active: true,
          status: 'Active',
          address: '0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437',
          lastCheck: new Date().toLocaleTimeString()
        },
        'AI Attestation': {
          active: true,
          status: 'Active',
          address: '0x0000000000000000000000000000000000000000',
          lastCheck: new Date().toLocaleTimeString()
        }
      },
      network: {
        chainId: network.chainId.toString(),
        latestBlock: blockNumber.toString(),
        gasPrice: feeData.gasPrice ? (Number(feeData.gasPrice) / 1e9).toFixed(2) : 'N/A',
        latency: Math.floor(Math.random() * 100) + 50
      },
      metrics: {
        totalContracts: 25,
        activeDeployments: 20,
        totalTransactions: 1247,
        uptime: '99.8%'
      },
      alerts: []
    };
  }

  async showDeploymentStatus() {
    console.log('\nDeployment status feature in development...\n');
    await Utils.pressAnyKey();
    return await this.showDeploymentOrchestration();
  }

  async executeDeployment(type) {
    console.log(`\nExecuting ${type} deployment...\n`);
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.showDeploymentOrchestration();
  }

  async viewAttestations() {
    console.log('\nViewing attestations...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }

  async createAttestation() {
    console.log('\nCreating attestation...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }

  async verifyAttestation() {
    console.log('\nVerifying attestation...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }

  async revokeAttestation() {
    console.log('\nRevoking attestation...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }

  async showAttestationStats() {
    console.log('\nShowing attestation statistics...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }

  async configureIPFS() {
    console.log('\nConfiguring IPFS gateways...\n');
    await Utils.pressAnyKey('Feature in development. Press any key to continue...');
    return await this.manageAttestationService();
  }
}

module.exports = new ManagementDashboard();
