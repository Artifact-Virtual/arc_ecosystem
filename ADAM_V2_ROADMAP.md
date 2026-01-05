# ADAM v2: Wasm Runtime Integration - Implementation Roadmap

**Target Branch**: `feature/adam-v2-wasm-runtime`  
**Base Branch**: `copilot/fix-wasm-sandboxed-policy-engine`  
**Estimated Timeline**: 8-12 weeks  
**Status**: Planning Phase

---

## Executive Summary

This document outlines the phased roadmap for implementing actual Wasm (WebAssembly) runtime integration into the ADAM constitutional policy engine. The current v1 implementation uses Solidity policies as reference implementations. V2 will add true Wasm sandboxed execution while maintaining backward compatibility.

### Why Wasm?

1. **Language Agnostic**: Policies can be written in Rust, C++, AssemblyScript, or any Wasm-compilable language
2. **True Sandboxing**: Deterministic execution with no access to contract storage or external state
3. **Fuel Metering**: Fine-grained gas accounting at instruction level
4. **Portability**: Same policy code can run on-chain and off-chain
5. **Security**: Memory-safe execution environment with no undefined behavior

### v1 vs v2 Comparison

| Feature | v1 (Current) | v2 (Wasm) |
|---------|--------------|-----------|
| Policy Language | Solidity | Wasm (Rust/C++/AS) |
| Execution | EVM native | Wasm VM |
| Gas Metering | Approximate | Instruction-level |
| Sandboxing | Contract boundaries | True VM isolation |
| Upgradability | Redeploy contract | Upload new Wasm |
| Off-chain Testing | Requires node | Native Wasm runtime |
| Language Support | Solidity only | Any→Wasm compiler |

---

## Phase 1: Research & Design (Weeks 1-2)

### Objectives
- ✅ Evaluate Wasm runtime options
- ✅ Define Wasm policy interface specification
- ✅ Design gas metering mechanism
- ✅ Plan backward compatibility strategy

### Tasks

#### 1.1 Runtime Evaluation
**Options**:
- **wasmer-rust**: Mature, production-ready, used by Cosmos
- **wasmtime**: Cranelift-based, good security track record
- **wasm3**: Interpreted, lower gas but easier integration
- **eWasm**: Ethereum-specific but not production ready

**Recommendation**: Start with **wasmer-rust** for Solidity integration

**Deliverables**:
- [ ] Comparative analysis document
- [ ] PoC: wasmer integration with Solidity
- [ ] Performance benchmarks
- [ ] Security assessment

#### 1.2 Interface Specification
Define standard interface for Wasm policies:

```rust
// Wasm Policy Interface (policy.wit)
interface adam-policy {
    // Evaluate a governance action
    // Returns: (verdict: u8, new_diff: bytes)
    fn evaluate(
        hook: [u8; 4],
        topic_id: u64,
        proposal_id: u64,
        proof_bundle: bytes,
        diff: bytes,
        fuel_limit: u64,
        memory_limit: u32
    ) -> result<(u8, bytes), string>;
    
    // Get policy metadata
    fn metadata() -> policy-metadata;
}

record policy-metadata {
    name: string,
    version: string,
    author: string,
    description: string,
    wasm_hash: [u8; 32]
}
```

**Deliverables**:
- [ ] WIT (WebAssembly Interface Types) specification
- [ ] Example policy in Rust
- [ ] Example policy in AssemblyScript
- [ ] Validation test suite

#### 1.3 Gas Metering Design
Design instruction-level gas metering:

```solidity
contract WasmGasSchedule {
    // Gas costs per Wasm instruction
    uint256 public constant GAS_LOAD = 1;
    uint256 public constant GAS_STORE = 2;
    uint256 public constant GAS_ADD = 1;
    uint256 public constant GAS_MUL = 2;
    uint256 public constant GAS_DIV = 4;
    uint256 public constant GAS_CALL = 10;
    // ... full schedule
}
```

**Deliverables**:
- [ ] Complete gas schedule
- [ ] Comparison with EVM gas costs
- [ ] Metering injection tooling
- [ ] Gas exhaustion handling

---

## Phase 2: Core Runtime Implementation (Weeks 3-5)

