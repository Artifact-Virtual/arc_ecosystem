# Codebase overview — Devs & Contributors

*Generated: 2025-08-23T08:50:09.042461 UTC*

## Quick stats

- Root: `arc_ecosystem`
- Files indexed: **169**
- Total size: **19.8MB**

## Top-level directories

- **.githooks** — 2 files, 1.9KB
- **.github** — 1 files, 1.3KB
- **.gitignore** — 1 files, 445.0B
- **.npmrc** — 1 files, 237.0B
- **address.book** — 1 files, 947.0B
- **audits** — 1 files, 15.2KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 17.9KB
- **contracts** — 21 files, 45.8KB
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

- [.githooks/pre-commit](.githooks/pre-commit) — 1001.0B / 2025-08-23T08:50:08.680029
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2025-08-23T08:50:08.680029
### .github

- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2025-08-23T08:50:08.680029
### .gitignore

- [.gitignore](.gitignore) — 445.0B / 2025-08-23T08:50:08.680029
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2025-08-23T08:50:08.680029
### address.book

- [address.book](address.book) — 947.0B / 2025-08-23T08:50:08.680029
### audits

- [audits/security-report.md](audits/security-report.md) — 15.2KB / 2025-08-23T08:50:08.680029
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2025-08-23T08:50:08.680029
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 17.9KB / 2025-08-23T08:50:08.680029
### contracts

- [contracts/ARCx/ARCx_MVC.sol](contracts/ARCx/ARCx_MVC.sol) — 13.4KB / 2025-08-23T08:50:08.681029
- [contracts/ARCx/ARCxDutchAuction.sol](contracts/ARCx/ARCxDutchAuction.sol) — 12.1KB / 2025-08-23T08:50:08.680029
- [contracts/ARCx/ARCxSmartAirdrop.sol](contracts/ARCx/ARCxSmartAirdrop.sol) — 11.3KB / 2025-08-23T08:50:08.681029
- [contracts/ARCx/ARCxToken.sol](contracts/ARCx/ARCxToken.sol) — 5.6KB / 2025-08-23T08:50:08.681029
- [contracts/ARCx/pool/IERC20.sol](contracts/ARCx/pool/IERC20.sol) — 712.0B / 2025-08-23T08:50:08.681029
- [contracts/ARCx/pool/IPoolManager.sol](contracts/ARCx/pool/IPoolManager.sol) — 540.0B / 2025-08-23T08:50:08.681029
- [contracts/ARCx/pool/IPositionManager.sol](contracts/ARCx/pool/IPositionManager.sol) — 715.0B / 2025-08-23T08:50:08.681029
- [contracts/ARCx/pool/IWETH.sol](contracts/ARCx/pool/IWETH.sol) — 234.0B / 2025-08-23T08:50:08.681029
- [contracts/defi/draft.md](contracts/defi/draft.md) — 1.2KB / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2025-08-23T08:50:08.681029
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2025-08-23T08:50:08.682029
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2025-08-23T08:50:08.681029
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2025-08-23T08:50:08.682029
- [css/style.css](css/style.css) — 14.3KB / 2025-08-23T08:50:08.682029
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2025-08-23T08:50:08.682029
### docs

