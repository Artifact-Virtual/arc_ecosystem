# AI Attestation Service

## Overview

The AI Attestation Service provides a decentralized, blockchain-based system for creating, verifying, and managing attestations for AI model outputs, credentials, and verifications. The service combines on-chain storage of cryptographic proofs with IPFS/IPNS for efficient off-chain data storage.

## Architecture

```
┌──────────────────────────────────────────┐
│     AI Model / User Action               │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Attestation Generator (Off-chain)       │
│  - Hash generation                       │
│  - Signature creation                    │
│  - IPFS upload                           │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  AIAttestation Contract (On-chain)       │
│  - Store hash                            │
│  - Verify signatures                     │
│  - Track revocations                     │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  IPFS/IPNS Storage                       │
│  - Full attestation data                 │
│  - Metadata                              │
│  - Verification proofs                   │
└──────────────────────────────────────────┘
```

## Smart Contract

**Contract:** `contracts/ai/AIAttestation.sol`

### Key Features

- **Upgradeable**: Uses OpenZeppelin upgradeable contracts
- **Access Control**: Role-based permissions (ATTESTER, VERIFIER, REVOKER)
- **Pausable**: Emergency stop functionality
- **IPFS Integration**: Support for multiple IPFS gateways
- **Cross-chain**: Chain ID tracking for cross-chain verification

### Attestation Types

```solidity
enum AttestationType {
    MODEL_OUTPUT,    // AI model inference result
    CREDENTIAL,      // User credential or achievement
    VERIFICATION,    // Verification of another attestation
    IDENTITY,        // Identity verification
    SKILL,           // Skill or expertise attestation
    REPUTATION       // Reputation score
}
```

### Attestation Status

```solidity
enum AttestationStatus {
    ACTIVE,     // Valid and active
    REVOKED,    // Revoked by issuer/admin
    EXPIRED,    // Past expiry timestamp
    DISPUTED    // Under dispute
}
```

## Core Functions

### Creating an Attestation

```solidity
function createAttestation(
    AttestationType attestationType,
    address subject,
    bytes32 dataHash,
    string calldata metadataURI,
    uint256 expiryTimestamp,
    bytes calldata signature
) external returns (uint256 attestationId)
```

**Parameters:**
- `attestationType`: Type of attestation being created
- `subject`: Address of the subject being attested
- `dataHash`: Keccak256 hash of the attested data
- `metadataURI`: IPFS/IPNS URI for full attestation data
- `expiryTimestamp`: Expiry time (0 for no expiry)
- `signature`: Issuer's signature of the data hash

**Returns:** Unique attestation ID

**Requirements:**
- Caller must have ATTESTER_ROLE
- Contract must not be paused
- Data hash must not already exist

**Example:**
```javascript
const dataHash = ethers.keccak256(ethers.toUtf8Bytes("attestation data"));
const metadataURI = "ipfs://QmX...";
const expiryTimestamp = 0; // No expiry
const signature = await signer.signMessage(dataHash);

const tx = await attestation.createAttestation(
    0, // MODEL_OUTPUT
    subjectAddress,
    dataHash,
    metadataURI,
    expiryTimestamp,
    signature
);

const receipt = await tx.wait();
const attestationId = receipt.events[0].args.attestationId;
```

### Verifying an Attestation

```solidity
function verifyAttestation(uint256 attestationId) 
    external view returns (bool isValid)
```

**Checks:**
- Attestation status is ACTIVE
- Not expired (if expiry set)
- Chain ID matches current chain

**Example:**
```javascript
const isValid = await attestation.verifyAttestation(attestationId);
console.log(`Attestation is ${isValid ? 'valid' : 'invalid'}`);
```

### Revoking an Attestation

```solidity
function revokeAttestation(
    uint256 attestationId, 
    string calldata reason
) external
```

**Requirements:**
- Caller must have REVOKER_ROLE
- Must be issuer or admin
- Attestation must be active

**Example:**
```javascript
await attestation.revokeAttestation(
    attestationId,
    "Credential invalidated due to violation"
);
```

### Querying Attestations

```solidity
// Get full attestation data
function getAttestation(uint256 attestationId) 
    external view returns (Attestation memory)

// Get all attestations for a subject
function getSubjectAttestations(address subject) 
    external view returns (uint256[] memory)

// Get all attestations by an issuer
function getIssuerAttestations(address issuer) 
    external view returns (uint256[] memory)

// Get attestation by data hash
function getAttestationByDataHash(bytes32 dataHash) 
    external view returns (uint256 attestationId)
```

## IPFS Integration

### Metadata Structure

Attestation metadata stored on IPFS should follow this structure:

```json
{
  "version": "1.0",
  "attestationType": "MODEL_OUTPUT",
  "subject": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "issuer": "0x1234567890123456789012345678901234567890",
  "timestamp": 1705511400,
  "data": {
    "modelHash": "QmModelHash123...",
    "inputHash": "QmInputHash456...",
    "outputHash": "QmOutputHash789...",
    "confidence": 9500,
    "tags": ["nlp", "classification", "production"]
  },
  "proof": {
    "algorithm": "ECDSA",
    "signature": "0xabc...",
    "publicKey": "0xdef..."
  },
  "metadata": {
    "description": "AI model output attestation",
    "version": "gpt-4-turbo",
    "environment": "production"
  }
}
```

### IPFS Upload Example

