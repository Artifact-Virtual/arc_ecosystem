# Codebase overview — Devs & Contributors

*Generated: 2026-01-17T20:55:47.829245 UTC*

## Quick stats

- Root: `ARC`
- Files indexed: **371**
- Total size: **23.2MB**

## Top-level directories

- **.eslintrc.json** — 1 files, 827.0B
- **.githooks** — 2 files, 2.7KB
- **.github** — 5 files, 13.8KB
- **.gitignore** — 1 files, 453.0B
- **.hardhatignore** — 1 files, 22.0B
- **.npmrc** — 1 files, 237.0B
- **.openzeppelin** — 1 files, 22.9KB
- **.prettierrc.json** — 1 files, 199.0B
- **.solhintignore** — 1 files, 51.0B
- **address.book** — 1 files, 4.3KB
- **ai-engine** — 25 files, 81.3KB
- **arc-cli** — 17 files, 163.0KB
- **arc_preview.html** — 1 files, 17.0KB
- **audit** — 4 files, 20.5KB
- **auto_audit.ps1** — 1 files, 3.0KB
- **check-positions.js** — 1 files, 4.5KB
- **code_indexer.ps1** — 1 files, 941.0B
- **CODEBASE_OVERVIEW.md** — 1 files, 45.7KB
- **contracts** — 146 files, 884.2KB
- **css** — 2 files, 14.7KB
- **deploy_auction.ps1** — 1 files, 5.2KB
- **deployment** — 1 files, 0.0B
- **docs** — 76 files, 21.4MB
- **echidna.yaml** — 1 files, 1.1KB
- **eslint.config.js** — 1 files, 1.6KB
- **foundry-scripts** — 8 files, 56.6KB
- **ganache-db** — 4 files, 112.0B
- **gas-report.txt** — 1 files, 3.6KB
- **gas-reports** — 2 files, 41.5KB
- **hardhat.config.ts** — 1 files, 5.6KB
- **IMPLEMENTATION_SUMMARY.md** — 1 files, 9.7KB
- **js** — 3 files, 38.9KB
- **LICENSE** — 1 files, 2.9KB
- **package.json** — 1 files, 7.8KB
- **README.md** — 1 files, 8.1KB
- **run-audit-and-append.ps1** — 1 files, 3.0KB
- **scripts** — 20 files, 113.5KB
- **SECURITY_AUDIT.md** — 1 files, 14.2KB
- **src** — 3 files, 58.4KB
- **TERMINAL_UI_DEMO.txt** — 1 files, 16.3KB
- **tests** — 24 files, 224.0KB
- **tools** — 2 files, 8.1KB
- **trader.py** — 1 files, 6.0KB
- **tsconfig.json** — 1 files, 589.0B

## Table of contents

### .eslintrc.json

- [.eslintrc.json](.eslintrc.json) — 827.0B / 2026-01-17T20:55:46.754939
### .githooks

- [.githooks/pre-commit](.githooks/pre-commit) — 1.8KB / 2026-01-17T20:55:46.754939
- [.githooks/pre-push](.githooks/pre-push) — 904.0B / 2026-01-17T20:55:46.754939
### .github

- [.github/FUNDING.yml](.github/FUNDING.yml) — 464.0B / 2026-01-17T20:55:46.754939
- [.github/pull_request_template.md](.github/pull_request_template.md) — 1.5KB / 2026-01-17T20:55:46.754939
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — 1.6KB / 2026-01-17T20:55:46.754939
- [.github/workflows/code_indexer.yml](.github/workflows/code_indexer.yml) — 1.3KB / 2026-01-17T20:55:46.755939
- [.github/workflows/security.yml](.github/workflows/security.yml) — 8.9KB / 2026-01-17T20:55:46.755939
### .gitignore

- [.gitignore](.gitignore) — 453.0B / 2026-01-17T20:55:46.755939
### .hardhatignore

- [.hardhatignore](.hardhatignore) — 22.0B / 2026-01-17T20:55:46.755939
### .npmrc

- [.npmrc](.npmrc) — 237.0B / 2026-01-17T20:55:46.755939
### .openzeppelin

- [.openzeppelin/base.json](.openzeppelin/base.json) — 22.9KB / 2026-01-17T20:55:46.755939
### .prettierrc.json

- [.prettierrc.json](.prettierrc.json) — 199.0B / 2026-01-17T20:55:46.755939
### .solhintignore

- [.solhintignore](.solhintignore) — 51.0B / 2026-01-17T20:55:46.755939
### address.book

- [address.book](address.book) — 4.3KB / 2026-01-17T20:55:46.756938
### ai-engine

- [ai-engine/backend/.dockerignore](ai-engine/backend/.dockerignore) — 40.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/DEPLOYMENT.md](ai-engine/backend/DEPLOYMENT.md) — 6.2KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/docker-compose.yml](ai-engine/backend/docker-compose.yml) — 926.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/Dockerfile](ai-engine/backend/Dockerfile) — 341.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/healthcheck.js](ai-engine/backend/healthcheck.js) — 324.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/package.json](ai-engine/backend/package.json) — 1.1KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/README.md](ai-engine/backend/README.md) — 5.9KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/scripts/generate-backend.sh](ai-engine/backend/scripts/generate-backend.sh) — 9.9KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/scripts/setup.sh](ai-engine/backend/scripts/setup.sh) — 2.5KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/src/config/index.ts](ai-engine/backend/src/config/index.ts) — 858.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/src/controllers/ChatController.ts](ai-engine/backend/src/controllers/ChatController.ts) — 1.1KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/src/controllers/ContractController.ts](ai-engine/backend/src/controllers/ContractController.ts) — 1.7KB / 2026-01-17T20:55:46.756938
- [ai-engine/backend/src/index.ts](ai-engine/backend/src/index.ts) — 552.0B / 2026-01-17T20:55:46.756938
- [ai-engine/backend/src/routes/chat.ts](ai-engine/backend/src/routes/chat.ts) — 345.0B / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/routes/contract.ts](ai-engine/backend/src/routes/contract.ts) — 409.0B / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/routes/index.ts](ai-engine/backend/src/routes/index.ts) — 233.0B / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/services/BlockchainService.ts](ai-engine/backend/src/services/BlockchainService.ts) — 1.3KB / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/services/ContractService.ts](ai-engine/backend/src/services/ContractService.ts) — 907.0B / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/services/LLMService.ts](ai-engine/backend/src/services/LLMService.ts) — 2.1KB / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/services/MCPService.ts](ai-engine/backend/src/services/MCPService.ts) — 2.2KB / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/services/VectorDBService.ts](ai-engine/backend/src/services/VectorDBService.ts) — 1.4KB / 2026-01-17T20:55:46.757938
- [ai-engine/backend/src/utils/logger.ts](ai-engine/backend/src/utils/logger.ts) — 179.0B / 2026-01-17T20:55:46.757938
- [ai-engine/backend/tsconfig.json](ai-engine/backend/tsconfig.json) — 449.0B / 2026-01-17T20:55:46.757938
- [ai-engine/frontend/ai-assistant.html](ai-engine/frontend/ai-assistant.html) — 29.6KB / 2026-01-17T20:55:46.757938
- [ai-engine/README.md](ai-engine/README.md) — 10.7KB / 2026-01-17T20:55:46.756938
### arc-cli

