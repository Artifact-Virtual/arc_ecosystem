
# ADAM Protocol — Constitutional Program & Policy Engine

<p align="left">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Chain-Base%20(EVM)-blue?style=flat-square" alt="Chain"/>
  <img src="https://img.shields.io/badge/License-AGPL--3.0-blueviolet?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/Admin-Timelock%2BSafe-orange?style=flat-square" alt="Admin"/>
  <img src="https://img.shields.io/badge/Integrates-ARCxGovernor%2C%20EAS%2C%20MACI%2C%20RWA%20Registry-9cf?style=flat-square" alt="Integrates"/>
</p>

---

**Version:** 1.0 BETA (hardened)

TodoWrite: [completed] ADAM Protocol v1.2 (hardened); [todo] Foundry tests + formal invariants; [todo] policy toolchain.

## 0. Purpose & Scope

Deterministic, Wasm-sandboxed policy engine that gates proposal lifecycles, parameter diffs, and RWA updates via explicit guards, proofs, pre/post-conditions, 2FA, and bytecode allowlists. All paths auditable, fuel/memory bounded, replay-safe.

## 1. Core Objects

* **Constitutional Program (CP):** Wasm (wasm32-unknown-unknown), pure/deterministic, fixed ABI, fuel+memory capped, no syscalls/time/random.
* **Policy Chain:** Ordered CP list per topic; each returns `ALLOW | DENY | AMEND(ChangeSet) | REQUIRE_2FA(hash)`. First terminal wins; default `DENY`.
* **ChangeSet:** Canonical param ops `{op:uint8 key:bytes32 val:bytes32}` where `op∈{1=setUint,2=setAddr,3=setBool}`; ABI-encoded array.
* **ProofBundle:** Deterministic CBOR (RFC 8949 Canonical) containing `easUIDs[]`, `oracleSigs[]`, `roleCountersign[]`, `payloadHash`, `snapshotBlock`; Host keccak256 over CBOR = `proofHash`.
* **Inter-Block 2FA:** Second, disjoint confirmation within `[min2FA,max2FA]` blocks via configured profile.

## 2. Hooks & Topics

Hooks: `onSubmit`, `onVoteStart`, `onTally`, `onQueue`, `onExecute`, `onRwaUpdate`, `onEmergency`. Topics: `TREASURY, PARAMS, ENERGY, CARBON, GRANTS`. Each `(topic,hook)` has a Policy Chain.

## 3. Host Evaluation Pipeline

1. Governor/Executor calls Host `evaluate(hook,topic,proposalId,proofBundle,diff)`.
2. Host builds immutable **Context** at `snapshotBlock`: topic config (WAD), eligibility snapshots, params, oracle state, EAS verifies, `proofHash`.
3. Stream Context to CPs in order; stop on terminal verdict.
4. AMEND → validate against allowlist/bounds; produce `newDiff`.
5. REQUIRE\_2FA(h) → record pending hash and DENY for this step.
6. Emit `VerdictEmitted`; queue/execute uses final, amended `diff`.

## 4. Constitutional Invariants (hard)

* No fund movement without topic `TREASURY`.
* PARAMS must stay within `ParamBounds`; monotonic flags enforced.
* RWA updates require `(≥2-of-N) ∧ active-operator-stakes ∧ recency window met`.
* Emergency limited to `pause()` and `cancel()` only.
* If `pending2FA`, queue/execute blocked until satisfied within window and with disjoint signers.

## 5. Wasm Sandbox & Metering

Fuel per call: `fuelMax` (config); memory cap: `<=256KiB`; floats disabled; only Host imports permitted; OOM/fuel-exhaust → `DENY`. `wasmHash=keccak256(code)` pinned in registry; upgrades via governance only.

## 6. ABI (Solidity↔Wasm)

**Host→CP imports (read-only, deterministic):**

```
getParam(bytes32)->bytes32
getTopicCfg(uint256)->bytes
getSnapshot(bytes32 addr,uint256 layerMask)->uint256
getQuorumReached()->bool
getSupermajorityReached()->bool
getOracleImpact(bytes32 addr,uint256 topic)->uint256
verifyEAS(bytes32 uid)->bool
getProofHash()->bytes32
getBlockTime()->uint64
```

`getTopicCfg` returns canonical CBOR: `{qTotalWad,qTokenWad,qSbtWad,qRwaWad,supermajorityWad,votingDays,timelockDays,challengeHours}`.

**CP→Host exports (one per hook):**

```
onSubmit(bytes ctx)->Verdict
onVoteStart(bytes ctx)->Verdict
onTally(bytes ctx)->Verdict
onQueue(bytes ctx)->Verdict
onExecute(bytes ctx)->Verdict
onRwaUpdate(bytes ctx)->Verdict
onEmergency(bytes ctx)->Verdict
```

## 7. Solidity Interfaces (authoritative)

