const theme = require('./theme');
const Utils = require('./utils');
const config = require('./config');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const boxen = require('boxen');
const ora = require('ora');

class EcosystemModule {
  async show() {
    console.clear();
    console.log(Utils.header('ECOSYSTEM OVERVIEW'));
    
    const choices = [
      { name: theme.primary('📊 Dashboard'), value: 'dashboard' },
      { name: theme.info('💰 Token Metrics'), value: 'metrics' },
      { name: theme.success('🔗 Contract Addresses'), value: 'addresses' },
      { name: theme.warning('🏥 Health Check'), value: 'health' },
      { name: theme.accent('🌐 Network Status'), value: 'network' },
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
      case 'dashboard':
        await this.showDashboard();
        break;
      case 'metrics':
        await this.showMetrics();
        break;
      case 'addresses':
        await this.showAddresses();
        break;
      case 'health':
        await this.showHealthCheck();
        break;
      case 'network':
        await this.showNetworkStatus();
        break;
      case 'back':
        return 'back';
    }

    const { continue: cont } = await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: theme.muted('Press Enter to continue...')
      }
    ]);

    return this.show();
  }

  async showDashboard() {
    const spinner = ora(theme.info('Loading ecosystem data...')).start();
    
    try {
      const provider = config.getProvider('base');
      const arcxAddress = config.getContractAddress('arcx');
      
      // Get network data
      const blockNumber = await provider.getBlockNumber();
      const gasPrice = await provider.getFeeData();
      
      spinner.stop();
      
      console.log('\n' + Utils.section('System Status'));
      
      const statusTable = new Table({
        head: [theme.label('Component'), theme.label('Status'), theme.label('Details')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 15, 40]
      });

      statusTable.push(
        ['ARCx Token V2', theme.live, `Deployed on Base L2`],
        ['Vesting Contract', theme.deployed, 'Active with 300K tokens'],
        ['Airdrop System', theme.deployed, '100K tokens allocated'],
        ['Uniswap V4 Hook', theme.live, 'Fee: 0.25%, MEV Protected'],
        ['Liquidity Pool', theme.live, '500K ARCx + WETH'],
        ['Network', theme.success('✓ Online'), `Block: ${Utils.formatBlock(blockNumber)}`]
      );

      console.log(statusTable.toString());

      // Key metrics
      console.log('\n' + Utils.section('Key Metrics'));
      
      const metricsTable = new Table({
        head: [theme.label('Metric'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 50]
      });

      metricsTable.push(
        ['Total Supply', theme.number('1,000,000 ARCx')],
        ['Circulating Supply', theme.number('~600,000 ARCx')],
        ['Locked in Vesting', theme.number('300,000 ARCx (30%)')],
        ['Airdrop Allocation', theme.number('100,000 ARCx (10%)')],
        ['Liquidity Pool', theme.number('500,000 ARCx (50%)')],
        ['Current Gas Price', Utils.formatGas(gasPrice.gasPrice)],
        ['Network', theme.primary('Base L2 Mainnet')],
        ['Chain ID', theme.number('8453')]
      );

      console.log(metricsTable.toString());

      // Token distribution chart
      console.log('\n' + Utils.section('Token Distribution'));
      console.log(theme.label('Liquidity Pool:    ') + Utils.createProgressBar(500000, 1000000, 40) + ' ' + theme.muted('500K'));
      console.log(theme.label('Vesting:           ') + Utils.createProgressBar(300000, 1000000, 40) + ' ' + theme.muted('300K'));
      console.log(theme.label('Airdrop:           ') + Utils.createProgressBar(100000, 1000000, 40) + ' ' + theme.muted('100K'));
      console.log(theme.label('Marketing:         ') + Utils.createProgressBar(100000, 1000000, 40) + ' ' + theme.muted('100K'));

    } catch (error) {
      spinner.fail(theme.error('Failed to load ecosystem data'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showMetrics() {
    const spinner = ora(theme.info('Fetching token metrics...')).start();
    
    try {
      const provider = config.getProvider('base');
      const arcxAddress = config.getContractAddress('arcx');
      
      if (arcxAddress) {
        const contract = config.getContract('arcx');
        const totalSupply = await contract.totalSupply();
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        
        spinner.stop();
        
        console.log('\n' + Utils.section('Token Metrics - ' + name));
        
        const table = new Table({
          head: [theme.label('Property'), theme.label('Value')],
          style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
          colWidths: [30, 50]
        });

        table.push(
          ['Token Name', theme.value(name)],
          ['Symbol', theme.success(symbol)],
          ['Decimals', theme.number(decimals.toString())],
          ['Total Supply', Utils.formatAmount(totalSupply, decimals, symbol)],
          ['Max Supply', theme.number('1,000,000 ARCx')],
          ['Contract Address', Utils.formatAddress(arcxAddress)],
          ['Network', theme.primary('Base L2 (8453)')],
          ['Standard', theme.info('ERC-20')]
        );

        console.log(table.toString());

        // Mock price data (would come from API in production)
        console.log('\n' + Utils.section('Market Data (Mock)'));
        
        const marketTable = new Table({
          head: [theme.label('Metric'), theme.label('Value'), theme.label('Change 24h')],
          style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] }
        });

        marketTable.push(
          ['Price', Utils.formatUSD(1.25), theme.success('+5.2%')],
          ['Market Cap', Utils.formatUSD(1250000), theme.success('+4.8%')],
          ['Volume 24h', Utils.formatUSD(125000), theme.warning('+12.3%')],
          ['Liquidity (TVL)', Utils.formatUSD(625000), theme.info('+2.1%')],
          ['Holders', theme.number('2,847'), theme.success('+15')]
        );

        console.log(marketTable.toString());
        
      } else {
        spinner.fail(theme.error('ARCx token address not configured'));
      }
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch metrics'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showAddresses() {
    console.log('\n' + Utils.section('Contract Addresses'));
    
    const addresses = config.addresses;
    
    // Core Contracts
    if (addresses.core && Object.keys(addresses.core).length > 0) {
      console.log('\n' + theme.subtitle('Core Contracts'));
      const coreTable = new Table({
        head: [theme.label('Contract'), theme.label('Address'), theme.label('Status')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 45, 15]
      });

      if (addresses.core.arcxToken) {
        coreTable.push(['ARCx V2 Enhanced', Utils.formatAddress(addresses.core.arcxToken), theme.live]);
      }
      if (addresses.core.arcxMath) {
        coreTable.push(['ARCxMath Library', Utils.formatAddress(addresses.core.arcxMath), theme.live]);
      }
      if (addresses.core.arcxV1) {
        coreTable.push(['ARCx V1 (Legacy)', Utils.formatAddress(addresses.core.arcxV1), theme.muted(' LEGACY ')]);
      }

      console.log(coreTable.toString());
    }

    // Infrastructure
    if (addresses.infrastructure && Object.keys(addresses.infrastructure).length > 0) {
      console.log('\n' + theme.subtitle('Infrastructure Contracts'));
      const infraTable = new Table({
        head: [theme.label('Contract'), theme.label('Address'), theme.label('Status')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 45, 15]
      });

      if (addresses.infrastructure.vesting) {
        infraTable.push(['Vesting Contract', Utils.formatAddress(addresses.infrastructure.vesting), theme.deployed]);
      }
      if (addresses.infrastructure.airdrop) {
        infraTable.push(['Airdrop Contract', Utils.formatAddress(addresses.infrastructure.airdrop), theme.deployed]);
      }
      if (addresses.infrastructure.uniswapHook) {
        infraTable.push(['Uniswap V4 Hook', Utils.formatAddress(addresses.infrastructure.uniswapHook), theme.live]);
      }

      console.log(infraTable.toString());
    }

    // Governance
    if (addresses.governance && Object.keys(addresses.governance).length > 0) {
      console.log('\n' + theme.subtitle('Governance & Security'));
      const govTable = new Table({
        head: [theme.label('Safe/Wallet'), theme.label('Address'), theme.label('Type')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 45, 15]
      });

      if (addresses.governance.treasury) {
        govTable.push(['Treasury Safe', Utils.formatAddress(addresses.governance.treasury), theme.success(' SAFE ')]);
      }
      if (addresses.governance.ecosystem) {
        govTable.push(['Ecosystem Safe', Utils.formatAddress(addresses.governance.ecosystem), theme.success(' SAFE ')]);
      }

      console.log(govTable.toString());
    }

    // Uniswap V4
    if (addresses.uniswap && Object.keys(addresses.uniswap).length > 0) {
      console.log('\n' + theme.subtitle('Uniswap V4 Infrastructure'));
      const uniTable = new Table({
        head: [theme.label('Component'), theme.label('Address/ID'), theme.label('Status')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 45, 15]
      });

      if (addresses.uniswap.positionManager) {
        uniTable.push(['Position Manager', Utils.formatAddress(addresses.uniswap.positionManager), theme.live]);
      }
      if (addresses.uniswap.poolManager) {
        uniTable.push(['Pool Manager', Utils.formatAddress(addresses.uniswap.poolManager), theme.live]);
      }
      if (addresses.uniswap.universalRouter) {
        uniTable.push(['Universal Router', Utils.formatAddress(addresses.uniswap.universalRouter), theme.live]);
      }
      if (addresses.uniswap.lpPosition) {
        uniTable.push(['LP Position ID', theme.number('#' + addresses.uniswap.lpPosition), theme.live]);
      }

      console.log(uniTable.toString());
    }
  }

  async showHealthCheck() {
    console.log('\n' + Utils.section('System Health Check'));
    
    const spinner = ora(theme.info('Running health checks...')).start();
    
    const checks = [];
    
    try {
      // Check network connectivity
      spinner.text = 'Checking network connectivity...';
      const provider = config.getProvider('base');
      const blockNumber = await provider.getBlockNumber();
      checks.push({ name: 'Network Connectivity', status: 'pass', details: `Block: ${blockNumber}` });
      
      // Check ARCx token contract
      spinner.text = 'Checking ARCx token contract...';
      const arcxAddress = config.getContractAddress('arcx');
      if (arcxAddress) {
        const contract = config.getContract('arcx');
        const totalSupply = await contract.totalSupply();
        checks.push({ name: 'ARCx Token Contract', status: 'pass', details: 'Responding' });
      } else {
        checks.push({ name: 'ARCx Token Contract', status: 'warning', details: 'Address not configured' });
      }
      
      // Check configuration
      spinner.text = 'Validating configuration...';
      const validation = config.validate();
      if (validation.valid) {
        checks.push({ name: 'Configuration', status: 'pass', details: 'All settings valid' });
      } else {
        checks.push({ name: 'Configuration', status: 'warning', details: `${validation.issues.length} issues found` });
      }
      
      // Check RPC endpoint
      spinner.text = 'Testing RPC endpoint...';
      const gasPrice = await provider.getFeeData();
      checks.push({ name: 'RPC Endpoint', status: 'pass', details: 'Responding normally' });
      
      spinner.stop();
      
      const table = new Table({
        head: [theme.label('Check'), theme.label('Status'), theme.label('Details')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 15, 40]
      });

      checks.forEach(check => {
        let statusDisplay;
        if (check.status === 'pass') statusDisplay = theme.success('✓ PASS');
        else if (check.status === 'warning') statusDisplay = theme.warning('⚠ WARN');
        else statusDisplay = theme.error('✗ FAIL');
        
        table.push([check.name, statusDisplay, theme.muted(check.details)]);
      });

      console.log(table.toString());
      
      const passCount = checks.filter(c => c.status === 'pass').length;
      const warnCount = checks.filter(c => c.status === 'warning').length;
      const failCount = checks.filter(c => c.status === 'fail').length;
      
      console.log('\n' + theme.subtitle('Summary: ') + 
        theme.success(`${passCount} passed`) + theme.muted(' • ') +
        theme.warning(`${warnCount} warnings`) + theme.muted(' • ') +
        theme.error(`${failCount} failed`));
      
    } catch (error) {
      spinner.fail(theme.error('Health check failed'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showNetworkStatus() {
    const spinner = ora(theme.info('Fetching network status...')).start();
    
    try {
      const provider = config.getProvider('base');
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      const gasPrice = await provider.getFeeData();
      const network = await provider.getNetwork();
      
      spinner.stop();
      
      console.log('\n' + Utils.section('Network Status - Base L2 Mainnet'));
      
      const table = new Table({
        head: [theme.label('Property'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 50]
      });

      table.push(
        ['Network Name', theme.primary('Base L2 Mainnet')],
        ['Chain ID', theme.number(network.chainId.toString())],
        ['Latest Block', Utils.formatBlock(blockNumber)],
        ['Block Timestamp', Utils.formatTimestamp(block.timestamp)],
        ['Gas Price', Utils.formatGas(gasPrice.gasPrice)],
        ['Max Priority Fee', Utils.formatGas(gasPrice.maxPriorityFeePerGas || 0)],
        ['Status', theme.success('✓ Online')],
        ['Explorer', theme.info('https://basescan.org')]
      );

      console.log(table.toString());
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch network status'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }
}

module.exports = new EcosystemModule();