- [arc-cli/DEMO.md](arc-cli/DEMO.md) — 27.9KB / 2026-01-17T20:55:46.757938
- [arc-cli/index.js](arc-cli/index.js) — 5.1KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/config.js](arc-cli/lib/config.js) — 9.6KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/deployments.js](arc-cli/lib/deployments.js) — 6.7KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/ecosystem.js](arc-cli/lib/ecosystem.js) — 15.2KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/monitoring.js](arc-cli/lib/monitoring.js) — 15.5KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/navigation.js](arc-cli/lib/navigation.js) — 7.0KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/nfts.js](arc-cli/lib/nfts.js) — 6.1KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/sbts.js](arc-cli/lib/sbts.js) — 8.5KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/theme.js](arc-cli/lib/theme.js) — 2.5KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/tokens.js](arc-cli/lib/tokens.js) — 13.1KB / 2026-01-17T20:55:46.758939
- [arc-cli/lib/utils.js](arc-cli/lib/utils.js) — 6.3KB / 2026-01-17T20:55:46.758939
- [arc-cli/package.json](arc-cli/package.json) — 770.0B / 2026-01-17T20:55:46.758939
- [arc-cli/PROJECT_SUMMARY.md](arc-cli/PROJECT_SUMMARY.md) — 11.0KB / 2026-01-17T20:55:46.757938
- [arc-cli/README.md](arc-cli/README.md) — 15.2KB / 2026-01-17T20:55:46.757938
- [arc-cli/start.sh](arc-cli/start.sh) — 2.0KB / 2026-01-17T20:55:46.758939
- [arc-cli/USAGE.md](arc-cli/USAGE.md) — 10.4KB / 2026-01-17T20:55:46.757938
### arc_preview.html

- [arc_preview.html](arc_preview.html) — 17.0KB / 2026-01-17T20:55:46.758939
### audit

- [audit/FINDING_TEMPLATE.md](audit/FINDING_TEMPLATE.md) — 2.6KB / 2026-01-17T20:55:46.758939
- [audit/README.md](audit/README.md) — 2.3KB / 2026-01-17T20:55:46.759938
- [audit/scripts/generate-report.ts](audit/scripts/generate-report.ts) — 2.8KB / 2026-01-17T20:55:46.759938
- [audit/security-report.md](audit/security-report.md) — 12.9KB / 2026-01-17T20:55:46.759938
### auto_audit.ps1

- [auto_audit.ps1](auto_audit.ps1) — 3.0KB / 2026-01-17T20:55:46.759938
### check-positions.js

- [check-positions.js](check-positions.js) — 4.5KB / 2026-01-17T20:55:46.759938
### code_indexer.ps1

- [code_indexer.ps1](code_indexer.ps1) — 941.0B / 2026-01-17T20:55:46.759938
### CODEBASE_OVERVIEW.md

- [CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md) — 45.7KB / 2026-01-17T20:55:46.755939
### contracts

