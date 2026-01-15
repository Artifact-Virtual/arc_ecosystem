# Model Class Schema Documentation

## Overview

The Model Class Schema provides a comprehensive, immutable definition of each AI model class in the ARC ecosystem. This schema serves as the canonical reference for understanding model capabilities, constraints, and intended use cases.

## Architecture

### Core Components

1. **ClassSchema Struct**: Complete metadata for a model class
2. **Capabilities Struct**: Detailed capability flags
3. **Pure Functions**: Deterministic schema retrieval

### Design Principles

- **Immutable**: Schema is defined in pure functions, cannot be modified
- **Deterministic**: Same input always produces same output
- **Comprehensive**: Covers all aspects of model class definition
- **Auditable**: Clear separation of capabilities and restrictions

## Model Classes

### 1. REASONING_CORE

**Purpose**: Strategic analysis, decision support, and constitutional guidance

**Identifier**: `keccak256("ARC::MODEL::REASONING_CORE")`

**Invariant Hash**: `keccak256("NO_EXECUTION|NO_ASSETS|ADVISORY_ONLY")`

**Capabilities**:
- ✅ Can generate output (advisory)
- ❌ Cannot execute on-chain transactions
- ❌ Cannot verify or audit other models
- ❌ Cannot participate in governance
- ❌ Cannot manage policies
- ❌ Cannot manage assets

**Use Cases**:
- Strategic analysis and decision support
- Risk assessment and scenario modeling
- Policy recommendation generation
- Constitutional AI guidance (e.g., GLADIUS)

**Restrictions**:
- Cannot execute on-chain transactions
- Cannot manage or access treasury assets
- Cannot participate in governance voting

**Example Models**: GLADIUS (Constitutional AI advisor)

---

### 2. GENERATIVE_INTERFACE

**Purpose**: Natural language interaction and content generation

**Identifier**: `keccak256("ARC::MODEL::GENERATIVE_INTERFACE")`

**Invariant Hash**: `keccak256("NO_GOV|NO_VERIFY|NO_EXEC")`

**Capabilities**:
- ✅ Can generate output (content)
- ❌ Cannot execute privileged operations
- ❌ Cannot verify or audit other models
- ❌ Cannot participate in governance
- ❌ Cannot manage policies
- ❌ Cannot manage assets

**Use Cases**:
- Natural language interfaces for user interaction
- Content generation and synthesis
- Query interpretation and response generation
- Documentation and report creation

**Restrictions**:
- Cannot participate in governance
- Cannot verify or audit other models
- Cannot execute privileged operations
- Limited to interface and content generation

**Example Models**: ChatGPT-style interfaces, content generators

---

### 3. OPERATIONAL_AGENT

**Purpose**: Automated task execution within defined boundaries

**Identifier**: `keccak256("ARC::MODEL::OPERATIONAL_AGENT")`

**Invariant Hash**: `keccak256("EXEC_ONLY|NO_POLICY|NO_VERIFY")`

**Capabilities**:
- ✅ Can execute on-chain actions (with approval)
- ✅ Can generate output
- ✅ Requires approval for actions
- ❌ Cannot verify or audit other models
- ❌ Cannot participate in governance
- ❌ Cannot manage policies
- ❌ Cannot manage assets

**Use Cases**:
- Automated task execution
- Workflow orchestration
- System monitoring and maintenance
- Routine operational procedures

**Restrictions**:
- Cannot modify policies or governance rules
- Cannot verify or audit other models
- Limited to pre-approved operational scope

**Example Models**: Automation agents, workflow orchestrators

---

### 4. VERIFIER_AUDITOR

**Purpose**: Verification, auditing, and compliance checking

**Identifier**: `keccak256("ARC::MODEL::VERIFIER_AUDITOR")`

**Invariant Hash**: `keccak256("VERIFY_ONLY|NO_EXEC|NO_POLICY")`

**Capabilities**:
- ✅ Can verify and audit other models
- ✅ Can generate output (verification reports)
- ❌ Cannot execute operational tasks
- ❌ Cannot participate in governance
- ❌ Cannot manage policies
- ❌ Cannot manage assets

**Use Cases**:
- Model output verification
- Compliance checking and auditing
- Security assessment
- Quality assurance and validation

