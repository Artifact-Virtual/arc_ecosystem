# Codebase overview — Devs & Contributors

*Generated: 2025-09-07T19:27:47.244994 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **187**
- Total size: **20.7MB**

## Top-level directories

- **.eslintrc.json** — 1 files, 827.0B
- **.githooks** — 2 files, 2.7KB
- **.github** — 5 files, 13.2KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **.openzeppelin** — 1 files, 22.9KB
- **.prettierrc.json** — 1 files, 199.0B
- **address.book** — 1 files, 3.0KB
- **audit** — 2 files, 5.0KB
- **audits** — 1 files, 15.2KB
- **auto_audit.ps1** — 1 files, 3.0KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 23.0KB
- **contracts** — 58 files, 421.0KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **deployment-summary.md** — 1 files, 2.6KB
- **DEPLOYMENT_GUIDE.md** — 1 files, 4.6KB
- **DEPLOYMENT_SUCCESS.md** — 1 files, 3.7KB
- **docs** — 56 files, 19.8MB
- **eslint.config.js** — 1 files, 1.6KB
- **gas-report.txt** — 1 files, 9.7KB
- **gas-reports** — 2 files, 41.5KB
- **hardhat.config.ts** — 1 files, 3.8KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 5.1KB
- **README.md** — 1 files, 15.6KB
- **RECOVERY_REPORT.md** — 1 files, 5.5KB
- **run-audit-and-append.ps1** — 1 files, 3.0KB
- **scripts** — 9 files, 60.7KB
- **src** — 3 files, 58.4KB
- **tests** — 19 files, 171.0KB
- **todo** — 1 files, 1.6KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .eslintrc.json

- [.eslintrc.json](.eslintrc.json) — 827.0B / 2025-09-07T19:27:46.139977
### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1.8KB / 2025-09-07T19:27:46.139977
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-09-07T19:27:46.139977
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2025-09-07T19:27:46.139977
- [.github/pull_request_template.md](.github/pull_request_template.md) — 1.5KB / 2025-09-07T19:27:46.139977
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — 1.0KB / 2025-09-07T19:27:46.139977
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-09-07T19:27:46.139977
- [.github/workflows/security.yml](.github/workflows/security.yml) — 9.0KB / 2025-09-07T19:27:46.139977
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-09-07T19:27:46.139977
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-09-07T19:27:46.139977
### .openzeppelin

- [.openzeppelin/base.json](.openzeppelin/base.json) — 22.9KB / 2025-09-07T19:27:46.139977
### .prettierrc.json

- [.prettierrc.json](.prettierrc.json) — 199.0B / 2025-09-07T19:27:46.139977
### address.book

- [address.book](address.book) — 3.0KB / 2025-09-07T19:27:46.140977
### audit

- [audit/README.md](audit/README.md) — 2.3KB / 2025-09-07T19:27:46.140977
- [audit/scripts/generate-report.ts](audit/scripts/generate-report.ts) — 2.8KB / 2025-09-07T19:27:46.140977
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-09-07T19:27:46.141977
### auto_audit.ps1

- [auto_audit.ps1](auto_audit.ps1) — 3.0KB / 2025-09-07T19:27:46.141977
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-09-07T19:27:46.141977
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 23.0KB / 2025-09-07T19:27:46.140977
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2025-09-07T19:27:46.141977
- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 8.7KB / 2025-09-07T19:27:46.141977
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-09-07T19:27:46.141977
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-09-07T19:27:46.141977
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-09-07T19:27:46.141977
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-09-07T19:27:46.141977
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-09-07T19:27:46.141977
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-09-07T19:27:46.141977
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 18.8KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-09-07T19:27:46.142977
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-09-07T19:27:46.142977
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-09-07T19:27:46.143977
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 15.2KB / 2025-09-07T19:27:46.143977
- [contracts/defi/hooks/ARCxLPHook.sol](contracts/defi/hooks/ARCxLPHook.sol) — 8.7KB / 2025-09-07T19:27:46.143977
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 19.0KB / 2025-09-07T19:27:46.143977
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.2KB / 2025-09-07T19:27:46.143977
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-09-07T19:27:46.143977
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-09-07T19:27:46.143977
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-09-07T19:27:46.143977
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 4.3KB / 2025-09-07T19:27:46.143977
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 3.4KB / 2025-09-07T19:27:46.143977
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-09-07T19:27:46.143977
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-09-07T19:27:46.143977
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-09-07T19:27:46.143977
- [contracts/thirdparty/GasOptimization.sol](contracts/thirdparty/GasOptimization.sol) — 8.6KB / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-09-07T19:27:46.144977
- [contracts/tokens/airdrop/ARCxAirdropContract.sol](contracts/tokens/airdrop/ARCxAirdropContract.sol) — 12.9KB / 2025-09-07T19:27:46.144977
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 2.5KB / 2025-09-07T19:27:46.144977
- [contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md](contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md) — 4.8KB / 2025-09-07T19:27:46.144977
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 4.1KB / 2025-09-07T19:27:46.144977
- [contracts/tokens/arc-x/ARCxMath.sol](contracts/tokens/arc-x/ARCxMath.sol) — 546.0B / 2025-09-07T19:27:46.145977
- [contracts/tokens/arc-x/ARCxV2.sol](contracts/tokens/arc-x/ARCxV2.sol) — 14.8KB / 2025-09-07T19:27:46.145977
- [contracts/tokens/arc-x/GasOptimizedARCx.sol](contracts/tokens/arc-x/GasOptimizedARCx.sol) — 8.4KB / 2025-09-07T19:27:46.145977
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-09-07T19:27:46.145977
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-09-07T19:27:46.145977
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 13.2KB / 2025-09-07T19:27:46.145977
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 17.5KB / 2025-09-07T19:27:46.145977
- [contracts/tokens/vesting/ARCxVestingContract.sol](contracts/tokens/vesting/ARCxVestingContract.sol) — 12.5KB / 2025-09-07T19:27:46.145977
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-09-07T19:27:46.145977
- [css/style.css](css/style.css) — 14.3KB / 2025-09-07T19:27:46.145977
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-09-07T19:27:46.146977
### deployment-summary.md

