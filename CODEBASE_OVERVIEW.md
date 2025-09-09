# Codebase overview — Devs & Contributors

*Generated: 2025-09-09T03:20:00.774578 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **197**
- Total size: **21.8MB**

## Top-level directories

- **.eslintrc.json** — 1 files, 827.0B
- **.githooks** — 2 files, 2.7KB
- **.github** — 5 files, 13.2KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **.openzeppelin** — 1 files, 22.9KB
- **.prettierrc.json** — 1 files, 199.0B
- **address.book** — 1 files, 3.6KB
- **audit** — 3 files, 18.0KB
- **auto_audit.ps1** — 1 files, 3.0KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 23.3KB
- **contracts** — 60 files, 441.4KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **deployment** — 1 files, 2.7KB
- **deployment-summary.md** — 1 files, 2.6KB
- **docs** — 58 files, 20.8MB
- **eslint.config.js** — 1 files, 1.6KB
- **gas-report.txt** — 1 files, 9.7KB
- **gas-reports** — 2 files, 41.5KB
- **hardhat.config.ts** — 1 files, 3.8KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 5.1KB
- **README.md** — 1 files, 8.6KB
- **run-audit-and-append.ps1** — 1 files, 3.0KB
- **scripts** — 17 files, 79.3KB
- **src** — 3 files, 58.4KB
- **tests** — 19 files, 171.0KB
- **todo** — 1 files, 1.6KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .eslintrc.json

- [.eslintrc.json](.eslintrc.json) — 827.0B / 2025-09-09T03:19:58.728216
### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1.8KB / 2025-09-09T03:19:58.728216
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-09-09T03:19:58.728216
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2025-09-09T03:19:58.728216
- [.github/pull_request_template.md](.github/pull_request_template.md) — 1.5KB / 2025-09-09T03:19:58.728216
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — 1.0KB / 2025-09-09T03:19:58.728216
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-09-09T03:19:58.728216
- [.github/workflows/security.yml](.github/workflows/security.yml) — 9.0KB / 2025-09-09T03:19:58.728216
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-09-09T03:19:58.729216
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-09-09T03:19:58.729216
### .openzeppelin

- [.openzeppelin/base.json](.openzeppelin/base.json) — 22.9KB / 2025-09-09T03:19:58.729216
### .prettierrc.json

- [.prettierrc.json](.prettierrc.json) — 199.0B / 2025-09-09T03:19:58.729216
### address.book

- [address.book](address.book) — 3.6KB / 2025-09-09T03:19:58.729216
### audit

- [audit/README.md](audit/README.md) — 2.3KB / 2025-09-09T03:19:58.729216
- [audit/scripts/generate-report.ts](audit/scripts/generate-report.ts) — 2.8KB / 2025-09-09T03:19:58.729216
- [audit/security-report.md](audit/security-report.md) — 12.9KB / 2025-09-09T03:19:58.729216
### auto_audit.ps1

