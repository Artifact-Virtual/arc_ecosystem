# Script Suite – Comprehensive ARC Ecosystem Management

This directory contains a streamlined, comprehensive script architecture for the ARCx ecosystem, designed with proper separation of concerns and conclusive functionality.

## Core Management Scripts

### Ecosystem Manager (`ecosystem-manager.ts`)

#### Master orchestrator for the entire ARC ecosystem

- Commands:
  - `health` – Comprehensive system health check
  - `status` – System status overview
  - `addresses` – Display all contract addresses
- Usage: `npx hardhat run scripts/ecosystem-manager.ts --network base <command>`

### Monitor (`monitor.ts`)

#### Real-time monitoring and reporting system

- Commands:
  - `report` – Generate full monitoring report
  - `supply` – Monitor token supply and holders
  - `vesting` – Monitor vesting schedules
  - `liquidity` – Monitor liquidity position
  - `health` – Monitor system health
- Usage: `npx hardhat run scripts/monitor.ts --network base <command>`

### Configuration Manager (`config.ts`)

#### Environment and configuration management

- Commands:
  - `show` – Display current configuration
  - `validate` – Validate contract deployments
  - `env` – Generate .env.example file
  - `update` – Update constants file with current addresses
- Usage: `npx hardhat run scripts/config.ts --network base <command>`

## Specialized Management Scripts

### Vesting Manager (`vesting-manager.ts`)

#### Complete vesting schedule management

- Commands:
  - `check-beneficiaries` – Check vesting schedules for beneficiaries
  - `check-treasury` – Check treasury and vesting balances/allowances
  - `check-status` – Check overall vesting and minting status
  - `get-owner` – Get the owner of the vesting contract
  - `setup-finalize` – Setup vesting schedules and finalize minting
- Usage: `npx hardhat run scripts/vesting-manager.ts --network base <command>`

### LP Manager (`lp-manager.ts`)

#### Uniswap V4 LP compatibility and management

- Commands:
  - `check` – Check LP compatibility status
  - `configure` – Configure for LP compatibility
  - `revert` – Revert LP compatibility changes
- Usage: `npx hardhat run scripts/lp-manager.ts --network base <command>`

### Airdrop Manager (`airdrop-manager.ts`)

#### Complete airdrop campaign management

- Commands:
  - `status` – Check airdrop status
  - `setup` – Setup airdrop (owner only)
  - `claim` – Claim airdrop tokens
  - `withdraw` – Emergency withdraw (owner only)
  - `merkle` – Generate merkle tree
- Usage: `npx hardhat run scripts/airdrop-manager.ts --network base <command>`

### Deployment Manager (`deployment-manager.ts`)

#### Contract deployment orchestration

- Commands:
  - `infrastructure` – Deploy vesting, airdrop, and hook contracts
  - `token` – Deploy the ARCx V2 Enhanced token
- Usage: `npx hardhat run scripts/deployment-manager.ts --network base <command>`

## Shared Resources

### Constants (`shared/constants.ts`)

Centralized address and configuration management

### Utils (`shared/utils.ts`)

Common utility functions and helpers

## Quick Start Commands

### System Health Check

```bash
npx hardhat run scripts/ecosystem-manager.ts --network base health
```

### Full Monitoring Report

```bash
npx hardhat run scripts/monitor.ts --network base report
```

### Configuration Validation

```bash
npx hardhat run scripts/config.ts --network base validate
```

### Vesting Setup

```bash
npx hardhat run scripts/vesting-manager.ts --network base setup-finalize
```

### LP Compatibility Check

```bash
npx hardhat run scripts/lp-manager.ts --network base check
```

## Environment Variables

Required environment variables for full functionality:

```bash
# Core Contracts
ARCX_TOKEN_ADDRESS=0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437
VESTING_CONTRACT_ADDRESS=0x0bBf1fFda16C2d9833a972b0E9dE535Cf398B600
AIRDROP_CONTRACT_ADDRESS=0x40fe447cf4B2af7aa41694a568d84F1065620298
UNISWAP_HOOK_ADDRESS=0xBCc34Ad1bC78c71E86A04814e69F9Cc26A456aE0

# Governance & Security
TREASURY_SAFE_ADDRESS=0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38
ECOSYSTEM_SAFE_ADDRESS=0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb
DEPLOYER_WALLET_ADDRESS=0x21E914dFBB137F7fEC896F11bC8BAd6BCCDB147B

# Uniswap V4 Infrastructure
UNISWAP_V4_POOL_MANAGER=0x498581ff718922c3f8e6a244956af099b2652b2b
UNISWAP_V4_POSITION_MANAGER=0x7c5f5a4bbd8fd63184577525326123b519429bdc
UNISWAP_V4_UNIVERSAL_ROUTER=0x6ff5693b99212da76ad316178a184ab56d299b43
MAIN_LP_POSITION_ID=242940

# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
```

## Architecture Principles

1. **Separation of Concerns** – Each script handles one major component
2. **Comprehensive Coverage** – Every aspect of the ecosystem is managed
3. **Consistent Interface** – All scripts follow the same command pattern
4. **Error Handling** – Robust error handling and user feedback
5. **Documentation** – Extensive inline documentation and usage examples

## Maintenance

- Run `npx hardhat run scripts/config.ts --network base update` after deployments
- Use `npx hardhat run scripts/monitor.ts --network base report` for regular health checks
- Update `shared/constants.ts` when addresses change
- Generate new `.env.example` with `npx hardhat run scripts/config.ts --network base env`
- **`health-check.ts`** – Perform health checks
  - Usage: `npx hardhat run scripts/health-check.ts --network base`