- [deployment-summary.md](deployment-summary.md) — 2.6KB / 2025-09-07T19:27:46.150977
### DEPLOYMENT_GUIDE.md

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — 4.6KB / 2025-09-07T19:27:46.140977
### DEPLOYMENT_SUCCESS.md

- [DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md) — 3.7KB / 2025-09-07T19:27:46.140977
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-09-07T19:27:46.150977
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-09-07T19:27:46.150977
- [docs/arcx-v2-enhanced-features.md](docs/arcx-v2-enhanced-features.md) — 5.9KB / 2025-09-07T19:27:46.151977
- [docs/assets/images/download (1).jpeg](docs/assets/images/download (1).jpeg) — 34.9KB / 2025-09-07T19:27:46.151977
- [docs/assets/images/download (2).jpeg](docs/assets/images/download (2).jpeg) — 61.4KB / 2025-09-07T19:27:46.151977
- [docs/assets/images/download (3).jpeg](docs/assets/images/download (3).jpeg) — 56.7KB / 2025-09-07T19:27:46.152977
- [docs/assets/images/download.jpeg](docs/assets/images/download.jpeg) — 85.9KB / 2025-09-07T19:27:46.152977
- [docs/assets/images/system_diagram20250830.drawio](docs/assets/images/system_diagram20250830.drawio) — 46.0KB / 2025-09-07T19:27:46.152977
- [docs/assets/images/system_overview.mermaid](docs/assets/images/system_overview.mermaid) — 6.6KB / 2025-09-07T19:27:46.152977
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-09-07T19:27:46.155977
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-09-07T19:27:46.167977
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-09-07T19:27:46.169977
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-09-07T19:27:46.170977
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-09-07T19:27:46.172977
- [docs/assets/logos/arcx_logo1-modified.png](docs/assets/logos/arcx_logo1-modified.png) — 1.4MB / 2025-09-07T19:27:46.175977
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-09-07T19:27:46.175977
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-09-07T19:27:46.175977
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-09-07T19:27:46.175977
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-09-07T19:27:46.175977
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-09-07T19:27:46.176977
- [docs/community_message.md](docs/community_message.md) — 5.9KB / 2025-09-07T19:27:46.176977
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-09-07T19:27:46.176977
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-09-07T19:27:46.176977
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-09-07T19:27:46.176977
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-09-07T19:27:46.177978
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2025-09-07T19:27:46.177978
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-09-07T19:27:46.177978
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-09-07T19:27:46.177978
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2025-09-07T19:27:46.177978
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-09-07T19:27:46.177978
- [docs/GAS_OPTIMIZATION_REPORT.md](docs/GAS_OPTIMIZATION_REPORT.md) — 3.9KB / 2025-09-07T19:27:46.150977
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-09-07T19:27:46.178977
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-09-07T19:27:46.180978
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-09-07T19:27:46.182977
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-09-07T19:27:46.183978
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-09-07T19:27:46.185977
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-09-07T19:27:46.185977
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-09-07T19:27:46.186978
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-09-07T19:27:46.186978
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-09-07T19:27:46.186978
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-09-07T19:27:46.186978
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-09-07T19:27:46.186978
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-09-07T19:27:46.186978
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-09-07T19:27:46.186978
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-09-07T19:27:46.186978
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-09-07T19:27:46.187978
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-09-07T19:27:46.186978
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-09-07T19:27:46.187978
- [docs/index.html](docs/index.html) — 21.4KB / 2025-09-07T19:27:46.187978
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-09-07T19:27:46.187978
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-09-07T19:27:46.187978
- [docs/real_world_assets.md](docs/real_world_assets.md) — 12.7KB / 2025-09-07T19:27:46.187978
- [docs/SECURITY.md](docs/SECURITY.md) — 3.2KB / 2025-09-07T19:27:46.150977
- [docs/SYSTEM_STATUS.md](docs/SYSTEM_STATUS.md) — 8.3KB / 2025-09-07T19:27:46.150977
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-09-07T19:27:46.188977
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-09-07T19:27:46.188977
### eslint.config.js

