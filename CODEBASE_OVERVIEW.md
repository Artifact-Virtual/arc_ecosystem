# Codebase overview — Devs & Contributors

*Generated: 2025-08-29T11:41:30.250677 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **160**
- Total size: **20.5MB**

## Top-level directories

- **.githooks** — 2 files, 1.9KB
- **.github** — 2 files, 1.7KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **address.book** — 1 files, 2.8KB
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 18.8KB
- **community_message.md** — 1 files, 5.9KB
- **contracts** — 54 files, 385.8KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **docs** — 48 files, 19.7MB
- **functions.json** — 1 files, 19.8KB
- **gas-report.txt** — 1 files, 2.8KB
- **hardhat.config.ts** — 1 files, 2.6KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 4.1KB
- **README.md** — 1 files, 12.2KB
- **real_world_assets.md** — 1 files, 12.7KB
- **scripts** — 22 files, 167.5KB
- **src** — 3 files, 58.4KB
- **tests** — 6 files, 44.5KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1001.0B / 2025-08-29T11:41:29.309262
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-29T11:41:29.309262
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2025-08-29T11:41:29.310262
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-29T11:41:29.310262
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-29T11:41:29.310262
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-29T11:41:29.310262
### address.book

- [address.book](address.book) — 2.8KB / 2025-08-29T11:41:29.310262
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-29T11:41:29.310262
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-29T11:41:29.310262
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 18.8KB / 2025-08-29T11:41:29.310262
### community_message.md

