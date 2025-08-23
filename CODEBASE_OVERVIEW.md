# Codebase overview — Devs & Contributors

*Generated: 2025-08-23T12:47:57.923402 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **174**
- Total size: **19.8MB**

## Top-level directories

- **.githooks** — 2 files, 1.9KB
- **.github** — 1 files, 1.3KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **address.book** — 1 files, 947.0B
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 18.9KB
- **contracts** — 26 files, 52.9KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **docs** — 31 files, 9.6MB
- **gas-report.txt** — 1 files, 2.8KB
- **hardhat.config.ts** — 1 files, 2.6KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **logo** — 8 files, 9.6MB
- **package.json** — 1 files, 3.5KB
- **README.md** — 1 files, 24.2KB
- **scripts** — 19 files, 146.5KB
- **src** — 3 files, 58.4KB
- **tests** — 6 files, 44.5KB
- **tools** — 2 files, 8.1KB
- **tsconfig.json** — 1 files, 589.0B
- **www** — 58 files, 176.8KB

## Table of contents

### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1001.0B / 2025-08-23T12:47:57.001055
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-23T12:47:57.001055
### .github

- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-23T12:47:57.001055
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-23T12:47:57.001055
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-23T12:47:57.001055
### address.book

- [address.book](address.book) — 947.0B / 2025-08-23T12:47:57.002055
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-23T12:47:57.002055
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-23T12:47:57.002055
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 18.9KB / 2025-08-23T12:47:57.001055
### contracts

