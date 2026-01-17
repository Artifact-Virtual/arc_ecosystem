const theme = require('./theme');
const Utils = require('./utils');
const inquirer = require('inquirer');
const Table = require('cli-table3');

class SBTsModule {
  async show() {
    console.clear();
    console.log(Utils.header('SBT MANAGEMENT - Soul-Bound Tokens'));
    
    const choices = [
      { name: theme.primary('🏅 SBT Overview'), value: 'overview' },
      { name: theme.info('📋 Browse SBTs'), value: 'browse' },
      { name: theme.success('🎖️  Issue SBT'), value: 'issue' },
      { name: theme.warning('🔍 Verify SBT'), value: 'verify' },
      { name: theme.accent('👤 Check Credentials'), value: 'credentials' },
      { name: theme.highlight('📊 SBT Statistics'), value: 'stats' },
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
        await this.browseSBTs();
        break;
      case 'issue':
        await this.issueSBT();
        break;
      case 'verify':
        await this.verifySBT();
        break;
      case 'credentials':
        await this.checkCredentials();
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
    console.log('\n' + Utils.section('Soul-Bound Token (SBT) System'));
    console.log(theme.info('Status: ') + theme.warning('PLANNED - Not yet deployed\n'));
    
    const table = new Table({
      head: [theme.label('Property'), theme.label('Value')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [30, 50]
    });

    table.push(
      ['Token Name', theme.value('ARC Achievement Tokens')],
      ['Symbol', theme.success('ARC-SBT')],
      ['Standard', theme.info('ERC-5192 (Soul-Bound)')],
      ['Network', theme.primary('Base L2 (8453)')],
      ['Issued', theme.number('0')],
      ['Active Holders', theme.number('0')],
      ['Status', theme.warning('⚙ In Development')],
      ['Transferable', theme.error('✗ No (Soul-Bound)')],
      ['Revocable', theme.success('✓ By Issuer Only')]
    );

    console.log(table.toString());

    console.log('\n' + Utils.section('SBT Types (Planned)'));
    
    const typesTable = new Table({
      head: [theme.label('Type'), theme.label('Description'), theme.label('Benefits')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [20, 35, 30]
    });

    typesTable.push(
      [theme.success('Contributor'), 'Active ecosystem contributor', 'Governance voting power'],
      [theme.warning('Developer'), 'Code contributor verified', 'Dev tool access'],
      [theme.info('Early Adopter'), 'Early user credential', 'Priority features'],
      [theme.accent('Governance'), 'DAO participation proof', 'Proposal creation'],
      [theme.highlight('Ambassador'), 'Community ambassador', 'Special privileges']
    );

    console.log(typesTable.toString());

    console.log('\n' + Utils.section('Key Features (Planned)'));
    console.log(theme.success('✓') + ' Non-transferable (soul-bound to address)');
    console.log(theme.success('✓') + ' On-chain verification via EAS');
    console.log(theme.success('✓') + ' Cryptographic proof of achievements');
    console.log(theme.success('✓') + ' Revocable by authorized issuers');
    console.log(theme.success('✓') + ' Grants ecosystem privileges');
    console.log(theme.success('✓') + ' Integrates with governance system');
  }

  async browseSBTs() {
    console.log('\n' + Utils.section('Browse SBTs'));
    console.log(theme.warning('SBT system not yet deployed\n'));
    
    // Mock SBT data
    const table = new Table({
      head: [theme.label('ID'), theme.label('Type'), theme.label('Holder'), theme.label('Issued'), theme.label('Status')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [8, 18, 35, 20, 12]
    });

    const mockSBTs = [
      [1, 'Early Adopter', '0x742d35...0bEb', '2024-09-01', theme.success('Active')],
      [2, 'Contributor', '0x3f5CE5...f0bE', '2024-09-15', theme.success('Active')],
      [3, 'Developer', '0x1a2b3c...4d5e', '2024-10-01', theme.success('Active')],
      [4, 'Ambassador', '0x9f8e7d...6c5b', '2024-11-01', theme.success('Active')],
      [5, 'Governance', '0x5e4d3c...2b1a', '2024-12-01', theme.success('Active')]
    ];

    mockSBTs.forEach(([id, type, holder, issued, status]) => {
      table.push([
        theme.number(`#${id}`),
        theme.accent(type),
        Utils.formatAddress(holder),
        theme.muted(issued),
        status
      ]);
    });

    console.log(table.toString());
    console.log('\n' + theme.muted('Showing 5 of 0 issued SBTs'));
  }

  async issueSBT() {
    console.log('\n' + Utils.section('Issue Soul-Bound Token'));
    console.log(theme.warning('⚠  SBT contract not yet deployed\n'));
    
    console.log(theme.info('Future issuance will require:'));
    console.log('  • Authorized issuer credentials');
    console.log('  • Recipient wallet address');
    console.log('  • SBT type selection');
    console.log('  • Achievement verification');
    console.log('  • On-chain attestation via EAS\n');
    
    console.log(theme.muted('Expected launch: Q2 2025'));
  }

  async verifySBT() {
    const { address } = await inquirer.prompt([
      {
        type: 'input',
        name: 'address',
        message: theme.info('Enter wallet address to verify:'),
        validate: (input) => {
          if (!Utils.isValidAddress(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        }
      }
    ]);

    console.log('\n' + Utils.section('SBT Verification'));
    console.log(theme.label('Address: ') + Utils.formatAddress(address));
    console.log(theme.label('SBTs Held: ') + theme.number('0'));
    console.log(theme.label('Verification: ') + theme.warning('System not deployed'));
    console.log('\n' + theme.muted('SBT verification will use EAS attestations'));
  }

  async checkCredentials() {
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

    console.log('\n' + Utils.section('Credentials & Achievements'));
    console.log(theme.label('Address: ') + Utils.formatAddress(address));
    console.log(theme.label('Total SBTs: ') + theme.number('0'));
    console.log('\n' + theme.warning('No credentials found (system not deployed)'));
  }

  async showStats() {
    console.log('\n' + Utils.section('SBT System Statistics'));
    console.log(theme.warning('System not yet deployed\n'));
    
    const table = new Table({
      head: [theme.label('Metric'), theme.label('Value')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] },
      colWidths: [30, 50]
    });

    table.push(
      ['Total SBTs Issued', theme.number('0')],
      ['Unique Holders', theme.number('0')],
      ['Active SBTs', theme.number('0')],
      ['Revoked SBTs', theme.number('0')],
      ['SBT Types Available', theme.number('5 (Planned)')],
      ['Authorized Issuers', theme.number('TBD')],
      ['Attestations Created', theme.number('0')],
      ['Deployment Status', theme.warning('⚙ Planned')]
    );

    console.log(table.toString());

    console.log('\n' + Utils.section('Planned SBT Distribution'));
    console.log(theme.label('Early Adopters:   ') + Utils.createProgressBar(0, 1000, 30) + ' ' + theme.muted('0/1000'));
    console.log(theme.label('Contributors:     ') + Utils.createProgressBar(0, 500, 30) + ' ' + theme.muted('0/500'));
    console.log(theme.label('Developers:       ') + Utils.createProgressBar(0, 200, 30) + ' ' + theme.muted('0/200'));
    console.log(theme.label('Ambassadors:      ') + Utils.createProgressBar(0, 100, 30) + ' ' + theme.muted('0/100'));
    console.log(theme.label('Governance:       ') + Utils.createProgressBar(0, 50, 30) + ' ' + theme.muted('0/50'));
  }
}

module.exports = new SBTsModule();
