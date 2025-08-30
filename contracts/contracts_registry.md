# ARC Contracts Registry

[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-363636.svg?logo=ethereum)](https://docs.soliditylang.org/)
[![EVM/SVM Compatible](https://img.shields.io/badge/EVM/SVM-Compatible-blue.svg?logo=ethereum)](https://ethereum.org/en/developers/docs/evm/)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-35%2B-green.svg?logo=ethereum)](https://docs.soliditylang.org/)

<!-- Feature Badges -->
<img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" alt="Access Control"/>
<img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" alt="Pausable"/>
<img src="https://img.shields.io/badge/ERC721%2BERC5192-Locked-9cf?style=flat-square&logo=solidity" alt="ERC721+ERC5192"/>
<img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" alt="PRBMath"/>

A comprehensive registry of 35+ smart contracts and specifications for the ARC ecosystem. This document provides an overview of each contract, its purpose, and related configuration files.

---

## Feature Overview

The ARC contracts leverage the following features and standards:

- **Access Control**: Role-based permissions are enabled across core and policy contracts (e.g., `ARCDAO.sol`, `AdamHost.sol`).
- **Pausable**: Emergency pause functionality is implemented in key contracts to enhance security (e.g., `ARCTreasury.sol`, `ARCSwap.sol`).
- **ERC721 + ERC5192 (Locked NFTs)**: Soulbound and position management tokens use ERC721 with ERC5192 for non-transferable, locked NFTs (e.g., `ARC_IdentitySBT.sol`, `NonfungiblePositionManager.sol`).
- **PRBMath UD60x18**: High-precision math operations are used in contracts requiring advanced calculations (e.g., `ARCxDutchAuction.sol`, `StakingVault.sol`).

---

## Governance & Core Contracts

| Contract/File         | Description                                              |
|-----------------------|----------------------------------------------------------|
| **ARCDAO.sol**        | Main DAO contract implementing constitutional governance.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCGovernor.sol**   | Custom governor with MACI integration and weighted voting.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCProposal.sol**   | Handles proposal management and lifecycle.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCTimelock.sol**   | Executes actions with per-topic time delays.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCTreasury.sol**   | Manages treasury and fund allocation.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCVoting.sol**     | Voting mechanics and tallying system.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |

---

## Policy & Identity

| Contract/File           | Description                                              |
|-------------------------|----------------------------------------------------------|
| **AdamHost.sol**        | Wasm policy engine for constitutional enforcement.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **AdamRegistry.sol**    | Manages policy chains and storage for ADAM.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **functions.json**      | ADAM function definitions and configurations.            |
| **ARC_IdentitySBT.sol** | Soulbound identity tokens with decay-weighted reputation.<br/><img src="https://img.shields.io/badge/ERC721%2BERC5192-Locked-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARC_Eligibility.sol** | Topic-based eligibility and component weight calculation.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |
| **blueprint.md**        | SBT system design and specifications.                    |

---

## Tokens & Distribution

| Contract/File            | Description                                              |
|--------------------------|----------------------------------------------------------|
| **ARCx.sol**             | Main governance token with ERC20Votes functionality.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **interfaces/IERC20.sol**| ERC20 interface for ARCx token.                          |
| **ARCs.sol**             | Utility token for ecosystem interactions.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **deployment_notes.md**  | Deployment configurations and notes for ARCs.            |
| **ARCxDutchAuction.sol** | Dutch auction mechanism for token distribution.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCxSmartAirdrop.sol** | Smart airdrop system with eligibility checks.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARCx_MVC.sol**         | Multi-vesting contract for token distribution.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |

---

## DeFi & Treasury

| Contract/File           | Description                                              |
|-------------------------|----------------------------------------------------------|
| **ARCSwap.sol**         | DEX integration and swap functionality.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **TreasuryRewards.sol** | Reward distribution and claiming.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |
| **PenaltyVault.sol**    | Penalty collection and management.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **StakingVault.sol**    | Staking rewards and management.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |

---

## Cross-Chain & RWA

| Contract/File           | Description                                              |
|-------------------------|----------------------------------------------------------|
| **ARCBridge.sol**       | Cross-chain bridge functionality.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **ARC_RWARegistry.sol** | Main RWA registration and attestation system.<br/><img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **IRWARegistry.sol**    | RWA registry interface definitions.                      |

---

## Liquidity & Position Management

| Contract/File                   | Description                                      |
|----------------------------------|--------------------------------------------------|
| **SlashingVault.sol**            | Operator slashing and recovery management.<br/><img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" height="16"/> |
| **NonfungiblePositionManager.sol** | NFT position management for liquidity.<br/><img src="https://img.shields.io/badge/ERC721%2BERC5192-Locked-9cf?style=flat-square&logo=solidity" height="16"/> |
| **PositionManager.sol**          | Position management interface.                    |
| **ProtocolFees.sol**             | Protocol fee collection and distribution.<br/><img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" height="16"/> |
| **IPoolManager.sol**             | Pool management interface.                        |
| **IPositionManager.sol**         | Position management interface.                    |

---

## Interfaces

| Contract/File        | Description                              |
|----------------------|------------------------------------------|
| **IWETH.sol**        | Wrapped Ether interface.                 |
| **IARCDAO.sol**      | DAO contract interface.                  |
| **IARCGovernor.sol** | Governor contract interface.             |

---

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