- [contracts/contracts_registry.json](contracts/contracts_registry.json) — 7.8KB / 2026-01-17T20:55:46.759938
- [contracts/contracts_registry.md](contracts/contracts_registry.md) — 8.7KB / 2026-01-17T20:55:46.759938
- [contracts/dao/adam/AdamHost.sol](contracts/dao/adam/AdamHost.sol) — 13.9KB / 2026-01-17T20:55:46.759938
- [contracts/dao/adam/AdamRegistry.sol](contracts/dao/adam/AdamRegistry.sol) — 10.9KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/functions.json](contracts/dao/adam/functions.json) — 19.8KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/interfaces/IAdamHost.sol](contracts/dao/adam/interfaces/IAdamHost.sol) — 3.4KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/interfaces/IAdamPolicy.sol](contracts/dao/adam/interfaces/IAdamPolicy.sol) — 837.0B / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/interfaces/IAdamRegistry.sol](contracts/dao/adam/interfaces/IAdamRegistry.sol) — 3.1KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/policies/Dual2FAPolicy.sol](contracts/dao/adam/policies/Dual2FAPolicy.sol) — 7.1KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/policies/ParamsGuardPolicy.sol](contracts/dao/adam/policies/ParamsGuardPolicy.sol) — 6.6KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/policies/RWARecencyPolicy.sol](contracts/dao/adam/policies/RWARecencyPolicy.sol) — 9.0KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/policies/TreasuryLimiterPolicy.sol](contracts/dao/adam/policies/TreasuryLimiterPolicy.sol) — 10.5KB / 2026-01-17T20:55:46.760938
- [contracts/dao/adam/README.md](contracts/dao/adam/README.md) — 7.4KB / 2026-01-17T20:55:46.760938
- [contracts/dao/governance/AdamGovernorIntegration.sol](contracts/dao/governance/AdamGovernorIntegration.sol) — 9.1KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/arc-genesis/AUDIT_REPORT_V2.md](contracts/dao/governance/arc-genesis/AUDIT_REPORT_V2.md) — 20.8KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/arc-genesis/contracts/genesis/ARCGenesis.sol](contracts/dao/governance/arc-genesis/contracts/genesis/ARCGenesis.sol) — 1.5KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/genesis/IARCGenesis.sol](contracts/dao/governance/arc-genesis/contracts/genesis/IARCGenesis.sol) — 459.0B / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/libraries/Errors.sol](contracts/dao/governance/arc-genesis/contracts/libraries/Errors.sol) — 1.7KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/libraries/MODEL_CLASS_SCHEMA.md](contracts/dao/governance/arc-genesis/contracts/libraries/MODEL_CLASS_SCHEMA.md) — 8.5KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/libraries/ModelClass.sol](contracts/dao/governance/arc-genesis/contracts/libraries/ModelClass.sol) — 1.0KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/libraries/ModelClassSchema.sol](contracts/dao/governance/arc-genesis/contracts/libraries/ModelClassSchema.sol) — 11.2KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/registry/ARCModelRegistry.sol](contracts/dao/governance/arc-genesis/contracts/registry/ARCModelRegistry.sol) — 1.9KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/registry/ARCModelRegistryV2.sol](contracts/dao/governance/arc-genesis/contracts/registry/ARCModelRegistryV2.sol) — 9.0KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/registry/IARCModelRegistry.sol](contracts/dao/governance/arc-genesis/contracts/registry/IARCModelRegistry.sol) — 660.0B / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/registry/IARCModelRegistryV2.sol](contracts/dao/governance/arc-genesis/contracts/registry/IARCModelRegistryV2.sol) — 2.6KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/registry/RegistryProxy.sol](contracts/dao/governance/arc-genesis/contracts/registry/RegistryProxy.sol) — 4.4KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/sbt/ARCModelSBT.sol](contracts/dao/governance/arc-genesis/contracts/sbt/ARCModelSBT.sol) — 2.8KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/sbt/ARCModelSBTV2.sol](contracts/dao/governance/arc-genesis/contracts/sbt/ARCModelSBTV2.sol) — 6.4KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/sbt/IARCModelSBT.sol](contracts/dao/governance/arc-genesis/contracts/sbt/IARCModelSBT.sol) — 814.0B / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/contracts/sbt/SBTProxy.sol](contracts/dao/governance/arc-genesis/contracts/sbt/SBTProxy.sol) — 2.2KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-genesis/contracts/utils/Immutable.sol](contracts/dao/governance/arc-genesis/contracts/utils/Immutable.sol) — 1.4KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-genesis/DEPLOYMENT_GUIDE.md](contracts/dao/governance/arc-genesis/DEPLOYMENT_GUIDE.md) — 13.1KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/arc-genesis/DOCUMENTATION.md](contracts/dao/governance/arc-genesis/DOCUMENTATION.md) — 23.6KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/arc-genesis/foundry.toml](contracts/dao/governance/arc-genesis/foundry.toml) — 661.0B / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-genesis/INTEGRATION_GUIDE.md](contracts/dao/governance/arc-genesis/INTEGRATION_GUIDE.md) — 15.6KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-genesis/README.md](contracts/dao/governance/arc-genesis/README.md) — 8.9KB / 2026-01-17T20:55:46.762938
- [contracts/dao/governance/arc-protocol-genesis/contracts/ARCProtocolGenesis.sol](contracts/dao/governance/arc-protocol-genesis/contracts/ARCProtocolGenesis.sol) — 16.4KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-protocol-genesis/contracts/IARCProtocolGenesis.sol](contracts/dao/governance/arc-protocol-genesis/contracts/IARCProtocolGenesis.sol) — 3.3KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-protocol-genesis/contracts/L2GenesisVerifier.sol](contracts/dao/governance/arc-protocol-genesis/contracts/L2GenesisVerifier.sol) — 6.9KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-protocol-genesis/DESIGN_BLUEPRINT.md](contracts/dao/governance/arc-protocol-genesis/DESIGN_BLUEPRINT.md) — 37.8KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-protocol-genesis/foundry.toml](contracts/dao/governance/arc-protocol-genesis/foundry.toml) — 966.0B / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/arc-protocol-genesis/README.md](contracts/dao/governance/arc-protocol-genesis/README.md) — 14.9KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/ARCDAO.sol](contracts/dao/governance/ARCDAO.sol) — 15.1KB / 2026-01-17T20:55:46.760938
- [contracts/dao/governance/ARCGovernor.sol](contracts/dao/governance/ARCGovernor.sol) — 22.0KB / 2026-01-17T20:55:46.760938
- [contracts/dao/governance/ARCProposal.sol](contracts/dao/governance/ARCProposal.sol) — 21.1KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/ARCTimelock.sol](contracts/dao/governance/ARCTimelock.sol) — 16.9KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/ARCTreasury.sol](contracts/dao/governance/ARCTreasury.sol) — 17.5KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/ARCVoting.sol](contracts/dao/governance/ARCVoting.sol) — 18.0KB / 2026-01-17T20:55:46.761938
- [contracts/dao/governance/interfaces/IEligibility.sol](contracts/dao/governance/interfaces/IEligibility.sol) — 2.5KB / 2026-01-17T20:55:46.763938
- [contracts/dao/governance/README.md](contracts/dao/governance/README.md) — 10.9KB / 2026-01-17T20:55:46.761938
- [contracts/dao/interfaces/IARCDAO.sol](contracts/dao/interfaces/IARCDAO.sol) — 2.6KB / 2026-01-17T20:55:46.763938
- [contracts/dao/interfaces/IARCGovernor.sol](contracts/dao/interfaces/IARCGovernor.sol) — 2.5KB / 2026-01-17T20:55:46.763938
- [contracts/dao/interfaces/IARCProposal.sol](contracts/dao/interfaces/IARCProposal.sol) — 2.7KB / 2026-01-17T20:55:46.763938
- [contracts/dao/interfaces/IARCTimelock.sol](contracts/dao/interfaces/IARCTimelock.sol) — 2.3KB / 2026-01-17T20:55:46.763938
- [contracts/dao/interfaces/IARCTreasury.sol](contracts/dao/interfaces/IARCTreasury.sol) — 2.7KB / 2026-01-17T20:55:46.764938
- [contracts/dao/interfaces/IARCVoting.sol](contracts/dao/interfaces/IARCVoting.sol) — 2.7KB / 2026-01-17T20:55:46.764938
- [contracts/defi/ARCSwap.sol](contracts/defi/ARCSwap.sol) — 16.4KB / 2026-01-17T20:55:46.764938
- [contracts/defi/hooks/ARCxHook.sol](contracts/defi/hooks/ARCxHook.sol) — 0.0B / 2026-01-17T20:55:46.764938
- [contracts/defi/hooks/ARCxLPHook.sol](contracts/defi/hooks/ARCxLPHook.sol) — 9.9KB / 2026-01-17T20:55:46.764938
- [contracts/defi/infrastructure/ARCBridge.sol](contracts/defi/infrastructure/ARCBridge.sol) — 20.3KB / 2026-01-17T20:55:46.764938
- [contracts/defi/MockPoolManager.sol](contracts/defi/MockPoolManager.sol) — 3.3KB / 2026-01-17T20:55:46.764938
- [contracts/defi/PenaltyVault.sol](contracts/defi/PenaltyVault.sol) — 1.2KB / 2026-01-17T20:55:46.764938
- [contracts/defi/rwa/ARC_RWARegistry.sol](contracts/defi/rwa/ARC_RWARegistry.sol) — 16.7KB / 2026-01-17T20:55:46.764938
- [contracts/defi/rwa/IRWARegistry.sol](contracts/defi/rwa/IRWARegistry.sol) — 8.0KB / 2026-01-17T20:55:46.764938
- [contracts/defi/rwa/SlashingVault.sol](contracts/defi/rwa/SlashingVault.sol) — 14.0KB / 2026-01-17T20:55:46.764938
- [contracts/defi/StakingVault.sol](contracts/defi/StakingVault.sol) — 5.5KB / 2026-01-17T20:55:46.764938
- [contracts/defi/TreasuryRewards.sol](contracts/defi/TreasuryRewards.sol) — 4.5KB / 2026-01-17T20:55:46.764938
- [contracts/mocks/MockEligibility.sol](contracts/mocks/MockEligibility.sol) — 1.1KB / 2026-01-17T20:55:46.765939
- [contracts/pool/IPoolManager.sol](contracts/pool/IPoolManager.sol) — 1.6KB / 2026-01-17T20:55:46.765939
- [contracts/pool/IPositionManager.sol](contracts/pool/IPositionManager.sol) — 715.0B / 2026-01-17T20:55:46.765939
- [contracts/pool/IWETH.sol](contracts/pool/IWETH.sol) — 234.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/GasOptimization.sol](contracts/thirdparty/GasOptimization.sol) — 8.6KB / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol](contracts/thirdparty/uniswap-v4-core/ProtocolFees.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol](contracts/thirdparty/uniswap-v4/base/ERC721Permit_v4.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WETHHook.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol](contracts/thirdparty/uniswap-v4/hooks/WstETHHook.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol](contracts/thirdparty/uniswap-v4/interfaces/IHooks.sol) — 3.7KB / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol](contracts/thirdparty/uniswap-v4/interfaces/IPermit2Forwarder.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol](contracts/thirdparty/uniswap-v4/libraries/Descriptor.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol](contracts/thirdparty/uniswap-v4/libraries/SafeCurrencyMetadata.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/libraries/SVG.sol](contracts/thirdparty/uniswap-v4/libraries/SVG.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol](contracts/thirdparty/uniswap-v4/NonfungiblePositionManager.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol](contracts/thirdparty/uniswap-v4/permit2/src/interfaces/IAllowanceTransfer.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol](contracts/thirdparty/uniswap-v4/permit2/src/libraries/SignatureVerification.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/thirdparty/uniswap-v4/PositionManager.sol](contracts/thirdparty/uniswap-v4/PositionManager.sol) — 0.0B / 2026-01-17T20:55:46.765939
- [contracts/tokens/airdrop/ARCxAirdropContract.sol](contracts/tokens/airdrop/ARCxAirdropContract.sol) — 14.2KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-s/ARCs.sol](contracts/tokens/arc-s/ARCs.sol) — 3.8KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md](contracts/tokens/arc-s/DEPLOYMENT_CHECKLIST.md) — 4.8KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-s/deployment_notes.md](contracts/tokens/arc-s/deployment_notes.md) — 4.1KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-x/ARCxMath.sol](contracts/tokens/arc-x/ARCxMath.sol) — 1.8KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-x/ARCxV2.sol](contracts/tokens/arc-x/ARCxV2.sol) — 16.1KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-x/GasOptimizedARCx.sol](contracts/tokens/arc-x/GasOptimizedARCx.sol) — 8.4KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-x/interfaces/IERC20.sol](contracts/tokens/arc-x/interfaces/IERC20.sol) — 712.0B / 2026-01-17T20:55:46.766938
- [contracts/tokens/arc-x/README.md](contracts/tokens/arc-x/README.md) — 24.9KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/MockARCxToken.sol](contracts/tokens/MockARCxToken.sol) — 359.0B / 2026-01-17T20:55:46.765939
- [contracts/tokens/MockWETH.sol](contracts/tokens/MockWETH.sol) — 560.0B / 2026-01-17T20:55:46.765939
- [contracts/tokens/nft/CONTRACT_MAPPING.md](contracts/tokens/nft/CONTRACT_MAPPING.md) — 2.9KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/nft/contracts/CompanionGovernance.sol](contracts/tokens/nft/contracts/CompanionGovernance.sol) — 5.2KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/EmergencyManager.sol](contracts/tokens/nft/contracts/EmergencyManager.sol) — 1016.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/EvolvingCompanion.sol](contracts/tokens/nft/contracts/EvolvingCompanion.sol) — 5.0KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/EvolvingCompanionUpgradeable.sol](contracts/tokens/nft/contracts/EvolvingCompanionUpgradeable.sol) — 3.4KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ModelRegistry.sol](contracts/tokens/nft/contracts/ModelRegistry.sol) — 903.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ModelRegistryUpgradeable.sol](contracts/tokens/nft/contracts/ModelRegistryUpgradeable.sol) — 11.6KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ModelRegistryUpgradeableSimple.sol](contracts/tokens/nft/contracts/ModelRegistryUpgradeableSimple.sol) — 1.5KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ModuleManager.sol](contracts/tokens/nft/contracts/ModuleManager.sol) — 1.7KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ModuleMock.sol](contracts/tokens/nft/contracts/ModuleMock.sol) — 1.2KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/ProverRegistry.sol](contracts/tokens/nft/contracts/ProverRegistry.sol) — 1.0KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/TokenBoundAccount.sol](contracts/tokens/nft/contracts/TokenBoundAccount.sol) — 2.2KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/TokenBoundAccountRegistry.sol](contracts/tokens/nft/contracts/TokenBoundAccountRegistry.sol) — 2.3KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/TraitVault.sol](contracts/tokens/nft/contracts/TraitVault.sol) — 3.9KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/contracts/TraitVaultUpgradeable.sol](contracts/tokens/nft/contracts/TraitVaultUpgradeable.sol) — 3.9KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/.gitignore](contracts/tokens/nft/frontend/.gitignore) — 480.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/data/archetypes.json](contracts/tokens/nft/frontend/data/archetypes.json) — 1.3KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/data/traits.json](contracts/tokens/nft/frontend/data/traits.json) — 1022.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/eslint.config.mjs](contracts/tokens/nft/frontend/eslint.config.mjs) — 524.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/next.config.ts](contracts/tokens/nft/frontend/next.config.ts) — 133.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/package.json](contracts/tokens/nft/frontend/package.json) — 794.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/postcss.config.mjs](contracts/tokens/nft/frontend/postcss.config.mjs) — 81.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/public/file.svg](contracts/tokens/nft/frontend/public/file.svg) — 391.0B / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/public/globe.svg](contracts/tokens/nft/frontend/public/globe.svg) — 1.0KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/public/next.svg](contracts/tokens/nft/frontend/public/next.svg) — 1.3KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/public/vercel.svg](contracts/tokens/nft/frontend/public/vercel.svg) — 128.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/public/window.svg](contracts/tokens/nft/frontend/public/window.svg) — 385.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/README.md](contracts/tokens/nft/frontend/README.md) — 13.3KB / 2026-01-17T20:55:46.767938
- [contracts/tokens/nft/frontend/src/app/companion/[id]/page.tsx](contracts/tokens/nft/frontend/src/app/companion/[id]/page.tsx) — 1.2KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/app/favicon.ico](contracts/tokens/nft/frontend/src/app/favicon.ico) — 25.3KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/app/globals.css](contracts/tokens/nft/frontend/src/app/globals.css) — 488.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/app/layout.tsx](contracts/tokens/nft/frontend/src/app/layout.tsx) — 831.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/app/page.tsx](contracts/tokens/nft/frontend/src/app/page.tsx) — 8.5KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/components/CompanionMint.tsx](contracts/tokens/nft/frontend/src/components/CompanionMint.tsx) — 5.7KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/components/CompanionProfile.tsx](contracts/tokens/nft/frontend/src/components/CompanionProfile.tsx) — 13.9KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/components/providers.tsx](contracts/tokens/nft/frontend/src/components/providers.tsx) — 792.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/src/components/TraitGallery.tsx](contracts/tokens/nft/frontend/src/components/TraitGallery.tsx) — 4.8KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/frontend/tsconfig.json](contracts/tokens/nft/frontend/tsconfig.json) — 602.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/hardhat.config.js](contracts/tokens/nft/hardhat.config.js) — 526.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/package.json](contracts/tokens/nft/package.json) — 723.0B / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/README.md](contracts/tokens/nft/README.md) — 11.3KB / 2026-01-17T20:55:46.766938
- [contracts/tokens/nft/scripts/deploy.js](contracts/tokens/nft/scripts/deploy.js) — 1.8KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/scripts/deploy_roles_and_demo.js](contracts/tokens/nft/scripts/deploy_roles_and_demo.js) — 1.8KB / 2026-01-17T20:55:46.768938
- [contracts/tokens/nft/scripts/upgrade.js](contracts/tokens/nft/scripts/upgrade.js) — 1.3KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/nft/test/EvolvingCompanionAccessControl.test.js](contracts/tokens/nft/test/EvolvingCompanionAccessControl.test.js) — 7.0KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/nft/test/phase1.test.js](contracts/tokens/nft/test/phase1.test.js) — 7.7KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/sbt/ARC_Eligibility.sol](contracts/tokens/sbt/ARC_Eligibility.sol) — 14.3KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/sbt/ARC_IdentitySBT.sol](contracts/tokens/sbt/ARC_IdentitySBT.sol) — 18.6KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/sbt/readme.md](contracts/tokens/sbt/readme.md) — 3.0KB / 2026-01-17T20:55:46.769938
- [contracts/tokens/vesting/ARCxVestingContract.sol](contracts/tokens/vesting/ARCxVestingContract.sol) — 13.7KB / 2026-01-17T20:55:46.769938
### css

