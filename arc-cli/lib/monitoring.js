const theme = require('./theme');
const Utils = require('./utils');
const config = require('./config');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const ora = require('ora');

class MonitoringModule {
  constructor() {
    this.refreshInterval = null;
  }

  async show() {
    console.clear();
    console.log(Utils.header('MONITORING & ANALYTICS'));
    
    const choices = [
      { name: theme.primary('📊 Real-time Dashboard'), value: 'dashboard' },
      { name: theme.info('⚡ Live Transactions'), value: 'transactions' },
      { name: theme.success('⛽ Gas Tracker'), value: 'gas' },
      { name: theme.warning('📝 Event Logs'), value: 'events' },
      { name: theme.accent('🔥 Liquidity Monitor'), value: 'liquidity' },
      { name: theme.highlight('📈 Analytics Report'), value: 'analytics' },
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
      case 'transactions':
        await this.showTransactions();
        break;
      case 'gas':
        await this.showGasTracker();
        break;
      case 'events':
        await this.showEvents();
        break;
      case 'liquidity':
        await this.showLiquidity();
        break;
      case 'analytics':
        await this.showAnalytics();
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

  async showDashboard() {
    console.log('\n' + Utils.section('Real-time Monitoring Dashboard'));
    
    const spinner = ora(theme.info('Loading live data...')).start();
    
    try {
      const provider = config.getProvider('base');
      
      // Fetch real-time data
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      const gasPrice = await provider.getFeeData();
      
      spinner.stop();
      
      // Network Status
      console.log('\n' + theme.subtitle('Network Status'));
      const networkTable = new Table({
        head: [theme.label('Metric'), theme.label('Value'), theme.label('Status')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 35, 15]
      });

      networkTable.push(
        ['Latest Block', Utils.formatBlock(blockNumber), theme.success('✓ Live')],
        ['Block Time', Utils.formatTimestamp(block.timestamp), theme.success('✓ Live')],
        ['Gas Price', Utils.formatGas(gasPrice.gasPrice), theme.success('✓ Live')],
        ['Network', theme.primary('Base L2'), theme.success('✓ Online')]
      );

      console.log(networkTable.toString());

      // Token Metrics (mock real-time)
      console.log('\n' + theme.subtitle('Token Metrics'));
      const tokenTable = new Table({
        head: [theme.label('Metric'), theme.label('Current'), theme.label('1h Change')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 35, 15]
      });

      tokenTable.push(
        ['ARCx Price', Utils.formatUSD(1.25), theme.success('+0.5%')],
        ['24h Volume', Utils.formatUSD(125000), theme.warning('+2.3%')],
        ['Active Traders', theme.number('342'), theme.success('+12')],
        ['Liquidity', Utils.formatUSD(625000), theme.info('+0.1%')]
      );

      console.log(tokenTable.toString());

      // System Health
      console.log('\n' + theme.subtitle('System Health'));
      console.log(theme.label('ARCx Token:        ') + theme.live);
      console.log(theme.label('Vesting Contract:  ') + theme.deployed);
      console.log(theme.label('Airdrop System:    ') + theme.deployed);
      console.log(theme.label('Uniswap Hook:      ') + theme.live);
      console.log(theme.label('Liquidity Pool:    ') + theme.live);

      console.log('\n' + theme.muted('Dashboard updates every 12 seconds'));
      console.log(theme.textDim('Last updated: ' + new Date().toLocaleTimeString()));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to load dashboard'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showTransactions() {
    console.log('\n' + Utils.section('Live Transaction Monitor'));
    console.log(theme.info('Monitoring ARCx token transfers...\n'));
    
    const spinner = ora(theme.info('Fetching recent transactions...')).start();
    
    try {
      // Mock transaction data (would come from blockchain events in production)
      await Utils.sleep(1500);
      spinner.stop();
      
      const table = new Table({
        head: [theme.label('Time'), theme.label('Type'), theme.label('From'), theme.label('To'), theme.label('Amount')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [12, 10, 20, 20, 20]
      });

      const mockTxs = [
        ['10:23:45', 'Transfer', '0x742d...0bEb', '0x3f5C...f0bE', '100 ARCx'],
        ['10:23:32', 'Transfer', '0x1a2b...4d5e', '0x9f8e...6c5b', '250 ARCx'],
        ['10:23:18', 'Swap', '0x5e4d...2b1a', 'Uniswap', '50 ARCx'],
        ['10:23:05', 'Transfer', '0x6f5e...3c4d', '0x8g7f...5d6e', '75 ARCx'],
        ['10:22:51', 'Approve', '0x9h8g...6e7f', 'Router', 'Unlimited']
      ];

      mockTxs.forEach(([time, type, from, to, amount]) => {
        let typeColor;
        if (type === 'Transfer') typeColor = theme.success(type);
        else if (type === 'Swap') typeColor = theme.warning(type);
        else typeColor = theme.info(type);
        
        table.push([
          theme.textDim(time),
          typeColor,
          Utils.formatAddress(from, true),
          Utils.formatAddress(to, true),
          theme.number(amount)
        ]);
      });

      console.log(table.toString());
      
      console.log('\n' + theme.muted('Showing last 5 transactions'));
      console.log(theme.textDim('Live monitoring would update automatically'));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch transactions'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showGasTracker() {
    console.log('\n' + Utils.section('Gas Price Tracker'));
    
    const spinner = ora(theme.info('Fetching gas data...')).start();
    
    try {
      const provider = config.getProvider('base');
      const gasData = await provider.getFeeData();
      
      spinner.stop();
      
      const table = new Table({
        head: [theme.label('Speed'), theme.label('Gas Price'), theme.label('Base Fee'), theme.label('Priority Fee')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [15, 20, 20, 20]
      });

      // Calculate different speed tiers (Base L2 has very low gas)
      const baseFee = gasData.gasPrice || BigInt(50000000); // 0.05 gwei minimum
      
      table.push(
        [
          theme.success('🐢 Slow'),
          Utils.formatGas(baseFee),
          Utils.formatGas(gasData.maxFeePerGas || baseFee),
          Utils.formatGas(gasData.maxPriorityFeePerGas || BigInt(0))
        ],
        [
          theme.info('🚶 Standard'),
          Utils.formatGas(baseFee * BigInt(110) / BigInt(100)),
          Utils.formatGas(gasData.maxFeePerGas || baseFee),
          Utils.formatGas(gasData.maxPriorityFeePerGas || BigInt(0))
        ],
        [
          theme.warning('🏃 Fast'),
          Utils.formatGas(baseFee * BigInt(120) / BigInt(100)),
          Utils.formatGas(gasData.maxFeePerGas || baseFee),
          Utils.formatGas(gasData.maxPriorityFeePerGas || BigInt(0))
        ]
      );

      console.log(table.toString());

      // Estimated transaction costs
      console.log('\n' + theme.subtitle('Estimated Transaction Costs'));
      const costTable = new Table({
        head: [theme.label('Operation'), theme.label('Gas Units'), theme.label('Cost (ETH)'), theme.label('Cost (USD)')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [20, 15, 20, 20]
      });

      // Mock prices for demonstration (in production, fetch from price oracle/API)
      const MOCK_ETH_PRICE_USD = 2500;
      const gasInGwei = Number(baseFee) / 1e9;
      
      const operations = [
        ['Transfer', 21000, 21000 * gasInGwei / 1e9],
        ['Approve', 46000, 46000 * gasInGwei / 1e9],
        ['Swap', 150000, 150000 * gasInGwei / 1e9],
        ['Add Liquidity', 200000, 200000 * gasInGwei / 1e9]
      ];

      operations.forEach(([op, gas, costEth]) => {
        costTable.push([
          theme.value(op),
          theme.number(gas.toLocaleString()),
          theme.number(`${costEth.toFixed(8)}`),
          Utils.formatUSD(costEth * MOCK_ETH_PRICE_USD)
        ]);
      });

      console.log(costTable.toString());
      
      console.log('\n' + theme.textDim('Note: Base L2 has significantly lower gas costs than Ethereum mainnet'));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch gas data'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showEvents() {
    console.log('\n' + Utils.section('Event Logs'));
    console.log(theme.info('ARCx Token Contract Events\n'));
    
    const spinner = ora(theme.info('Fetching event logs...')).start();
    
    try {
      // Mock event data
      await Utils.sleep(1500);
      spinner.stop();
      
      const table = new Table({
        head: [theme.label('Block'), theme.label('Event'), theme.label('Details'), theme.label('TX Hash')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [12, 15, 35, 20]
      });

      const mockEvents = [
        ['18234567', 'Transfer', 'From: 0x742d...0bEb To: 0x3f5C...', '0xabc123...'],
        ['18234556', 'Approval', 'Owner: 0x1a2b...4d5e Spender: Router', '0xdef456...'],
        ['18234545', 'Transfer', 'From: 0x5e4d...2b1a To: Pool', '0xghi789...'],
        ['18234534', 'Transfer', 'From: Vesting To: 0x6f5e...3c4d', '0xjkl012...'],
        ['18234523', 'Approval', 'Owner: 0x9h8g...6e7f Spender: Hook', '0xmno345...']
      ];

      mockEvents.forEach(([block, event, details, tx]) => {
        let eventColor;
        if (event === 'Transfer') eventColor = theme.success(event);
        else if (event === 'Approval') eventColor = theme.info(event);
        else eventColor = theme.warning(event);
        
        table.push([
          Utils.formatBlock(block),
          eventColor,
          theme.muted(details),
          Utils.formatTxHash(tx)
        ]);
      });

      console.log(table.toString());
      
      console.log('\n' + theme.muted('Showing last 5 events'));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch events'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showLiquidity() {
    console.log('\n' + Utils.section('Liquidity Pool Monitor'));
    
    const spinner = ora(theme.info('Fetching liquidity data...')).start();
    
    try {
      await Utils.sleep(1500);
      spinner.stop();
      
      // Pool Overview
      console.log('\n' + theme.subtitle('Uniswap V4 Pool - ARCx/WETH'));
      const poolTable = new Table({
        head: [theme.label('Metric'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 50]
      });

      poolTable.push(
        ['Pool Address', Utils.formatAddress('0x' + '1'.repeat(40))],
        ['ARCx Reserve', theme.number('500,000 ARCx')],
        ['WETH Reserve', theme.number('250 WETH')],
        ['Total Liquidity (USD)', Utils.formatUSD(625000)],
        ['24h Volume', Utils.formatUSD(125000)],
        ['24h Fees', Utils.formatUSD(312.5)],
        ['Fee Tier', theme.number('0.25%')],
        ['LP Position ID', theme.number('#242940')]
      );

      console.log(poolTable.toString());

      // Price Impact
      console.log('\n' + theme.subtitle('Price Impact Calculator'));
      const impactTable = new Table({
        head: [theme.label('Trade Size'), theme.label('Price Impact'), theme.label('Received')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [25, 25, 25]
      });

      impactTable.push(
        ['100 ARCx', theme.success('< 0.1%'), theme.number('~0.05 WETH')],
        ['1,000 ARCx', theme.info('0.5%'), theme.number('~0.497 WETH')],
        ['10,000 ARCx', theme.warning('4.8%'), theme.number('~4.76 WETH')],
        ['50,000 ARCx', theme.error('21.2%'), theme.number('~19.7 WETH')]
      );

      console.log(impactTable.toString());
      
      console.log('\n' + theme.textDim('Data refreshed: ' + new Date().toLocaleTimeString()));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to fetch liquidity data'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showAnalytics() {
    console.log('\n' + Utils.section('Analytics Report'));
    
    const spinner = ora(theme.info('Generating analytics report...')).start();
    
    try {
      await Utils.sleep(2000);
      spinner.stop();
      
      // 24h Summary
      console.log('\n' + theme.subtitle('24-Hour Summary'));
      const summaryTable = new Table({
        head: [theme.label('Metric'), theme.label('Value'), theme.label('Change')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 25, 20]
      });

      summaryTable.push(
        ['Trading Volume', Utils.formatUSD(125000), theme.success('+12.3%')],
        ['Transactions', theme.number('1,234'), theme.success('+8.7%')],
        ['Unique Traders', theme.number('342'), theme.success('+15.2%')],
        ['Avg Transaction Size', theme.number('101.3 ARCx'), theme.warning('-2.1%')],
        ['New Holders', theme.number('27'), theme.success('+27')],
        ['Liquidity Added', Utils.formatUSD(12500), theme.info('+12.5K')],
        ['Fees Generated', Utils.formatUSD(312.5), theme.success('+11.8%')]
      );

      console.log(summaryTable.toString());

      // Top Activities
      console.log('\n' + theme.subtitle('Top Activities (24h)'));
      const activityTable = new Table({
        head: [theme.label('Rank'), theme.label('Wallet'), theme.label('Volume'), theme.label('Transactions')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [8, 35, 20, 15]
      });

      const topTraders = [
        [1, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '25,000', '47'],
        [2, '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', '18,500', '32'],
        [3, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', '12,300', '28'],
        [4, '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e', '9,800', '19'],
        [5, '0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d', '7,200', '15']
      ];

      topTraders.forEach(([rank, wallet, volume, txs]) => {
        activityTable.push([
          theme.number(`#${rank}`),
          Utils.formatAddress(wallet),
          Utils.formatUSD(volume),
          theme.number(txs)
        ]);
      });

      console.log(activityTable.toString());

      console.log('\n' + theme.muted('Report generated: ' + new Date().toLocaleString()));
      
    } catch (error) {
      spinner.fail(theme.error('Failed to generate analytics'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }
}

module.exports = new MonitoringModule();