- [docs/airdrop_interface.html](docs/airdrop_interface.html) — 10.1KB / 2025-08-23T08:50:08.682029
- [docs/archive/README.md](docs/archive/README.md) — 398.0B / 2025-08-23T08:50:08.682029
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2025-08-23T08:50:08.685029
- [docs/auction_interface.html](docs/auction_interface.html) — 8.0KB / 2025-08-23T08:50:08.685029
- [docs/bridge.html](docs/bridge.html) — 31.1KB / 2025-08-23T08:50:08.685029
- [docs/documentation.html](docs/documentation.html) — 24.1KB / 2025-08-23T08:50:08.685029
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2025-08-23T08:50:08.685029
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2025-08-23T08:50:08.685029
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2025-08-23T08:50:08.685029
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2025-08-23T08:50:08.685029
- [docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md](docs/environment/V4_LP_DEPLOYMENT_SUMMARY.md) — 2.5KB / 2025-08-23T08:50:08.685029
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2025-08-23T08:50:08.687029
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2025-08-23T08:50:08.699029
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2025-08-23T08:50:08.701029
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2025-08-23T08:50:08.703029
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2025-08-23T08:50:08.705029
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2025-08-23T08:50:08.705029
- [docs/governance/diagrams/arc.png](docs/governance/diagrams/arc.png) — 198.8KB / 2025-08-23T08:50:08.706029
- [docs/governance/diagrams/arc_map.md](docs/governance/diagrams/arc_map.md) — 7.1KB / 2025-08-23T08:50:08.706029
- [docs/governance/diagrams/enerygy_cap.md](docs/governance/diagrams/enerygy_cap.md) — 3.9KB / 2025-08-23T08:50:08.706029
- [docs/governance/diagrams/layers.md](docs/governance/diagrams/layers.md) — 2.1KB / 2025-08-23T08:50:08.706029
- [docs/governance/diagrams/lifecycle.md](docs/governance/diagrams/lifecycle.md) — 1.9KB / 2025-08-23T08:50:08.706029
- [docs/governance/docs_checklist.md](docs/governance/docs_checklist.md) — 5.8KB / 2025-08-23T08:50:08.706029
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2025-08-23T08:50:08.706029
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2025-08-23T08:50:08.706029
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2025-08-23T08:50:08.706029
- [docs/index-old.html](docs/index-old.html) — 17.6KB / 2025-08-23T08:50:08.706029
- [docs/index.html](docs/index.html) — 10.0KB / 2025-08-23T08:50:08.707029
- [docs/index_horizontal.html](docs/index_horizontal.html) — 46.1KB / 2025-08-23T08:50:08.707029
- [docs/transparency.html](docs/transparency.html) — 23.6KB / 2025-08-23T08:50:08.707029
- [docs/whitepaper.html](docs/whitepaper.html) — 7.8KB / 2025-08-23T08:50:08.707029
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 2.8KB / 2025-08-23T08:50:08.707029
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 2.6KB / 2025-08-23T08:50:08.707029
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2025-08-23T08:50:08.707029
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2025-08-23T08:50:08.707029
- [js/auction.js](js/auction.js) — 14.0KB / 2025-08-23T08:50:08.707029
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2025-08-23T08:50:08.680029
### logo

- [logo/arcx_logo1-modified.png](logo/arcx_logo1-modified.png) — 1.4MB / 2025-08-23T08:50:08.710029
- [logo/av-black-logo-removebg-preview.png](logo/av-black-logo-removebg-preview.png) — 28.0KB / 2025-08-23T08:50:08.710029
- [logo/av-white-logo-removebg-preview.png](logo/av-white-logo-removebg-preview.png) — 33.1KB / 2025-08-23T08:50:08.710029
- [logo/base-logo.png](logo/base-logo.png) — 2.2KB / 2025-08-23T08:50:08.710029
- [logo/lod (1).fbx](logo/lod (1).fbx) — 2.1MB / 2025-08-23T08:50:08.712029
- [logo/lod (2).fbx](logo/lod (2).fbx) — 2.1MB / 2025-08-23T08:50:08.714029
- [logo/lod (3).fbx](logo/lod (3).fbx) — 2.1MB / 2025-08-23T08:50:08.715029
- [logo/lod.fbx](logo/lod.fbx) — 2.1MB / 2025-08-23T08:50:08.717029
### package.json

- [package.json](package.json) — 3.5KB / 2025-08-23T08:50:08.717029
### README.md

- [README.md](README.md) — 24.2KB / 2025-08-23T08:50:08.680029
### scripts