- [css/lines.svg](css/lines.svg) — 413.0B / 2026-01-17T20:55:46.769938
- [css/style.css](css/style.css) — 14.3KB / 2026-01-17T20:55:46.769938
### deploy_auction.ps1

- [deploy_auction.ps1](deploy_auction.ps1) — 5.2KB / 2026-01-17T20:55:46.769938
### deployment

- [deployment/testnet/deploy-ganache.ts](deployment/testnet/deploy-ganache.ts) — 0.0B / 2026-01-17T20:55:46.769938
### docs

- [docs/00_README_FULL.md](docs/00_README_FULL.md) — 14.9KB / 2026-01-17T20:55:46.769938
- [docs/01_INTRODUCTION.md](docs/01_INTRODUCTION.md) — 3.1KB / 2026-01-17T20:55:46.770938
- [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md) — 11.0KB / 2026-01-17T20:55:46.770938
- [docs/03_DEVELOPMENT.md](docs/03_DEVELOPMENT.md) — 14.8KB / 2026-01-17T20:55:46.770938
- [docs/04_TOKENS.md](docs/04_TOKENS.md) — 12.7KB / 2026-01-17T20:55:46.770938
- [docs/05_GOVERNANCE.md](docs/05_GOVERNANCE.md) — 13.8KB / 2026-01-17T20:55:46.770938
- [docs/06_DEFI.md](docs/06_DEFI.md) — 12.1KB / 2026-01-17T20:55:46.770938
- [docs/07_SECURITY.md](docs/07_SECURITY.md) — 12.5KB / 2026-01-17T20:55:46.770938
- [docs/08_API_REFERENCE.md](docs/08_API_REFERENCE.md) — 15.7KB / 2026-01-17T20:55:46.770938
- [docs/09_DEPLOYMENT.md](docs/09_DEPLOYMENT.md) — 11.9KB / 2026-01-17T20:55:46.770938
- [docs/10_SCRIPTS.md](docs/10_SCRIPTS.md) — 13.1KB / 2026-01-17T20:55:46.770938
- [docs/11_TROUBLESHOOTING.md](docs/11_TROUBLESHOOTING.md) — 15.2KB / 2026-01-17T20:55:46.770938
- [docs/ADAM_INTEGRATION_GUIDE.md](docs/ADAM_INTEGRATION_GUIDE.md) — 12.8KB / 2026-01-17T20:55:46.771938
- [docs/archive/README.md](docs/archive/README.md) — 350.0B / 2026-01-17T20:55:46.771938
- [docs/archive/README_legacy_full.md](docs/archive/README_legacy_full.md) — 11.6KB / 2026-01-17T20:55:46.771938
- [docs/arcx-v2-enhanced-features.md](docs/arcx-v2-enhanced-features.md) — 5.7KB / 2026-01-17T20:55:46.771938
- [docs/assets/images/SBT_bg.jpeg](docs/assets/images/SBT_bg.jpeg) — 85.9KB / 2026-01-17T20:55:46.771938
- [docs/assets/images/system_diagram20250830.drawio](docs/assets/images/system_diagram20250830.drawio) — 46.0KB / 2026-01-17T20:55:46.772938
- [docs/assets/images/system_overview.mermaid](docs/assets/images/system_overview.mermaid) — 6.6KB / 2026-01-17T20:55:46.772938
- [docs/assets/index-CXsZFpx3.js](docs/assets/index-CXsZFpx3.js) — 549.2KB / 2026-01-17T20:55:46.774938
- [docs/assets/lod (1).fbx](docs/assets/lod (1).fbx) — 2.1MB / 2026-01-17T20:55:46.786938
- [docs/assets/lod (2).fbx](docs/assets/lod (2).fbx) — 2.1MB / 2026-01-17T20:55:46.788938
- [docs/assets/lod (3).fbx](docs/assets/lod (3).fbx) — 2.1MB / 2026-01-17T20:55:46.790938
- [docs/assets/lod.fbx](docs/assets/lod.fbx) — 2.1MB / 2026-01-17T20:55:46.792938
- [docs/assets/logos/arcx_logo.png](docs/assets/logos/arcx_logo.png) — 1.4MB / 2026-01-17T20:55:46.794938
- [docs/assets/logos/arcx_logo.svg](docs/assets/logos/arcx_logo.svg) — 1.2MB / 2026-01-17T20:55:46.799938
- [docs/assets/logos/av-black-logo-removebg-preview.png](docs/assets/logos/av-black-logo-removebg-preview.png) — 28.0KB / 2026-01-17T20:55:46.800938
- [docs/assets/logos/av-white-logo-removebg-preview.png](docs/assets/logos/av-white-logo-removebg-preview.png) — 33.1KB / 2026-01-17T20:55:46.800938
- [docs/assets/logos/base-logo.png](docs/assets/logos/base-logo.png) — 2.2KB / 2026-01-17T20:55:46.800938
- [docs/community_message.md](docs/community_message.md) — 5.9KB / 2026-01-17T20:55:46.800938
- [docs/diagrams/arc.png](docs/diagrams/arc.png) — 198.8KB / 2026-01-17T20:55:46.801938
- [docs/diagrams/arc_map.md](docs/diagrams/arc_map.md) — 7.1KB / 2026-01-17T20:55:46.801938
- [docs/diagrams/enerygy_cap.md](docs/diagrams/enerygy_cap.md) — 3.9KB / 2026-01-17T20:55:46.801938
- [docs/diagrams/layers.md](docs/diagrams/layers.md) — 2.1KB / 2026-01-17T20:55:46.801938
- [docs/diagrams/lifecycle.md](docs/diagrams/lifecycle.md) — 1.9KB / 2026-01-17T20:55:46.801938
- [docs/environment/CODE_OF_CONDUCT.md](docs/environment/CODE_OF_CONDUCT.md) — 6.2KB / 2026-01-17T20:55:46.801938
- [docs/environment/CONTRIBUTING.md](docs/environment/CONTRIBUTING.md) — 11.9KB / 2026-01-17T20:55:46.801938
- [docs/environment/DEPLOYMENT_README.md](docs/environment/DEPLOYMENT_README.md) — 5.8KB / 2026-01-17T20:55:46.801938
- [docs/environment/ENVIRONMENT_SETUP.md](docs/environment/ENVIRONMENT_SETUP.md) — 5.4KB / 2026-01-17T20:55:46.801938
- [docs/environment/README.md](docs/environment/README.md) — 1.1KB / 2026-01-17T20:55:46.801938
- [docs/environment/SBT_TOKENS_DEPLOYMENT_README.md](docs/environment/SBT_TOKENS_DEPLOYMENT_README.md) — 4.9KB / 2026-01-17T20:55:46.801938
- [docs/governance/assets/arcx_lp_nft.mp4](docs/governance/assets/arcx_lp_nft.mp4) — 353.2KB / 2026-01-17T20:55:46.803938
- [docs/governance/assets/lod (1).fbx](docs/governance/assets/lod (1).fbx) — 2.1MB / 2026-01-17T20:55:46.805938
- [docs/governance/assets/lod (2).fbx](docs/governance/assets/lod (2).fbx) — 2.1MB / 2026-01-17T20:55:46.806938
- [docs/governance/assets/lod (3).fbx](docs/governance/assets/lod (3).fbx) — 2.1MB / 2026-01-17T20:55:46.808938
- [docs/governance/assets/lod.fbx](docs/governance/assets/lod.fbx) — 2.1MB / 2026-01-17T20:55:46.810938
- [docs/governance/deployment_plan.md](docs/governance/deployment_plan.md) — 828.0B / 2026-01-17T20:55:46.810938
- [docs/governance/energy_cap.md](docs/governance/energy_cap.md) — 2.3KB / 2026-01-17T20:55:46.810938
- [docs/governance/governance_model.md](docs/governance/governance_model.md) — 10.1KB / 2026-01-17T20:55:46.810938
- [docs/governance/whitepaper-adam.md](docs/governance/whitepaper-adam.md) — 12.0KB / 2026-01-17T20:55:46.810938
- [docs/governance/whitepaper-SBT.md](docs/governance/whitepaper-SBT.md) — 12.5KB / 2026-01-17T20:55:46.810938
- [docs/html/airdrop_interface.html](docs/html/airdrop_interface.html) — 10.1KB / 2026-01-17T20:55:46.810938
- [docs/html/artifact_development_engine.html](docs/html/artifact_development_engine.html) — 22.4KB / 2026-01-17T20:55:46.810938
- [docs/html/auction_interface.html](docs/html/auction_interface.html) — 8.0KB / 2026-01-17T20:55:46.810938
- [docs/html/bridge.html](docs/html/bridge.html) — 31.1KB / 2026-01-17T20:55:46.810938
- [docs/html/contract_deployment_ide.html](docs/html/contract_deployment_ide.html) — 30.0KB / 2026-01-17T20:55:46.811938
- [docs/html/documentation.html](docs/html/documentation.html) — 24.1KB / 2026-01-17T20:55:46.811938
- [docs/html/index.html](docs/html/index.html) — 21.4KB / 2026-01-17T20:55:46.811938
- [docs/html/index_horizontal.html](docs/html/index_horizontal.html) — 72.5KB / 2026-01-17T20:55:46.812938
- [docs/html/transparency.html](docs/html/transparency.html) — 24.5KB / 2026-01-17T20:55:46.812938
- [docs/html/whitepaper.html](docs/html/whitepaper.html) — 7.8KB / 2026-01-17T20:55:46.812938
- [docs/real_world_assets.md](docs/real_world_assets.md) — 12.8KB / 2026-01-17T20:55:46.812938
- [docs/research/banking_2.md](docs/research/banking_2.md) — 48.9KB / 2026-01-17T20:55:46.812938
- [docs/research/crypt_vs_banking.md](docs/research/crypt_vs_banking.md) — 68.4KB / 2026-01-17T20:55:46.813938
- [docs/research/dev_thesis.md](docs/research/dev_thesis.md) — 8.6KB / 2026-01-17T20:55:46.813938
- [docs/research/gmi.md](docs/research/gmi.md) — 42.7KB / 2026-01-17T20:55:46.813938
- [docs/research/imf_international_sc.md](docs/research/imf_international_sc.md) — 101.6KB / 2026-01-17T20:55:46.813938
- [docs/research/index.md](docs/research/index.md) — 2.0KB / 2026-01-17T20:55:46.813938
- [docs/research/new_money.md](docs/research/new_money.md) — 27.7KB / 2026-01-17T20:55:46.814938
- [docs/research/sc_revolution.md](docs/research/sc_revolution.md) — 39.0KB / 2026-01-17T20:55:46.814938
- [docs/research/stablecoins.md](docs/research/stablecoins.md) — 229.8KB / 2026-01-17T20:55:46.815938
- [docs/research/tokenization.md](docs/research/tokenization.md) — 6.7KB / 2026-01-17T20:55:46.815938
- [docs/research/tokenization_infra.jpg](docs/research/tokenization_infra.jpg) — 21.6KB / 2026-01-17T20:55:46.815938
- [docs/SECURITY.md](docs/SECURITY.md) — 3.2KB / 2026-01-17T20:55:46.771938
- [docs/tokenlists/arcx.tokenlist.json](docs/tokenlists/arcx.tokenlist.json) — 905.0B / 2026-01-17T20:55:46.815938
- [docs/tokenlists/README.md](docs/tokenlists/README.md) — 947.0B / 2026-01-17T20:55:46.815938
### echidna.yaml

