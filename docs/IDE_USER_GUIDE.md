# ARC Contract Deployment IDE - User Guide

![IDE](https://img.shields.io/badge/IDE-Contract%20Deployment-6A00FF?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-00C853?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-00C853?style=for-the-badge)

## Overview

The ARC Contract Deployment IDE is a professional, browser-based interface for writing, compiling, and deploying smart contracts. Built specifically for the ARC ecosystem, it provides a Remix-like experience optimized for ARC token standards.

**Access:** `/docs/contract_deployment_ide.html`

---

## Features

### 🎨 Professional Interface
- Dark-themed UI matching ARC branding
- Intuitive three-panel layout (Templates | Editor | Deployment)
- Real-time console feedback
- Tab-based workflow

### 📝 Code Editor
- Syntax highlighting for Solidity
- Line numbers for easy navigation
- Auto-save functionality
- Template library integration

### 🏗️ Built-in Templates
- **ERC20 Token**: Standard fungible token with minting
- **ERC721 NFT**: Non-fungible token with URI storage
- **ERC1155 Multi-Token**: Multi-token standard
- **Soulbound Token (SBT)**: Non-transferable identity token
- **Governor Contract**: DAO governance system

### ⚙️ Compilation
- Multiple Solidity version support (0.8.0 - 0.8.21)
- Optimization settings (200 runs default)
- Real-time compilation feedback
- ABI and bytecode generation

### 🚀 Deployment
- MetaMask wallet integration
- Multi-network support:
  - Base Mainnet
  - Base Sepolia (testnet)
  - Ethereum Mainnet
  - Localhost (development)
- Constructor parameter inputs
- Gas estimation
- Transaction monitoring

### 📊 Console
- Real-time operation logging
- Success/error/info message categorization
- Deployment address tracking
- Block explorer links

---

## Getting Started

### Step 1: Access the IDE

Open the IDE in your browser:
```
file:///path/to/arc_ecosystem/docs/contract_deployment_ide.html
```

Or serve it locally:
```bash
cd arc_ecosystem/docs
python3 -m http.server 8000
# Then open http://localhost:8000/contract_deployment_ide.html
```

### Step 2: Connect Wallet

1. Click **"Connect Wallet"** button in the top-right
2. MetaMask will prompt for connection
3. Approve the connection
4. Your wallet address will display (e.g., "✓ 0x1234...5678")

### Step 3: Select Network

Use the network dropdown to choose your deployment target:
- **Localhost**: For local Hardhat/Ganache testing
- **Base Sepolia**: For testnet deployment
- **Base Mainnet**: For production deployment

---

## Creating Your First Contract

### Using Templates

#### 1. ERC20 Token

**Click** the "ERC20 Token" template card in the sidebar.

**Template loads with:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

**Customize:**
- Change contract name from `CustomToken`
- Modify initial supply logic
- Add custom functions
- Adjust access control

#### 2. ERC721 NFT

**Click** the "ERC721 NFT" template.

**Features:**
- ERC721URIStorage for metadata
- Ownable for access control
- Safe minting function
- Token counter for unique IDs

**Use Case:**
- Digital art collections
- Gaming assets
- Identity tokens
- Membership NFTs

#### 3. Soulbound Token (SBT)

**Click** the "Soulbound Token (SBT)" template.

**Special Feature:**
- Non-transferable after minting
- `_beforeTokenTransfer` override prevents transfers
- Perfect for credentials and achievements

**Use Case:**
- Identity verification
- Educational credentials
- Achievement badges
- Reputation tokens

#### 4. ERC1155 Multi-Token

**Click** the "ERC1155 Multi-Token" template.

**Capabilities:**
- Multiple token types in one contract
- Batch minting and transfers
- Gas-efficient for gaming and collectibles

#### 5. Governor Contract

**Click** the "Governor Contract" template.

**DAO Features:**
- Proposal creation and voting
- Timelock integration
- Vote delegation
- Quorum requirements

---

## Compiling Contracts

### Step 1: Configure Compiler

1. **Solidity Version**: Select the version matching your imports
   - Use `0.8.21` for latest features
   - Use `0.8.20` for slightly better compatibility
   - Use `0.8.0` for older projects

2. **Optimization**: Choose optimization level
   - **Enabled (200 runs)**: Recommended for production
   - **Disabled**: Better for debugging

### Step 2: Compile

1. Click **"🔨 Compile Contract"**
2. Watch console for compilation progress
3. Wait for success message:
   ```
   ✓ Contract compiled successfully!
   Contract: CustomToken
   ```

### Step 3: Review Compilation

After successful compilation:
- Contract dropdown populates with contract name
- Constructor parameters appear in deployment section
- Deploy button becomes enabled
- Switch to "Compiled" tab to view ABI/bytecode

---

## Deploying Contracts

### Step 1: Prepare Constructor Parameters

After compilation, the IDE displays input fields for constructor parameters.

**Example for ERC20:**
```
name (string): My Awesome Token
symbol (string): MAT
initialSupply (uint256): 1000000
```

**Tips:**
- Verify parameter types carefully
- For uint256, enter numbers without decimals (contract handles decimals)
- For addresses, use full checksummed addresses
- For strings, enter plain text

### Step 2: Deploy

1. Fill in all constructor parameters
2. Verify network selection is correct
3. Click **"📤 Deploy Contract"**
4. MetaMask will prompt for transaction approval
5. Confirm gas fees and click "Confirm"

### Step 3: Track Deployment

Watch console for deployment progress:
```
[12:34:56] Deploying contract...
[12:34:56] Network: base
[12:34:59] ✓ Contract deployed successfully!
[12:34:59] Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
[12:34:59] View on block explorer: https://explorer.com/address/0x742d35Cc...
```

**Save Deployment Info:**
- Copy contract address
- Save to your address book
- Verify on block explorer
- Add to monitoring systems

---

## Advanced Usage

### Custom Contract Development

#### Starting from Scratch

1. **Clear Editor**: Remove template code
2. **Write Contract**: Use Solidity best practices
3. **Import Dependencies**: Use OpenZeppelin imports
4. **Test Locally**: Deploy to localhost first

#### Example Custom Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AdvancedToken is ERC20, ReentrancyGuard, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public maxSupply;
    mapping(address => uint256) public mintedAmount;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply
    ) ERC20(name, symbol) {
        maxSupply = _maxSupply;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
        nonReentrant 
    {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
        mintedAmount[to] += amount;
    }
}
```

### Testing Before Production

#### Local Testing (Recommended)

1. **Start Hardhat Node**:
```bash
cd arc_ecosystem
npx hardhat node
```

2. **Deploy to Localhost**:
   - Select "Localhost" network in IDE
   - Deploy contract
   - Test all functions

3. **Verify Functionality**:
   - Call contract functions
   - Test edge cases
   - Check events and logs

#### Testnet Deployment

1. **Get Test Tokens**:
   - Base Sepolia: Use faucet
   - Switch wallet to testnet

2. **Deploy**:
   - Select "Base Sepolia" network
   - Deploy with test parameters
   - Verify contract works as expected

3. **Community Testing**:
   - Share testnet address
   - Get feedback
   - Fix issues before mainnet

---

## Best Practices

### Security

✅ **DO:**
- Use OpenZeppelin contracts for standards
- Add ReentrancyGuard to payable functions
- Implement access control (Ownable/AccessControl)
- Test thoroughly on testnet first
- Verify contracts on block explorer
- Use multi-sig for admin functions

❌ **DON'T:**
- Deploy untested contracts to mainnet
- Use deprecated Solidity features
- Ignore compiler warnings
- Deploy without proper access controls
- Skip security audits for production

### Gas Optimization

✅ **Optimize:**
- Use `uint256` instead of smaller uints
- Pack storage variables efficiently
- Use `calldata` for function parameters
- Batch operations when possible
- Use events instead of storage for logs

### Code Quality

✅ **Maintain:**
- Clear, descriptive variable names
- Comprehensive comments (NatSpec)
- Consistent code style
- Modular function design
- Proper error messages

---

## Troubleshooting

### Compilation Errors

**Error: "Cannot find module '@openzeppelin/contracts'"**
- **Solution**: Ensure you have OpenZeppelin installed locally
- **Note**: IDE templates assume OpenZeppelin is available

**Error: "Parser error: Expected pragma"**
- **Solution**: Add SPDX license and pragma to top of file:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
```

