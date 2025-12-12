# Codebase overview — Devs & Contributors

*Generated: 2025-12-12T10:06:05.084068 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **264**
- Total size: **22.6MB**

## Top-level directories

- **.eslintrc.json** — 1 files, 827.0B
- **.githooks** — 2 files, 2.7KB
- **.github** — 5 files, 13.9KB
- **.gitignore** — 1 files, 453.0B
- **.npmrc** — 1 files, 237.0B
- **.openzeppelin** — 1 files, 22.9KB
- **.prettierrc.json** — 1 files, 199.0B
- **address.book** — 1 files, 4.3KB
- **arc_preview.html** — 1 files, 17.0KB
- **audit** — 3 files, 18.0KB
- **auto_audit.ps1** — 1 files, 3.0KB
- **check-positions.js** — 1 files, 4.5KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 32.1KB
- **contracts** — 110 files, 611.1KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **deployment** — 1 files, 0.0B
- **docs** — 68 files, 21.4MB
- **eslint.config.js** — 1 files, 1.6KB
- **ganache-db** — 4 files, 112.0B
- **gas-report.txt** — 1 files, 3.6KB
- **gas-reports** — 2 files, 41.5KB
- **hardhat.config.ts** — 1 files, 4.7KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 7.5KB
- **README.md** — 1 files, 12.2KB
- **run-audit-and-append.ps1** — 1 files, 3.0KB
- **scripts** — 18 files, 99.4KB
- **src** — 3 files, 58.4KB
- **tests** — 20 files, 185.3KB
- **tools** — 2 files, 8.1KB
- **trader.py** — 1 files, 6.0KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .eslintrc.json

- [.eslintrc.json](.eslintrc.json) — 827.0B / 2025-12-12T10:06:04.131519
### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1.8KB / 2025-12-12T10:06:04.131519
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-12-12T10:06:04.131519
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2025-12-12T10:06:04.131519
- [.github/pull_request_template.md](.github/pull_request_template.md) — 1.5KB / 2025-12-12T10:06:04.131519
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — 1.7KB / 2025-12-12T10:06:04.131519
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-12-12T10:06:04.131519
- [.github/workflows/security.yml](.github/workflows/security.yml) — 9.0KB / 2025-12-12T10:06:04.131519
### .gitignore

- [.gitignore](.gitignore) — 453.0B / 2025-12-12T10:06:04.131519
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-12-12T10:06:04.131519
### .openzeppelin

- [.openzeppelin/base.json](.openzeppelin/base.json) — 22.9KB / 2025-12-12T10:06:04.131519
### .prettierrc.json

- [.prettierrc.json](.prettierrc.json) — 199.0B / 2025-12-12T10:06:04.132519
### address.book

- [address.book](address.book) — 4.3KB / 2025-12-12T10:06:04.132519
### arc_preview.html

- [arc_preview.html](arc_preview.html) — 17.0KB / 2025-12-12T10:06:04.132519
### audit

- [audit/README.md](audit/README.md) — 2.3KB / 2025-12-12T10:06:04.132519
- [audit/scripts/generate-report.ts](audit/scripts/generate-report.ts) — 2.8KB / 2025-12-12T10:06:04.132519
- [audit/security-report.md](audit/security-report.md) — 12.9KB / 2025-12-12T10:06:04.132519
### auto_audit.ps1

- [auto_audit.ps1](auto_audit.ps1) — 3.0KB / 2025-12-12T10:06:04.132519
### check-positions.js