- [scripts/allocation-summary.ts](scripts/allocation-summary.ts) — 7.2KB / 2025-08-23T08:50:08.717029
- [scripts/auction-monitor.ts](scripts/auction-monitor.ts) — 13.4KB / 2025-08-23T08:50:08.717029
- [scripts/audit-trail.ts](scripts/audit-trail.ts) — 14.3KB / 2025-08-23T08:50:08.717029
- [scripts/deploy.ts](scripts/deploy.ts) — 8.8KB / 2025-08-23T08:50:08.717029
- [scripts/final-cleanup-audit.ts](scripts/final-cleanup-audit.ts) — 5.6KB / 2025-08-23T08:50:08.717029
- [scripts/finalize-auction.ts](scripts/finalize-auction.ts) — 4.6KB / 2025-08-23T08:50:08.717029
- [scripts/grant-auction-admin.ts](scripts/grant-auction-admin.ts) — 1.9KB / 2025-08-23T08:50:08.717029
- [scripts/health-check.ts](scripts/health-check.ts) — 25.3KB / 2025-08-23T08:50:08.718029
- [scripts/inspect-tx.js](scripts/inspect-tx.js) — 3.1KB / 2025-08-23T08:50:08.718029
- [scripts/liquidity.ts](scripts/liquidity.ts) — 9.0KB / 2025-08-23T08:50:08.718029
- [scripts/live-monitor.ts](scripts/live-monitor.ts) — 10.7KB / 2025-08-23T08:50:08.718029
- [scripts/lp-history.ts](scripts/lp-history.ts) — 7.4KB / 2025-08-23T08:50:08.718029
- [scripts/query-position.ts](scripts/query-position.ts) — 1.9KB / 2025-08-23T08:50:08.718029
- [scripts/quick-audit.ts](scripts/quick-audit.ts) — 4.1KB / 2025-08-23T08:50:08.718029
- [scripts/README.md](scripts/README.md) — 6.2KB / 2025-08-23T08:50:08.717029
- [scripts/revoke-excess-roles.ts](scripts/revoke-excess-roles.ts) — 2.5KB / 2025-08-23T08:50:08.718029
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.2KB / 2025-08-23T08:50:08.718029
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 7.8KB / 2025-08-23T08:50:08.718029
- [scripts/status.ts](scripts/status.ts) — 9.4KB / 2025-08-23T08:50:08.718029
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2025-08-23T08:50:08.718029
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2025-08-23T08:50:08.718029
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2025-08-23T08:50:08.718029
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2025-08-23T08:50:08.719029
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2025-08-23T08:50:08.719029
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2025-08-23T08:50:08.719029
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2025-08-23T08:50:08.719029
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2025-08-23T08:50:08.719029
- [tests/test_results.md](tests/test_results.md) — 1.9KB / 2025-08-23T08:50:08.719029
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2025-08-23T08:50:08.719029
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2025-08-23T08:50:08.719029
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2025-08-23T08:50:08.719029
### www