```javascript
const { create } = require('ipfs-http-client');

async function uploadToIPFS(attestationData) {
  const client = create({ url: 'https://ipfs.infura.io:5001' });
  
  const { cid } = await client.add(JSON.stringify(attestationData));
  const metadataURI = `ipfs://${cid}`;
  
  console.log(`Uploaded to IPFS: ${metadataURI}`);
  return metadataURI;
}
```

### Gateway Configuration

The contract supports multiple IPFS gateways:

```solidity
// Add gateway
function addIPFSGateway(string calldata gateway) external

// Remove gateway
function removeIPFSGateway(uint256 index) external

// Get all gateways
function getIPFSGateways() external view returns (string[] memory)
```

## Access Control

### Roles

```solidity
bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");
```

### Granting Roles

```javascript
const ATTESTER_ROLE = await attestation.ATTESTER_ROLE();
await attestation.grantRole(ATTESTER_ROLE, attesterAddress);
```

### Checking Roles

```javascript
const hasRole = await attestation.hasRole(ATTESTER_ROLE, address);
```

## Deployment

### Local/Test Network

```bash
# Deploy to Hardhat
npx hardhat run scripts/deploy-test-ecosystem.ts --network hardhat

# Deploy to Ganache
npx hardhat run scripts/deploy-test-ecosystem.ts --network ganache
```

### Production Network

```typescript
import { ethers, upgrades } from "hardhat";

async function main() {
  const AIAttestation = await ethers.getContractFactory("AIAttestation");
  const attestation = await upgrades.deployProxy(
    AIAttestation,
    [adminAddress],
    { initializer: "initialize" }
  );
  await attestation.waitForDeployment();
  
  console.log("AIAttestation deployed to:", await attestation.getAddress());
}
```

## Usage Examples

### Complete Attestation Flow

```javascript
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

// 1. Prepare attestation data
const attestationData = {
  version: "1.0",
  attestationType: "MODEL_OUTPUT",
  subject: userAddress,
  issuer: issuerAddress,
  timestamp: Date.now() / 1000,
  data: {
    modelHash: "QmModel...",
    inputHash: ethers.keccak256(ethers.toUtf8Bytes(input)),
    outputHash: ethers.keccak256(ethers.toUtf8Bytes(output)),
    confidence: 9500,
    tags: ["nlp", "production"]
  }
};

// 2. Upload to IPFS
const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
const { cid } = await ipfs.add(JSON.stringify(attestationData));
const metadataURI = `ipfs://${cid}`;

// 3. Generate data hash
const dataString = JSON.stringify(attestationData.data);
const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

// 4. Sign the data hash
const signature = await signer.signMessage(ethers.getBytes(dataHash));

// 5. Create on-chain attestation
const attestation = await ethers.getContractAt("AIAttestation", contractAddress);
const tx = await attestation.createAttestation(
  0, // MODEL_OUTPUT
  userAddress,
  dataHash,
  metadataURI,
  0, // No expiry
  signature
);

const receipt = await tx.wait();
const attestationId = receipt.events[0].args.attestationId;

console.log(`Created attestation #${attestationId}`);
console.log(`Metadata: ${metadataURI}`);

// 6. Verify attestation
const isValid = await attestation.verifyAttestation(attestationId);
console.log(`Attestation is ${isValid ? 'valid' : 'invalid'}`);
```

### Querying Attestations

```javascript
// Get all attestations for a user
const attestationIds = await attestation.getSubjectAttestations(userAddress);

// Fetch details for each
for (const id of attestationIds) {
  const att = await attestation.getAttestation(id);
  console.log(`Attestation #${id}:`);
  console.log(`  Type: ${att.attestationType}`);
  console.log(`  Status: ${att.status}`);
  console.log(`  Issuer: ${att.issuer}`);
  console.log(`  Metadata: ${att.metadataURI}`);
}
```

## Integration with TUI

The Management Dashboard in the ARC CLI provides a user-friendly interface for:

- Creating attestations
- Verifying attestations
- Viewing attestation history
- Managing IPFS gateways
- Monitoring attestation statistics

Access via:
```bash
npm run cli
# Select: Management Dashboard > AI Attestation Service
```

## Security Considerations

1. **Role Management**: Carefully control who has ATTESTER, VERIFIER, and REVOKER roles
2. **Data Privacy**: Sensitive data should be encrypted before uploading to IPFS
3. **Signature Verification**: Always verify signatures off-chain before accepting attestations
4. **Rate Limiting**: Consider implementing rate limits for attestation creation
5. **IPFS Pinning**: Ensure critical attestations are pinned to prevent data loss

## Gas Optimization

The contract uses several gas optimization techniques:

- Packed storage slots
- Minimal on-chain data (full data on IPFS)
- Batch operations where possible
- Efficient data structures (mappings over arrays)

**Estimated Gas Costs:**
- Create attestation: ~100,000-150,000 gas
- Verify attestation: ~30,000 gas (view function)
- Revoke attestation: ~50,000 gas

## Future Enhancements

- [ ] Multi-signature attestations
- [ ] Attestation delegation
- [ ] Reputation scoring based on attestations
- [ ] Integration with ENS for human-readable names
- [ ] Support for attestation templates
- [ ] Batch attestation creation
- [ ] Encrypted attestations with access control

## Support

For issues or questions:
- GitHub: https://github.com/Artifact-Virtual/ARC/issues
- Documentation: See `SYSTEM_MAP.md` for complete system reference

## License

MIT License - see LICENSE file for details