- [auto_audit.ps1](auto_audit.ps1) — 3.0KB / 2025-09-09T03:19:58.730216
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-09-09T03:19:58.730216
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 23.3KB / 2025-09-09T03:19:58.729216
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2025-09-09T03:19:58.730216
- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 8.7KB / 2025-09-09T03:19:58.730216
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-09-09T03:19:58.730216
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-09-09T03:19:58.730216
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-09-09T03:19:58.730216
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-09-09T03:19:58.730216
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-09-09T03:19:58.730216
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-09-09T03:19:58.730216
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 19.8KB / 2025-09-09T03:19:58.730216
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-09-09T03:19:58.731215
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-09-09T03:19:58.731215
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-09-09T03:19:58.731215
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-09-09T03:19:58.731215
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-09-09T03:19:58.731215
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-09-09T03:19:58.731215
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-09-09T03:19:58.731215
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 16.4KB / 2025-09-09T03:19:58.732215
- [contracts/defi/hooks/ARCxHook.sol](contracts/defi/hooks/ARCxHook.sol) — 0.0B / 2025-09-09T03:19:58.732215
- [contracts/defi/hooks/ARCxLPHook.sol](contracts/defi/hooks/ARCxLPHook.sol) — 9.9KB / 2025-09-09T03:19:58.732215
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 20.3KB / 2025-09-09T03:19:58.732215
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.2KB / 2025-09-09T03:19:58.732215
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-09-09T03:19:58.732215
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-09-09T03:19:58.732215
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-09-09T03:19:58.732215
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 5.5KB / 2025-09-09T03:19:58.732215
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 4.5KB / 2025-09-09T03:19:58.732215
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 1.6KB / 2025-09-09T03:19:58.732215
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-09-09T03:19:58.732215
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-09-09T03:19:58.732215
- [contracts/thirdparty/GasOptimization.sol](contracts/thirdparty/GasOptimization.sol) — 8.6KB / 2025-09-09T03:19:58.732215
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol](contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol) — 3.7KB / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-09-09T03:19:58.733214
- [contracts/tokens/airdrop/ARCxAirdropContract.sol](contracts/tokens/airdrop/ARCxAirdropContract.sol) — 14.2KB / 2025-09-09T03:19:58.733214
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 3.8KB / 2025-09-09T03:19:58.733214
- [contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md](contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md) — 4.8KB / 2025-09-09T03:19:58.733214
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 4.1KB / 2025-09-09T03:19:58.733214
- [contracts/tokens/arc-x/ARCxMath.sol](contracts/tokens/arc-x/ARCxMath.sol) — 1.8KB / 2025-09-09T03:19:58.733214
- [contracts/tokens/arc-x/ARCxV2.sol](contracts/tokens/arc-x/ARCxV2.sol) — 16.1KB / 2025-09-09T03:19:58.734214
- [contracts/tokens/arc-x/GasOptimizedARCx.sol](contracts/tokens/arc-x/GasOptimizedARCx.sol) — 8.4KB / 2025-09-09T03:19:58.734214
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-09-09T03:19:58.734214
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-09-09T03:19:58.734214
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 14.3KB / 2025-09-09T03:19:58.734214
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 18.6KB / 2025-09-09T03:19:58.734214
- [contracts/tokens/vesting/ARCxVestingContract.sol](contracts/tokens/vesting/ARCxVestingContract.sol) — 13.7KB / 2025-09-09T03:19:58.734214
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-09-09T03:19:58.734214
- [css/style.css](css/style.css) — 14.3KB / 2025-09-09T03:19:58.734214
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-09-09T03:19:58.735214
### deployment-summary.md

- [deployment-summary.md](deployment-summary.md) — 2.6KB / 2025-09-09T03:19:58.735214
### deployment

