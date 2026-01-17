const chalk = require('chalk');

// ARC Brand Colors
const theme = {
  // Primary Colors
  primary: chalk.hex('#6A00FF'),
  primaryBg: chalk.bgHex('#6A00FF').white,
  
  // Status Colors
  success: chalk.hex('#00C853'),
  successBg: chalk.bgHex('#00C853').black,
  warning: chalk.hex('#F9A825'),
  warningBg: chalk.bgHex('#F9A825').black,
  error: chalk.hex('#FF1744'),
  errorBg: chalk.bgHex('#FF1744').white,
  info: chalk.hex('#58A6FF'),
  infoBg: chalk.bgHex('#58A6FF').black,
  
  // UI Elements
  accent: chalk.hex('#9D4EDD'),
  muted: chalk.hex('#6C757D'),
  text: chalk.white,
  textDim: chalk.gray,
  highlight: chalk.bold.hex('#E0AAFF'),
  
  // Semantic Colors
  address: chalk.hex('#58A6FF'),
  number: chalk.hex('#79C0FF'),
  label: chalk.hex('#7EE787'),
  value: chalk.white,
  
  // Borders and Decorations
  border: chalk.hex('#30363D'),
  separator: chalk.hex('#21262D'),
  
  // Status Indicators
  live: chalk.bgHex('#00C853').black.bold(' LIVE '),
  deployed: chalk.bgHex('#58A6FF').black.bold(' DEPLOYED '),
  pending: chalk.bgHex('#F9A825').black.bold(' PENDING '),
  failed: chalk.bgHex('#FF1744').white.bold(' FAILED '),
  
  // Special Effects
  gradient: (text) => {
    return chalk.hex('#6A00FF')(text);
  },
  
  title: (text) => {
    return chalk.bold.hex('#E0AAFF')(text);
  },
  
  subtitle: (text) => {
    return chalk.hex('#9D4EDD')(text);
  },
  
  // Utility functions
  dim: (text) => chalk.dim(text),
  bold: (text) => chalk.bold(text),
  italic: (text) => chalk.italic(text),
  underline: (text) => chalk.underline(text),
  
  // Logo colors
  logo: {
    primary: chalk.hex('#6A00FF').bold,
    secondary: chalk.hex('#9D4EDD'),
    accent: chalk.hex('#E0AAFF')
  }
};

// Box themes for consistent styling
theme.boxStyles = {
  primary: {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#6A00FF',
    backgroundColor: '#0D1117'
  },
  success: {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#00C853',
    backgroundColor: '#0D1117'
  },
  warning: {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#F9A825',
    backgroundColor: '#0D1117'
  },
  error: {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#FF1744',
    backgroundColor: '#0D1117'
  },
  info: {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#58A6FF',
    backgroundColor: '#0D1117'
  }
};

// Table themes
theme.tableStyles = {
  head: ['bold', 'hex("#6A00FF")'],
  border: ['hex("#30363D")']
};

module.exports = theme;