- [contracts/defi/ARCx_MVC.sol](contracts/defi/ARCx_MVC.sol) — 13.4KB / 2025-08-23T12:47:57.002055
- [contracts/defi/ARCxDutchAuction.sol](contracts/defi/ARCxDutchAuction.sol) — 12.1KB / 2025-08-23T12:47:57.002055
- [contracts/defi/ARCxSmartAirdrop.sol](contracts/defi/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-23T12:47:57.002055
- [contracts/defi/draft.md](contracts/defi/draft.md) — 1.2KB / 2025-08-23T12:47:57.002055
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 670.0B / 2025-08-23T12:47:57.002055
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 2.2KB / 2025-08-23T12:47:57.002055
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 2.2KB / 2025-08-23T12:47:57.002055
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 540.0B / 2025-08-23T12:47:57.002055
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2025-08-23T12:47:57.002055
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2025-08-23T12:47:57.002055
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-23T12:47:57.003055
- [contracts/tokens/arc-x/ARCx.sol](contracts/tokens/arc-x/ARCx.sol) — 5.7KB / 2025-08-23T12:47:57.003055
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2025-08-23T12:47:57.003055
- [contracts/tokens/arc-xs/ARCxs.sol](contracts/tokens/arc-xs/ARCxs.sol) — 1.4KB / 2025-08-23T12:47:57.003055
- [contracts/tokens/arc-xs/deployment_notes.md](contracts/tokens/arc-xs/deployment_notes.md) — 560.0B / 2025-08-23T12:47:57.003055
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-23T12:47:57.003055
- [css/style.css](css/style.css) — 14.3KB / 2025-08-23T12:47:57.003055
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-23T12:47:57.004055
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-23T12:47:57.004055
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-23T12:47:57.004055
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-23T12:47:57.006055
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-23T12:47:57.006055
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-23T12:47:57.007055
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-23T12:47:57.007055
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-23T12:47:57.007055
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-23T12:47:57.007055
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-23T12:47:57.007055
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-23T12:47:57.007055
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-23T12:47:57.007055
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-23T12:47:57.009055
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-23T12:47:57.021055
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-23T12:47:57.023055
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-23T12:47:57.025055
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-23T12:47:57.027055
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-23T12:47:57.027055
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-23T12:47:57.028055
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-23T12:47:57.028055
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-23T12:47:57.028055
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-23T12:47:57.028055
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-23T12:47:57.028055
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-23T12:47:57.028055
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-23T12:47:57.028055
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-23T12:47:57.028055
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-23T12:47:57.028055
- [docs/index-old.html](docs/index-old.html) — 17.6KB / 2025-08-23T12:47:57.028055
- [docs/index.html](docs/index.html) — 10.0KB / 2025-08-23T12:47:57.028055
- [docs/index_horizontal.html](docs/index_horizontal.html) — 46.1KB / 2025-08-23T12:47:57.029055
- [docs/transparency.html](docs/transparency.html) — 23.6KB / 2025-08-23T12:47:57.029055
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-23T12:47:57.029055
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 2.8KB / 2025-08-23T12:47:57.029055
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.6KB / 2025-08-23T12:47:57.029055
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-23T12:47:57.029055
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-23T12:47:57.029055
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-23T12:47:57.029055
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-23T12:47:57.002055
### logo

- [logo/arcx_logo1-modified.png](logo/arcx_logo1-modified.png) — 1.4MB / 2025-08-23T12:47:57.032055
- [logo/av-black-logo-removebg-preview.png](logo/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-23T12:47:57.032055
- [logo/av-white-logo-removebg-preview.png](logo/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-23T12:47:57.032055
- [logo/base-logo.png](logo/base-logo.png) — 2.2KB / 2025-08-23T12:47:57.032055
- [logo/lod (1).fbx](logo/lod (1).fbx) — 2.1MB / 2025-08-23T12:47:57.034055
- [logo/lod (2).fbx](logo/lod (2).fbx) — 2.1MB / 2025-08-23T12:47:57.035055
- [logo/lod (3).fbx](logo/lod (3).fbx) — 2.1MB / 2025-08-23T12:47:57.037055
- [logo/lod.fbx](logo/lod.fbx) — 2.1MB / 2025-08-23T12:47:57.039055
### package.json

- [package.json](package.json) — 3.5KB / 2025-08-23T12:47:57.039055
### README.md

- [README.md](README.md) — 24.2KB / 2025-08-23T12:47:57.002055
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-23T12:47:57.039055
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-23T12:47:57.039055
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-23T12:47:57.039055
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-23T12:47:57.039055
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-23T12:47:57.039055
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-23T12:47:57.039055
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-23T12:47:57.039055
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-23T12:47:57.040055
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-23T12:47:57.040055
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-23T12:47:57.040055
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-23T12:47:57.040055
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-23T12:47:57.040055
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-23T12:47:57.040055
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-23T12:47:57.040055
- [scripts/README.md](scripts/README.md) — 6.2KB / 2025-08-23T12:47:57.039055
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-23T12:47:57.040055
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.2KB / 2025-08-23T12:47:57.040055
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-23T12:47:57.040055
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-23T12:47:57.040055
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-23T12:47:57.040055
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-23T12:47:57.040055
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-23T12:47:57.040055
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-23T12:47:57.041055
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-23T12:47:57.041055
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-23T12:47:57.041055
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-23T12:47:57.041055
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-23T12:47:57.041055
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-23T12:47:57.041055
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-23T12:47:57.041055
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-23T12:47:57.041055
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-23T12:47:57.041055
### www

- [www/.gitignore](www/.gitignore) — 253.0B / 2025-08-23T12:47:57.041055
- [www/adam_protocol.html](www/adam_protocol.html) — 0.0B / 2025-08-23T12:47:57.041055
- [www/adam_short.html](www/adam_short.html) — 0.0B / 2025-08-23T12:47:57.041055
- [www/AdamProtocol.tsx](www/AdamProtocol.tsx) — 3.6KB / 2025-08-23T12:47:57.041055
- [www/App.tsx](www/App.tsx) — 1.1KB / 2025-08-23T12:47:57.041055
- [www/ArcxToken.tsx](www/ArcxToken.tsx) — 3.6KB / 2025-08-23T12:47:57.041055
- [www/components/About.tsx](www/components/About.tsx) — 0.0B / 2025-08-23T12:47:57.041055
- [www/components/AdamAbout.tsx](www/components/AdamAbout.tsx) — 5.7KB / 2025-08-23T12:47:57.041055
- [www/components/AdamArchitecture.tsx](www/components/AdamArchitecture.tsx) — 8.5KB / 2025-08-23T12:47:57.041055
- [www/components/AdamBackground.tsx](www/components/AdamBackground.tsx) — 5.1KB / 2025-08-23T12:47:57.042055
- [www/components/AdamHero.tsx](www/components/AdamHero.tsx) — 3.5KB / 2025-08-23T12:47:57.042055
- [www/components/AdamJoin.tsx](www/components/AdamJoin.tsx) — 3.7KB / 2025-08-23T12:47:57.042055
- [www/components/AdamLifecycle.tsx](www/components/AdamLifecycle.tsx) — 6.4KB / 2025-08-23T12:47:57.042055
- [www/components/AdamParameters.tsx](www/components/AdamParameters.tsx) — 3.4KB / 2025-08-23T12:47:57.042055
- [www/components/AdamSandbox.tsx](www/components/AdamSandbox.tsx) — 13.1KB / 2025-08-23T12:47:57.042055
- [www/components/AdamSecurity.tsx](www/components/AdamSecurity.tsx) — 6.3KB / 2025-08-23T12:47:57.042055
- [www/components/AdamTokenomics.tsx](www/components/AdamTokenomics.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/ArcHero.tsx](www/components/ArcHero.tsx) — 7.4KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxAcquire.tsx](www/components/ArcxAcquire.tsx) — 2.4KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxCore.tsx](www/components/ArcxCore.tsx) — 4.5KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxEcosystem.tsx](www/components/ArcxEcosystem.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/ArcxHero.tsx](www/components/ArcxHero.tsx) — 3.2KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxJoin.tsx](www/components/ArcxJoin.tsx) — 3.8KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxSecurity.tsx](www/components/ArcxSecurity.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/ArcxStaking.tsx](www/components/ArcxStaking.tsx) — 5.1KB / 2025-08-23T12:47:57.042055
- [www/components/ArcxTokenomics.tsx](www/components/ArcxTokenomics.tsx) — 4.0KB / 2025-08-23T12:47:57.042055
- [www/components/Community.tsx](www/components/Community.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/Entry.tsx](www/components/Entry.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/Footer.tsx](www/components/Footer.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/GovernanceParameters.tsx](www/components/GovernanceParameters.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/GovernanceSandbox.tsx](www/components/GovernanceSandbox.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/Header.tsx](www/components/Header.tsx) — 5.9KB / 2025-08-23T12:47:57.042055
- [www/components/Hero.tsx](www/components/Hero.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/Join.tsx](www/components/Join.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/LineAnimation.tsx](www/components/LineAnimation.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/NoiseBackground.tsx](www/components/NoiseBackground.tsx) — 5.5KB / 2025-08-23T12:47:57.042055
- [www/components/ParticleBackground.tsx](www/components/ParticleBackground.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/Roadmap.tsx](www/components/Roadmap.tsx) — 0.0B / 2025-08-23T12:47:57.042055
- [www/components/SbtConstellation.tsx](www/components/SbtConstellation.tsx) — 4.0KB / 2025-08-23T12:47:57.043055
- [www/components/SbtCore.tsx](www/components/SbtCore.tsx) — 4.1KB / 2025-08-23T12:47:57.043055
- [www/components/SbtCredentials.tsx](www/components/SbtCredentials.tsx) — 2.7KB / 2025-08-23T12:47:57.043055
- [www/components/SbtDecay.tsx](www/components/SbtDecay.tsx) — 4.1KB / 2025-08-23T12:47:57.043055
- [www/components/SbtHero.tsx](www/components/SbtHero.tsx) — 2.9KB / 2025-08-23T12:47:57.043055
- [www/components/SbtJoin.tsx](www/components/SbtJoin.tsx) — 3.8KB / 2025-08-23T12:47:57.043055
- [www/components/Tokenomics.tsx](www/components/Tokenomics.tsx) — 0.0B / 2025-08-23T12:47:57.043055
- [www/html-version/assets/icon.svg](www/html-version/assets/icon.svg) — 0.0B / 2025-08-23T12:47:57.043055
- [www/html-version/css/style.css](www/html-version/css/style.css) — 12.9KB / 2025-08-23T12:47:57.043055
- [www/html-version/index.html](www/html-version/index.html) — 9.0KB / 2025-08-23T12:47:57.043055
- [www/html-version/js/main.js](www/html-version/js/main.js) — 10.9KB / 2025-08-23T12:47:57.043055
- [www/index.html](www/index.html) — 9.9KB / 2025-08-23T12:47:57.043055
- [www/index.tsx](www/index.tsx) — 351.0B / 2025-08-23T12:47:57.043055
- [www/metadata.json](www/metadata.json) — 240.0B / 2025-08-23T12:47:57.043055
- [www/package.json](www/package.json) — 598.0B / 2025-08-23T12:47:57.043055
- [www/README.md](www/README.md) — 553.0B / 2025-08-23T12:47:57.041055
- [www/SbtIdentity.tsx](www/SbtIdentity.tsx) — 3.2KB / 2025-08-23T12:47:57.041055
- [www/tsconfig.json](www/tsconfig.json) — 542.0B / 2025-08-23T12:47:57.043055
- [www/types.ts](www/types.ts) — 216.0B / 2025-08-23T12:47:57.043055
- [www/vite.config.ts](www/vite.config.ts) — 679.0B / 2025-08-23T12:47:57.043055

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.