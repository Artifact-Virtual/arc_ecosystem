const theme = require('./theme');
const Utils = require('./utils');
const config = require('./config');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const ora = require('ora');
const { ethers } = require('ethers');

class TokensModule {
  async show() {
    console.clear();
    console.log(Utils.header('TOKEN MANAGEMENT - ARCx'));
    
    const choices = [
      { name: theme.primary('📊 Token Overview'), value: 'overview' },
      { name: theme.info('💰 Supply & Distribution'), value: 'supply' },
      { name: theme.success('👥 Holder Statistics'), value: 'holders' },
      { name: theme.warning('💸 Transfer Tokens'), value: 'transfer' },
      { name: theme.accent('🔍 Check Balance'), value: 'balance' },
      { name: theme.highlight('📈 Price & Market'), value: 'market' },
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
      case 'overview':
        await this.showOverview();
        break;
      case 'supply':
        await this.showSupply();
        break;
      case 'holders':
        await this.showHolders();
        break;
      case 'transfer':
        await this.transferTokens();
        break;
      case 'balance':
        await this.checkBalance();
        break;
      case 'market':
        await this.showMarket();
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

  async showOverview() {
    const spinner = ora(theme.info('Loading ARCx token data...')).start();
    
    try {
      const contract = config.getContract('arcx');
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const totalSupply = await contract.totalSupply();
      
      spinner.stop();
      
      console.log('\n' + Utils.section('ARCx Token Overview'));
      
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
        ['Max Supply', theme.number('1,000,000 ARCx (Fixed)')],
        ['Type', theme.info('ERC-20 Enhanced')],
        ['Network', theme.primary('Base L2 (8453)')],
        ['Contract', Utils.formatAddress(config.getContractAddress('arcx'))],
        ['Status', theme.live]
      );

      console.log(table.toString());

      // Token features
      console.log('\n' + Utils.section('Token Features'));
      console.log(theme.success('✓') + ' Fixed supply (1M max, no minting)');
      console.log(theme.success('✓') + ' Gas-optimized transfers');
      console.log(theme.success('✓') + ' Integrated with Uniswap V4');
      console.log(theme.success('✓') + ' MEV protection via custom hooks');
      console.log(theme.success('✓') + ' Vesting & airdrop support');
      console.log(theme.success('✓') + ' Constitutional intelligence framework');
      
    } catch (error) {
      spinner.fail(theme.error('Failed to load token data'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showSupply() {
    const spinner = ora(theme.info('Analyzing token distribution...')).start();
    
    try {
      const contract = config.getContract('arcx');
      const totalSupply = await contract.totalSupply();
      const decimals = await contract.decimals();
      
      spinner.stop();
      
      console.log('\n' + Utils.section('Supply & Distribution'));
      
      // Distribution breakdown
      const distribution = [
        { name: 'Liquidity Pool', amount: 500000, percent: 50, color: theme.primary },
        { name: 'Vesting (Locked)', amount: 300000, percent: 30, color: theme.warning },
        { name: 'Airdrop', amount: 100000, percent: 10, color: theme.success },
        { name: 'Marketing', amount: 100000, percent: 10, color: theme.info }
      ];

      const table = new Table({
        head: [theme.label('Category'), theme.label('Amount'), theme.label('Percentage'), theme.label('Progress')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [20, 20, 15, 30]
      });

      distribution.forEach(item => {
        table.push([
          item.color(item.name),
          theme.number(`${item.amount.toLocaleString()} ARCx`),
          theme.number(`${item.percent}%`),
          Utils.createProgressBar(item.amount, 1000000, 20)
        ]);
      });

      console.log(table.toString());

      // Supply stats
      console.log('\n' + Utils.section('Supply Statistics'));
      
      const statsTable = new Table({
        head: [theme.label('Metric'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 50]
      });

      statsTable.push(
        ['Total Supply', Utils.formatAmount(totalSupply, decimals, 'ARCx')],
        ['Max Supply', theme.number('1,000,000 ARCx')],
        ['Circulating Supply', theme.number('~600,000 ARCx')],
        ['Locked in Vesting', theme.warning('300,000 ARCx (30%)')],
        ['Available for Trading', theme.success('~600,000 ARCx (60%)')],
        ['Burn Mechanism', theme.muted('N/A (Fixed supply)')]
      );

      console.log(statsTable.toString());
      
    } catch (error) {
      spinner.fail(theme.error('Failed to load supply data'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showHolders() {
    console.log('\n' + Utils.section('Holder Statistics'));
    console.log(theme.info('Note: This would query blockchain data or indexer API\n'));
    
    // Mock holder data
    const table = new Table({
      head: [theme.label('Rank'), theme.label('Address'), theme.label('Balance'), theme.label('Share')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [8, 45, 20, 10]
    });

    const mockHolders = [
      [1, config.getContractAddress('treasury'), '350000', '35%'],
      [2, config.getContractAddress('vesting'), '300000', '30%'],
      [3, config.getContractAddress('airdrop'), '100000', '10%'],
      [4, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '50000', '5%'],
      [5, '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', '25000', '2.5%']
    ];

    mockHolders.forEach(([rank, address, balance, share]) => {
      table.push([
        theme.number(`#${rank}`),
        Utils.formatAddress(address),
        theme.number(`${parseFloat(balance).toLocaleString()} ARCx`),
        theme.value(share)
      ]);
    });

    console.log(table.toString());
    
    console.log('\n' + theme.subtitle('Summary'));
    console.log(theme.label('Total Holders: ') + theme.number('2,847'));
    console.log(theme.label('Top 10 Hold: ') + theme.number('85% of supply'));
    console.log(theme.label('Average Balance: ') + theme.number('351 ARCx'));
  }

  async checkBalance() {
    const { address } = await inquirer.prompt([
      {
        type: 'input',
        name: 'address',
        message: theme.info('Enter wallet address:'),
        validate: (input) => {
          if (!Utils.isValidAddress(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        }
      }
    ]);

    const spinner = ora(theme.info('Checking balance...')).start();
    
    try {
      const contract = config.getContract('arcx');
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      
      spinner.stop();
      
      console.log('\n' + Utils.section('Balance Information'));
      
      const table = new Table({
        head: [theme.label('Property'), theme.label('Value')],
        style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
        colWidths: [30, 50]
      });

      const sharePercent = (parseFloat(ethers.formatUnits(balance, decimals)) / 
                            parseFloat(ethers.formatUnits(totalSupply, decimals)) * 100).toFixed(4);

      // Mock price for demonstration (in production, fetch from price oracle/API)
      const MOCK_ARCX_PRICE_USD = 1.25;

      table.push(
        ['Address', Utils.formatAddress(address)],
        ['Balance', Utils.formatAmount(balance, decimals, symbol)],
        ['Share of Supply', theme.number(`${sharePercent}%`)],
        ['USD Value (Mock)', Utils.formatUSD(parseFloat(ethers.formatUnits(balance, decimals)) * MOCK_ARCX_PRICE_USD)]
      );

      console.log(table.toString());
      
    } catch (error) {
      spinner.fail(theme.error('Failed to check balance'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async transferTokens() {
    console.log('\n' + Utils.section('Transfer Tokens'));
    console.log(theme.warning('⚠  This will execute a real blockchain transaction!\n'));
    
    if (!config.env.deployerKey) {
      console.log(theme.error('DEPLOYER_PRIVATE_KEY not configured in .env'));
      console.log(theme.info('Configure private key to enable transfers\n'));
      return;
    }

    const { recipient } = await inquirer.prompt([
      {
        type: 'input',
        name: 'recipient',
        message: theme.info('Recipient address:'),
        validate: (input) => {
          if (!Utils.isValidAddress(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        }
      }
    ]);

    const { amount } = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: theme.info('Amount (in ARCx):'),
        validate: (input) => {
          const num = parseFloat(input);
          if (isNaN(num) || num <= 0) {
            return 'Invalid amount';
          }
          return true;
        }
      }
    ]);

    const confirmed = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: theme.warning(`Transfer ${amount} ARCx to ${recipient.slice(0, 10)}...?`),
        default: false
      }
    ]);

    if (!confirmed.confirmed) {
      console.log(theme.muted('\nTransfer cancelled'));
      return;
    }

    const spinner = ora(theme.info('Processing transfer...')).start();
    
    try {
      const signer = config.getSigner('base');
      const contract = config.getContract('arcx').connect(signer);
      
      const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18));
      spinner.text = theme.info(`Transaction sent: ${Utils.formatTxHash(tx.hash)}`);
      
      const receipt = await tx.wait();
      spinner.succeed(theme.success('Transfer completed!'));
      
      console.log('\n' + theme.success('✓ Transaction confirmed'));
      console.log(theme.label('TX Hash: ') + Utils.formatTxHash(receipt.hash, false));
      console.log(theme.label('Block: ') + Utils.formatBlock(receipt.blockNumber));
      console.log(theme.label('Gas Used: ') + theme.number(receipt.gasUsed.toString()));
      
    } catch (error) {
      spinner.fail(theme.error('Transfer failed'));
      console.error('\n' + theme.error(Utils.parseError(error)));
    }
  }

  async showMarket() {
    console.log('\n' + Utils.section('Market Data'));
    console.log(theme.info('Note: Mock data for demonstration\n'));
    
    const table = new Table({
      head: [theme.label('Metric'), theme.label('Value'), theme.label('24h Change')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [25, 25, 20]
    });

    table.push(
      ['Price', Utils.formatUSD(1.25), theme.success('+5.2%')],
      ['Market Cap', Utils.formatUSD(1250000), theme.success('+4.8%')],
      ['Fully Diluted', Utils.formatUSD(1250000), theme.success('+4.8%')],
      ['Volume 24h', Utils.formatUSD(125000), theme.warning('+12.3%')],
      ['Liquidity (TVL)', Utils.formatUSD(625000), theme.info('+2.1%')],
      ['Holders', theme.number('2,847'), theme.success('+15')],
      ['Transactions 24h', theme.number('1,234'), theme.warning('+8.7%')]
    );

    console.log(table.toString());

    // Trading pairs
    console.log('\n' + Utils.section('Trading Pairs'));
    
    const pairsTable = new Table({
      head: [theme.label('Pair'), theme.label('DEX'), theme.label('Liquidity'), theme.label('Volume 24h')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] }
    });

    pairsTable.push(
      ['ARCx/WETH', theme.primary('Uniswap V4'), Utils.formatUSD(500000), Utils.formatUSD(100000)],
      ['ARCx/USDC', theme.primary('Uniswap V4'), Utils.formatUSD(125000), Utils.formatUSD(25000)]
    );

    console.log(pairsTable.toString());
  }
}

module.exports = new TokensModule();
