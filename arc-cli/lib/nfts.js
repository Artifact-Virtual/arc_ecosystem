const theme = require('./theme');
const Utils = require('./utils');
const inquirer = require('inquirer');
const Table = require('cli-table3');

class NFTsModule {
  async show() {
    console.clear();
    console.log(Utils.header('NFT MANAGEMENT - ARCs Collection'));
    
    const choices = [
      { name: theme.primary('🎨 Collection Overview'), value: 'overview' },
      { name: theme.info('📋 Browse NFTs'), value: 'browse' },
      { name: theme.success('🖼️  Mint NFT'), value: 'mint' },
      { name: theme.warning('💸 Transfer NFT'), value: 'transfer' },
      { name: theme.accent('🔍 Check Ownership'), value: 'ownership' },
      { name: theme.highlight('📊 Collection Stats'), value: 'stats' },
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
      case 'browse':
        await this.browseNFTs();
        break;
      case 'mint':
        await this.mintNFT();
        break;
      case 'transfer':
        await this.transferNFT();
        break;
      case 'ownership':
        await this.checkOwnership();
        break;
      case 'stats':
        await this.showStats();
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
    console.log('\n' + Utils.section('ARCs NFT Collection Overview'));
    console.log(theme.info('Status: ') + theme.warning('PLANNED - Not yet deployed\n'));
    
    const table = new Table({
      head: [theme.label('Property'), theme.label('Value')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [30, 50]
    });

    table.push(
      ['Collection Name', theme.value('Adaptive Resource Contexts (ARCs)')],
      ['Symbol', theme.success('ARCs')],
      ['Standard', theme.info('ERC-721')],
      ['Network', theme.primary('Base L2 (8453)')],
      ['Total Supply', theme.number('10,000 (Planned)')],
      ['Minted', theme.number('0')],
      ['Status', theme.warning('⚙ In Development')],
      ['Mint Price', theme.number('0.01 ETH (TBD)')],
      ['Royalties', theme.number('5%')]
    );

    console.log(table.toString());

    console.log('\n' + Utils.section('Collection Features (Planned)'));
    console.log(theme.success('✓') + ' Dynamic metadata based on context');
    console.log(theme.success('✓') + ' On-chain generative art');
    console.log(theme.success('✓') + ' Utility within ARC ecosystem');
    console.log(theme.success('✓') + ' Staking rewards in ARCx');
    console.log(theme.success('✓') + ' Governance participation rights');
    console.log(theme.success('✓') + ' Rarity tiers with special benefits');
  }

  async browseNFTs() {
    console.log('\n' + Utils.section('Browse NFTs'));
    console.log(theme.warning('Collection not yet deployed\n'));
    
    // Mock NFT data
    const table = new Table({
      head: [theme.label('ID'), theme.label('Name'), theme.label('Owner'), theme.label('Rarity')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [8, 25, 45, 15]
    });

    const mockNFTs = [
      [1, 'Genesis ARC #1', '0x742d35...0bEb', theme.success('Legendary')],
      [2, 'Adaptive Context #2', '0x3f5CE5...f0bE', theme.warning('Epic')],
      [3, 'Resource Node #3', '0x1a2b3c...4d5e', theme.info('Rare')],
      [4, 'Dynamic State #4', '0x9f8e7d...6c5b', theme.muted('Common')],
      [5, 'Context Matrix #5', '0x5e4d3c...2b1a', theme.info('Rare')]
    ];

    mockNFTs.forEach(([id, name, owner, rarity]) => {
      table.push([theme.number(`#${id}`), theme.value(name), Utils.formatAddress(owner), rarity]);
    });

    console.log(table.toString());
    console.log('\n' + theme.muted('Showing 5 of 0 minted NFTs'));
  }

  async mintNFT() {
    console.log('\n' + Utils.section('Mint NFT'));
    console.log(theme.warning('⚠  NFT contract not yet deployed\n'));
    console.log(theme.info('This feature will be available after deployment'));
    console.log(theme.muted('Expected launch: Q2 2025\n'));
  }

  async transferNFT() {
    console.log('\n' + Utils.section('Transfer NFT'));
    console.log(theme.warning('⚠  NFT contract not yet deployed\n'));
    console.log(theme.info('This feature will be available after deployment'));
  }

  async checkOwnership() {
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

    console.log('\n' + Utils.section('NFT Ownership'));
    console.log(theme.label('Address: ') + Utils.formatAddress(address));
    console.log(theme.label('NFTs Owned: ') + theme.number('0'));
    console.log('\n' + theme.muted('Collection not yet deployed'));
  }

  async showStats() {
    console.log('\n' + Utils.section('Collection Statistics'));
    console.log(theme.warning('Collection not yet deployed\n'));
    
    const table = new Table({
      head: [theme.label('Metric'), theme.label('Value')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [30, 50]
    });

    table.push(
      ['Total Supply', theme.number('10,000 (Planned)')],
      ['Minted', theme.number('0')],
      ['Unique Holders', theme.number('0')],
      ['Floor Price', theme.muted('TBD')],
      ['Volume (All Time)', theme.muted('TBD')],
      ['Average Sale Price', theme.muted('TBD')],
      ['Royalties Collected', theme.muted('0 ETH')],
      ['Deployment Status', theme.warning('⚙ Planned')]
    );

    console.log(table.toString());
  }
}

module.exports = new NFTsModule();
