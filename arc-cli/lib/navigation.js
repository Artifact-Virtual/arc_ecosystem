const inquirer = require('inquirer');
const theme = require('./theme');
const Utils = require('./utils');

class Navigation {
  constructor() {
    this.modules = {};
    this.history = [];
  }

  // Register a module
  register(name, module) {
    this.modules[name] = module;
  }

  // Main menu
  async showMainMenu() {
    console.clear();
    this.displayHeader();
    
    const choices = [
      { name: theme.primary('🌐 Ecosystem Overview'), value: 'ecosystem' },
      { name: theme.info('🚀 Deployments'), value: 'deployments' },
      { name: theme.success('🪙  Tokens (ARCx)'), value: 'tokens' },
      { name: theme.accent('🎨 NFTs Management'), value: 'nfts' },
      { name: theme.warning('🏅 SBTs (Soul-Bound Tokens)'), value: 'sbts' },
      { name: theme.highlight('📊 Monitoring & Analytics'), value: 'monitoring' },
      { name: theme.subtitle('⚙️  Configuration'), value: 'config' },
      new inquirer.Separator(theme.border('─'.repeat(60))),
      { name: theme.muted('❓ Help & Documentation'), value: 'help' },
      { name: theme.error('🚪 Exit'), value: 'exit' }
    ];

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'module',
        message: theme.title('Select an option:'),
        choices,
        pageSize: 15,
        loop: false
      }
    ]);

    return answer.module;
  }

  // Display ASCII header
  displayHeader() {
    const figlet = require('figlet');
    const boxen = require('boxen');
    
    const logo = figlet.textSync('ARC CLI', {
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted'
    });

    const coloredLogo = logo.split('\n').map((line, i) => {
      if (i < 2) return theme.logo.primary(line);
      if (i < 4) return theme.logo.secondary(line);
      return theme.logo.accent(line);
    }).join('\n');

    const box = boxen(
      coloredLogo + '\n\n' +
      theme.subtitle('Professional Terminal UI for ARC Ecosystem') + '\n' +
      theme.textDim('Version 1.0.0 • Base L2 Network') + '\n' +
      theme.muted('─'.repeat(60)),
      {
        ...theme.boxStyles.primary,
        padding: 1,
        margin: { top: 1, bottom: 1 },
        align: 'center'
      }
    );

    console.log(box);
  }

  // Show loading screen
  async showLoading(message = 'Loading...', duration = 2000) {
    const ora = require('ora');
    const spinner = ora({
      text: theme.info(message),
      color: 'magenta',
      spinner: 'dots12'
    }).start();

    await Utils.sleep(duration);
    spinner.succeed(theme.success('Ready!'));
  }

  // Show confirmation dialog
  async confirm(message, defaultValue = false) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: theme.warning(message),
        default: defaultValue
      }
    ]);
    return answer.confirmed;
  }

  // Show input prompt
  async input(message, defaultValue = '', validate = null) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: theme.info(message),
        default: defaultValue,
        validate: validate || (() => true)
      }
    ]);
    return answer.value;
  }

  // Show selection list
  async select(message, choices) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: theme.title(message),
        choices,
        pageSize: 15,
        loop: false
      }
    ]);
    return answer.selected;
  }

  // Show multi-select list
  async multiSelect(message, choices) {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: theme.title(message),
        choices,
        pageSize: 15
      }
    ]);
    return answer.selected;
  }

  // Show error message
  showError(error) {
    const boxen = require('boxen');
    const message = Utils.parseError(error);
    
    const box = boxen(
      theme.error('✗ ERROR\n\n') + theme.text(message),
      theme.boxStyles.error
    );
    
    console.log('\n' + box + '\n');
  }

  // Show success message
  showSuccess(message) {
    const boxen = require('boxen');
    
    const box = boxen(
      theme.success('✓ SUCCESS\n\n') + theme.text(message),
      theme.boxStyles.success
    );
    
    console.log('\n' + box + '\n');
  }

  // Show warning message
  showWarning(message) {
    const boxen = require('boxen');
    
    const box = boxen(
      theme.warning('⚠ WARNING\n\n') + theme.text(message),
      theme.boxStyles.warning
    );
    
    console.log('\n' + box + '\n');
  }

  // Show info message
  showInfo(message) {
    const boxen = require('boxen');
    
    const box = boxen(
      theme.info('ℹ INFO\n\n') + theme.text(message),
      theme.boxStyles.info
    );
    
    console.log('\n' + box + '\n');
  }

  // Wait for user input
  async pressAnyKey() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: theme.muted('Press Enter to continue...')
      }
    ]);
  }

  // Show search input
  async search(placeholder = 'Search...') {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: theme.info('🔍'),
        prefix: '',
        default: placeholder
      }
    ]);
    return answer.query;
  }

  // Show help
  displayHelp() {
    console.clear();
    const Table = require('cli-table3');
    
    console.log(Utils.header('HELP & DOCUMENTATION'));
    
    const shortcuts = new Table({
      head: [theme.label('Key'), theme.label('Action')],
      style: { head: ['bold', 'hex("#6A00FF")'], border: ['hex("#30363D")'] }
    });

    shortcuts.push(
      ['↑ ↓', 'Navigate menu items'],
      ['Enter', 'Select/Confirm'],
      ['Space', 'Toggle selection (multi-select)'],
      ['Esc', 'Go back/Cancel'],
      ['Ctrl+C', 'Exit application']
    );

    console.log(shortcuts.toString());
    
    console.log(Utils.section('Available Modules'));
    console.log(theme.primary('• Ecosystem Overview') + ' - View system status and metrics');
    console.log(theme.info('• Deployments') + ' - Manage contract deployments');
    console.log(theme.success('• Tokens') + ' - ARCx token management and operations');
    console.log(theme.accent('• NFTs') + ' - NFT collection management');
    console.log(theme.warning('• SBTs') + ' - Soul-bound token operations');
    console.log(theme.highlight('• Monitoring') + ' - Real-time analytics and logs');
    console.log(theme.subtitle('• Configuration') + ' - Network and system settings');
    
    console.log(Utils.section('Quick Start'));
    console.log('1. Ensure your .env file is configured with API keys');
    console.log('2. Select ' + theme.primary('Ecosystem Overview') + ' to check system status');
    console.log('3. Use ' + theme.highlight('Monitoring') + ' to track real-time metrics');
    console.log('4. Configure settings in ' + theme.subtitle('Configuration') + ' module\n');
    
    console.log(theme.muted('For more information, visit: https://github.com/Artifact-Virtual/ARC\n'));
  }
}

module.exports = new Navigation();