### Objectives
- ✅ Implement Wasm VM wrapper in Solidity
- ✅ Add fuel and memory metering
- ✅ Implement host functions
- ✅ Add error handling and safety checks

### Tasks

#### 2.1 Wasm VM Wrapper

**Option A: Native Precompile** (Recommended)
```solidity
// Precompiled contract at address 0x0A
contract WasmVM {
    function execute(
        bytes memory wasmCode,
        bytes memory input,
        uint256 fuelLimit,
        uint256 memoryLimit
    ) external returns (bytes memory output, uint256 fuelUsed);
}
```

**Option B: Pure Solidity Interpreter**
- Slower but no precompile needed
- Harder to maintain
- Not recommended for production

**Deliverables**:
- [ ] WasmVM precompile implementation (Rust)
- [ ] Solidity wrapper contract
- [ ] Integration tests
- [ ] Performance benchmarks

#### 2.2 Fuel Metering

```rust
// Inject metering into Wasm bytecode
fn inject_metering(wasm: &[u8], gas_schedule: &GasSchedule) -> Vec<u8> {
    // Parse Wasm
    let module = parse_wasm(wasm)?;
    
    // Inject gas counter updates
    for instruction in module.code.instructions {
        let gas_cost = gas_schedule.cost_of(&instruction);
        inject_gas_check(gas_cost);
    }
    
    // Emit instrumented Wasm
    module.to_bytes()
}
```

**Deliverables**:
- [ ] Metering injection tool (Rust)
- [ ] Gas exhaustion handling
- [ ] Dynamic gas schedule
- [ ] Gas refund mechanism

#### 2.3 Host Functions

Define Solidity-accessible functions for Wasm:

```rust
// Host functions available to Wasm policies
trait HostFunctions {
    fn keccak256(data: &[u8]) -> [u8; 32];
    fn ecrecover(hash: &[u8], sig: &[u8]) -> Result<Address, Error>;
    fn block_timestamp() -> u64;
    fn block_number() -> u64;
    // Limited, safe subset only
}
```

**Security Constraints**:
- No storage access
- No external calls
- No contract creation
- Read-only blockchain data
- Deterministic only

**Deliverables**:
- [ ] Host function registry
- [ ] Security audit of host functions
- [ ] Usage examples
- [ ] Documentation

---

## Phase 3: Policy Migration (Weeks 6-7)

### Objectives
- ✅ Port existing Solidity policies to Rust/Wasm
- ✅ Maintain functional equivalence
- ✅ Add comprehensive tests
- ✅ Performance optimization

### Tasks

#### 3.1 ParamsGuardPolicy (Wasm)

```rust
// Rust implementation
#[no_mangle]
pub extern "C" fn evaluate(
    hook: [u8; 4],
    topic_id: u64,
    proposal_id: u64,
    proof_bundle: &[u8],
    diff: &[u8],
    fuel_limit: u64,
    memory_limit: u32
) -> Result<(u8, Vec<u8>), String> {
    // Decode context
    let (keys, old_values, new_values) = decode_context(diff)?;
    
    // Check bounds for each parameter
    for i in 0..keys.len() {
        let bounds = get_param_bounds(&keys[i])?;
        if !bounds.check(new_values[i]) {
            return Ok((1, vec![])); // DENY
        }
    }
    
    Ok((0, diff.to_vec())) // ALLOW
}
```

**Deliverables**:
- [ ] ParamsGuard Wasm policy
- [ ] Unit tests (Rust)
- [ ] Integration tests (Solidity)
- [ ] Equivalence tests vs Solidity version

#### 3.2 TreasuryLimiterPolicy (Wasm)

```rust
// Stateless design - budget tracking remains in Solidity
#[no_mangle]
pub extern "C" fn evaluate(/* ... */) -> Result<(u8, Vec<u8>), String> {
    let (amount, recipient, action) = decode_treasury_context(diff)?;
    
    // Query current budget from host (read-only)
    let epoch_spent = host_call("get_epoch_spent", &[])?;
    let epoch_reserved = host_call("get_epoch_reserved", &[])?;
    let budget_cap = host_call("get_budget_cap", &[])?;
    
    // Check if proposal would exceed cap
    if epoch_spent + epoch_reserved + amount > budget_cap {
        return Ok((1, vec![])); // DENY
    }
    
    Ok((0, diff.to_vec())) // ALLOW
}
```

