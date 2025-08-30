# ARC Contracts Registry

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/solidity-%5E0.8.0-363636.svg?logo=ethereum)](https://docs.soliditylang.org/)
[![Docs](https://img.shields.io/badge/docs-reference-4c1.svg?logo=readthedocs)](https://github.com/your-org/arc_ecosystem/wiki)
[![Audit Status](https://img.shields.io/badge/audit-passed-brightgreen.svg)](AUDIT.md)
[![Upgradeable](https://img.shields.io/badge/upgradeable-UUPS%20%26%20Timelock-ff69b4.svg)](https://docs.openzeppelin.com/contracts/4.x/api/proxy)
[![EVM Compatible](https://img.shields.io/badge/evm-compatible-blueviolet.svg)](https://ethereum.org/en/developers/docs/evm/)
[![OpenZeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-2ea44f.svg)](https://openzeppelin.com/)

A comprehensive registry of 35 smart contracts and specifications for the ARC ecosystem. This document provides an overview of each contract, its purpose, and related configuration files.

---

## Governance & Core Contracts

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **ARCDAO.sol**               | Main DAO contract implementing constitutional governance.                                   |
| **ARCGovernor.sol**          | Custom governor with MACI integration and weighted voting.                                  |
| **ARCProposal.sol**          | Handles proposal management and lifecycle.                                                  |
| **ARCTimelock.sol**          | Executes actions with per-topic time delays.                                                |
| **ARCTreasury.sol**          | Manages treasury and fund allocation.                                                       |
| **ARCVoting.sol**            | Voting mechanics and tallying system.                                                       |

---

## Policy & Identity

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **AdamHost.sol**             | Wasm policy engine for constitutional enforcement.                                          |
| **AdamRegistry.sol**         | Manages policy chains and storage for ADAM.                                                 |
| **functions.json**           | ADAM function definitions and configurations.                                               |
| **ARC_IdentitySBT.sol**      | Soulbound identity tokens with decay-weighted reputation.                                   |
| **ARC_Eligibility.sol**      | Topic-based eligibility and component weight calculation.                                   |
| **blueprint.md**             | SBT system design and specifications.                                                       |

---

## Tokens & Distribution

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **ARCx.sol**                 | Main governance token with ERC20Votes functionality.                                        |
| **interfaces/IERC20.sol**    | ERC20 interface for ARCx token.                                                             |
| **ARCs.sol**                 | Utility token for ecosystem interactions.                                                   |
| **deployment_notes.md**      | Deployment configurations and notes for ARCs.                                               |
| **ARCxDutchAuction.sol**     | Dutch auction mechanism for token distribution.                                             |
| **ARCxSmartAirdrop.sol**     | Smart airdrop system with eligibility checks.                                               |
| **ARCx_MVC.sol**             | Multi-vesting contract for token distribution.                                              |

---

## DeFi & Treasury

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **ARCSwap.sol**              | DEX integration and swap functionality.                                                     |
| **TreasuryRewards.sol**      | Reward distribution and claiming.                                                           |
| **PenaltyVault.sol**         | Penalty collection and management.                                                          |
| **StakingVault.sol**         | Staking rewards and management.                                                             |

---

## Cross-Chain & RWA

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **ARCBridge.sol**            | Cross-chain bridge functionality.                                                           |
| **ARC_RWARegistry.sol**      | Main RWA registration and attestation system.                                               |
| **IRWARegistry.sol**         | RWA registry interface definitions.                                                         |

---

## Liquidity & Position Management

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **SlashingVault.sol**        | Operator slashing and recovery management.                                                  |
| **NonfungiblePositionManager.sol** | NFT position management for liquidity.                                                |
| **PositionManager.sol**      | Position management interface.                                                              |
| **ProtocolFees.sol**         | Protocol fee collection and distribution.                                                   |
| **IPoolManager.sol**         | Pool management interface.                                                                  |
| **IPositionManager.sol**     | Position management interface.                                                              |

---

## Interfaces

| Contract/File                | Description                                                                                 |
|------------------------------|---------------------------------------------------------------------------------------------|
| **IWETH.sol**                | Wrapped Ether interface.                                                                    |
| **IARCDAO.sol**              | DAO contract interface.                                                                     |
| **IARCGovernor.sol**         | Governor contract interface.                                                                |

---

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