- [echidna.yaml](echidna.yaml) — 1.1KB / 2026-01-17T20:55:46.815938
### eslint.config.js

- [eslint.config.js](eslint.config.js) — 1.6KB / 2026-01-17T20:55:46.815938
### foundry-scripts

- [foundry-scripts/DeployGenesis.s.sol](foundry-scripts/DeployGenesis.s.sol) — 5.3KB / 2026-01-17T20:55:46.815938
- [foundry-scripts/DeployGenesisV2.s.sol](foundry-scripts/DeployGenesisV2.s.sol) — 3.0KB / 2026-01-17T20:55:46.815938
- [foundry-scripts/DeployProtocolGenesis.s.sol](foundry-scripts/DeployProtocolGenesis.s.sol) — 9.0KB / 2026-01-17T20:55:46.815938
- [foundry-scripts/Genesis.t.sol](foundry-scripts/Genesis.t.sol) — 5.0KB / 2026-01-17T20:55:46.815938
- [foundry-scripts/L2GenesisVerifier.t.sol](foundry-scripts/L2GenesisVerifier.t.sol) — 4.9KB / 2026-01-17T20:55:46.815938
- [foundry-scripts/ProtocolGenesis.t.sol](foundry-scripts/ProtocolGenesis.t.sol) — 17.4KB / 2026-01-17T20:55:46.816938
- [foundry-scripts/Registry.t.sol](foundry-scripts/Registry.t.sol) — 5.8KB / 2026-01-17T20:55:46.816938
- [foundry-scripts/SBT.t.sol](foundry-scripts/SBT.t.sol) — 6.3KB / 2026-01-17T20:55:46.816938
### ganache-db