- [www/.gitignore](www/.gitignore) — 253.0B / 2025-08-23T08:50:08.719029
- [www/adam_protocol.html](www/adam_protocol.html) — 0.0B / 2025-08-23T08:50:08.719029
- [www/adam_short.html](www/adam_short.html) — 0.0B / 2025-08-23T08:50:08.719029
- [www/AdamProtocol.tsx](www/AdamProtocol.tsx) — 3.6KB / 2025-08-23T08:50:08.719029
- [www/App.tsx](www/App.tsx) — 1.1KB / 2025-08-23T08:50:08.719029
- [www/ArcxToken.tsx](www/ArcxToken.tsx) — 3.6KB / 2025-08-23T08:50:08.719029
- [www/components/About.tsx](www/components/About.tsx) — 0.0B / 2025-08-23T08:50:08.719029
- [www/components/AdamAbout.tsx](www/components/AdamAbout.tsx) — 5.7KB / 2025-08-23T08:50:08.719029
- [www/components/AdamArchitecture.tsx](www/components/AdamArchitecture.tsx) — 8.5KB / 2025-08-23T08:50:08.719029
- [www/components/AdamBackground.tsx](www/components/AdamBackground.tsx) — 5.1KB / 2025-08-23T08:50:08.719029
- [www/components/AdamHero.tsx](www/components/AdamHero.tsx) — 3.5KB / 2025-08-23T08:50:08.720029
- [www/components/AdamJoin.tsx](www/components/AdamJoin.tsx) — 3.7KB / 2025-08-23T08:50:08.720029
- [www/components/AdamLifecycle.tsx](www/components/AdamLifecycle.tsx) — 6.4KB / 2025-08-23T08:50:08.720029
- [www/components/AdamParameters.tsx](www/components/AdamParameters.tsx) — 3.4KB / 2025-08-23T08:50:08.720029
- [www/components/AdamSandbox.tsx](www/components/AdamSandbox.tsx) — 13.1KB / 2025-08-23T08:50:08.720029
- [www/components/AdamSecurity.tsx](www/components/AdamSecurity.tsx) — 6.3KB / 2025-08-23T08:50:08.720029
- [www/components/AdamTokenomics.tsx](www/components/AdamTokenomics.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/ArcHero.tsx](www/components/ArcHero.tsx) — 7.4KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxAcquire.tsx](www/components/ArcxAcquire.tsx) — 2.4KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxCore.tsx](www/components/ArcxCore.tsx) — 4.5KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxEcosystem.tsx](www/components/ArcxEcosystem.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/ArcxHero.tsx](www/components/ArcxHero.tsx) — 3.2KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxJoin.tsx](www/components/ArcxJoin.tsx) — 3.8KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxSecurity.tsx](www/components/ArcxSecurity.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/ArcxStaking.tsx](www/components/ArcxStaking.tsx) — 5.1KB / 2025-08-23T08:50:08.720029
- [www/components/ArcxTokenomics.tsx](www/components/ArcxTokenomics.tsx) — 4.0KB / 2025-08-23T08:50:08.720029
- [www/components/Community.tsx](www/components/Community.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/Entry.tsx](www/components/Entry.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/Footer.tsx](www/components/Footer.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/GovernanceParameters.tsx](www/components/GovernanceParameters.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/GovernanceSandbox.tsx](www/components/GovernanceSandbox.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/Header.tsx](www/components/Header.tsx) — 5.9KB / 2025-08-23T08:50:08.720029
- [www/components/Hero.tsx](www/components/Hero.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/Join.tsx](www/components/Join.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/LineAnimation.tsx](www/components/LineAnimation.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/NoiseBackground.tsx](www/components/NoiseBackground.tsx) — 5.5KB / 2025-08-23T08:50:08.720029
- [www/components/ParticleBackground.tsx](www/components/ParticleBackground.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/Roadmap.tsx](www/components/Roadmap.tsx) — 0.0B / 2025-08-23T08:50:08.720029
- [www/components/SbtConstellation.tsx](www/components/SbtConstellation.tsx) — 4.0KB / 2025-08-23T08:50:08.720029
- [www/components/SbtCore.tsx](www/components/SbtCore.tsx) — 4.1KB / 2025-08-23T08:50:08.721029
- [www/components/SbtCredentials.tsx](www/components/SbtCredentials.tsx) — 2.7KB / 2025-08-23T08:50:08.721029
- [www/components/SbtDecay.tsx](www/components/SbtDecay.tsx) — 4.1KB / 2025-08-23T08:50:08.721029
- [www/components/SbtHero.tsx](www/components/SbtHero.tsx) — 2.9KB / 2025-08-23T08:50:08.721029
- [www/components/SbtJoin.tsx](www/components/SbtJoin.tsx) — 3.8KB / 2025-08-23T08:50:08.721029
- [www/components/Tokenomics.tsx](www/components/Tokenomics.tsx) — 0.0B / 2025-08-23T08:50:08.721029
- [www/html-version/assets/icon.svg](www/html-version/assets/icon.svg) — 0.0B / 2025-08-23T08:50:08.721029
- [www/html-version/css/style.css](www/html-version/css/style.css) — 12.9KB / 2025-08-23T08:50:08.721029
- [www/html-version/index.html](www/html-version/index.html) — 9.0KB / 2025-08-23T08:50:08.721029
- [www/html-version/js/main.js](www/html-version/js/main.js) — 10.9KB / 2025-08-23T08:50:08.721029
- [www/index.html](www/index.html) — 9.9KB / 2025-08-23T08:50:08.721029
- [www/index.tsx](www/index.tsx) — 351.0B / 2025-08-23T08:50:08.721029
- [www/metadata.json](www/metadata.json) — 240.0B / 2025-08-23T08:50:08.721029
- [www/package.json](www/package.json) — 598.0B / 2025-08-23T08:50:08.721029
- [www/README.md](www/README.md) — 553.0B / 2025-08-23T08:50:08.719029
- [www/SbtIdentity.tsx](www/SbtIdentity.tsx) — 3.2KB / 2025-08-23T08:50:08.719029
- [www/tsconfig.json](www/tsconfig.json) — 542.0B / 2025-08-23T08:50:08.721029
- [www/types.ts](www/types.ts) — 216.0B / 2025-08-23T08:50:08.721029
- [www/vite.config.ts](www/vite.config.ts) — 679.0B / 2025-08-23T08:50:08.721029

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.