- [community_message.md](community_message.md) — 5.9KB / 2025-08-29T11:41:29.310262
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2025-08-29T11:41:29.310262
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-08-29T11:41:29.310262
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-08-29T11:41:29.311262
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-08-29T11:41:29.311262
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-08-29T11:41:29.311262
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 18.8KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-08-29T11:41:29.311262
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-08-29T11:41:29.312262
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-08-29T11:41:29.312262
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-08-29T11:41:29.312262
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 15.0KB / 2025-08-29T11:41:29.312262
- [contracts/defi/ARCx_MVC.sol](contracts/defi/ARCx_MVC.sol) — 13.4KB / 2025-08-29T11:41:29.312262
- [contracts/defi/ARCxDutchAuction.sol](contracts/defi/ARCxDutchAuction.sol) — 12.1KB / 2025-08-29T11:41:29.312262
- [contracts/defi/ARCxSmartAirdrop.sol](contracts/defi/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-29T11:41:29.312262
- [contracts/defi/ARCxStakingVault.sol](contracts/defi/ARCxStakingVault.sol) — 7.4KB / 2025-08-29T11:41:29.312262
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 19.0KB / 2025-08-29T11:41:29.313262
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.1KB / 2025-08-29T11:41:29.312262
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-08-29T11:41:29.313262
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-08-29T11:41:29.313262
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-08-29T11:41:29.313262
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 4.1KB / 2025-08-29T11:41:29.312262
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 3.3KB / 2025-08-29T11:41:29.312262
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-08-29T11:41:29.313262
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-08-29T11:41:29.313262
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-29T11:41:29.314262
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-29T11:41:29.313262
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 1.4KB / 2025-08-29T11:41:29.314262
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 560.0B / 2025-08-29T11:41:29.314262
- [contracts/tokens/arc-x/ARCx.sol](contracts/tokens/arc-x/ARCx.sol) — 5.7KB / 2025-08-29T11:41:29.314262
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-08-29T11:41:29.314262
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-08-29T11:41:29.314262
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 13.2KB / 2025-08-29T11:41:29.314262
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 17.5KB / 2025-08-29T11:41:29.314262
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-29T11:41:29.314262
- [css/style.css](css/style.css) — 14.3KB / 2025-08-29T11:41:29.314262
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-29T11:41:29.314262
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-29T11:41:29.315262
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-29T11:41:29.315262
- [docs/assets/images/download (1).jpeg](docs/assets/images/download (1).jpeg) — 34.9KB / 2025-08-29T11:41:29.315262
- [docs/assets/images/download (2).jpeg](docs/assets/images/download (2).jpeg) — 61.4KB / 2025-08-29T11:41:29.315262
- [docs/assets/images/download (3).jpeg](docs/assets/images/download (3).jpeg) — 56.7KB / 2025-08-29T11:41:29.315262
- [docs/assets/images/download.jpeg](docs/assets/images/download.jpeg) — 85.9KB / 2025-08-29T11:41:29.316262
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-29T11:41:29.318262
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-08-29T11:41:29.330262
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-08-29T11:41:29.333262
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-08-29T11:41:29.335262
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-08-29T11:41:29.336262
- [docs/assets/logos/arcx_logo1-modified.png](docs/assets/logos/arcx_logo1-modified.png) — 1.4MB / 2025-08-29T11:41:29.339262
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-29T11:41:29.339262
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-29T11:41:29.339262
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-08-29T11:41:29.339262
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-29T11:41:29.339262
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-29T11:41:29.339262
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-29T11:41:29.340262
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-08-29T11:41:29.340262
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-29T11:41:29.340262
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-29T11:41:29.340262
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2025-08-29T11:41:29.340262
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-29T11:41:29.340262
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-29T11:41:29.340262
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2025-08-29T11:41:29.340262
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-29T11:41:29.340262
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-29T11:41:29.342262
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-29T11:41:29.344262
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-29T11:41:29.345262
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-29T11:41:29.347262
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-29T11:41:29.349262
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-29T11:41:29.349262
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-29T11:41:29.350262
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-29T11:41:29.350262
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-29T11:41:29.350262
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-29T11:41:29.350262
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-29T11:41:29.350262
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-29T11:41:29.350262
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-08-29T11:41:29.350262
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-29T11:41:29.350262
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-29T11:41:29.350262
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-29T11:41:29.350262
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-08-29T11:41:29.350262
- [docs/index.html](docs/index.html) — 21.4KB / 2025-08-29T11:41:29.350262
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-08-29T11:41:29.351262
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-08-29T11:41:29.351262
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-08-29T11:41:29.351262
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-29T11:41:29.351262
### functions.json

- [functions.json](functions.json) — 19.8KB / 2025-08-29T11:41:29.351262
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 2.8KB / 2025-08-29T11:41:29.351262
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.6KB / 2025-08-29T11:41:29.351262
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-29T11:41:29.352262
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-29T11:41:29.352262
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-29T11:41:29.352262
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-29T11:41:29.310262
### package.json

- [package.json](package.json) — 4.1KB / 2025-08-29T11:41:29.352262
### README.md

- [README.md](README.md) — 12.2KB / 2025-08-29T11:41:29.310262
### real_world_assets.md

- [real_world_assets.md](real_world_assets.md) — 12.7KB / 2025-08-29T11:41:29.352262
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-29T11:41:29.352262
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-29T11:41:29.352262
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-29T11:41:29.352262
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-29T11:41:29.352262
- [scripts/deploy_arcs_token.ts](scripts/deploy_arcs_token.ts) — 5.1KB / 2025-08-29T11:41:29.352262
- [scripts/deploy_defi.ts](scripts/deploy_defi.ts) — 7.5KB / 2025-08-29T11:41:29.353262
- [scripts/deploy_sbt.ts](scripts/deploy_sbt.ts) — 8.1KB / 2025-08-29T11:41:29.353262
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-29T11:41:29.353262
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-29T11:41:29.353262
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-29T11:41:29.353262
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-29T11:41:29.353262
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-29T11:41:29.353262
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-29T11:41:29.353262
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-29T11:41:29.353262
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-29T11:41:29.353262
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-29T11:41:29.353262
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-29T11:41:29.353262
- [scripts/README.md](scripts/README.md) — 6.2KB / 2025-08-29T11:41:29.352262
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-29T11:41:29.353262
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2025-08-29T11:41:29.353262
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-29T11:41:29.353262
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-29T11:41:29.353262
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-29T11:41:29.354262
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-29T11:41:29.354262
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-29T11:41:29.354262
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-29T11:41:29.354262
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-29T11:41:29.354262
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-29T11:41:29.354262
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-29T11:41:29.354262
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-29T11:41:29.354262
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-29T11:41:29.354262
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-29T11:41:29.354262
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-29T11:41:29.354262
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-29T11:41:29.354262

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.