- [ganache-db/CURRENT](ganache-db/CURRENT) — 16.0B / 2026-01-17T20:55:46.816938
- [ganache-db/LOCK](ganache-db/LOCK) — 0.0B / 2026-01-17T20:55:46.816938
- [ganache-db/LOG](ganache-db/LOG) — 46.0B / 2026-01-17T20:55:46.816938
- [ganache-db/MANIFEST-000002](ganache-db/MANIFEST-000002) — 50.0B / 2026-01-17T20:55:46.816938
### gas-report.txt

- [gas-report.txt](gas-report.txt) — 3.6KB / 2026-01-17T20:55:46.816938
### gas-reports

- [gas-reports/gas-analysis-1756553019749.json](gas-reports/gas-analysis-1756553019749.json) — 20.7KB / 2026-01-17T20:55:46.816938
- [gas-reports/gas-analysis-1756553056888.json](gas-reports/gas-analysis-1756553056888.json) — 20.7KB / 2026-01-17T20:55:46.816938
### hardhat.config.ts

- [hardhat.config.ts](hardhat.config.ts) — 5.6KB / 2026-01-17T20:55:46.816938
### IMPLEMENTATION_SUMMARY.md

- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) — 9.7KB / 2026-01-17T20:55:46.755939
### js

- [js/airdrop.js](js/airdrop.js) — 7.6KB / 2026-01-17T20:55:46.816938
- [js/auction-gh-pages.js](js/auction-gh-pages.js) — 17.3KB / 2026-01-17T20:55:46.816938
- [js/auction.js](js/auction.js) — 14.0KB / 2026-01-17T20:55:46.816938
### LICENSE

