const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// Try to load .env from multiple possible locations
const possibleEnvPaths = [
  path.join(__dirname, '../../.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.env.HOME || process.env.USERPROFILE, '.arc-cli', '.env')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}

class Config {
  constructor() {
    this.rootPath = path.join(__dirname, '../..');
    this.addressBookPath = path.join(this.rootPath, 'address.book');
    this.configPath = path.join(this.rootPath, 'hardhat.config.ts');
    this.load();
  }

  // Load configuration from files
  load() {
    this.addresses = this.parseAddressBook();
    this.networks = this.getNetworkConfig();
    this.env = this.loadEnvConfig();
  }

  // Parse address book
  parseAddressBook() {
    try {
      const content = fs.readFileSync(this.addressBookPath, 'utf8');
      const addresses = {
        core: {},
        infrastructure: {},
        governance: {},
        wallets: {},
        external: {},
        uniswap: {},
        tokens: {}
      };

      // Parse core contracts
      const arcxMatch = content.match(/ARCx V2 Enhanced:\s*(0x[a-fA-F0-9]{40})/);
      if (arcxMatch) addresses.core.arcxToken = arcxMatch[1];

      const mathMatch = content.match(/ARCxMath Library:\s*(0x[a-fA-F0-9]{40})/);
      if (mathMatch) addresses.core.arcxMath = mathMatch[1];

      const arcxV1Match = content.match(/ARCx V1 \(Legacy\):\s*(0x[a-fA-F0-9]{40})/);
      if (arcxV1Match) addresses.core.arcxV1 = arcxV1Match[1];

      // Parse infrastructure
      const vestingMatch = content.match(/Vesting Contract:\s*(0x[a-fA-F0-9]{40})/);
      if (vestingMatch) addresses.infrastructure.vesting = vestingMatch[1];

      const airdropMatch = content.match(/Airdrop Contract:\s*(0x[a-fA-F0-9]{40})/);
      if (airdropMatch) addresses.infrastructure.airdrop = airdropMatch[1];

      const hookMatch = content.match(/Uniswap V4 Hook:\s*(0x[a-fA-F0-9]{40})/);
      if (hookMatch) addresses.infrastructure.uniswapHook = hookMatch[1];

      // Parse governance
      const treasuryMatch = content.match(/Treasury Safe:\s*(0x[a-fA-F0-9]{40})/);
      if (treasuryMatch) addresses.governance.treasury = treasuryMatch[1];

      const ecosystemMatch = content.match(/Ecosystem Safe:\s*(0x[a-fA-F0-9]{40})/);
      if (ecosystemMatch) addresses.governance.ecosystem = ecosystemMatch[1];

      // Parse wallets
      const deployerMatch = content.match(/Deployer Wallet:\s*(0x[a-fA-F0-9]{40})/);
      if (deployerMatch) addresses.wallets.deployer = deployerMatch[1];

      // Parse external services
      const easMatch = content.match(/EAS.*:\s*(0x[a-fA-F0-9]{40})/);
      if (easMatch) addresses.external.eas = easMatch[1];

      // Parse Uniswap V4
      const posManagerMatch = content.match(/Position Manager.*:\s*(0x[a-fA-F0-9]{40})/);
      if (posManagerMatch) addresses.uniswap.positionManager = posManagerMatch[1];

      const poolManagerMatch = content.match(/Pool Manager:\s*(0x[a-fA-F0-9]{40})/);
      if (poolManagerMatch) addresses.uniswap.poolManager = poolManagerMatch[1];

      const universalRouterMatch = content.match(/Universal Router:\s*(0x[a-fA-F0-9]{40})/);
      if (universalRouterMatch) addresses.uniswap.universalRouter = universalRouterMatch[1];

      const lpPositionMatch = content.match(/LP Position:\s*(\d+)/);
      if (lpPositionMatch) addresses.uniswap.lpPosition = lpPositionMatch[1];

      // Parse Base tokens
      const wethMatch = content.match(/WETH \(Base\):\s*(0x[a-fA-F0-9]{40})/);
      if (wethMatch) addresses.tokens.weth = wethMatch[1];

      const usdcMatch = content.match(/USDC \(Base\):\s*(0x[a-fA-F0-9]{40})/);
      if (usdcMatch) addresses.tokens.usdc = usdcMatch[1];

      return addresses;
    } catch (error) {
      console.error('Error parsing address book:', error.message);
      return {};
    }
  }

  // Get network configuration
  getNetworkConfig() {
    return {
      base: {
        name: 'Base L2 Mainnet',
        chainId: 8453,
        rpc: process.env.INFURA_PROJECT_ID 
          ? `https://base-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          : 'https://mainnet.base.org',
        explorer: 'https://basescan.org',
        currency: 'ETH'
      },
      'base-sepolia': {
        name: 'Base Sepolia Testnet',
        chainId: 84532,
        rpc: process.env.INFURA_PROJECT_ID
          ? `https://base-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          : 'https://sepolia.base.org',
        explorer: 'https://sepolia.basescan.org',
        currency: 'ETH'
      },
      mainnet: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpc: process.env.INFURA_PROJECT_ID
          ? `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          : null,
        explorer: 'https://etherscan.io',
        currency: 'ETH'
      },
      hardhat: {
        name: 'Hardhat Local',
        chainId: 31337,
        rpc: 'http://127.0.0.1:8545',
        explorer: null,
        currency: 'ETH'
      },
      ganache: {
        name: 'Ganache Local',
        chainId: 1337,
        rpc: 'http://127.0.0.1:8545',
        explorer: null,
        currency: 'ETH'
      }
    };
  }

  // Load environment configuration
  loadEnvConfig() {
    return {
      infuraKey: process.env.INFURA_PROJECT_ID || null,
      alchemyKey: process.env.ALCHEMY_API_KEY || null,
      etherscanKey: process.env.ETHERSCAN_API_KEY || null,
      deployerKey: process.env.DEPLOYER_PRIVATE_KEY || null,
      gasPrice: process.env.GAS_PRICE_MAINNET || '20',
      reportGas: process.env.REPORT_GAS === 'true'
    };
  }

  // Get provider for network
  getProvider(network = 'base') {
    const networkConfig = this.networks[network];
    if (!networkConfig || !networkConfig.rpc) {
      throw new Error(`Network ${network} not configured or RPC unavailable`);
    }
    return new ethers.JsonRpcProvider(networkConfig.rpc);
  }

  // Get signer (requires private key)
  getSigner(network = 'base') {
    if (!this.env.deployerKey) {
      throw new Error('DEPLOYER_PRIVATE_KEY not configured in .env');
    }
    const provider = this.getProvider(network);
    return new ethers.Wallet(this.env.deployerKey, provider);
  }

  // Get contract instance
  getContract(contractName, network = 'base') {
    const address = this.getContractAddress(contractName);
    if (!address) {
      throw new Error(`Contract ${contractName} not found in address book`);
    }
    
    const provider = this.getProvider(network);
    const abi = this.getContractABI(contractName);
    
    return new ethers.Contract(address, abi, provider);
  }

  // Get contract address
  getContractAddress(contractName) {
    const mapping = {
      'arcx': this.addresses.core?.arcxToken,
      'arcx-token': this.addresses.core?.arcxToken,
      'arcx-math': this.addresses.core?.arcxMath,
      'arcx-v1': this.addresses.core?.arcxV1,
      'vesting': this.addresses.infrastructure?.vesting,
      'airdrop': this.addresses.infrastructure?.airdrop,
      'uniswap-hook': this.addresses.infrastructure?.uniswapHook,
      'treasury': this.addresses.governance?.treasury,
      'ecosystem': this.addresses.governance?.ecosystem,
      'deployer': this.addresses.wallets?.deployer,
      'weth': this.addresses.tokens?.weth,
      'usdc': this.addresses.tokens?.usdc,
      'pool-manager': this.addresses.uniswap?.poolManager,
      'position-manager': this.addresses.uniswap?.positionManager
    };
    
    return mapping[contractName.toLowerCase()];
  }

  // Get contract ABI (basic ERC20 for now)
  getContractABI(contractName) {
    // Basic ERC20 ABI
    return [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function transferFrom(address from, address to, uint256 amount) returns (bool)',
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'event Approval(address indexed owner, address indexed spender, uint256 value)'
    ];
  }

  // Save configuration
  save() {
    // This would save any runtime configuration changes
    // For now, we keep it read-only from address.book
  }

  // Validate configuration
  validate() {
    const issues = [];
    
    if (!this.env.infuraKey && !this.env.alchemyKey) {
      issues.push('No RPC provider API key configured (INFURA_PROJECT_ID or ALCHEMY_API_KEY)');
    }
    
    if (!this.addresses.core?.arcxToken) {
      issues.push('ARCx token address not found in address.book');
    }
    
    if (!this.env.deployerKey) {
      issues.push('DEPLOYER_PRIVATE_KEY not configured (required for transactions)');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  // Get explorer URL
  getExplorerUrl(network, type, identifier) {
    const networkConfig = this.networks[network];
    if (!networkConfig || !networkConfig.explorer) return null;
    
    const base = networkConfig.explorer;
    switch (type) {
      case 'address':
      case 'token':
        return `${base}/address/${identifier}`;
      case 'tx':
        return `${base}/tx/${identifier}`;
      case 'block':
        return `${base}/block/${identifier}`;
      default:
        return base;
    }
  }
}

// Export singleton instance
module.exports = new Config();
