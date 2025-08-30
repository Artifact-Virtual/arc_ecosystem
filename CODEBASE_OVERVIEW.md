# Codebase overview — Devs & Contributors

*Generated: 2025-08-30T09:25:38.845272 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **177**
- Total size: **20.6MB**

## Top-level directories

- **.eslintrc.json** — 1 files, 827.0B
- **.githooks** — 2 files, 2.7KB
- **.github** — 4 files, 4.2KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **.prettierrc.json** — 1 files, 199.0B
- **address.book** — 1 files, 2.8KB
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 20.8KB
- **community_message.md** — 1 files, 5.9KB
- **contracts** — 55 files, 394.5KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **docs** — 50 files, 19.7MB
- **eslint.config.js** — 1 files, 1.6KB
- **gas-report.txt** — 1 files, 5.1KB
- **hardhat.config.ts** — 1 files, 2.8KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 4.8KB
- **README.md** — 1 files, 12.2KB
- **real_world_assets.md** — 1 files, 12.7KB
- **scripts** — 24 files, 180.3KB
- **SECURITY.md** — 1 files, 3.0KB
- **src** — 3 files, 58.4KB
- **tests** — 13 files, 96.4KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .eslintrc.json

- [.eslintrc.json](.eslintrc.json) — 827.0B / 2025-08-30T09:25:37.021161
### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1.8KB / 2025-08-30T09:25:37.021161
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-30T09:25:37.021161
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2025-08-30T09:25:37.022161
- [.github/pull_request_template.md](.github/pull_request_template.md) — 1.5KB / 2025-08-30T09:25:37.022161
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — 1.0KB / 2025-08-30T09:25:37.022161
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-30T09:25:37.022161
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-30T09:25:37.022161
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-30T09:25:37.022161
### .prettierrc.json

- [.prettierrc.json](.prettierrc.json) — 199.0B / 2025-08-30T09:25:37.022161
### address.book

- [address.book](address.book) — 2.8KB / 2025-08-30T09:25:37.022161
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-30T09:25:37.022161
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-30T09:25:37.022161
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 20.8KB / 2025-08-30T09:25:37.022161
### community_message.md