```solidity
interface IAdamHost{
  event VerdictEmitted(uint256 indexed proposalId, bytes4 hook, uint8 verdict, bytes32 proofHash, bytes newDiff);
  event Pending2FA(uint256 indexed proposalId, bytes4 hook, bytes32 hash);
  event Satisfied2FA(uint256 indexed proposalId, bytes4 hook, bytes32 hash);
  function evaluate(bytes4 hook, uint256 topicId, uint256 proposalId, bytes calldata proofBundle, bytes calldata diff) external returns (uint8 verdict, bytes memory newDiff);
}
interface IAdamRegistry{
  event PolicySet(uint256 indexed topicId, bytes4 indexed hook, bytes32 policyId, uint8 order);
  event PolicyRemoved(uint256 indexed topicId, bytes4 indexed hook, bytes32 policyId);
  function setPolicy(uint256 topicId, bytes4 hook, bytes32 policyId, uint8 order) external;
  function removePolicy(uint256 topicId, bytes4 hook, bytes32 policyId) external;
  function policyChainOf(uint256 topicId, bytes4 hook) external view returns (bytes32[] memory);
}
interface IAdamPolicy{
  function wasmHash() external view returns (bytes32);
  function evaluate(bytes calldata ctx) external view returns (uint8 verdict, bytes memory data);
}
```

## 8. Storage Layout (stable)

```
AdamHost:
  address timelock
  address executor
  address governor
  address eas
  address rwaRegistry
  mapping(uint256=>mapping(bytes4=>bytes32[])) chain
  mapping(uint256=>mapping(bytes4=>bytes32)) pending2FAHash
  mapping(bytes32=>bool) usedEasUID
  uint64 min2FABlocks, max2FABlocks
  bytes32[] paramAllowlist
  mapping(bytes32=>ParamBounds){uint256 min,max;bool monoUp;bool monoDown;}
  uint32 fuelMax
  uint32 memMax
```

## 9) Exact Semantics

* **evaluate(...)**: decode deterministic CBOR proof; reject if any UID `usedEasUID[uid]==true`; EAS.verify(uid)==true; mark UIDs used for this evaluation only when verdict != DENY OR when 2FA satisfied (prevents grief replay). Iterate chain; on AMEND run `validateChangeSet` (allowlist/bounds); return `(verdict,newDiff)`.
* **Queue/Execute 2FA**: if `pending2FAHash[proposal,hook]!=0`, require 2FA proof where `keccak(proofBundle)==pending` and `block.number ∈ [min2FA,max2FA]` and signer set disjointness enforced by profile (e.g., SBT-only quorum or `EAS:PolicyCounterSign_v1`). Clear pending and allow.
* **Disjointness**: dual-quorum profile enforces second step uses SBT-layer-only weights; EAS profile enforces attesters not in first attester-set (CP stores first-set hash in pending).

## 10) Policy Examples (canonical)

* **ParamsGuard:** ALLOW iff all ops within bounds/monotonic; else DENY.
* **TreasuryLimiter:** ALLOW iff epoch outlay + requested ≤ cap; requires `GRANTS` refUID if tag present.
* **RWARecency:** ALLOW iff each oracle proof within topic recency `R_k` and operator SLA ≥ threshold; else DENY.
* **Dual2FA:** REQUIRE\_2FA(proofHash) on high-impact keys; else pass through.

## 11) 2FA Profiles

* **DUAL\_QUORUM:** Pass 1: TOKEN+SBT; Pass 2: SBT-only quorum within window.
* **EAS\_AUDITOR:** Pass 2 requires attestation `PolicyCounterSign_v1` from auditor set.
* **ORACLE\_SPLIT:** Pass 2 requires disjoint oracle-operator set signatures.

## 12) Allowlist & Bounds

`ParamBounds{min,max,monoUp,monoDown}` keyed by `bytes32`. Only keys in `paramAllowlist` may be amended by CPs; others must be direct proposals. Bounds in WAD for numeric keys; adapters map to native units where needed.

## 13) Events & Errors

Errors: `PolicyFail()`, `NotGovernor()`, `OutOfBounds()`, `DisjointQuorumRequired()`, `TwoFAWindow()`, `ProofHashMismatch()`, `DiffNotAllowed()`, `WasmTrap()`, `FuelExceeded()`, `MemExceeded()`, `UIDReplay()`.

## 14) Security Model

Wasm code pinned by `wasmHash`; Host has no `delegatecall`; Executor allowlist-only; proofs single-use; bounded loops; OOG protection via batching; revert/trap→`DENY`; formal invariants hold irrespective of CP behavior.

## 15) On-Chain Config JSON (WAD strings)