**Error: "Identifier not found or not unique"**
- **Solution**: Check import paths and contract names
- **Verify**: All imported contracts exist

### Deployment Errors

**Error: "MetaMask not detected"**
- **Solution**: Install MetaMask browser extension
- **Alternative**: Use WalletConnect (future feature)

**Error: "Insufficient funds for gas"**
- **Solution**: Add ETH/tokens to your wallet
- **Check**: Current gas prices on network

**Error: "Transaction failed"**
- **Cause**: Constructor reverted or out of gas
- **Solution**: Check constructor logic and increase gas limit

**Error: "User rejected transaction"**
- **Solution**: Click "Confirm" in MetaMask
- **Note**: Transaction will timeout after 2 minutes

### Network Issues

**Error: "Network mismatch"**
- **Solution**: Switch MetaMask to correct network
- **Verify**: Network selector matches MetaMask

**Error: "RPC error"**
- **Solution**: Try different RPC endpoint
- **Check**: Network status page

---

## Integration with ARC Ecosystem

### Deploying ARC-Compatible Tokens

#### ARCx V2 Token Template

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract MyARCToken is ERC20Upgradeable, AccessControlUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    function initialize(
        string memory name,
        string memory symbol,
        address admin
    ) public initializer {
        __ERC20_init(name, symbol);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
```

### Governance Integration

Deploy Governor contracts compatible with ARCx V2:

```solidity
// Use Governor template from IDE
// Customize voting parameters
// Link to ARCx V2 token for voting power
```

### NFT Ecosystem Integration

Deploy NFTs compatible with ARC NFT system:

```solidity
// Use ERC721 template
// Add trait attachment system
// Integrate with TraitVault if needed
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current contract |
| `Ctrl/Cmd + K` | Compile contract |
| `Ctrl/Cmd + D` | Deploy contract |
| `Ctrl/Cmd + L` | Clear console |
| `Ctrl/Cmd + /` | Toggle comments |

*(Future feature - not yet implemented)*

---

## API Reference

### Contract Templates

#### `templates.erc20`
Standard ERC20 token with:
- `name`: Token name
- `symbol`: Token symbol
- `initialSupply`: Initial token supply
- `mint()`: Owner-only minting function

#### `templates.erc721`
NFT with URI storage:
- `name`: Collection name
- `symbol`: Collection symbol
- `safeMint()`: Safe minting with URI
- `tokenURI()`: Get token metadata

#### `templates.sbt`
Soulbound token:
- `name`: Token name
- `symbol`: Token symbol
- `mint()`: Mint non-transferable token
- Transfer blocking built-in

#### `templates.erc1155`
Multi-token standard:
- URI template configuration
- `mint()`: Single token minting
- `mintBatch()`: Batch minting

#### `templates.governor`
Governance system:
- `token`: Governance token address
- `name`: Governor name
- Voting configuration (delay, period, threshold)

---

## Future Features

### Planned Enhancements

- [ ] **Code Completion**: IntelliSense for Solidity
- [ ] **Syntax Highlighting**: Full color coding
- [ ] **Debugger**: Step-through debugging
- [ ] **Gas Estimator**: Real-time gas cost preview
- [ ] **Contract Verification**: Auto-verify on Etherscan
- [ ] **Version Control**: Git integration
- [ ] **Collaboration**: Multi-user editing
- [ ] **Template Marketplace**: Community templates
- [ ] **AI Assistant**: Code suggestions and security checks

### Integration Roadmap

- [ ] **Hardhat Integration**: Direct deployment from local environment
- [ ] **Foundry Support**: Forge-based deployment
- [ ] **IPFS Upload**: Metadata hosting
- [ ] **Subgraph Generation**: Auto-generate indexing
- [ ] **Frontend Generation**: Auto-create React interface

---

## Support & Resources

### Documentation
- **Main README**: `../README.md`
- **Security Audit**: `./COMPREHENSIVE_SECURITY_AUDIT.md`
- **Deployment Guide**: `../environment/DEPLOYMENT_README.md`

### Community
- **GitHub**: [arc_ecosystem](https://github.com/Artifact-Virtual/arc_ecosystem)
- **Discord**: Join ARC community
- **Twitter**: Follow updates

### Getting Help
- **Issues**: Report bugs on GitHub
- **Questions**: Ask in Discord
- **Security**: security@arcexchange.io

---

## Contributing

### Report Issues
1. Use GitHub issue tracker
2. Include IDE version, browser, and error message
3. Provide steps to reproduce

### Suggest Features
1. Open feature request on GitHub
2. Describe use case and benefits
3. Provide examples if possible

### Submit Code
1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

---

## License

MIT License - See LICENSE file

---

## Changelog

### v1.0.0 (2026-01-02)
- Initial release
- 5 contract templates
- Basic compilation and deployment
- MetaMask integration
- Multi-network support
- Real-time console

---

**Last Updated:** January 2, 2026  
**Version:** 1.0.0  
**Maintainer:** ARC Team

---

*For the most up-to-date information, always refer to the official documentation at `/docs/`*
