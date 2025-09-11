# NFT Contract Functions Mapping

## ✅ EXISTING & MATCHING

### EvolvingCompanionUpgradeable
- ✅ `mint(address to, string uri)` - exists, returns uint256
- ✅ `getTokenBoundAccount(uint256 tokenId)` - exists, returns address
- ✅ `gainXP(uint256 tokenId, uint256 amount)` - exists, onlyRole(MODULE_ROLE)
- ✅ Events: `MintWithAccount`, `XPChanged` - exist

### ProverRegistry
- ✅ `slashProver(address prover, uint256 amount)` - exists, onlyOwner
- ✅ `proverStake(address prover)` - exists, view returns uint256

### EmergencyManager
- ✅ `pause()` - exists, onlyOwner
- ✅ `unpause()` - exists, onlyOwner
- ✅ `freezeTokenBoundAccount(uint256 tokenId)` - exists, onlyOwner

## ⚠️ EXISTING BUT DIFFERENT SIGNATURES

### ModelRegistry (vs Interface)
- ❌ `submitModelUpdate(...)` - **MISSING**
- ⚠️ `appendDataNode(bytes32 dataHash, bytes32[] parentRoots)` - exists but different params than interface
- ❌ `modelRoot` variable - **MISSING**

### ERC1155TraitVault (TraitVaultUpgradeable)
- ⚠️ `mintTrait(address to, uint256 traitId, uint256 amount, string name)` - exists but takes 4 params vs 3 in interface
- ⚠️ `attachTrait(uint256 tokenId, uint256 traitId, uint256 amount)` - exists but takes 3 params vs 2 in interface

### ProverRegistry
- ⚠️ `registerProver()` - exists but takes no params and is payable vs interface

## ❌ MISSING FUNCTIONS

### EvolvingCompanionUpgradeable
- ❌ `attachTrait(uint256 tokenId, uint256 traitId)` - **MISSING** (should call TraitVault)

### ModelRegistry
- ❌ `submitModelUpdate(bytes, bytes, bytes32, bytes32[])` - **MISSING**
- ❌ `modelRoot` public variable - **MISSING**

### EmergencyManager
- ❌ `rollbackModelRoot(bytes32 root)` - **MISSING**

## 🔧 RECOMMENDED FIXES

1. **Add missing `attachTrait` to EvolvingCompanionUpgradeable** - should integrate with TraitVault
2. **Fix ModelRegistry compilation** - resolve `createModel` visibility issue
3. **Add missing ModelRegistry functions** or update interface to match existing
4. **Add missing EmergencyManager functions** or update interface
5. **Update interface signatures** to match actual implementations

## 📋 CONTRACT INTEGRATION MAP

```
EvolvingCompanionUpgradeable
├── TokenBoundAccountRegistry (creates accounts)
├── TraitVaultUpgradeable (for trait attachment)
└── ModuleMock (for minting & XP via roles)

TraitVaultUpgradeable
├── EvolvingCompanionUpgradeable (checks ownership)
└── ERC1155 standard (trait tokens)

ModuleMock
├── EvolvingCompanionUpgradeable (granted MINTER_ROLE, MODULE_ROLE)
└── External callers (saleMint, grantXP)

ModelRegistryUpgradeableSimple
└── Standalone (simplified model storage)
```

## To Do

1. Fix ModelRegistry compilation error
2. Add missing `attachTrait` function to EvolvingCompanion
3. Update interfaces.md to match actual implementations
4. Test full integration flow</content>
<parameter name="filePath">l:\worxpace\arc_ecosystem\contracts\dao\nft\CONTRACT_MAPPING.md