- [check-positions.js](check-positions.js) — 4.5KB / 2025-12-12T10:06:04.133519
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-12-12T10:06:04.133519
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 32.1KB / 2025-12-12T10:06:04.132519
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2025-12-12T10:06:04.133519
- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 8.7KB / 2025-12-12T10:06:04.133519
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-12-12T10:06:04.133519
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-12-12T10:06:04.133519
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-12-12T10:06:04.133519
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-12-12T10:06:04.133519
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-12-12T10:06:04.133519
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-12-12T10:06:04.133519
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 19.8KB / 2025-12-12T10:06:04.133519
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-12-12T10:06:04.134519
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-12-12T10:06:04.134519
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-12-12T10:06:04.134519
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-12-12T10:06:04.134519
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-12-12T10:06:04.134519
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-12-12T10:06:04.134519
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-12-12T10:06:04.134519
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 16.4KB / 2025-12-12T10:06:04.134519
- [contracts/defi/hooks/ARCxHook.sol](contracts/defi/hooks/ARCxHook.sol) — 0.0B / 2025-12-12T10:06:04.135519
- [contracts/defi/hooks/ARCxLPHook.sol](contracts/defi/hooks/ARCxLPHook.sol) — 9.9KB / 2025-12-12T10:06:04.135519
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 20.3KB / 2025-12-12T10:06:04.135519
- [contracts/defi/MockPoolManager.sol](contracts/defi/MockPoolManager.sol) — 3.3KB / 2025-12-12T10:06:04.134519
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.2KB / 2025-12-12T10:06:04.134519
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-12-12T10:06:04.135519
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-12-12T10:06:04.135519
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-12-12T10:06:04.135519
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 5.5KB / 2025-12-12T10:06:04.135519
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 4.5KB / 2025-12-12T10:06:04.135519
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 1.6KB / 2025-12-12T10:06:04.135519
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-12-12T10:06:04.135519
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-12-12T10:06:04.135519
- [contracts/thirdparty/GasOptimization.sol](contracts/thirdparty/GasOptimization.sol) — 8.6KB / 2025-12-12T10:06:04.135519
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-12-12T10:06:04.135519
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol](contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol) — 3.7KB / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-12-12T10:06:04.135519
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-12-12T10:06:04.136519
- [contracts/tokens/airdrop/ARCxAirdropContract.sol](contracts/tokens/airdrop/ARCxAirdropContract.sol) — 14.2KB / 2025-12-12T10:06:04.136519
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 3.8KB / 2025-12-12T10:06:04.136519
- [contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md](contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md) — 4.8KB / 2025-12-12T10:06:04.136519
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 4.1KB / 2025-12-12T10:06:04.136519
- [contracts/tokens/arc-x/ARCxMath.sol](contracts/tokens/arc-x/ARCxMath.sol) — 1.8KB / 2025-12-12T10:06:04.136519
- [contracts/tokens/arc-x/ARCxV2.sol](contracts/tokens/arc-x/ARCxV2.sol) — 16.1KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/arc-x/GasOptimizedARCx.sol](contracts/tokens/arc-x/GasOptimizedARCx.sol) — 8.4KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-12-12T10:06:04.137519
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/MockARCxToken.sol](contracts/tokens/MockARCxToken.sol) — 359.0B / 2025-12-12T10:06:04.136519
- [contracts/tokens/MockWETH.sol](contracts/tokens/MockWETH.sol) — 560.0B / 2025-12-12T10:06:04.136519
- [contracts/tokens/nft/CONTRACT_MAPPING.md](contracts/tokens/nft/CONTRACT_MAPPING.md) — 2.9KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/CompanionGovernance.sol](contracts/tokens/nft/contracts/CompanionGovernance.sol) — 5.2KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/EmergencyManager.sol](contracts/tokens/nft/contracts/EmergencyManager.sol) — 1016.0B / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/EvolvingCompanion.sol](contracts/tokens/nft/contracts/EvolvingCompanion.sol) — 5.0KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/EvolvingCompanionUpgradeable.sol](contracts/tokens/nft/contracts/EvolvingCompanionUpgradeable.sol) — 3.4KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ModelRegistry.sol](contracts/tokens/nft/contracts/ModelRegistry.sol) — 903.0B / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ModelRegistryUpgradeable.sol](contracts/tokens/nft/contracts/ModelRegistryUpgradeable.sol) — 11.6KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ModelRegistryUpgradeableSimple.sol](contracts/tokens/nft/contracts/ModelRegistryUpgradeableSimple.sol) — 1.5KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ModuleManager.sol](contracts/tokens/nft/contracts/ModuleManager.sol) — 1.7KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ModuleMock.sol](contracts/tokens/nft/contracts/ModuleMock.sol) — 1.2KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/contracts/ProverRegistry.sol](contracts/tokens/nft/contracts/ProverRegistry.sol) — 1.0KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/contracts/TokenBoundAccount.sol](contracts/tokens/nft/contracts/TokenBoundAccount.sol) — 2.2KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/contracts/TokenBoundAccountRegistry.sol](contracts/tokens/nft/contracts/TokenBoundAccountRegistry.sol) — 2.3KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/contracts/TraitVault.sol](contracts/tokens/nft/contracts/TraitVault.sol) — 3.9KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/contracts/TraitVaultUpgradeable.sol](contracts/tokens/nft/contracts/TraitVaultUpgradeable.sol) — 3.9KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/.gitignore](contracts/tokens/nft/frontend/.gitignore) — 480.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/data/archetypes.json](contracts/tokens/nft/frontend/data/archetypes.json) — 1.3KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/data/traits.json](contracts/tokens/nft/frontend/data/traits.json) — 1022.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/eslint.config.mjs](contracts/tokens/nft/frontend/eslint.config.mjs) — 524.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/next.config.ts](contracts/tokens/nft/frontend/next.config.ts) — 133.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/package.json](contracts/tokens/nft/frontend/package.json) — 794.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/postcss.config.mjs](contracts/tokens/nft/frontend/postcss.config.mjs) — 81.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/public/file.svg](contracts/tokens/nft/frontend/public/file.svg) — 391.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/public/globe.svg](contracts/tokens/nft/frontend/public/globe.svg) — 1.0KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/public/next.svg](contracts/tokens/nft/frontend/public/next.svg) — 1.3KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/public/vercel.svg](contracts/tokens/nft/frontend/public/vercel.svg) — 128.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/public/window.svg](contracts/tokens/nft/frontend/public/window.svg) — 385.0B / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/README.md](contracts/tokens/nft/frontend/README.md) — 13.3KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/src/app/companion/[id]/page.tsx](contracts/tokens/nft/frontend/src/app/companion/[id]/page.tsx) — 1.2KB / 2025-12-12T10:06:04.138519
- [contracts/tokens/nft/frontend/src/app/favicon.ico](contracts/tokens/nft/frontend/src/app/favicon.ico) — 25.3KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/app/globals.css](contracts/tokens/nft/frontend/src/app/globals.css) — 488.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/app/layout.tsx](contracts/tokens/nft/frontend/src/app/layout.tsx) — 831.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/app/page.tsx](contracts/tokens/nft/frontend/src/app/page.tsx) — 8.5KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/components/CompanionMint.tsx](contracts/tokens/nft/frontend/src/components/CompanionMint.tsx) — 5.7KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/components/CompanionProfile.tsx](contracts/tokens/nft/frontend/src/components/CompanionProfile.tsx) — 13.9KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/components/providers.tsx](contracts/tokens/nft/frontend/src/components/providers.tsx) — 792.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/src/components/TraitGallery.tsx](contracts/tokens/nft/frontend/src/components/TraitGallery.tsx) — 4.8KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/frontend/tsconfig.json](contracts/tokens/nft/frontend/tsconfig.json) — 602.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/hardhat.config.js](contracts/tokens/nft/hardhat.config.js) — 526.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/package.json](contracts/tokens/nft/package.json) — 723.0B / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/README.md](contracts/tokens/nft/README.md) — 11.3KB / 2025-12-12T10:06:04.137519
- [contracts/tokens/nft/scripts/deploy.js](contracts/tokens/nft/scripts/deploy.js) — 1.8KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/scripts/deploy_roles_and_demo.js](contracts/tokens/nft/scripts/deploy_roles_and_demo.js) — 1.8KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/scripts/upgrade.js](contracts/tokens/nft/scripts/upgrade.js) — 1.3KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/test/EvolvingCompanionAccessControl.test.js](contracts/tokens/nft/test/EvolvingCompanionAccessControl.test.js) — 7.0KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/nft/test/phase1.test.js](contracts/tokens/nft/test/phase1.test.js) — 7.7KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 14.3KB / 2025-12-12T10:06:04.139519
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 18.6KB / 2025-12-12T10:06:04.140519
- [contracts/tokens/sbt/readme.md](contracts/tokens/sbt/readme.md) — 3.0KB / 2025-12-12T10:06:04.140519
- [contracts/tokens/vesting/ARCxVestingContract.sol](contracts/tokens/vesting/ARCxVestingContract.sol) — 13.7KB / 2025-12-12T10:06:04.140519
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-12-12T10:06:04.140519
- [css/style.css](css/style.css) — 14.3KB / 2025-12-12T10:06:04.140519
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-12-12T10:06:04.140519
### deployment

