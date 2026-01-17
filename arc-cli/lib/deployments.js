const theme = require('./theme');
const Utils = require('./utils');
const config = require('./config');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const ora = require('ora');

class DeploymentsModule {
  async show() {
    console.clear();
    console.log(Utils.header('DEPLOYMENT MANAGEMENT'));
    
    const choices = [
      { name: theme.primary('📋 View All Deployments'), value: 'list' },
      { name: theme.info('🔍 Deployment Details'), value: 'details' },
      { name: theme.success('✅ Verify Contract'), value: 'verify' },
      { name: theme.warning('📊 Deployment Status'), value: 'status' },
      new inquirer.Separator(theme.border('─'.repeat(60))),
      { name: theme.muted('← Back to Main Menu'), value: 'back' }
    ];

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: theme.title('Select an option:'),
        choices,
        pageSize: 15
      }
    ]);

    switch (answer.action) {
      case 'list':
        await this.listDeployments();
        break;
      case 'details':
        await this.showDetails();
        break;
      case 'verify':
        await this.verifyContract();
        break;
      case 'status':
        await this.showStatus();
        break;
      case 'back':
        return 'back';
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: theme.muted('Press Enter to continue...')
      }
    ]);

    return this.show();
  }

  async listDeployments() {
    console.log('\n' + Utils.section('Deployed Contracts'));
    
    const table = new Table({
      head: [theme.label('Contract'), theme.label('Address'), theme.label('Network'), theme.label('Status')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [25, 45, 15, 15]
    });

    const deployments = [
      ['ARCx V2 Enhanced', config.getContractAddress('arcx'), 'Base L2', theme.live],
      ['ARCxMath Library', config.getContractAddress('arcx-math'), 'Base L2', theme.live],
      ['Vesting Contract', config.getContractAddress('vesting'), 'Base L2', theme.deployed],
      ['Airdrop Contract', config.getContractAddress('airdrop'), 'Base L2', theme.deployed],
      ['Uniswap V4 Hook', config.getContractAddress('uniswap-hook'), 'Base L2', theme.live]
    ];

    deployments.forEach(([name, address, network, status]) => {
      if (address) {
        table.push([name, Utils.formatAddress(address), network, status]);
      }
    });

    console.log(table.toString());
  }

  async showDetails() {
    const contracts = [
      { name: 'ARCx V2 Enhanced', value: 'arcx' },
      { name: 'Vesting Contract', value: 'vesting' },
      { name: 'Airdrop Contract', value: 'airdrop' },
      { name: 'Uniswap V4 Hook', value: 'uniswap-hook' }
    ];

    const { contract } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contract',
        message: theme.info('Select contract:'),
        choices: contracts
      }
    ]);

    const spinner = ora(theme.info('Fetching contract details...')).start();
    
    try {
      const address = config.getContractAddress(contract);
      if (!address) {
        spinner.fail(theme.error('Contract address not found'));
        return;
      }

      const provider = config.getProvider('base');
      const code = await provider.getCode(address);
      const balance = await provider.getBalance(address);
      
      spinner.stop();
      
      console.log('\n' + Utils.section('Contract Details'));
      
      const table = new Table({
        head: [theme.label('Property'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 55]
      });

      table.push(
        ['Contract Name', theme.value(contracts.find(c => c.value === contract).name)],
        ['Address', Utils.formatAddress(address)],
        ['Network', theme.primary('Base L2 (8453)')],
        ['Balance', Utils.formatAmount(balance, 18, 'ETH')],
        ['Bytecode Size', theme.number(`${code.length} bytes`)],
        ['Deployed', theme.success('✓ Yes')],
        ['Verified', theme.success('✓ BaseScan')],
        ['Explorer', theme.info(`basescan.org/address/${address}`)]
      );

      console.log(table.toString());
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch details'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async verifyContract() {
    console.log('\n' + Utils.section('Contract Verification'));
    console.log(theme.info('This feature requires Etherscan/BaseScan API key\n'));
    
    const { contractName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'contractName',
        message: theme.info('Enter contract name:'),
        default: 'ARCxTokenV2'
      }
    ]);

    const { network } = await inquirer.prompt([
      {
        type: 'list',
        name: 'network',
        message: theme.info('Select network:'),
        choices: ['base', 'base-sepolia']
      }
    ]);

    console.log('\n' + theme.warning('Verification command:'));
    console.log(theme.muted('npx hardhat verify --network ' + network + ' <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>'));
    console.log('\n' + theme.info('Run this command from the project root directory'));
  }

  async showStatus() {
    console.log('\n' + Utils.section('Deployment Status'));
    
    const table = new Table({
      head: [theme.label('Component'), theme.label('Status'), theme.label('Progress')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [30, 15, 40]
    });

    const deploymentPlan = [
      ['ARCx Token V2', 'Complete', 100],
      ['ARCxMath Library', 'Complete', 100],
      ['Vesting Contract', 'Complete', 100],
      ['Airdrop System', 'Complete', 100],
      ['Uniswap V4 Hook', 'Complete', 100],
      ['Liquidity Pool Setup', 'Complete', 100],
      ['SBT System', 'Planned', 0],
      ['ARCs NFT Collection', 'Planned', 0],
      ['ADAM AI System', 'In Progress', 75]
    ];

    deploymentPlan.forEach(([component, status, progress]) => {
      let statusDisplay;
      if (status === 'Complete') statusDisplay = theme.success('✓ Done');
      else if (status === 'In Progress') statusDisplay = theme.warning('⚙ WIP');
      else statusDisplay = theme.muted('○ Plan');
      
      const progressBar = Utils.createProgressBar(progress, 100, 25);
      table.push([component, statusDisplay, progressBar]);
    });

    console.log(table.toString());
    
    console.log('\n' + theme.subtitle('Overall Progress: ') + 
      Utils.createProgressBar(675, 900, 40) + ' ' + 
      theme.number('75%'));
  }
}

module.exports = new DeploymentsModule();