- [LICENSE](LICENSE) — 2.9KB / 2026-01-17T20:55:46.755939
### package.json

- [package.json](package.json) — 7.8KB / 2026-01-17T20:55:46.816938
### README.md

- [README.md](README.md) — 8.1KB / 2026-01-17T20:55:46.755939
### run-audit-and-append.ps1

- [run-audit-and-append.ps1](run-audit-and-append.ps1) — 3.0KB / 2026-01-17T20:55:46.816938
### scripts

- [scripts/airdrop-manager.ts](scripts/airdrop-manager.ts) — 6.9KB / 2026-01-17T20:55:46.817938
- [scripts/check-deployer-nfts-standalone.ts](scripts/check-deployer-nfts-standalone.ts) — 3.0KB / 2026-01-17T20:55:46.817938
- [scripts/check-deployer-nfts.ts](scripts/check-deployer-nfts.ts) — 2.8KB / 2026-01-17T20:55:46.817938
- [scripts/check-lp-compat-fixed.ts](scripts/check-lp-compat-fixed.ts) — 1.7KB / 2026-01-17T20:55:46.817938
- [scripts/check-specific-positions.ts](scripts/check-specific-positions.ts) — 1.9KB / 2026-01-17T20:55:46.817938
- [scripts/check-uniswap-positions.ts](scripts/check-uniswap-positions.ts) — 3.5KB / 2026-01-17T20:55:46.817938
- [scripts/config.ts](scripts/config.ts) — 8.6KB / 2026-01-17T20:55:46.817938
- [scripts/deploy_adam.ts](scripts/deploy_adam.ts) — 10.0KB / 2026-01-17T20:55:46.817938
- [scripts/deploy_defi.ts](scripts/deploy_defi.ts) — 2.5KB / 2026-01-17T20:55:46.817938
- [scripts/deployment-manager.ts](scripts/deployment-manager.ts) — 5.7KB / 2026-01-17T20:55:46.817938
- [scripts/ecosystem-manager.ts](scripts/ecosystem-manager.ts) — 8.5KB / 2026-01-17T20:55:46.817938
- [scripts/lp-manager.ts](scripts/lp-manager.ts) — 6.7KB / 2026-01-17T20:55:46.817938
- [scripts/monitor.ts](scripts/monitor.ts) — 8.3KB / 2026-01-17T20:55:46.817938
- [scripts/README.md](scripts/README.md) — 10.2KB / 2026-01-17T20:55:46.817938
- [scripts/setup_adam_policies.ts](scripts/setup_adam_policies.ts) — 4.1KB / 2026-01-17T20:55:46.817938
- [scripts/shared/constants.ts](scripts/shared/constants.ts) — 3.6KB / 2026-01-17T20:55:46.817938
- [scripts/shared/utils.ts](scripts/shared/utils.ts) — 9.7KB / 2026-01-17T20:55:46.817938
- [scripts/transfer-positions.ts](scripts/transfer-positions.ts) — 1.7KB / 2026-01-17T20:55:46.817938
- [scripts/txdata/generate-vesting-txdata.ts](scripts/txdata/generate-vesting-txdata.ts) — 4.8KB / 2026-01-17T20:55:46.818938
- [scripts/vesting-manager.ts](scripts/vesting-manager.ts) — 9.1KB / 2026-01-17T20:55:46.818938
### SECURITY_AUDIT.md

- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) — 14.2KB / 2026-01-17T20:55:46.756938
### src

- [src/components/arc_roadmap.html](src/components/arc_roadmap.html) — 9.0KB / 2026-01-17T20:55:46.818938
- [src/components/roadmap.tsx](src/components/roadmap.tsx) — 22.6KB / 2026-01-17T20:55:46.818938
- [src/components/votingsystem.tsx](src/components/votingsystem.tsx) — 26.8KB / 2026-01-17T20:55:46.818938
### TERMINAL_UI_DEMO.txt

- [TERMINAL_UI_DEMO.txt](TERMINAL_UI_DEMO.txt) — 16.3KB / 2026-01-17T20:55:46.756938
### tests

- [tests/ARCx.test.ts](tests/ARCx.test.ts) — 2.8KB / 2026-01-17T20:55:46.818938
- [tests/ARCxDutchAuction.test.ts](tests/ARCxDutchAuction.test.ts) — 2.3KB / 2026-01-17T20:55:46.818938
- [tests/ARCxMasterVesting.test.ts](tests/ARCxMasterVesting.test.ts) — 17.8KB / 2026-01-17T20:55:46.818938
- [tests/ARCxSmartAirdrop.test.ts](tests/ARCxSmartAirdrop.test.ts) — 8.1KB / 2026-01-17T20:55:46.818938
- [tests/ARCxToken.test.ts](tests/ARCxToken.test.ts) — 11.6KB / 2026-01-17T20:55:46.818938
- [tests/dao/adam/ContextEncoding.test.ts](tests/dao/adam/ContextEncoding.test.ts) — 7.7KB / 2026-01-17T20:55:46.818938
- [tests/dao/adam/GovernanceLifecycle.integration.test.ts](tests/dao/adam/GovernanceLifecycle.integration.test.ts) — 13.2KB / 2026-01-17T20:55:46.819938
- [tests/dao/adam/TreasuryLimiter.test.ts](tests/dao/adam/TreasuryLimiter.test.ts) — 6.4KB / 2026-01-17T20:55:46.819938
- [tests/fuzz/AdamPolicyFuzzTest.sol](tests/fuzz/AdamPolicyFuzzTest.sol) — 11.3KB / 2026-01-17T20:55:46.819938
- [tests/fuzz/ContractInvariants.t.sol](tests/fuzz/ContractInvariants.t.sol) — 14.5KB / 2026-01-17T20:55:46.819938
- [tests/governance/TimelockRoles.test.ts](tests/governance/TimelockRoles.test.ts) — 7.0KB / 2026-01-17T20:55:46.819938
- [tests/integration/integration.test.ts](tests/integration/integration.test.ts) — 14.9KB / 2026-01-17T20:55:46.819938
- [tests/mocha.opts](tests/mocha.opts) — 140.0B / 2026-01-17T20:55:46.819938
- [tests/phase1-modules.test.js](tests/phase1-modules.test.js) — 14.3KB / 2026-01-17T20:55:46.819938
- [tests/security/AdamHostSecurity.test.ts](tests/security/AdamHostSecurity.test.ts) — 12.1KB / 2026-01-17T20:55:46.819938
- [tests/security/AdamRegistrySecurity.test.ts](tests/security/AdamRegistrySecurity.test.ts) — 14.6KB / 2026-01-17T20:55:46.819938
- [tests/security/ARCBridgeSecurity.test.ts](tests/security/ARCBridgeSecurity.test.ts) — 10.9KB / 2026-01-17T20:55:46.819938
- [tests/security/ARCGovernorSecurity.test.ts](tests/security/ARCGovernorSecurity.test.ts) — 10.3KB / 2026-01-17T20:55:46.819938
- [tests/security/ARCTimelockSecurity.test.ts](tests/security/ARCTimelockSecurity.test.ts) — 8.1KB / 2026-01-17T20:55:46.819938
- [tests/security/BridgeSecurity.test.ts](tests/security/BridgeSecurity.test.ts) — 3.0KB / 2026-01-17T20:55:46.819938
- [tests/security/security.test.ts](tests/security/security.test.ts) — 18.9KB / 2026-01-17T20:55:46.820938
- [tests/security/TokenSecurity.test.ts](tests/security/TokenSecurity.test.ts) — 4.1KB / 2026-01-17T20:55:46.820938
- [tests/shared/test-helpers.ts](tests/shared/test-helpers.ts) — 6.0KB / 2026-01-17T20:55:46.820938
- [tests/test_results.md](tests/test_results.md) — 3.9KB / 2026-01-17T20:55:46.820938
### tools

- [tools/code_indexer.py](tools/code_indexer.py) — 7.2KB / 2026-01-17T20:55:46.820938
- [tools/install_git_hooks.ps1](tools/install_git_hooks.ps1) — 851.0B / 2026-01-17T20:55:46.820938
### trader.py

- [trader.py](trader.py) — 6.0KB / 2026-01-17T20:55:46.820938
### tsconfig.json

- [tsconfig.json](tsconfig.json) — 589.0B / 2026-01-17T20:55:46.820938

---

### Notes for contributors

- This file is generated automatically by `tools/code_indexer.py`.
- It excludes some common build and dependency folders (see script EXCLUDE_DIRS).
- If you need more detailed per-file descriptions, open issues or submit a PR to improve this document.