- [deployment/testnet/deploy-ganache.ts](deployment/testnet/deploy-ganache.ts) — 0.0B / 2025-12-12T10:06:04.140519
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-12-12T10:06:04.140519
- [docs/archive/README.md](docs/archive/README.md) — 350.0B / 2025-12-12T10:06:04.140519
- [docs/archive/README_legacy_full.md](docs/archive/README_legacy_full.md) — 11.6KB / 2025-12-12T10:06:04.141519
- [docs/arcx-v2-enhanced-features.md](docs/arcx-v2-enhanced-features.md) — 5.7KB / 2025-12-12T10:06:04.141519
- [docs/assets/images/SBT_bg.jpeg](docs/assets/images/SBT_bg.jpeg) — 85.9KB / 2025-12-12T10:06:04.141519
- [docs/assets/images/system_diagram20250830.drawio](docs/assets/images/system_diagram20250830.drawio) — 46.0KB / 2025-12-12T10:06:04.141519
- [docs/assets/images/system_overview.mermaid](docs/assets/images/system_overview.mermaid) — 6.6KB / 2025-12-12T10:06:04.141519
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-12-12T10:06:04.144519
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-12-12T10:06:04.156519
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-12-12T10:06:04.158519
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-12-12T10:06:04.160519
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-12-12T10:06:04.161519
- [docs/assets/logos/arcx_logo.png](docs/assets/logos/arcx_logo.png) — 1.4MB / 2025-12-12T10:06:04.164519
- [docs/assets/logos/arcx_logo.svg](docs/assets/logos/arcx_logo.svg) — 1.2MB / 2025-12-12T10:06:04.169519
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-12-12T10:06:04.169519
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-12-12T10:06:04.169519
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-12-12T10:06:04.169519
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-12-12T10:06:04.169519
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-12-12T10:06:04.169519
- [docs/community_message.md](docs/community_message.md) — 5.9KB / 2025-12-12T10:06:04.169519
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-12-12T10:06:04.170519
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-12-12T10:06:04.170519
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-12-12T10:06:04.170519
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-12-12T10:06:04.170519
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2025-12-12T10:06:04.170519
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-12-12T10:06:04.170519
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-12-12T10:06:04.170519
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2025-12-12T10:06:04.170519
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 3.0KB / 2025-12-12T10:06:04.170519
- [docs/GAS_OPTIMIZATION_REPORT.md](docs/GAS_OPTIMIZATION_REPORT.md) — 3.9KB / 2025-12-12T10:06:04.140519
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-12-12T10:06:04.172519
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-12-12T10:06:04.174519
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-12-12T10:06:04.175519
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-12-12T10:06:04.177519
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-12-12T10:06:04.178519
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-12-12T10:06:04.179519
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-12-12T10:06:04.180519
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-12-12T10:06:04.180519
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-12-12T10:06:04.180519
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-12-12T10:06:04.180519
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-12-12T10:06:04.180519
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-12-12T10:06:04.180519
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-12-12T10:06:04.180519
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-12-12T10:06:04.180519
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-12-12T10:06:04.180519
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-12-12T10:06:04.180519
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-12-12T10:06:04.180519
- [docs/index.html](docs/index.html) — 21.4KB / 2025-12-12T10:06:04.180519
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-12-12T10:06:04.180519
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-12-12T10:06:04.181519
- [docs/real_world_assets.md](docs/real_world_assets.md) — 12.8KB / 2025-12-12T10:06:04.181519
- [docs/research/banking_2.md](docs/research/banking_2.md) — 48.9KB / 2025-12-12T10:06:04.181519
- [docs/research/crypt_vs_banking.md](docs/research/crypt_vs_banking.md) — 68.4KB / 2025-12-12T10:06:04.181519
- [docs/research/dev_thesis.md](docs/research/dev_thesis.md) — 8.6KB / 2025-12-12T10:06:04.182519
- [docs/research/gmi.md](docs/research/gmi.md) — 42.7KB / 2025-12-12T10:06:04.182519
- [docs/research/imf_international_sc.md](docs/research/imf_international_sc.md) — 101.6KB / 2025-12-12T10:06:04.182519
- [docs/research/index.md](docs/research/index.md) — 2.0KB / 2025-12-12T10:06:04.182519
- [docs/research/new_money.md](docs/research/new_money.md) — 27.7KB / 2025-12-12T10:06:04.182519
- [docs/research/sc_revolution.md](docs/research/sc_revolution.md) — 39.0KB / 2025-12-12T10:06:04.183519
- [docs/research/stablecoins.md](docs/research/stablecoins.md) — 229.8KB / 2025-12-12T10:06:04.184519
- [docs/research/tokenization.md](docs/research/tokenization.md) — 6.7KB / 2025-12-12T10:06:04.184519
- [docs/research/tokenization_infra.jpg](docs/research/tokenization_infra.jpg) — 21.6KB / 2025-12-12T10:06:04.184519
- [docs/SECURITY.md](docs/SECURITY.md) — 3.2KB / 2025-12-12T10:06:04.140519
- [docs/SYSTEM_STATUS.md](docs/SYSTEM_STATUS.md) — 12.9KB / 2025-12-12T10:06:04.140519
- [docs/tokenlists/arcx.tokenlist.json](docs/tokenlists/arcx.tokenlist.json) — 905.0B / 2025-12-12T10:06:04.184519
- [docs/tokenlists/README.md](docs/tokenlists/README.md) — 947.0B / 2025-12-12T10:06:04.184519
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-12-12T10:06:04.184519
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-12-12T10:06:04.184519
### eslint.config.js

