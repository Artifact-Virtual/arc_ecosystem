# GENESIS System Integration Guide

## Overview

The GENESIS system is the foundational identity and registry infrastructure for AI models in the ARC ecosystem. This guide provides comprehensive instructions for integrating GENESIS into your applications, services, and contracts.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Integration Patterns](#integration-patterns)
3. [Smart Contract Integration](#smart-contract-integration)
4. [Off-Chain Integration](#off-chain-integration)
5. [Frontend Integration](#frontend-integration)
6. [Backend Integration](#backend-integration)
7. [Security Considerations](#security-considerations)
8. [Common Integration Patterns](#common-integration-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Components

```
GENESIS System
├── ARCGenesis (Pure Immutable Root)
│   ├── Validates model classes
│   ├── Provides invariant hashes
│   └── Genesis hash anchor
│
├── ARCModelRegistry (Governed Registry)
│   ├── Registers models
│   ├── Verifies Genesis compliance
│   └── Emits canonical ModelID records
│
├── ARCModelSBT (Identity Layer)
│   ├── Issues soulbound tokens
│   ├── Encodes model metadata
│   └── Enforces non-transferability
│
└── ModelClassSchema (Metadata Library)
    ├── Capability definitions
    ├── Use case documentation
    └── Restriction specifications
```

### Data Flow

```
1. Model Registration Flow:
   Governance → Registry.registerModel() → Validates via Genesis → Emits ModelRegistered

2. Identity Issuance Flow:
   Registry → SBT.mint() → Validates model exists → Issues non-transferable token

3. Capability Verification Flow:
   Application → Schema.hasCapability() → Returns boolean → Application logic
```

---

## Integration Patterns

### Pattern 1: Read-Only Integration (Query Model Data)

**Use Case**: Display model information, check capabilities, verify compliance

```solidity
// Example: Check if a model can execute operations
import {ModelClassSchema} from "./libraries/ModelClassSchema.sol";
import {IARCModelRegistry} from "./registry/IARCModelRegistry.sol";

contract ModelVerifier {
    IARCModelRegistry public registry;
    
    function canModelExecute(bytes32 modelId) external view returns (bool) {
        bytes32 classId = registry.modelClass(modelId);
        return ModelClassSchema.hasCapability(classId, "canExecute");
    }
}
```

### Pattern 2: Governance Integration (Register Models)

**Use Case**: DAO or multisig registering new AI models

```solidity
import {IARCModelRegistry} from "./registry/IARCModelRegistry.sol";
import {ModelClass} from "./libraries/ModelClass.sol";

contract GovernanceIntegration {
    IARCModelRegistry public registry;
    
    function proposeModelRegistration(
        string memory name,
        string memory version,
        bytes32 classId
    ) external returns (bytes32) {
        // Governance check would happen here
        require(isGovernance(msg.sender), "NOT_GOVERNANCE");
        
        return registry.registerModel(name, version, classId);
    }
}
```

### Pattern 3: Identity Verification (Check SBT Ownership)

**Use Case**: Verify a model has a valid soulbound identity

```solidity
import {ARCModelSBT} from "./sbt/ARCModelSBT.sol";

contract IdentityVerifier {
    ARCModelSBT public sbt;
    
    function hasValidIdentity(bytes32 modelId) external view returns (bool) {
        uint256 tokenId = sbt.modelToken(modelId);
        return tokenId != 0 && !sbt.revoked(tokenId);
    }
}
```

---

## Smart Contract Integration

### Step 1: Install Dependencies

Add GENESIS contracts to your project:

```bash
# If using Foundry
forge install Artifact-Virtual/arc_ecosystem

# If using Hardhat
npm install @artifact-virtual/arc-genesis
```

### Step 2: Import Interfaces

```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {IARCGenesis} from "@arc-genesis/contracts/genesis/IARCGenesis.sol";
import {IARCModelRegistry} from "@arc-genesis/contracts/registry/IARCModelRegistry.sol";
import {ModelClassSchema} from "@arc-genesis/contracts/libraries/ModelClassSchema.sol";
import {ModelClass} from "@arc-genesis/contracts/libraries/ModelClass.sol";
```

### Step 3: Connect to Deployed Contracts

```solidity
contract MyApplication {
    IARCGenesis public immutable genesis;
    IARCModelRegistry public immutable registry;
    
    constructor(address genesis_, address registry_) {
        genesis = IARCGenesis(genesis_);
        registry = IARCModelRegistry(registry_);
    }
    
    function validateModel(bytes32 modelId) public view returns (bool) {
        // Get model class from registry
        bytes32 classId = registry.modelClass(modelId);
        
        // Verify class is valid in Genesis
        return genesis.isValidClass(classId);
    }
}
```

### Step 4: Implement Access Control

```solidity
contract ModelGatedFeature {
    IARCModelRegistry public registry;
    
    modifier onlyOperationalAgents(bytes32 modelId) {
        bytes32 classId = registry.modelClass(modelId);
        require(classId == ModelClass.OPERATIONAL_AGENT, "NOT_OPERATIONAL_AGENT");
        _;
    }
    
    function executeTask(bytes32 modelId) external onlyOperationalAgents(modelId) {
        // Protected functionality
    }
}
```

---

## Off-Chain Integration

### JavaScript/TypeScript Integration

#### Install Web3 Libraries

```bash
npm install ethers @artifact-virtual/arc-genesis-abi
```

#### Connect to Contracts

```typescript
import { ethers } from 'ethers';
import genesisABI from '@arc-genesis/abi/ARCGenesis.json';
import registryABI from '@arc-genesis/abi/ARCModelRegistry.json';

// Contract addresses (from deployment)
const GENESIS_ADDRESS = "0x...";
const REGISTRY_ADDRESS = "0x...";

// Connect to provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create contract instances
const genesis = new ethers.Contract(GENESIS_ADDRESS, genesisABI, provider);
const registry = new ethers.Contract(REGISTRY_ADDRESS, registryABI, provider);

// Query data
async function getModelClass(modelId: string): Promise<string> {
    const classId = await registry.modelClass(modelId);
    return classId;
}

// Check if class is valid
async function isValidClass(classId: string): Promise<boolean> {
    return await genesis.isValidClass(classId);
}
```

#### Listen to Events

```typescript
// Listen for model registrations
registry.on("ModelRegistered", (modelId, classId, name, version, registrar) => {
    console.log(`New model registered: ${name} v${version}`);
    console.log(`Model ID: ${modelId}`);
    console.log(`Class: ${classId}`);
});

// Listen for SBT minting
sbt.on("ModelMinted", (tokenId, modelId, classId) => {
    console.log(`SBT minted for model ${modelId}`);
    console.log(`Token ID: ${tokenId}`);
});
```

---

## Frontend Integration

### React Component Example

```tsx
import { useContract, useContractRead } from 'wagmi';
import registryABI from './abi/ARCModelRegistry.json';

function ModelDisplay({ modelId }: { modelId: string }) {
    const { data: classId } = useContractRead({
        address: REGISTRY_ADDRESS,
        abi: registryABI,
        functionName: 'modelClass',
        args: [modelId],
    });
    
    const { data: schema } = useModelSchema(classId);
    
    return (
        <div className="model-card">
            <h3>{schema?.name}</h3>
            <p>{schema?.description}</p>
            <div className="capabilities">
                {schema?.capabilities.canExecute && <Badge>Can Execute</Badge>}
                {schema?.capabilities.canVerify && <Badge>Can Verify</Badge>}
            </div>
        </div>
    );
}

// Custom hook to get schema data
function useModelSchema(classId: string) {
    const { data: schema } = useContractRead({
        address: SCHEMA_ADDRESS,
        abi: schemaABI,
        functionName: 'getSchema',
        args: [classId],
    });
    
    return { data: schema };
}
```

### Display Capability Matrix

```tsx
function CapabilityMatrix({ classId }: { classId: string }) {
    const capabilities = [
        'canExecute',
        'canVerify',
        'canGovern',
        'canManagePolicy',
        'canManageAssets',
    ];
    
    return (
        <table className="capability-matrix">
            <tbody>
                {capabilities.map(cap => (
                    <tr key={cap}>
                        <td>{cap}</td>
                        <td>
                            <CapabilityCheck classId={classId} capability={cap} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

---

## Backend Integration

### Node.js Service Example

```javascript
const { ethers } = require('ethers');

class GenesisService {
    constructor(provider, addresses) {
        this.genesis = new ethers.Contract(
            addresses.genesis,
            genesisABI,
            provider
        );
        this.registry = new ethers.Contract(
            addresses.registry,
            registryABI,
            provider
        );
    }
    
    async validateModel(modelId) {
        try {
            const classId = await this.registry.modelClass(modelId);
            const isValid = await this.genesis.isValidClass(classId);
            
            return {
                valid: isValid,
                classId: classId,
                modelId: modelId
            };
        } catch (error) {
            console.error('Validation failed:', error);
            return { valid: false, error: error.message };
        }
    }
    
    async getModelMetadata(modelId) {
        const classId = await this.registry.modelClass(modelId);
        const invariantHash = await this.genesis.invariantHash(classId);
        
        return {
            modelId,
            classId,
            invariantHash,
            genesisHash: await this.genesis.genesisHash()
        };
    }
}
```

### API Endpoints

```javascript
const express = require('express');
const app = express();

app.get('/api/models/:modelId', async (req, res) => {
    const { modelId } = req.params;
    
    try {
        const metadata = await genesisService.getModelMetadata(modelId);
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/models/:modelId/capabilities', async (req, res) => {
    const { modelId } = req.params;
    
    try {
        const classId = await registry.modelClass(modelId);
        const schema = await schemaContract.getSchema(classId);
        
        res.json({
            modelId,
            capabilities: schema.capabilities
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## Security Considerations

### 1. Validate All Inputs

```solidity
function registerModel(
    string calldata name,
    string calldata version,
    bytes32 classId
) external {
    // Validate inputs
    require(bytes(name).length > 0, "NAME_EMPTY");
    require(bytes(version).length > 0, "VERSION_EMPTY");
    require(genesis.isValidClass(classId), "INVALID_CLASS");
    
    // Continue with registration
}
```

### 2. Check Genesis Compliance

Always verify models through Genesis before trusting them:

```solidity
function useModel(bytes32 modelId) external {
    bytes32 classId = registry.modelClass(modelId);
    require(genesis.isValidClass(classId), "NOT_GENESIS_COMPLIANT");
    
    // Safe to use model
}
```

### 3. Verify SBT Validity

Check that models have valid, non-revoked SBTs:

```solidity
function verifyModelIdentity(bytes32 modelId) public view returns (bool) {
    uint256 tokenId = sbt.modelToken(modelId);
    if (tokenId == 0) return false;
    if (sbt.revoked(tokenId)) return false;
    
    bytes32 storedModelId = sbt.tokenModel(tokenId);
    return storedModelId == modelId;
}
```

### 4. Implement Rate Limiting

For off-chain integrations, implement rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);
```

---

## Common Integration Patterns

### Pattern: Model Gating

Restrict functionality to specific model classes:

```solidity
contract ProtectedFeature {
    modifier onlyReasoningCore(bytes32 modelId) {
        bytes32 classId = registry.modelClass(modelId);
        require(classId == ModelClass.REASONING_CORE, "NOT_REASONING_CORE");
        _;
    }
    
    function analyzeStrategy(bytes32 modelId) external onlyReasoningCore(modelId) {
        // Only REASONING_CORE models can access
    }
}
```

### Pattern: Capability-Based Access

Grant access based on capabilities:

```solidity
function performAction(bytes32 modelId) external {
    bytes32 classId = registry.modelClass(modelId);
    
    require(
        ModelClassSchema.hasCapability(classId, "canExecute"),
        "CANNOT_EXECUTE"
    );
    
    // Perform action
}
```

### Pattern: Multi-Model Verification

Verify multiple models for complex operations:

```solidity
function collaborativeTask(
    bytes32 executorModelId,
    bytes32 verifierModelId
) external {
    // Executor must be able to execute
    bytes32 executorClass = registry.modelClass(executorModelId);
    require(
        ModelClassSchema.hasCapability(executorClass, "canExecute"),
        "EXECUTOR_CANNOT_EXECUTE"
    );
    
    // Verifier must be able to verify
    bytes32 verifierClass = registry.modelClass(verifierModelId);
    require(
        ModelClassSchema.hasCapability(verifierClass, "canVerify"),
        "VERIFIER_CANNOT_VERIFY"
    );
    
    // Perform collaborative task
}
```

---

## Troubleshooting

### Issue: "INVALID_CLASS" Error

**Cause**: Attempting to use a class ID that Genesis doesn't recognize

**Solution**:
```solidity
// Check valid classes
bytes32 classId = ModelClass.REASONING_CORE; // Use library constants
require(genesis.isValidClass(classId), "Class must be valid");
```

### Issue: Model Not Found in Registry

**Cause**: Model hasn't been registered yet

**Solution**:
```solidity
bytes32 classId = registry.modelClass(modelId);
require(classId != bytes32(0), "Model not registered");
```

### Issue: SBT Transfer Failure

**Cause**: SBTs are non-transferable by design

**Solution**: SBTs cannot be transferred. If you need to reassign identity, revoke the old SBT and mint a new one (governance only).

### Issue: Off-Chain Data Mismatch

**Cause**: Cached data out of sync with chain state

**Solution**:
```javascript
// Always fetch fresh data for critical operations
const classId = await registry.modelClass(modelId, { 
    blockTag: 'latest' 
});
```

---

## Best Practices

1. **Always validate through Genesis**: Never trust model class IDs without Genesis validation
2. **Use library constants**: Import ModelClass library for type-safe class IDs
3. **Check SBT validity**: Verify SBTs haven't been revoked before trusting model identity
4. **Cache appropriately**: Genesis is pure functions (safe to cache), Registry can change (cache with TTL)
5. **Handle errors gracefully**: Implement proper error handling for all contract calls
6. **Monitor events**: Listen to ModelRegistered and ModelRevoked events
7. **Test integration thoroughly**: Use testnet deployments before mainnet integration

---

## Support and Resources

- **Documentation**: [Full documentation](./DOCUMENTATION.md)
- **Schema Reference**: [Model Class Schema](./contracts/libraries/MODEL_CLASS_SCHEMA.md)
- **Deployment Guide**: [Deployment instructions](./DEPLOYMENT_GUIDE.md)
- **Audit Report**: [Security audit findings](./AUDIT_REPORT.md)

---

## Version History

- v1.0.0 (2026-01-16): Initial GENESIS system integration guide