**Deliverables**:
- [ ] TreasuryLimiter Wasm policy
- [ ] Budget tracking integration
- [ ] Reservation system tests
- [ ] Race condition tests

#### 3.3 RWARecencyPolicy (Wasm)
#### 3.4 Dual2FAPolicy (Wasm)

Similar structure for remaining policies.

**Deliverables per policy**:
- [ ] Wasm implementation
- [ ] Compilation artifacts
- [ ] Test suite
- [ ] Gas benchmarks

---

## Phase 4: Integration & Testing (Week 8)

### Objectives
- ✅ Integrate Wasm runtime with AdamHost
- ✅ Add fallback to Solidity policies
- ✅ Comprehensive testing
- ✅ Performance validation

### Tasks

#### 4.1 AdamHost Integration

```solidity
contract AdamHost {
    IWasmVM public wasmVM;
    bool public wasmEnabled;
    
    function evaluate(/* ... */) external returns (uint8, bytes memory) {
        IAdamPolicy policy = IAdamPolicy(policyAddress);
        
        // Check if policy has Wasm bytecode
        bytes32 wasmHash = adamRegistry.getWasmHash(policyAddress);
        
        if (wasmEnabled && wasmHash != bytes32(0)) {
            // Execute via Wasm VM
            return _evaluateWasm(wasmHash, hook, topicId, /* ... */);
        } else {
            // Fallback to Solidity
            return policy.evaluate(hook, topicId, /* ... */);
        }
    }
    
    function _evaluateWasm(/* ... */) internal returns (uint8, bytes memory) {
        bytes memory wasmCode = adamRegistry.getWasmCode(wasmHash);
        bytes memory input = abi.encode(hook, topicId, proposalId, proof, diff);
        
        (bytes memory output, uint256 fuelUsed) = wasmVM.execute(
            wasmCode,
            input,
            fuelLimit,
            memoryLimit
        );
        
        require(fuelUsed <= fuelLimit, "Fuel exhausted");
        
        (uint8 verdict, bytes memory newDiff) = abi.decode(output, (uint8, bytes));
        return (verdict, newDiff);
    }
}
```

**Deliverables**:
- [ ] Wasm execution path in AdamHost
- [ ] Fallback mechanism
- [ ] Gas accounting
- [ ] Error handling

#### 4.2 Testing

**Test Categories**:
1. **Unit Tests** (Rust): Each Wasm policy in isolation
2. **Integration Tests** (Solidity): Full governance lifecycle with Wasm
3. **Equivalence Tests**: Wasm results match Solidity
4. **Fuzzing**: Property-based testing with Wasm
5. **Performance**: Gas consumption comparison
6. **Security**: Sandbox escape attempts

**Deliverables**:
- [ ] 500+ test cases
- [ ] 95%+ coverage
- [ ] Gas benchmarks
- [ ] Security penetration testing

---

## Phase 5: Documentation & Deployment (Week 9)

### Objectives
- ✅ Complete technical documentation
- ✅ Developer guides for Wasm policy authoring
- ✅ Deployment playbooks
- ✅ Migration guides

### Deliverables
- [ ] Wasm Policy Developer Guide
- [ ] Runtime Architecture Documentation
- [ ] Deployment Checklist
- [ ] Migration Guide (v1→v2)
- [ ] Video tutorials
- [ ] Example policies repository

---

## Phase 6: Audit & Hardening (Weeks 10-12)

### Objectives
- ✅ Third-party security audit
- ✅ Performance optimization
- ✅ Stress testing
- ✅ Production readiness

### Tasks

#### 6.1 Security Audit
- [ ] Engage Trail of Bits or OpenZeppelin
- [ ] Focus on Wasm VM security
- [ ] Sandbox escape testing
- [ ] Gas metering accuracy
- [ ] Host function safety

#### 6.2 Performance Optimization
- [ ] JIT compilation for hot paths
- [ ] Caching of compiled Wasm modules
- [ ] Gas schedule tuning
- [ ] Memory allocation optimization

#### 6.3 Stress Testing
- [ ] 10,000+ policy evaluations
- [ ] Concurrent execution (if applicable)
- [ ] Large Wasm modules (1MB+)
- [ ] Complex policy chains (10+ policies)