- [eslint.config.js](eslint.config.js) — 1.6KB / 2025-12-12T10:06:04.184519
### ganache-db

- [ganache-db/CURRENT](ganache-db/CURRENT) — 16.0B / 2025-12-12T10:06:04.184519
- [ganache-db/LOCK](ganache-db/LOCK) — 0.0B / 2025-12-12T10:06:04.184519
- [ganache-db/LOG](ganache-db/LOG) — 46.0B / 2025-12-12T10:06:04.184519
- [ganache-db/MANIFEST-000002](ganache-db/MANIFEST-000002) — 50.0B / 2025-12-12T10:06:04.184519
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 3.6KB / 2025-12-12T10:06:04.184519
### gas-reports

- [gas-reports/gas-analysis-1756553019749.json](gas-reports/gas-analysis-1756553019749.json) — 20.7KB / 2025-12-12T10:06:04.184519
- [gas-reports/gas-analysis-1756553056888.json](gas-reports/gas-analysis-1756553056888.json) — 20.7KB / 2025-12-12T10:06:04.184519
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 4.7KB / 2025-12-12T10:06:04.185519
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-12-12T10:06:04.185519
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-12-12T10:06:04.185519
- [js/auction.js](js/auction.js) — 14.0KB / 2025-12-12T10:06:04.185519
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-12-12T10:06:04.132519
### package.json