```
{
 "adam":{
  "version":"1.2.0",
  "fuelMax": 2000000,
  "memMax": 262144,
  "policyChains":{
    "TREASURY":{"onTally":["0xPOLICY_TREASURY_LIMIT"],"onQueue":["0xPOLICY_DUAL2FA"]},
    "PARAMS":{"onTally":["0xPOLICY_PARAMS_GUARD"]},
    "ENERGY":{"onRwaUpdate":["0xPOLICY_RWA_RECENCY","0xPOLICY_DUAL2FA"]},
    "CARBON":{"onRwaUpdate":["0xPOLICY_RWA_RECENCY","0xPOLICY_DUAL2FA"]},
    "GRANTS":{"onTally":["0xPOLICY_GRANTS_BUDGET"]}
  },
  "twoFA":{"minBlocks":2,"maxBlocks":7200,"profiles":["DUAL_QUORUM","EAS_AUDITOR"]},
  "allowlist":["ENERGY_CAP","CARBON_CAP","FEE_BPS","QUORUM_PCT"],
  "bounds":{
    "FEE_BPS":{"min":"0","max":"500","monoUp":false,"monoDown":false},
    "QUORUM_PCT":{"min":"30000000000000000","max":"200000000000000000","monoUp":true,"monoDown":false}
  }
 }
}
```

## 16) Tests & Formal Methods

Unit/property: deterministic verdicts; AMEND within bounds; 2FA windows; disjointness; UID single-use; AMEND encoding/decoding.
Fuzz: malformed CBOR, adversarial diffs, Wasm fuel/mem exhaustion, chain reorderings.
Invariants (TLA+/Scribble): I1 no TREASURY→no funds; I2 bounds/monotonic; I3 RWA `(2-of-N ∧ stake ∧ recency)`; I4 pending2FA blocks queue/execute unless satisfied; I5 emergency only pause/cancel.

## 17) Reference Wasm Policy Skeleton (Rust, no comments)

```rust
#![no_std]
#[no_mangle] pub extern "C" fn onTally(ctx_ptr:*const u8, ctx_len:usize)->u32{ 1 }
```

## 18) Reference Host/Registry Skeleton (no comments)

```solidity
pragma solidity ^0.8.24;
interface IAdamPolicy{function evaluate(bytes calldata ctx) external view returns(uint8,bytes memory);}
contract AdamRegistry{
  mapping(uint256=>mapping(bytes4=>bytes32[])) public chain;
  event PolicySet(uint256 indexed t,bytes4 indexed h,bytes32 indexed id,uint8 o);
  function setPolicy(uint256 t,bytes4 h,bytes32 id,uint8 o) external { chain[t][h].push(id); emit PolicySet(t,h,id,o); }
  function policyChainOf(uint256 t,bytes4 h) external view returns(bytes32[] memory){ return chain[t][h]; }
}
contract AdamHost{
  address public governor; address public timelock; address public executor; address public eas; address public rwaRegistry;
  uint64 public min2FABlocks=2; uint64 public max2FABlocks=7200; uint32 public fuelMax=2_000_000; uint32 public memMax=262_144;
  mapping(uint256=>mapping(bytes4=>bytes32[])) public chain; mapping(uint256=>mapping(bytes4=>bytes32)) public pending2FAHash;
  mapping(bytes32=>bool) public usedEasUID;
  event VerdictEmitted(uint256 indexed p,bytes4 h,uint8 v,bytes32 ph,bytes nd);
  function evaluate(bytes4 h,uint256 t,uint256 p,bytes calldata proof,bytes calldata diff) external returns(uint8,bytes memory){
    bytes32 ph = keccak256(proof); uint8 v=1; bytes memory nd=diff; emit VerdictEmitted(p,h,v,ph,nd); return (v,nd);
  }
}
```

## 19) Rollout

T-2w publish ABI/bounds/allowlist; deploy Registry/Host; register policies; shadow-run. T-1w enable PARAMS; shadow TREASURY/RWA. T-0 bind Host to Governor, enable 2FA; emit config. T+2w audit; extend policies.

## 20) Changelog

v1.2 — Canonical CBOR proofs; stricter UID lifecycle; hook-scoped chains; disjointness enforcement; hardened storage/types; fuel/mem caps; WAD-aligned bounds; expanded events/errors; code skeletons.

## Community & Governance

- [ ] Community Guidelines
- [ ] Governance Structure
- [ ] Decision-Making Processes
- [ ] Conflict Resolution Mechanisms
- [ ] Engagement & Communication Strategies
- [ ] Community Feedback & Iteration Processes
  - [ ] Inclusivity & Diversity Initiatives
  - [ ] Continuous Improvement Mechanisms
  - [ ] Community Building Activities
  - [ ] Knowledge Sharing & Education Initiatives
  - [ ] Feedback Loops & Iterative Development
- [ ] Community Recognition & Incentives
- [ ] Community Representation & Advocacy
- [ ] Community Engagement & Outreach
- [ ] Community Resources & Support
- [ ] Community Tools & Infrastructure
- [ ] Community Events & Activities
- [ ] Community Sustainability & Environmental Initiatives
- [ ] Community Health & Wellbeing Initiatives
- [ ] Community Safety & Security Initiatives
- [ ] Community Empowerment & Capacity Building
- [ ] Community Innovation & Experimentation
- [ ] Community Resilience & Adaptability
  - [ ] Community Building & Networking Initiatives
  - [ ] Community Mentorship & Support Programs
  - [ ] Community Resource Sharing & Collaboration
  - [ ] Community Advocacy & Representation Initiatives
  - [ ] Community Digital Literacy & Skills Development
  - [ ] Community Access & Inclusion Initiatives
