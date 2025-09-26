# ARC SoulBound Token (SBT) Contracts

![Status](https://img.shields.io/badge/Status-Prototype-546E7A?style=for-the-badge)
[![Standard: ERC-5192](https://img.shields.io/badge/Standard-ERC--5192-795548?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-5192)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=for-the-badge&logo=solidity)](https://docs.soliditylang.org/)

## Overview

This directory contains the ARC ecosystem's SoulBound Token (SBT) contracts, designed for non-transferable token use cases such as identity, eligibility, and reputation. Built using the ERC-5192 (Minimal Soulbound Token) standard, these contracts enable secure, non-transferable digital credentials linked to blockchain addresses.

### Core Contracts

- **ARC_Eligibility.sol**  
  Implements eligibility logic for assigning SBTs based on specific requirements or proofs.
- **ARC_IdentitySBT.sol**  
  Provides identity-linked SoulBound Tokens, allowing unique, non-transferable identity verification for ARC ecosystem members.

## Features

- **Non-Transferable**: Tokens are bound to recipient addresses and cannot be transferred.
- **Eligibility Checks**: Issue SBTs based on on-chain or off-chain proofs (e.g., governance actions, KYC).
- **Identity Verification**: Link blockchain addresses to human-readable identities.
- **Standard Compliant**: Implements ERC-5192 for maximum interoperability.

## Directory Structure

```
contracts/tokens/sbt/
├── ARC_Eligibility.sol      # Eligibility-based SBT contract
├── ARC_IdentitySBT.sol     # Identity-bound SBT contract
```

## Usage

### Prerequisites

- Solidity ^0.8.x
- Node.js 16.x or higher
- Hardhat (recommended for deployment/testing)

### Installation & Build

```bash
npm install
npx hardhat compile
npx hardhat test
```

### Deployment Example

```javascript
// Example Hardhat deployment script
const ARCIdentitySBT = await ethers.getContractFactory("ARC_IdentitySBT");
const identitySBT = await ARCIdentitySBT.deploy();
// For eligibility SBT
const ARCELigibility = await ethers.getContractFactory("ARC_Eligibility");
const eligibilitySBT = await ARCELigibility.deploy();
```

### Basic Interaction

- **Mint SBT**: Issue a SoulBound Token to a verified address.
- **Eligibility Check**: Validate requirements before minting.
- **Identity Link**: Associate metadata with a recipient address.

## Architecture

- Follows ARC ecosystem modular contract principles for ease of integration.
- Designed for DAO, governance, and user credentialing scenarios.
- Can be extended for advanced eligibility and reputation scoring.

## Security

- Tokens are non-transferable by design.
- Supports role-based access control for minting and eligibility checks.
- All critical functions protected against reentrancy and unauthorized access.

## License

MIT License — see `LICENSE`.

---

For more details about the ARC ecosystem and main token contracts, see the [root README](https://github.com/Artifact-Virtual/arc_ecosystem/blob/main/README.md).