- [package.json](package.json) — 7.5KB / 2025-12-12T10:06:04.185519
### README.md

- [README.md](README.md) — 12.2KB / 2025-12-12T10:06:04.132519
### run-audit-and-append.ps1

- [run-audit-and-append.ps1](run-audit-and-append.ps1) — 3.0KB / 2025-12-12T10:06:04.185519
### scripts

- [scripts/airdrop-manager.ts](scripts/airdrop-manager.ts) — 6.9KB / 2025-12-12T10:06:04.186519
- [scripts/check-deployer-nfts-standalone.ts](scripts/check-deployer-nfts-standalone.ts) — 3.0KB / 2025-12-12T10:06:04.186519
- [scripts/check-deployer-nfts.ts](scripts/check-deployer-nfts.ts) — 2.8KB / 2025-12-12T10:06:04.186519
- [scripts/check-lp-compat-fixed.ts](scripts/check-lp-compat-fixed.ts) — 1.7KB / 2025-12-12T10:06:04.186519
- [scripts/check-specific-positions.ts](scripts/check-specific-positions.ts) — 1.9KB / 2025-12-12T10:06:04.186519
- [scripts/check-uniswap-positions.ts](scripts/check-uniswap-positions.ts) — 3.5KB / 2025-12-12T10:06:04.186519
- [scripts/config.ts](scripts/config.ts) — 8.6KB / 2025-12-12T10:06:04.186519
- [scripts/deploy_defi.ts](scripts/deploy_defi.ts) — 2.5KB / 2025-12-12T10:06:04.186519
- [scripts/deployment-manager.ts](scripts/deployment-manager.ts) — 5.7KB / 2025-12-12T10:06:04.186519
- [scripts/ecosystem-manager.ts](scripts/ecosystem-manager.ts) — 8.5KB / 2025-12-12T10:06:04.186519
- [scripts/lp-manager.ts](scripts/lp-manager.ts) — 6.7KB / 2025-12-12T10:06:04.186519
- [scripts/monitor.ts](scripts/monitor.ts) — 8.3KB / 2025-12-12T10:06:04.186519
- [scripts/README.md](scripts/README.md) — 10.2KB / 2025-12-12T10:06:04.186519
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2025-12-12T10:06:04.186519
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 9.7KB / 2025-12-12T10:06:04.186519
- [scripts/transfer-positions.ts](scripts/transfer-positions.ts) — 1.7KB / 2025-12-12T10:06:04.186519
- [scripts/txdata/generate-vesting-txdata.ts](scripts/txdata/generate-vesting-txdata.ts) — 4.8KB / 2025-12-12T10:06:04.186519
- [scripts/vesting-manager.ts](scripts/vesting-manager.ts) — 9.1KB / 2025-12-12T10:06:04.186519
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-12-12T10:06:04.187519
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-12-12T10:06:04.187519
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-12-12T10:06:04.187519
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-12-12T10:06:04.187519
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-12-12T10:06:04.187519
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-12-12T10:06:04.187519
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-12-12T10:06:04.187519
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-12-12T10:06:04.187519
- [tests/fuzz/ContractInvariants.t.sol](tests/fuzz/ContractInvariants.t.sol) — 14.5KB / 2025-12-12T10:06:04.187519
- [tests/governance/TimelockRoles.test.ts](tests/governance/TimelockRoles.test.ts) — 7.0KB / 2025-12-12T10:06:04.187519
- [tests/integration/integration.test.ts](tests/integration/integration.test.ts) — 14.9KB / 2025-12-12T10:06:04.187519
- [tests/mocha.opts](tests/mocha.opts) — 140.0B / 2025-12-12T10:06:04.187519
- [tests/phase1-modules.test.js](tests/phase1-modules.test.js) — 14.3KB / 2025-12-12T10:06:04.188519
- [tests/security/AdamHostSecurity.test.ts](tests/security/AdamHostSecurity.test.ts) — 12.1KB / 2025-12-12T10:06:04.188519
- [tests/security/AdamRegistrySecurity.test.ts](tests/security/AdamRegistrySecurity.test.ts) — 14.6KB / 2025-12-12T10:06:04.188519
- [tests/security/ARCBridgeSecurity.test.ts](tests/security/ARCBridgeSecurity.test.ts) — 10.9KB / 2025-12-12T10:06:04.188519
- [tests/security/ARCGovernorSecurity.test.ts](tests/security/ARCGovernorSecurity.test.ts) — 10.3KB / 2025-12-12T10:06:04.188519
- [tests/security/ARCTimelockSecurity.test.ts](tests/security/ARCTimelockSecurity.test.ts) — 8.1KB / 2025-12-12T10:06:04.188519
- [tests/security/BridgeSecurity.test.ts](tests/security/BridgeSecurity.test.ts) — 3.0KB / 2025-12-12T10:06:04.188519
- [tests/security/security.test.ts](tests/security/security.test.ts) — 18.9KB / 2025-12-12T10:06:04.188519
- [tests/security/TokenSecurity.test.ts](tests/security/TokenSecurity.test.ts) — 4.1KB / 2025-12-12T10:06:04.188519
- [tests/shared/test-helpers.ts](tests/shared/test-helpers.ts) — 6.0KB / 2025-12-12T10:06:04.188519
- [tests/test_results.md](tests/test_results.md) — 3.9KB / 2025-12-12T10:06:04.188519
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-12-12T10:06:04.188519
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-12-12T10:06:04.188519
### trader.py

- [trader.py](trader.py) — 6.0KB / 2025-12-12T10:06:04.188519
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-12-12T10:06:04.188519

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.