- [community_message.md](community_message.md) — 5.9KB / 2025-08-30T09:25:37.022161
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2025-08-30T09:25:37.022161
- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 8.7KB / 2025-08-30T09:25:37.023161
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-08-30T09:25:37.023161
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-08-30T09:25:37.023161
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-08-30T09:25:37.023161
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-08-30T09:25:37.023161
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-08-30T09:25:37.023161
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-08-30T09:25:37.023161
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 18.8KB / 2025-08-30T09:25:37.023161
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-08-30T09:25:37.023161
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-08-30T09:25:37.024161
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-08-30T09:25:37.024161
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-08-30T09:25:37.024161
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-08-30T09:25:37.024161
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-08-30T09:25:37.024161
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-08-30T09:25:37.024161
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 15.0KB / 2025-08-30T09:25:37.024161
- [contracts/defi/ARCx_MVC.sol](contracts/defi/ARCx_MVC.sol) — 13.4KB / 2025-08-30T09:25:37.025161
- [contracts/defi/ARCxDutchAuction.sol](contracts/defi/ARCxDutchAuction.sol) — 12.1KB / 2025-08-30T09:25:37.024161
- [contracts/defi/ARCxSmartAirdrop.sol](contracts/defi/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-30T09:25:37.024161
- [contracts/defi/ARCxStakingVault.sol](contracts/defi/ARCxStakingVault.sol) — 7.4KB / 2025-08-30T09:25:37.024161
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 19.0KB / 2025-08-30T09:25:37.025161
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.1KB / 2025-08-30T09:25:37.025161
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-08-30T09:25:37.025161
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-08-30T09:25:37.025161
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-08-30T09:25:37.025161
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 4.1KB / 2025-08-30T09:25:37.025161
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 3.3KB / 2025-08-30T09:25:37.025161
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-08-30T09:25:37.025161
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-08-30T09:25:37.025161
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-08-30T09:25:37.025161
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-30T09:25:37.025161
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-30T09:25:37.025161
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-30T09:25:37.025161
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-30T09:25:37.026161
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-30T09:25:37.025161
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 1.4KB / 2025-08-30T09:25:37.026161
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 560.0B / 2025-08-30T09:25:37.026161
- [contracts/tokens/arc-x/ARCx.sol](contracts/tokens/arc-x/ARCx.sol) — 5.7KB / 2025-08-30T09:25:37.026161
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-08-30T09:25:37.026161
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-08-30T09:25:37.026161
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 13.2KB / 2025-08-30T09:25:37.026161
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 17.5KB / 2025-08-30T09:25:37.027161
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-30T09:25:37.027161
- [css/style.css](css/style.css) — 14.3KB / 2025-08-30T09:25:37.027161
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-30T09:25:37.027161
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-30T09:25:37.027161
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-30T09:25:37.027161
- [docs/assets/images/download (1).jpeg](docs/assets/images/download (1).jpeg) — 34.9KB / 2025-08-30T09:25:37.027161
- [docs/assets/images/download (2).jpeg](docs/assets/images/download (2).jpeg) — 61.4KB / 2025-08-30T09:25:37.028161
- [docs/assets/images/download (3).jpeg](docs/assets/images/download (3).jpeg) — 56.7KB / 2025-08-30T09:25:37.028161
- [docs/assets/images/download.jpeg](docs/assets/images/download.jpeg) — 85.9KB / 2025-08-30T09:25:37.028161
- [docs/assets/images/system_diagram20250830.drawio](docs/assets/images/system_diagram20250830.drawio) — 46.0KB / 2025-08-30T09:25:37.028161
- [docs/assets/images/system_overview.mermaid](docs/assets/images/system_overview.mermaid) — 6.6KB / 2025-08-30T09:25:37.028161
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-30T09:25:37.031161
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-08-30T09:25:37.043161
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-08-30T09:25:37.045161
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-08-30T09:25:37.047161
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-08-30T09:25:37.048161
- [docs/assets/logos/arcx_logo1-modified.png](docs/assets/logos/arcx_logo1-modified.png) — 1.4MB / 2025-08-30T09:25:37.051161
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-30T09:25:37.051161
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-30T09:25:37.051161
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-08-30T09:25:37.051161
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-30T09:25:37.051161
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-30T09:25:37.052161
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-30T09:25:37.052161
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-08-30T09:25:37.052161
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-30T09:25:37.052161
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-30T09:25:37.052161
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2025-08-30T09:25:37.052161
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-30T09:25:37.052161
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-30T09:25:37.053161
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2025-08-30T09:25:37.053161
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-30T09:25:37.053161
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-30T09:25:37.054161
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-30T09:25:37.057161
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-30T09:25:37.059161
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-30T09:25:37.061161
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-30T09:25:37.064161
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-30T09:25:37.064161
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-30T09:25:37.065161
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-30T09:25:37.065161
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-30T09:25:37.065161
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-30T09:25:37.065161
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-30T09:25:37.065161
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-30T09:25:37.065161
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-08-30T09:25:37.065161
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-30T09:25:37.065161
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-30T09:25:37.065161
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-30T09:25:37.065161
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-08-30T09:25:37.065161
- [docs/index.html](docs/index.html) — 21.4KB / 2025-08-30T09:25:37.065161
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-08-30T09:25:37.066161
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-08-30T09:25:37.066161
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-08-30T09:25:37.066161
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-30T09:25:37.066161
### eslint.config.js

- [eslint.config.js](eslint.config.js) — 1.6KB / 2025-08-30T09:25:37.066161
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 5.1KB / 2025-08-30T09:25:37.066161
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.8KB / 2025-08-30T09:25:37.066161
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-30T09:25:37.066161
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-30T09:25:37.066161
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-30T09:25:37.066161
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-30T09:25:37.022161
### package.json

- [package.json](package.json) — 4.8KB / 2025-08-30T09:25:37.067162
### README.md

- [README.md](README.md) — 12.2KB / 2025-08-30T09:25:37.022161
### real_world_assets.md

- [real_world_assets.md](real_world_assets.md) — 12.7KB / 2025-08-30T09:25:37.067162
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-30T09:25:37.067162
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-30T09:25:37.067162
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-30T09:25:37.067162
- [scripts/check-governance.ts](scripts/check-governance.ts) — 7.3KB / 2025-08-30T09:25:37.067162
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-30T09:25:37.067162
- [scripts/deploy_arcs_token.ts](scripts/deploy_arcs_token.ts) — 5.1KB / 2025-08-30T09:25:37.067162
- [scripts/deploy_defi.ts](scripts/deploy_defi.ts) — 7.5KB / 2025-08-30T09:25:37.068161
- [scripts/deploy_sbt.ts](scripts/deploy_sbt.ts) — 8.1KB / 2025-08-30T09:25:37.068161
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-30T09:25:37.068161
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-30T09:25:37.068161
- [scripts/governance-test.ts](scripts/governance-test.ts) — 5.4KB / 2025-08-30T09:25:37.068161
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-30T09:25:37.068161
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-30T09:25:37.068161
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-30T09:25:37.068161
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-30T09:25:37.068161
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-30T09:25:37.068161
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-30T09:25:37.068161
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-30T09:25:37.068161
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-30T09:25:37.068161
- [scripts/README.md](scripts/README.md) — 6.3KB / 2025-08-30T09:25:37.067162
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-30T09:25:37.068161
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2025-08-30T09:25:37.068161
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-30T09:25:37.068161
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-30T09:25:37.069161
### SECURITY.md

- [SECURITY.md](SECURITY.md) — 3.0KB / 2025-08-30T09:25:37.022161
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-30T09:25:37.069161
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-30T09:25:37.069161
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-30T09:25:37.069161
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-30T09:25:37.069161
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-30T09:25:37.069161
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-30T09:25:37.069161
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-30T09:25:37.069161
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-30T09:25:37.069161
- [tests/governance/TimelockRoles.test.ts](tests/governance/TimelockRoles.test.ts) — 7.0KB / 2025-08-30T09:25:37.069161
- [tests/integration/integration.test.ts](tests/integration/integration.test.ts) — 14.9KB / 2025-08-30T09:25:37.069161
- [tests/mocha.opts](tests/mocha.opts) — 140.0B / 2025-08-30T09:25:37.069161
- [tests/security/BridgeSecurity.test.ts](tests/security/BridgeSecurity.test.ts) — 3.0KB / 2025-08-30T09:25:37.070162
- [tests/security/security.test.ts](tests/security/security.test.ts) — 16.8KB / 2025-08-30T09:25:37.070162
- [tests/security/TokenSecurity.test.ts](tests/security/TokenSecurity.test.ts) — 4.1KB / 2025-08-30T09:25:37.070162
- [tests/shared/test-helpers.ts](tests/shared/test-helpers.ts) — 6.0KB / 2025-08-30T09:25:37.070162
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-30T09:25:37.070162
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-30T09:25:37.070162
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-30T09:25:37.070162
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-30T09:25:37.070162

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.