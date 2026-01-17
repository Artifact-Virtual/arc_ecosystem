#!/usr/bin/env node

/**
 * ARC CLI - Professional Terminal UI for ARC Ecosystem
 * 
 * A comprehensive command-line interface for managing the ARC ecosystem,
 * including ARCx tokens, NFTs, SBTs, deployments, and real-time monitoring.
 * 
 * @author Artifact Virtual
 * @version 1.0.0
 */

const navigation = require('./lib/navigation');
const ecosystem = require('./lib/ecosystem');
const deployments = require('./lib/deployments');
const tokens = require('./lib/tokens');
const nfts = require('./lib/nfts');
const sbts = require('./lib/sbts');
const monitoring = require('./lib/monitoring');
const management = require('./lib/management');
const config = require('./lib/config');
const theme = require('./lib/theme');
const Utils = require('./lib/utils');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n' + theme.info('👋 Thanks for using ARC CLI!'));
  console.log(theme.muted('Goodbye!\n'));
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n' + theme.error('Fatal Error: ' + Utils.parseError(error)));
  process.exit(1);
});

// Main application class
class ARCli {
  constructor() {
    this.running = false;
    
    // Register modules with navigation
    navigation.register('ecosystem', ecosystem);
    navigation.register('deployments', deployments);
    navigation.register('tokens', tokens);
    navigation.register('nfts', nfts);
    navigation.register('sbts', sbts);
    navigation.register('monitoring', monitoring);
    navigation.register('management', management);
  }

  // Start the application
  async start() {
    this.running = true;
    
    // Show splash screen
    await this.showSplash();
    
    // Validate configuration
    await this.validateConfig();
    
    // Main loop
    while (this.running) {
      try {
        const selection = await navigation.showMainMenu();
        
        if (selection === 'exit') {
          await this.exit();
          break;
        }
        
        if (selection === 'help') {
          navigation.displayHelp();
          await navigation.pressAnyKey();
          continue;
        }
        
        // Route to appropriate module
        const result = await this.routeToModule(selection);
        
        if (result === 'exit') {
          await this.exit();
          break;
        }
        
      } catch (error) {
        navigation.showError(error);
        await navigation.pressAnyKey();
      }
    }
  }

  // Show splash screen
  async showSplash() {
    console.clear();
    navigation.displayHeader();
    
    const boxen = require('boxen');
    
    const welcomeMessage = 
      theme.primary('Welcome to ARC CLI!') + '\n\n' +
      theme.text('Manage your ARC ecosystem with ease:\n') +
      theme.success('✓') + ' Token management (ARCx)\n' +
      theme.success('✓') + ' NFT & SBT operations\n' +
      theme.success('✓') + ' Real-time monitoring\n' +
      theme.success('✓') + ' Contract deployments\n' +
      theme.success('✓') + ' Network analytics\n\n' +
      theme.muted('Base L2 Network • Professional Grade');
    
    const box = boxen(welcomeMessage, {
      ...theme.boxStyles.info,
      padding: 1,
      margin: { top: 0, bottom: 1 },
      align: 'center'
    });
    
    console.log(box);
    
    await navigation.showLoading('Initializing...', 1500);
  }

  // Validate configuration
  async validateConfig() {
    const validation = config.validate();
    
    if (!validation.valid) {
      const boxen = require('boxen');
      
      let warningMsg = theme.warning('⚠  Configuration Warnings\n\n');
      validation.issues.forEach(issue => {
        warningMsg += theme.muted('• ' + issue + '\n');
      });
      warningMsg += '\n' + theme.info('Some features may be limited. Check your .env file.');
      
      const box = boxen(warningMsg, theme.boxStyles.warning);
      console.log('\n' + box);
      
      await navigation.pressAnyKey();
    }
  }

  // Route to module
  async routeToModule(moduleName) {
    const module = navigation.modules[moduleName];
    
    if (!module) {
      throw new Error(`Module '${moduleName}' not found`);
    }
    
    return await module.show();
  }

  // Exit application
  async exit() {
    console.clear();
    
    const boxen = require('boxen');
    const figlet = require('figlet');
    
    const goodbye = figlet.textSync('Goodbye!', {
      font: 'Small',
      horizontalLayout: 'fitted'
    });
    
    const message = 
      theme.primary(goodbye) + '\n\n' +
      theme.text('Thank you for using ARC CLI') + '\n' +
      theme.muted('Built with ❤️  by Artifact Virtual') + '\n\n' +
      theme.info('Visit: https://github.com/Artifact-Virtual/ARC');
    
    const box = boxen(message, {
      ...theme.boxStyles.primary,
      padding: 1,
      align: 'center'
    });
    
    console.log('\n' + box + '\n');
    
    this.running = false;
  }
}

// Application entry point
async function main() {
  const app = new ARCli();
  await app.start();
}

// Run the application
if (require.main === module) {
  main().catch((error) => {
    console.error('\n' + theme.error('Fatal Error: ' + Utils.parseError(error)));
    console.error(theme.muted('\nPlease check your configuration and try again.\n'));
    process.exit(1);
  });
}

module.exports = ARCli;
