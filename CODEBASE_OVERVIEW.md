# Codebase overview — Devs & Contributors

*Generated: 2025-08-28T12:35:05.825425 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **136**
- Total size: **20.2MB**

## Top-level directories

- **.githooks** — 2 files, 1.9KB
- **.github** — 1 files, 1.3KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **address.book** — 1 files, 947.0B
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 14.3KB
- **contracts** — 40 files, 220.1KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **docs** — 45 files, 19.7MB
- **gas-report.txt** — 1 files, 2.8KB
- **hardhat.config.ts** — 1 files, 2.6KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 3.6KB
- **README.md** — 1 files, 24.9KB
- **scripts** — 19 files, 146.5KB
- **src** — 3 files, 58.4KB
- **tests** — 6 files, 44.5KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1001.0B / 2025-08-28T12:35:04.740276
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-28T12:35:04.740276
### .github

- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-28T12:35:04.740276
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-28T12:35:04.740276
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-28T12:35:04.740276
### address.book

- [address.book](address.book) — 947.0B / 2025-08-28T12:35:04.740276
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-28T12:35:04.741276
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-28T12:35:04.741276
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 14.3KB / 2025-08-28T12:35:04.740276
### contracts

- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 14.4KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 18.9KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 19.6KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.7KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.6KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 17.6KB / 2025-08-28T12:35:04.741276
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.8KB / 2025-08-28T12:35:04.741276
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2025-08-28T12:35:04.741276
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2025-08-28T12:35:04.741276
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2025-08-28T12:35:04.741276
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2025-08-28T12:35:04.742276
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2025-08-28T12:35:04.742276
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2025-08-28T12:35:04.742276
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 15.0KB / 2025-08-28T12:35:04.742276
- [contracts/defi/ARCx_MVC.sol](contracts/defi/ARCx_MVC.sol) — 13.4KB / 2025-08-28T12:35:04.742276
- [contracts/defi/ARCxDutchAuction.sol](contracts/defi/ARCxDutchAuction.sol) — 12.1KB / 2025-08-28T12:35:04.742276
- [contracts/defi/ARCxSmartAirdrop.sol](contracts/defi/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-28T12:35:04.742276
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 19.0KB / 2025-08-28T12:35:04.742276
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.1KB / 2025-08-28T12:35:04.742276
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 4.1KB / 2025-08-28T12:35:04.742276
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 3.3KB / 2025-08-28T12:35:04.742276
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-08-28T12:35:04.742276
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-08-28T12:35:04.742276
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-08-28T12:35:04.742276
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-28T12:35:04.742276
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-28T12:35:04.742276
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-28T12:35:04.743276
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-28T12:35:04.742276
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 1.4KB / 2025-08-28T12:35:04.743276
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 560.0B / 2025-08-28T12:35:04.743276
- [contracts/tokens/arc-x/ARCx.sol](contracts/tokens/arc-x/ARCx.sol) — 5.7KB / 2025-08-28T12:35:04.743276
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-08-28T12:35:04.743276
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-28T12:35:04.743276
- [css/style.css](css/style.css) — 14.3KB / 2025-08-28T12:35:04.743276
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-28T12:35:04.743276
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-28T12:35:04.744276
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-28T12:35:04.744276
- [docs/assets/images/download (1).jpeg](docs/assets/images/download (1).jpeg) — 34.9KB / 2025-08-28T12:35:04.744276
- [docs/assets/images/download (2).jpeg](docs/assets/images/download (2).jpeg) — 61.4KB / 2025-08-28T12:35:04.744276
- [docs/assets/images/download (3).jpeg](docs/assets/images/download (3).jpeg) — 56.7KB / 2025-08-28T12:35:04.745276
- [docs/assets/images/download.jpeg](docs/assets/images/download.jpeg) — 85.9KB / 2025-08-28T12:35:04.745276
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-28T12:35:04.747276
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2025-08-28T12:35:04.759276
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2025-08-28T12:35:04.761276
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2025-08-28T12:35:04.763276
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2025-08-28T12:35:04.764276
- [docs/assets/logos/arcx_logo1-modified.png](docs/assets/logos/arcx_logo1-modified.png) — 1.4MB / 2025-08-28T12:35:04.767276
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-28T12:35:04.767276
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-28T12:35:04.767276
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2025-08-28T12:35:04.767276
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-28T12:35:04.767276
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-28T12:35:04.767276
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-28T12:35:04.767276
- [docs/draft.html](docs/draft.html) — 155.9KB / 2025-08-28T12:35:04.768276
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-28T12:35:04.768276
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-28T12:35:04.768276
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-28T12:35:04.768276
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-28T12:35:04.768276
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-28T12:35:04.768276
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-28T12:35:04.770276
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-28T12:35:04.773276
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-28T12:35:04.775276
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-28T12:35:04.777276
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-28T12:35:04.779276
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-28T12:35:04.780276
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-28T12:35:04.781276
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-28T12:35:04.781276
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-28T12:35:04.781276
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-28T12:35:04.781276
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-28T12:35:04.781276
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-28T12:35:04.781276
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-28T12:35:04.781276
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-28T12:35:04.781276
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-28T12:35:04.781276
- [docs/index-broken.html](docs/index-broken.html) — 10.2KB / 2025-08-28T12:35:04.781276
- [docs/index.html](docs/index.html) — 21.4KB / 2025-08-28T12:35:04.781276
- [docs/index_horizontal-copy.html](docs/index_horizontal-copy.html) — 46.8KB / 2025-08-28T12:35:04.781276
- [docs/index_horizontal.html](docs/index_horizontal.html) — 72.5KB / 2025-08-28T12:35:04.782276
- [docs/transparency.html](docs/transparency.html) — 24.5KB / 2025-08-28T12:35:04.782276
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-28T12:35:04.782276
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 2.8KB / 2025-08-28T12:35:04.782276
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.6KB / 2025-08-28T12:35:04.782276
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-28T12:35:04.782276
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-28T12:35:04.782276
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-28T12:35:04.782276
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-28T12:35:04.740276
### package.json

- [package.json](package.json) — 3.6KB / 2025-08-28T12:35:04.782276
### README.md

- [README.md](README.md) — 24.9KB / 2025-08-28T12:35:04.740276
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-28T12:35:04.783276
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-28T12:35:04.783276
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-28T12:35:04.783276
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-28T12:35:04.783276
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-28T12:35:04.783276
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-28T12:35:04.783276
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-28T12:35:04.783276
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-28T12:35:04.783276
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-28T12:35:04.784276
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-28T12:35:04.784276
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-28T12:35:04.784276
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-28T12:35:04.784276
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-28T12:35:04.784276
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-28T12:35:04.784276
- [scripts/README.md](scripts/README.md) — 6.2KB / 2025-08-28T12:35:04.783276
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-28T12:35:04.784276
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.2KB / 2025-08-28T12:35:04.784276
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-28T12:35:04.784276
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-28T12:35:04.784276
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-28T12:35:04.784276
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-28T12:35:04.784276
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-28T12:35:04.784276
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-28T12:35:04.785276
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-28T12:35:04.785276
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-28T12:35:04.785276
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-28T12:35:04.785276
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-28T12:35:04.785276
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-28T12:35:04.785276
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-28T12:35:04.785276
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-28T12:35:04.785276
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-28T12:35:04.785276

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.