**Restrictions**:
- Cannot execute operational tasks
- Cannot modify policies
- Limited to verification and auditing functions

**Example Models**: Audit agents, compliance checkers

---

## Capability System

### Capability Flags

Each model class has the following capability flags:

| Capability | Description |
|------------|-------------|
| `canExecute` | Can execute on-chain actions |
| `canVerify` | Can verify or audit other models |
| `canGovern` | Can participate in governance |
| `canManagePolicy` | Can manage or update policies |
| `canManageAssets` | Can manage treasury or assets |
| `canGenerateOutput` | Can generate creative/analytical output |
| `requiresApproval` | Requires governance approval for actions |
| `isAdvisoryOnly` | Provides advisory output only (no execution) |

### Capability Matrix

|                      | Reasoning Core | Generative Interface | Operational Agent | Verifier Auditor |
|---------------------|----------------|---------------------|-------------------|------------------|
| canExecute          | ❌             | ❌                  | ✅                | ❌               |
| canVerify           | ❌             | ❌                  | ❌                | ✅               |
| canGovern           | ❌             | ❌                  | ❌                | ❌               |
| canManagePolicy     | ❌             | ❌                  | ❌                | ❌               |
| canManageAssets     | ❌             | ❌                  | ❌                | ❌               |
| canGenerateOutput   | ✅             | ✅                  | ✅                | ✅               |
| requiresApproval    | ❌             | ❌                  | ✅                | ❌               |
| isAdvisoryOnly      | ✅             | ❌                  | ❌                | ❌               |

## Usage Examples

### Solidity

```solidity
import {ModelClassSchema} from "./libraries/ModelClassSchema.sol";
import {ModelClass} from "./libraries/ModelClass.sol";

// Get complete schema
ModelClassSchema.ClassSchema memory schema = 
    ModelClassSchema.getReasoningCoreSchema();

// Check specific capability
bool canExecute = ModelClassSchema.hasCapability(
    ModelClass.REASONING_CORE,
    "canExecute"
);

// Get human-readable name
string memory name = ModelClassSchema.getName(
    ModelClass.OPERATIONAL_AGENT
);

// Validate multiple capabilities
string[] memory required = new string[](2);
required[0] = "canExecute";
required[1] = "canGenerateOutput";

bool valid = ModelClassSchema.validateCapabilities(
    ModelClass.OPERATIONAL_AGENT,
    required
);
```

### Off-Chain Integration

The schema can be queried off-chain for:
- UI display and model selection
- Documentation generation
- Access control decisions
- Integration planning

## Security Considerations

### Immutability
- Schema is defined in pure functions
- No storage variables can be modified
- Deterministic output guarantees consistency

### Separation of Concerns
- Genesis defines validity
- Schema defines capabilities
- Registry enforces compliance
- Clear boundaries prevent privilege escalation

### Audit Trail
- Each capability is explicitly documented
- Restrictions are clearly stated
- Use cases provide context for auditors

## Integration with ARC Genesis

### Genesis Integration
The schema complements the Genesis contract:
- Genesis validates class IDs
- Genesis provides invariant hashes
- Schema provides detailed metadata
- Together they form complete class definition

### Registry Integration
The registry can use schema for:
- Validating model capabilities before registration
- Enforcing class-specific constraints
- Generating registration metadata

### SBT Integration
The SBT can encode:
- Class ID from Genesis
- Capability hash from Schema
- Model-specific attributes

## Extending the Schema

### Adding New Classes
1. Add class constant to `ModelClass.sol`
2. Add schema function to `ModelClassSchema.sol`
3. Update Genesis invariant hash function
4. Document in this file

### Adding New Capabilities
1. Add capability flag to `Capabilities` struct
2. Update all class schema functions
3. Update capability matrix documentation
4. Update hasCapability() function

## Versioning

Current Version: **1.0.0**

Schema versioning follows semantic versioning:
- MAJOR: Breaking changes to schema structure
- MINOR: New classes or capabilities added
- PATCH: Documentation or clarification updates

## License

AGPL-3.0 - Same as core contracts

## References

- [ARCGenesis.sol](../genesis/ARCGenesis.sol) - Immutable root contract
- [ModelClass.sol](./ModelClass.sol) - Class identifiers
- [ARCModelRegistry.sol](../registry/ARCModelRegistry.sol) - Registration system
