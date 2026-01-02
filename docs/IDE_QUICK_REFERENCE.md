# ARC Contract IDE - Quick Reference

## 🚀 Quick Start (3 Steps)

1. **Open IDE**: `docs/contract_deployment_ide.html`
2. **Connect Wallet**: Click "Connect Wallet" → Approve MetaMask
3. **Deploy**: Select Template → Compile → Fill Parameters → Deploy

---

## 📝 Templates Available

| Template | Use Case | Key Features |
|----------|----------|--------------|
| **ERC20** | Fungible tokens | Standard token with minting |
| **ERC721** | NFTs | Non-fungible with metadata |
| **ERC1155** | Multi-token | Gaming assets, collections |
| **SBT** | Credentials | Non-transferable identity |
| **Governor** | DAO | Governance voting system |

---

## 🌐 Supported Networks

- **Base Mainnet** (Production) - Chain ID: 8453
- **Base Sepolia** (Testnet) - For testing
- **Ethereum Mainnet** - Cross-chain ops
- **Localhost** - Local development

---

## ⚙️ Compilation Settings

**Solidity Version**
- Use: `0.8.21` (recommended)
- Why: Latest security features

**Optimization**
- Production: `200 runs` (enabled)
- Development: `Disabled` (easier debugging)

---

## 🎯 Common Workflows

### Workflow 1: Deploy ERC20 Token
```
1. Click "ERC20 Token" template
2. Change contract name (optional)
3. Click "Compile Contract"
4. Enter constructor parameters:
   - name: "My Token"
   - symbol: "MTK"  
   - initialSupply: 1000000
5. Click "Deploy Contract"
6. Approve in MetaMask
7. Copy deployed address from console
```

### Workflow 2: Deploy NFT Collection
```
1. Click "ERC721 NFT" template
2. Modify if needed
3. Compile
4. Enter:
   - name: "My NFT Collection"
   - symbol: "MNFT"
5. Deploy
6. Mint NFTs using safeMint() function
```

### Workflow 3: Deploy Soulbound Token
```
1. Click "Soulbound Token" template
2. Review transfer restrictions
3. Compile
4. Enter:
   - name: "Identity Badge"
   - symbol: "IDB"
5. Deploy
6. Mint to users with mint() function
```

---

## 🔧 Troubleshooting

### Issue: Compilation Fails
**Fix**: Check Solidity version matches imports
- OpenZeppelin: Use 0.8.0+
- Check `pragma solidity` line

### Issue: MetaMask Not Found
**Fix**: Install MetaMask browser extension
- Chrome: chrome.google.com/webstore
- Firefox: addons.mozilla.org

### Issue: Deployment Fails
**Possible Causes**:
1. Wrong network selected
2. Insufficient gas
3. Wrong parameter types
4. Constructor logic errors

**Solutions**:
1. Match network in IDE and MetaMask
2. Add more ETH to wallet
3. Verify parameter types match constructor
4. Test on localhost first

### Issue: Transaction Pending
**Fix**: Wait or speed up in MetaMask
- Normal: Wait 1-5 minutes
- Urgent: "Speed Up" in MetaMask

---

## 💡 Best Practices

### ✅ DO
- Test on localhost/testnet first
- Use OpenZeppelin contracts
- Add access control (Ownable)
- Verify on block explorer
- Save deployed addresses
- Document constructor parameters

### ❌ DON'T
- Deploy to mainnet without testing
- Use deprecated Solidity features
- Ignore compiler warnings
- Deploy without access controls
- Forget to save deployment info

---

## 📊 Console Messages

| Type | Color | Meaning |
|------|-------|---------|
| ✓ Green | Success | Operation completed |
| ℹ Blue | Info | Status information |
| ⚠️ Red | Error | Failed operation |

---

## 🔐 Security Checklist

Before deploying to mainnet:

- [ ] Tested on localhost
- [ ] Tested on testnet (Base Sepolia)
- [ ] Constructor parameters verified
- [ ] Access control implemented
- [ ] Events emitted for key actions
- [ ] No compiler warnings
- [ ] Gas costs acceptable
- [ ] Documentation complete
- [ ] Team review completed
- [ ] Audit passed (if applicable)

---

## 📞 Support

**Documentation**
- Full Guide: `docs/IDE_USER_GUIDE.md`
- Security Audit: `docs/COMPREHENSIVE_SECURITY_AUDIT.md`
- Main README: `README.md`

**Help**
- GitHub Issues: Report bugs
- Discord: Community support
- Email: security@arcexchange.io

---

## 🎓 Learning Resources

### Solidity Basics
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum.org](https://ethereum.org/developers)

### Smart Contract Security
- [ConsenSys Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security](https://blog.openzeppelin.com/security-audits/)

### Base Network
- [Base Documentation](https://docs.base.org/)
- [Base Scan](https://basescan.org/)

---

## 🚨 Emergency Contacts

**Security Issues**
- Email: security@arcexchange.io
- Response Time: < 24 hours

**Technical Support**
- GitHub: Open an issue
- Discord: #support channel

**Critical Vulnerabilities**
- Immediate: Email security team
- Include: Contract address, issue details, proof of concept

---

## 📈 Version History

**v1.0.0** (2026-01-02)
- Initial release
- 5 contract templates
- Multi-network support
- MetaMask integration

---

## 🎨 Interface Guide

```
┌─────────────────────────────────────────────────────────┐
│  🏛️ ARC Contract IDE        [Wallet] [Network] [Connect]│
├──────────┬─────────────────────────────┬────────────────┤
│          │                             │                │
│ TEMPLATES│        CODE EDITOR          │   COMPILER     │
│          │                             │                │
│ ERC20    │  pragma solidity ^0.8.0;    │ Version: 0.8.21│
│ ERC721   │  contract MyToken {         │ Optimization:  │
│ ERC1155  │    ...                      │ ☑ Enabled      │
│ SBT      │  }                          │ [🔨 Compile]   │
│ Governor │                             │                │
│          │                             │   DEPLOYMENT   │
│ Recent:  │  [Editor] [Compiled]        │                │
│ - none   │                             │ Contract:      │
│          │                             │ [MyToken   ▼]  │
│          │                             │                │
│          │                             │ Parameters:    │
│          │                             │ name: ______   │
│          │                             │ symbol: ____   │
│          │                             │                │
│          │                             │ [📤 Deploy]    │
│          │                             │                │
│          │        CONSOLE              │                │
│          │  ✓ Compiled successfully    │                │
│          │  ✓ Deployed to 0x1234...    │                │
└──────────┴─────────────────────────────┴────────────────┘
```

---

**Print this page for quick reference while developing!**

---

*Last Updated: January 2, 2026*
*Version: 1.0.0*