- [eslint.config.js](eslint.config.js) — 1.6KB / 2025-09-07T19:27:46.188977
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 9.7KB / 2025-09-07T19:27:46.188977
### gas-reports

- [gas-reports/gas-analysis-1756553019749.json](gas-reports/gas-analysis-1756553019749.json) — 20.7KB / 2025-09-07T19:27:46.188977
- [gas-reports/gas-analysis-1756553056888.json](gas-reports/gas-analysis-1756553056888.json) — 20.7KB / 2025-09-07T19:27:46.188977
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 3.8KB / 2025-09-07T19:27:46.188977
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-09-07T19:27:46.188977
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-09-07T19:27:46.188977
- [js/auction.js](js/auction.js) — 14.0KB / 2025-09-07T19:27:46.188977
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-09-07T19:27:46.140977
### package.json

- [package.json](package.json) — 5.1KB / 2025-09-07T19:27:46.188977
### README.md

- [README.md](README.md) — 15.6KB / 2025-09-07T19:27:46.140977
### RECOVERY_REPORT.md

- [RECOVERY_REPORT.md](RECOVERY_REPORT.md) — 5.5KB / 2025-09-07T19:27:46.140977
### run-audit-and-append.ps1

- [run-audit-and-append.ps1](run-audit-and-append.ps1) — 3.0KB / 2025-09-07T19:27:46.189978
### scripts

- [scripts/check-vesting-status.ts](scripts/check-vesting-status.ts) — 2.7KB / 2025-09-07T19:27:46.189978
- [scripts/deploy-infrastructure.ts](scripts/deploy-infrastructure.ts) — 3.5KB / 2025-09-07T19:27:46.189978
- [scripts/deploy-proper-token.ts](scripts/deploy-proper-token.ts) — 2.4KB / 2025-09-07T19:27:46.189978
- [scripts/distribute-tokens.ts](scripts/distribute-tokens.ts) — 3.9KB / 2025-09-07T19:27:46.189978
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-09-07T19:27:46.189978
- [scripts/README.md](scripts/README.md) — 6.3KB / 2025-09-07T19:27:46.189978
- [scripts/setup-vesting-and-finalize.ts](scripts/setup-vesting-and-finalize.ts) — 4.9KB / 2025-09-07T19:27:46.189978
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2025-09-07T19:27:46.189978
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 8.1KB / 2025-09-07T19:27:46.189978
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-09-07T19:27:46.189978
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-09-07T19:27:46.189978
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-09-07T19:27:46.190978
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-09-07T19:27:46.190978
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-09-07T19:27:46.190978
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-09-07T19:27:46.190978
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-09-07T19:27:46.190978
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-09-07T19:27:46.190978
- [tests/fuzz/ContractInvariants.t.sol](tests/fuzz/ContractInvariants.t.sol) — 14.5KB / 2025-09-07T19:27:46.190978
- [tests/governance/TimelockRoles.test.ts](tests/governance/TimelockRoles.test.ts) — 7.0KB / 2025-09-07T19:27:46.190978
- [tests/integration/integration.test.ts](tests/integration/integration.test.ts) — 14.9KB / 2025-09-07T19:27:46.190978
- [tests/mocha.opts](tests/mocha.opts) — 140.0B / 2025-09-07T19:27:46.190978
- [tests/security/AdamHostSecurity.test.ts](tests/security/AdamHostSecurity.test.ts) — 12.1KB / 2025-09-07T19:27:46.190978
- [tests/security/AdamRegistrySecurity.test.ts](tests/security/AdamRegistrySecurity.test.ts) — 14.6KB / 2025-09-07T19:27:46.191978
- [tests/security/ARCBridgeSecurity.test.ts](tests/security/ARCBridgeSecurity.test.ts) — 10.9KB / 2025-09-07T19:27:46.190978
- [tests/security/ARCGovernorSecurity.test.ts](tests/security/ARCGovernorSecurity.test.ts) — 10.3KB / 2025-09-07T19:27:46.190978
- [tests/security/ARCTimelockSecurity.test.ts](tests/security/ARCTimelockSecurity.test.ts) — 8.1KB / 2025-09-07T19:27:46.190978
- [tests/security/BridgeSecurity.test.ts](tests/security/BridgeSecurity.test.ts) — 3.0KB / 2025-09-07T19:27:46.191978
- [tests/security/security.test.ts](tests/security/security.test.ts) — 18.9KB / 2025-09-07T19:27:46.191978
- [tests/security/TokenSecurity.test.ts](tests/security/TokenSecurity.test.ts) — 4.1KB / 2025-09-07T19:27:46.191978
- [tests/shared/test-helpers.ts](tests/shared/test-helpers.ts) — 6.0KB / 2025-09-07T19:27:46.191978
- [tests/test_results.md](tests/test_results.md) — 3.9KB / 2025-09-07T19:27:46.191978
### todo

- [todo](todo) — 1.6KB / 2025-09-07T19:27:46.191978
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-09-07T19:27:46.191978
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-09-07T19:27:46.191978
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-09-07T19:27:46.191978

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.