**Deliverables**:
- [ ] Security audit report
- [ ] Performance benchmarks
- [ ] Stress test results
- [ ] Production deployment plan

---

## Success Criteria

### Functional Requirements
- [ ] Wasm policies execute correctly
- [ ] Functional equivalence with v1 Solidity policies
- [ ] Backward compatibility maintained
- [ ] Smooth migration path

### Non-Functional Requirements
- [ ] Gas cost <200k per evaluation
- [ ] <50ms execution time off-chain
- [ ] 99.9% sandbox security (no escapes)
- [ ] Support for 100KB Wasm modules

### Quality Requirements
- [ ] 95%+ test coverage
- [ ] Zero critical vulnerabilities
- [ ] Complete documentation
- [ ] Professional audit completed

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Wasm VM bugs | Medium | High | Use battle-tested runtime (wasmer), extensive testing |
| Gas metering inaccuracy | Medium | Medium | Compare with existing benchmarks, tune schedule |
| Sandbox escape | Low | Critical | Security audit, fuzzing, formal verification |
| Performance issues | Medium | Medium | JIT compilation, caching, optimization |
| Integration complexity | High | Medium | Incremental rollout, fallback to v1 |
| Backward compatibility breaks | Low | High | Comprehensive migration tests |

---

## Dependencies

### External Dependencies
- **wasmer-rust** or **wasmtime**: Wasm runtime
- **wasm-instrument**: Gas metering injection
- **walrus**: Wasm parsing and manipulation
- **wit-bindgen**: Interface type generation

### Internal Dependencies
- v1 ADAM system (base)
- ARCGovernor integration
- Test infrastructure
- Deployment tooling

---

## Rollout Strategy

### Phase 1: Testnet
1. Deploy v2 to testnet
2. Run both v1 (Solidity) and v2 (Wasm) in parallel
3. Compare results for equivalence
4. Collect performance metrics

### Phase 2: Mainnet Canary
1. Enable Wasm for 1 low-risk policy (e.g., ParamsGuard)
2. Monitor for issues
3. Gradually enable more policies

### Phase 3: Full Mainnet
1. Enable Wasm for all policies
2. Keep v1 Solidity as fallback
3. Monitor and optimize

---

## Maintenance & Support

### Post-Launch
- Weekly monitoring of Wasm execution
- Monthly gas cost optimization
- Quarterly security reviews
- Annual major version updates

### Support Channels
- GitHub Issues for bugs
- Discord for developer questions
- Documentation site
- Video tutorials

---

## Budget & Resources

### Team Requirements
- 1 Rust developer (full-time, 12 weeks)
- 1 Solidity developer (part-time, 8 weeks)
- 1 Security auditor (2 weeks)
- 1 Technical writer (4 weeks)

### Estimated Costs
- Development: $80k-$120k
- Security Audit: $30k-$50k
- Infrastructure: $5k
- **Total**: $115k-$175k

---

## Checklist for PR Creation

- [ ] Create feature branch: `feature/adam-v2-wasm-runtime`
- [ ] Copy this roadmap to PR description
- [ ] Link to v1 PR for context
- [ ] Add milestones for each phase
- [ ] Enable draft mode during development
- [ ] Add reviewers
- [ ] Link to project board
- [ ] Set up CI/CD for Wasm builds

---

## References

### Technical Resources
- [Wasm Specification](https://webassembly.github.io/spec/)
- [wasmer Documentation](https://docs.wasmer.io/)
- [WIT Specification](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md)
- [Substrate Wasm Runtime](https://docs.substrate.io/fundamentals/runtime-intro/)
- [Cosmos CosmWasm](https://docs.cosmwasm.com/)

### Similar Projects
- **CosmWasm**: Wasm smart contracts on Cosmos
- **Substrate**: Wasm runtime for Polkadot
- **NEAR Protocol**: Wasm contracts on NEAR
- **Dfinity**: Wasm canisters on Internet Computer

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-05  
**Next Review**: Start of Phase 1

**Approval Required From**:
- [ ] Lead Developer
- [ ] Security Team
- [ ] Product Owner
- [ ] Community (via governance proposal)