### Token Balance Scanner
- **`scan-token-balances.ts`** – Scan token balances
  - Usage: `npx hardhat run scripts/scan-token-balances.ts --network base`

## Shared Infrastructure

- **`shared/`** – Shared utilities and constants

## Environment Variables

Set these environment variables as needed:

- `ARCX_TOKEN_ADDRESS` – ARCx token address
- `UNISWAP_V4_POOL_MANAGER` – Uniswap V4 pool manager address
- `ARCX_HOOK_ADDRESS` – ARCx hook address
- `UNISWAP_V4_POOL_ADDRESS` – Uniswap V4 pool address (optional)

## Notes

- All scripts use Hardhat and ethers v6
- Scripts are designed to be run on Base mainnet
- Ensure proper network configuration in hardhat.config.ts
- Some scripts require ADMIN_ROLE for execution

#### `shared/utils.ts`
Common utilities and functions:
- Contract status checking
- Network validation
- Balance verification
- Error handling
- Formatting helpers

## Usage Examples

### Status Checking
```bash
# Complete ecosystem status
npx hardhat run scripts/status.ts --network base

# Quick contract verification
npx hardhat run scripts/status.ts --network base
```

### Deployment Operations
```bash
# Deploy auction only
npx hardhat run scripts/deploy.ts --network base auction

# Deploy airdrop with dry run
npx hardhat run scripts/deploy.ts --network base airdrop --dry-run

# Deploy all components
npx hardhat run scripts/deploy.ts --network base all --confirm
```

### Liquidity Management

```bash
# Check liquidity status
npx hardhat run scripts/liquidity.ts --network base status

# Setup new pool (dry run)
npx hardhat run scripts/liquidity.ts --network base setup --dry-run

# Add liquidity
npx hardhat run scripts/liquidity.ts --network base add
```


## Migration from Old Scripts

### Removed Scripts (21 total)

The following redundant scripts have been consolidated:

**Status Scripts → `status.ts`:**

- `quick_status.ts`
- `final_status.ts`
- `deep_status.ts`
- `current_deployment_status.ts`
- `check_live_status.js`
- `investigate_contract.ts`
- `investigate_minting.ts`
- `token_forensics.ts`
- `check_auction_status.ts`
- `check_funding_status.ts`
- `check_liquidity.ts`

**Deployment Scripts → `deploy.ts`:**

- `deploy_dutch_auction.ts`
- `EMERGENCY_deploy_dutch_auction.ts`
- `EMERGENCY_deploy_smart_airdrop.ts`

**Liquidity Scripts → `liquidity.ts`:**

- `add_v4_liquidity.ts`
- `provide_liquidity.ts`
- `create_v4_liquidity_pool.ts`
- `setup_uniswap_v4_pool.ts`
- `initialize_v4_pool.ts`
- `safe_lp_transaction.ts`
- `approve_lp_tokens.ts`
- `enterprise_lp_strategy.ts`
- `verify_liquidity_ready.ts`

**Other:**

- `finalize_auction.ts`
- `burn_excess_tokens.ts`

### Script Migration Guide

| Old Script                  | New Command                                               |
|-----------------------------|----------------------------------------------------------|
| `quick_status.ts`           | `npx hardhat run scripts/status.ts --network base`        |
| `deploy_dutch_auction.ts`   | `npx hardhat run scripts/deploy.ts --network base auction`|
| `add_v4_liquidity.ts`       | `npx hardhat run scripts/liquidity.ts --network base add`|
| `check_auction_status.ts`   | `npx hardhat run scripts/status.ts --network base`        |

## Benefits of Consolidation

1. Reduced redundancy: From 29 scripts to 8 core scripts (72% reduction)
2. Centralized configuration: All addresses and constants in one place
3. Consistent error handling: Standardized validation and error patterns
4. Improved maintainability: Easier to update and maintain
5. Better documentation: Clear usage patterns and examples
6. Reduced configuration drift: Single source of truth for addresses
7. Streamlined workflows: Logical grouping of related operations

## Safety Features

- Dry run mode: Test operations without execution (`--dry-run`)
- Network validation: Automatic Base mainnet verification
- Balance checking: Pre-flight validation of sufficient funds
- Error handling: Graceful failure with clear error messages
- Confirmation required: Critical operations require explicit confirmation

## Development Notes

### Adding New Functionality

1. Status checks: Add to `status.ts`
2. Deployments: Add to `deploy.ts`
3. Liquidity operations: Add to `liquidity.ts`
4. New addresses: Update `shared/constants.ts`
5. Common functions: Add to `shared/utils.ts`

### Testing

Always test with dry run mode first:

```bash
npx hardhat run scripts/deploy.ts --network base auction --dry-run
```

### Safety Checklist

- [ ] Network validation passes
- [ ] Sufficient balances confirmed
- [ ] Dry run executed successfully
- [ ] Addresses verified in `constants.ts`
- [ ] Confirmation flags added for critical operations

## Emergency Recovery

If you need any of the removed scripts:

1. Check git history: `git log --oneline --name-only`
2. Restore a specific file: `git checkout <commit> -- scripts/<file>`
3. Or recreate functionality using the consolidated scripts

This new architecture maintains all previous functionality while significantly reducing complexity and maintenance overhead.
