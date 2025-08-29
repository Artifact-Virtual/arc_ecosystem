# Codebase overview — Devs & Contributors

*Generated: 2025-08-29T05:52:25.343569 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **154**
- Total size: **20.5MB**

## Top-level directories

- **.githooks** — 2 files, 1.9KB
- **.github** — 1 files, 1.3KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **address.book** — 1 files, 947.0B
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 17.4KB
- **community_message.md** — 1 files, 5.9KB
- **contracts** — 53 files, 376.4KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **docs** — 46 files, 19.7MB
- **functions.json** — 1 files, 19.8KB
- **gas-report.txt** — 1 files, 2.8KB
- **hardhat.config.ts** — 1 files, 2.6KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 3.6KB
- **README.md** — 1 files, 12.2KB
- **real_world_assets.md** — 1 files, 12.7KB
- **scripts** — 19 files, 146.5KB
- **src** — 3 files, 58.4KB
- **status_report.md.md** — 1 files, 29.9KB
- **tests** — 6 files, 44.5KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1001.0B / 2025-08-29T05:52:24.412198
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-29T05:52:24.412198
### .github

- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-29T05:52:24.412198
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-29T05:52:24.412198
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-29T05:52:24.412198
### address.book

- [address.book](address.book) — 947.0B / 2025-08-29T05:52:24.413198
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-29T05:52:24.413198
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-29T05:52:24.413198
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 17.4KB / 2025-08-29T05:52:24.412198
### community_message.md

- [community_message.md](community_message.md) — 5.9KB / 2025-08-29T05:52:24.413198
### contracts

- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 5.9KB / 2025-08-29T05:52:24.413198
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2025-08-29T05:52:24.413198
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2025-08-29T05:52:24.413198
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2025-08-29T05:52:24.413198
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2025-08-29T05:52:24.413198
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2025-08-29T05:52:24.413198
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 18.8KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2025-08-29T05:52:24.414198
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2025-08-29T05:52:24.414198
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-08-29T05:52:24.414198
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-08-29T05:52:24.414198
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-08-29T05:52:24.414198
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-08-29T05:52:24.414198
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-08-29T05:52:24.415198
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-08-29T05:52:24.415198
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 15.0KB / 2025-08-29T05:52:24.415198
- [contracts/defi/ARCx_MVC.sol](contracts/defi/ARCx_MVC.sol) — 13.4KB / 2025-08-29T05:52:24.415198
- [contracts/defi/ARCxDutchAuction.sol](contracts/defi/ARCxDutchAuction.sol) — 12.1KB / 2025-08-29T05:52:24.415198
- [contracts/defi/ARCxSmartAirdrop.sol](contracts/defi/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-29T05:52:24.415198
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 19.0KB / 2025-08-29T05:52:24.415198
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.1KB / 2025-08-29T05:52:24.415198
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2025-08-29T05:52:24.415198
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2025-08-29T05:52:24.415198
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2025-08-29T05:52:24.415198
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 4.1KB / 2025-08-29T05:52:24.415198
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 3.3KB / 2025-08-29T05:52:24.415198
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-08-29T05:52:24.416198
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-08-29T05:52:24.416198
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-29T05:52:24.416198
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 1.4KB / 2025-08-29T05:52:24.416198
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 560.0B / 2025-08-29T05:52:24.416198
- [contracts/tokens/arc-x/ARCx.sol](contracts/tokens/arc-x/ARCx.sol) — 5.7KB / 2025-08-29T05:52:24.416198
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-08-29T05:52:24.417198
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2025-08-29T05:52:24.417198
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 13.2KB / 2025-08-29T05:52:24.417198
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 17.5KB / 2025-08-29T05:52:24.417198
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-29T05:52:24.417198
- [css/style.css](css/style.css) — 14.3KB / 2025-08-29T05:52:24.417198
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-29T05:52:24.417198
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-29T05:52:24.417198
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-29T05:52:24.417198
- [docs/assets/images/download (1).jpeg](docs/assets/images/download (1).jpeg) — 34.9KB / 2025-08-29T05:52:24.418198
- [docs/assets/images/download (2).jpeg](docs/assets/images/download (2).jpeg) — 61.4KB / 2025-08-29T05:52:24.418198
- [docs/assets/images/download (3).jpeg](docs/assets/images/download (3).jpeg) — 56.7KB / 2025-08-29T05:52:24.418198
- [docs/assets/images/download.jpeg](docs/assets/images/download.jpeg) — 85.9KB / 2025-08-29T05:52:24.418198
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-29T05:52:24.421198
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-08-29T05:52:24.433198
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-08-29T05:52:24.435198
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-08-29T05:52:24.437198
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-08-29T05:52:24.439198
- [docs/assets/logos/arcx_logo1-modified.png](docs/assets/logos/arcx_logo1-modified.png) — 1.4MB / 2025-08-29T05:52:24.441198
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-29T05:52:24.441198
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-29T05:52:24.441198
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-08-29T05:52:24.441198
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-29T05:52:24.441198
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-29T05:52:24.442198
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-29T05:52:24.442198
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-08-29T05:52:24.442198
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-29T05:52:24.442198
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-29T05:52:24.442198
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-29T05:52:24.443198
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-29T05:52:24.443198
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-29T05:52:24.443198
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-29T05:52:24.444198
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-29T05:52:24.446198
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-29T05:52:24.447198
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-29T05:52:24.449198
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-29T05:52:24.451198
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-29T05:52:24.451198
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-29T05:52:24.452198
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-29T05:52:24.452198
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-29T05:52:24.452198
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-29T05:52:24.452198
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-29T05:52:24.452198
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-29T05:52:24.452198
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2025-08-29T05:52:24.452198
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-29T05:52:24.452198
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-29T05:52:24.452198
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-29T05:52:24.452198
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-08-29T05:52:24.452198
- [docs/index.html](docs/index.html) — 21.4KB / 2025-08-29T05:52:24.452198
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-08-29T05:52:24.453198
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-08-29T05:52:24.453198
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-08-29T05:52:24.453198
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-29T05:52:24.453198
### functions.json

- [functions.json](functions.json) — 19.8KB / 2025-08-29T05:52:24.453198
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 2.8KB / 2025-08-29T05:52:24.453198
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.6KB / 2025-08-29T05:52:24.453198
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-29T05:52:24.454198
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-29T05:52:24.454198
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-29T05:52:24.454198
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-29T05:52:24.413198
### package.json

- [package.json](package.json) — 3.6KB / 2025-08-29T05:52:24.454198
### README.md

- [README.md](README.md) — 12.2KB / 2025-08-29T05:52:24.413198
### real_world_assets.md

- [real_world_assets.md](real_world_assets.md) — 12.7KB / 2025-08-29T05:52:24.454198
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-29T05:52:24.454198
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-29T05:52:24.454198
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-29T05:52:24.454198
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-29T05:52:24.454198
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-29T05:52:24.455198
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-29T05:52:24.455198
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-29T05:52:24.455198
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-29T05:52:24.455198
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-29T05:52:24.455198
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-29T05:52:24.455198
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-29T05:52:24.455198
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-29T05:52:24.455198
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-29T05:52:24.455198
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-29T05:52:24.455198
- [scripts/README.md](scripts/README.md) — 6.2KB / 2025-08-29T05:52:24.454198
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-29T05:52:24.455198
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.2KB / 2025-08-29T05:52:24.455198
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-29T05:52:24.455198
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-29T05:52:24.455198
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-29T05:52:24.455198
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-29T05:52:24.456198
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-29T05:52:24.456198
### status_report.md.md

- [status_report.md.md](status_report.md.md) — 29.9KB / 2025-08-29T05:52:24.456198
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-29T05:52:24.456198
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-29T05:52:24.456198
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-29T05:52:24.456198
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-29T05:52:24.456198
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-29T05:52:24.456198
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-29T05:52:24.456198
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-29T05:52:24.456198
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-29T05:52:24.456198
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-29T05:52:24.456198

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.