- [deployment/base/vesting-init-batch.json](deployment/base/vesting-init-batch.json) — 2.7KB / 2025-09-09T03:19:58.735214
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-09-09T03:19:58.735214
- [docs/archive/README.md](docs/archive/README.md) — 350.0B / 2025-09-09T03:19:58.735214
- [docs/archive/README_legacy_full.md](docs/archive/README_legacy_full.md) — 11.6KB / 2025-09-09T03:19:58.735214
- [docs/arcx-v2-enhanced-features.md](docs/arcx-v2-enhanced-features.md) — 5.7KB / 2025-09-09T03:19:58.735214
- [docs/assets/images/SBT_bg.jpeg](docs/assets/images/SBT_bg.jpeg) — 85.9KB / 2025-09-09T03:19:58.736213
- [docs/assets/images/system_diagram20250830.drawio](docs/assets/images/system_diagram20250830.drawio) — 46.0KB / 2025-09-09T03:19:58.736213
- [docs/assets/images/system_overview.mermaid](docs/assets/images/system_overview.mermaid) — 6.6KB / 2025-09-09T03:19:58.736213
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-09-09T03:19:58.739213
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-09-09T03:19:58.750209
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-09-09T03:19:58.752208
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-09-09T03:19:58.754207
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-09-09T03:19:58.755207
- [docs/assets/logos/arcx_logo.png](docs/assets/logos/arcx_logo.png) — 1.4MB / 2025-09-09T03:19:58.758206
- [docs/assets/logos/arcx_logo.svg](docs/assets/logos/arcx_logo.svg) — 1.2MB / 2025-09-09T03:19:58.763204
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-09-09T03:19:58.763204
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-09-09T03:19:58.763204
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-09-09T03:19:58.763204
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-09-09T03:19:58.763204
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-09-09T03:19:58.763204
- [docs/community_message.md](docs/community_message.md) — 5.9KB / 2025-09-09T03:19:58.763204
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-09-09T03:19:58.764204
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-09-09T03:19:58.764204
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-09-09T03:19:58.764204
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-09-09T03:19:58.764204
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2025-09-09T03:19:58.764204
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-09-09T03:19:58.764204
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-09-09T03:19:58.764204
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2025-09-09T03:19:58.764204
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 3.0KB / 2025-09-09T03:19:58.764204
- [docs/GAS_OPTIMIZATION_REPORT.md](docs/GAS_OPTIMIZATION_REPORT.md) — 3.9KB / 2025-09-09T03:19:58.735214
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-09-09T03:19:58.766203
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-09-09T03:19:58.768203
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-09-09T03:19:58.769202
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-09-09T03:19:58.771202
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-09-09T03:19:58.772201
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-09-09T03:19:58.772201
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-09-09T03:19:58.774201
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-09-09T03:19:58.774201
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-09-09T03:19:58.774201
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-09-09T03:19:58.774201
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-09-09T03:19:58.774201
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-09-09T03:19:58.774201
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-09-09T03:19:58.774201
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-09-09T03:19:58.774201
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-09-09T03:19:58.774201
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-09-09T03:19:58.774201
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-09-09T03:19:58.774201
- [docs/index.html](docs/index.html) — 21.4KB / 2025-09-09T03:19:58.774201
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-09-09T03:19:58.774201
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-09-09T03:19:58.775200
- [docs/real_world_assets.md](docs/real_world_assets.md) — 12.7KB / 2025-09-09T03:19:58.775200
- [docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md) — 18.5KB / 2025-09-09T03:19:58.735214
- [docs/SECURITY.md](docs/SECURITY.md) — 3.2KB / 2025-09-09T03:19:58.735214
- [docs/SYSTEM_STATUS.md](docs/SYSTEM_STATUS.md) — 8.3KB / 2025-09-09T03:19:58.735214
- [docs/tokenlists/arcx.tokenlist.json](docs/tokenlists/arcx.tokenlist.json) — 905.0B / 2025-09-09T03:19:58.775200
- [docs/tokenlists/README.md](docs/tokenlists/README.md) — 947.0B / 2025-09-09T03:19:58.775200
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-09-09T03:19:58.775200
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-09-09T03:19:58.775200
### eslint.config.js

- [eslint.config.js](eslint.config.js) — 1.6KB / 2025-09-09T03:19:58.775200
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 9.7KB / 2025-09-09T03:19:58.775200
### gas-reports

- [gas-reports/gas-analysis-1756553019749.json](gas-reports/gas-analysis-1756553019749.json) — 20.7KB / 2025-09-09T03:19:58.775200
- [gas-reports/gas-analysis-1756553056888.json](gas-reports/gas-analysis-1756553056888.json) — 20.7KB / 2025-09-09T03:19:58.775200
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 3.8KB / 2025-09-09T03:19:58.775200
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-09-09T03:19:58.776200
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-09-09T03:19:58.776200
- [js/auction.js](js/auction.js) — 14.0KB / 2025-09-09T03:19:58.776200
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-09-09T03:19:58.729216
### package.json

- [package.json](package.json) — 5.1KB / 2025-09-09T03:19:58.776200
### README.md

- [README.md](README.md) — 8.6KB / 2025-09-09T03:19:58.729216
### run-audit-and-append.ps1

- [run-audit-and-append.ps1](run-audit-and-append.ps1) — 3.0KB / 2025-09-09T03:19:58.776200
### scripts

