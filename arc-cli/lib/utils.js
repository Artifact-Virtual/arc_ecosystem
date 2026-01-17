const chalk = require('chalk');
const theme = require('./theme');
const { ethers } = require('ethers');

class Utils {
  // Format Ethereum address
  static formatAddress(address, short = false) {
    if (!address) return theme.muted('N/A');
    if (short) {
      return theme.address(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
    return theme.address(address);
  }

  // Format token amount
  static formatAmount(amount, decimals = 18, symbol = '') {
    try {
      if (amount == null) {
        return theme.muted('0');
      }
      const formatted = ethers.formatUnits(amount.toString(), decimals);
      const num = parseFloat(formatted);
      
      let display;
      if (num >= 1000000) {
        display = `${(num / 1000000).toFixed(2)}M`;
      } else if (num >= 1000) {
        display = `${(num / 1000).toFixed(2)}K`;
      } else {
        display = num.toFixed(4);
      }
      
      return theme.number(display) + (symbol ? ` ${theme.label(symbol)}` : '');
    } catch (error) {
      return theme.muted('Invalid');
    }
  }

  // Format USD value
  static formatUSD(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return theme.muted('$0.00');
    
    if (num >= 1000000) {
      return theme.success(`$${(num / 1000000).toFixed(2)}M`);
    } else if (num >= 1000) {
      return theme.success(`$${(num / 1000).toFixed(2)}K`);
    }
    return theme.success(`$${num.toFixed(2)}`);
  }

  // Format percentage
  static formatPercent(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return theme.muted('0%');
    
    const formatted = `${num.toFixed(2)}%`;
    if (num > 0) return theme.success(formatted);
    if (num < 0) return theme.error(formatted);
    return theme.muted(formatted);
  }

  // Format timestamp
  static formatTimestamp(timestamp) {
    try {
      const date = new Date(timestamp * 1000);
      return theme.textDim(date.toLocaleString());
    } catch (error) {
      return theme.muted('Invalid date');
    }
  }

  // Format duration
  static formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return theme.value(`${days}d ${hours}h`);
    if (hours > 0) return theme.value(`${hours}h ${minutes}m`);
    return theme.value(`${minutes}m`);
  }

  // Format status indicator
  static formatStatus(status) {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'LIVE':
      case 'ACTIVE':
      case 'DEPLOYED':
        return theme.live;
      case 'PENDING':
      case 'PROCESSING':
        return theme.pending;
      case 'FAILED':
      case 'ERROR':
        return theme.failed;
      default:
        return theme.muted(` ${statusUpper} `);
    }
  }

  // Format boolean
  static formatBool(value) {
    return value ? theme.success('✓ Yes') : theme.error('✗ No');
  }

  // Format network name
  static formatNetwork(network) {
    const networks = {
      'base': theme.primary('Base L2'),
      'base-sepolia': theme.info('Base Sepolia'),
      'mainnet': theme.success('Ethereum'),
      'sepolia': theme.warning('Sepolia'),
      'hardhat': theme.muted('Hardhat'),
      'ganache': theme.muted('Ganache')
    };
    return networks[network] || theme.muted(network);
  }

  // Create progress bar
  static createProgressBar(current, total, width = 30) {
    const percent = (current / total) * 100;
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    
    const bar = theme.success('█'.repeat(filled)) + theme.muted('░'.repeat(empty));
    const label = `${percent.toFixed(1)}%`;
    
    return `${bar} ${theme.number(label)}`;
  }

  // Validate Ethereum address
  static isValidAddress(address) {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  // Truncate text with ellipsis
  static truncate(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  // Parse error message
  static parseError(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.reason) return error.reason;
    if (error.error && error.error.message) return error.error.message;
    return 'Unknown error occurred';
  }

  // Sleep utility
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Format gas price
  static formatGas(gasPrice) {
    try {
      const gwei = ethers.formatUnits(gasPrice.toString(), 'gwei');
      return theme.number(`${parseFloat(gwei).toFixed(2)} Gwei`);
    } catch (error) {
      return theme.muted('N/A');
    }
  }

  // Format transaction hash
  static formatTxHash(hash, short = true) {
    if (!hash) return theme.muted('N/A');
    if (short) {
      return theme.info(`${hash.slice(0, 10)}...${hash.slice(-8)}`);
    }
    return theme.info(hash);
  }

  // Create divider
  static divider(char = '─', width = 80) {
    return theme.border(char.repeat(width));
  }

  // Format block number
  static formatBlock(blockNumber) {
    return theme.number(`#${blockNumber.toLocaleString()}`);
  }

  // Calculate time remaining
  static timeRemaining(targetTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const remaining = targetTimestamp - now;
    
    if (remaining <= 0) return theme.muted('Expired');
    return this.formatDuration(remaining);
  }

  // Format APY/APR
  static formatAPY(apy) {
    const num = parseFloat(apy);
    if (isNaN(num)) return theme.muted('0%');
    
    const formatted = `${num.toFixed(2)}%`;
    if (num >= 100) return theme.success(`🔥 ${formatted}`);
    if (num >= 50) return theme.success(formatted);
    if (num >= 10) return theme.info(formatted);
    return theme.warning(formatted);
  }

  // Spinner frames
  static spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  // Create header
  static header(text) {
    return `\n${theme.primary('═'.repeat(80))}\n${theme.title(text.toUpperCase().padStart((80 + text.length) / 2))}\n${theme.primary('═'.repeat(80))}\n`;
  }

  // Create section header
  static section(text) {
    return `\n${theme.subtitle('▶ ' + text)}\n${theme.border('─'.repeat(80))}\n`;
  }
}

module.exports = Utils;