- [scripts/check-lp-compat.ts](scripts/check-lp-compat.ts) — 2.1KB / 2025-09-09T03:19:58.777200
- [scripts/check-vesting-status.ts](scripts/check-vesting-status.ts) — 2.7KB / 2025-09-09T03:19:58.777200
- [scripts/configure-lp-compat.ts](scripts/configure-lp-compat.ts) — 2.7KB / 2025-09-09T03:19:58.777200
- [scripts/deploy-hook.ts](scripts/deploy-hook.ts) — 74.0B / 2025-09-09T03:19:58.777200
- [scripts/deploy-infrastructure.ts](scripts/deploy-infrastructure.ts) — 3.5KB / 2025-09-09T03:19:58.777200
- [scripts/deploy-proper-token.ts](scripts/deploy-proper-token.ts) — 2.4KB / 2025-09-09T03:19:58.777200
- [scripts/distribute-tokens.ts](scripts/distribute-tokens.ts) — 3.9KB / 2025-09-09T03:19:58.777200
- [scripts/find-admins.ts](scripts/find-admins.ts) — 1.8KB / 2025-09-09T03:19:58.777200
- [scripts/grant-admin-and-exempt.ts](scripts/grant-admin-and-exempt.ts) — 2.3KB / 2025-09-09T03:19:58.777200
- [scripts/grant-exemptions.ts](scripts/grant-exemptions.ts) — 2.7KB / 2025-09-09T03:19:58.777200
- [scripts/grant-more-exemptions.ts](scripts/grant-more-exemptions.ts) — 2.1KB / 2025-09-09T03:19:58.777200
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-09-09T03:19:58.777200
- [scripts/README.md](scripts/README.md) — 6.3KB / 2025-09-09T03:19:58.777200
- [scripts/scan-token-balances.ts](scripts/scan-token-balances.ts) — 4.8KB / 2025-09-09T03:19:58.777200
- [scripts/setup-vesting-and-finalize.ts](scripts/setup-vesting-and-finalize.ts) — 4.9KB / 2025-09-09T03:19:58.777200
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2025-09-09T03:19:58.777200
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 8.1KB / 2025-09-09T03:19:58.777200
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-09-09T03:19:58.778199
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-09-09T03:19:58.778199
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-09-09T03:19:58.778199
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-09-09T03:19:58.778199
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-09-09T03:19:58.778199
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-09-09T03:19:58.778199
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-09-09T03:19:58.778199
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-09-09T03:19:58.778199
- [tests/fuzz/ContractInvariants.t.sol](tests/fuzz/ContractInvariants.t.sol) — 14.5KB / 2025-09-09T03:19:58.778199
- [tests/governance/TimelockRoles.test.ts](tests/governance/TimelockRoles.test.ts) — 7.0KB / 2025-09-09T03:19:58.778199
- [tests/integration/integration.test.ts](tests/integration/integration.test.ts) — 14.9KB / 2025-09-09T03:19:58.778199
- [tests/mocha.opts](tests/mocha.opts) — 140.0B / 2025-09-09T03:19:58.778199
- [tests/security/AdamHostSecurity.test.ts](tests/security/AdamHostSecurity.test.ts) — 12.1KB / 2025-09-09T03:19:58.779199
- [tests/security/AdamRegistrySecurity.test.ts](tests/security/AdamRegistrySecurity.test.ts) — 14.6KB / 2025-09-09T03:19:58.779199
- [tests/security/ARCBridgeSecurity.test.ts](tests/security/ARCBridgeSecurity.test.ts) — 10.9KB / 2025-09-09T03:19:58.779199
- [tests/security/ARCGovernorSecurity.test.ts](tests/security/ARCGovernorSecurity.test.ts) — 10.3KB / 2025-09-09T03:19:58.779199
- [tests/security/ARCTimelockSecurity.test.ts](tests/security/ARCTimelockSecurity.test.ts) — 8.1KB / 2025-09-09T03:19:58.779199
- [tests/security/BridgeSecurity.test.ts](tests/security/BridgeSecurity.test.ts) — 3.0KB / 2025-09-09T03:19:58.779199
- [tests/security/security.test.ts](tests/security/security.test.ts) — 18.9KB / 2025-09-09T03:19:58.779199
- [tests/security/TokenSecurity.test.ts](tests/security/TokenSecurity.test.ts) — 4.1KB / 2025-09-09T03:19:58.779199
- [tests/shared/test-helpers.ts](tests/shared/test-helpers.ts) — 6.0KB / 2025-09-09T03:19:58.779199
- [tests/test_results.md](tests/test_results.md) — 3.9KB / 2025-09-09T03:19:58.779199
### todo

- [todo](todo) — 1.6KB / 2025-09-09T03:19:58.779199
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-09-09T03:19:58.779199
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-09-09T03:19:58.779199
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-09-09T03:19:58.779199

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.