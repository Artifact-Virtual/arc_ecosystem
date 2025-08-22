# ADAM Protocol — Continuous Intelligence System for The ARC

![Status: Draft](https://img.shields.io/badge/status-draft-yellow)
![Governance](https://img.shields.io/badge/governance-DAO-blue)
![Security](https://img.shields.io/badge/security-auditable-brightgreen)
![RWA](https://img.shields.io/badge/RWA-integrated-blueviolet)

<p align="center">
  <img src="../../logo/arcx_logo1-modified.png" alt="ARCx Logo" width="120"/>
</p>

<div align="center">
  <b>ARCx Constitutional Intelligence — Authoritative Governance Specification (v0.1)</b>
</div>

---

> **An RWA-aware DAO model designed for real-world impact, perpetual adaptability, and maximum security.**  
> This is the canonical, implementation-ready specification for ARCx governance on Base (chain-agnostic where possible).

---

## Preamble

- **Objective:** Bind capital, reputation, and verifiable real-world proofs into a single, composable voting system with autonomous execution, strict safety rails, and transparent monitoring.
- **Design stance:** Deterministic, auditable, minimally trust-assumptive. Every rule here is implementable without hand-waving.
- **Non-goals:** Vibes-based voting, opaque committees, “ad hoc exceptions.” Emergency powers are bytecode-limited.

---

## 1. Scope & Definitions

- **ARCx Token (ARCx):** ERC-20 with vote power from stake & duration. Minting finalized.

---

## 📚 Appendix: Implementation Requirements

### Text/Narrative Requirements

- Governance Model Whitepaper / Spec
- README / Governance Overview
- Proposal Submission Guide
- Deliberation & Discussion Policy
- Voting Guide
- Execution Pathways
- Emergency Procedures
- RWA Onboarding Playbook
- SBT/NFT Issuance & Revocation Policy
- Challenge & Dispute Resolution Process
- Upgrade & Amendment Procedures
- Security Policy & Incident Response Plan
- Treasury Management Policy
- Terms of Service & Participation Agreement
- Privacy Policy
- RWA Regulatory Compliance Checklist
- Jurisdictional Risk Matrix
- Onboarding Guide for New Members
- Code of Conduct
- Community Moderation Policy
- Transparency Reports (periodic)
- FAQ & Troubleshooting
- Docs Site Structure

### Code/Artifact Requirements

- System Architecture Diagram (SVG/PNG)
- Proposal → Vote → Execute Flow Diagram
- Proposal Lifecycle State Machine Diagram
- Governance Config Template (JSON/YAML)
- Governance Matrix (Excel/CSV)
- Weighting Aggregator Contract Interface (Solidity/Foundry)
- Governor Contract Interface (Solidity/Foundry)
- Module Registry & Permissions Map
- Smart Contract Audit Reports
- Oracle Integration Docs
- Sybil Resistance & Privacy Proofs (MACI/Semaphore, etc.)
- Monitoring & Transparency Dashboard Spec
- Subgraph/Indexing Documentation
- API Reference for Governance Modules
- Tokenomics Sheet (Excel/CSV)
- Vesting Schedules & Unlocks (Excel/CSV)
- Liquidity Provisioning Plan
- Auction/Distribution Mechanism Docs
- RWA Valuation & Risk Assessment Templates
- DAO Legal Entity Formation Docs
- Brand Assets (SVG/PNG, color palette)
- Launch Landing Page (HTML)
- Open Graph/Twitter Meta Tags
- Favicon Set
- Per-Proposal “What-If” Simulators (Excel/JS)
- CSV Importer for On-Chain Balances (Tool)
- Governance Analytics & Sensitivity Dashboards
- Automated Alerts & Anomaly Detection Spec
- Periodic Review & Audit Checklist

---

### Key Terms

- **SBT (IdentityRole):** Soulbound credential proving contributor roles (code, validator ops, governance, RWA curation).
- **RWA Proof:** On-chain attestation (EAS) of a real-world asset/impact (e.g., energy receipt, carbon credit, data feed, LP receipt).
- **Proposal Topic:** Category that gates eligibility & rules (e.g., TREASURY, PARAMS, ENERGY, CARBON, GRANTS).
- **Constitutional Engine:** Governor + Timelock + Safe Module that executes passed proposals.
- **MACI/Semaphore:** Anti-collusion, Sybil-resistant secret ballot infrastructure.
- **EAS:** Ethereum Attestation Service; canonical attestation layer.

---

## 2. Key Principles

- **Multi-Asset, Multi-Layer Voting Power:** Weight is a deterministic function of ARCx stake, SBTs, and attested RWA proofs; eligibility is per-proposal and enforced on-chain.
- **Context-Gated Ballots:** Only relevant voters (by topic) can vote; cross-domain proposals require layered quorums.
- **Autonomous, Modular Execution:** Proposals map to modular executors (treasury, parameters, RWA onboarding). Emergency actions are strictly bytecode-limited, time-locked, and dual-quorum gated.
- **Programmable RWA Integration:** 2-of-N oracle attestations, operator staking & slashing, recency-weighted impact.
- **Sybil/Collusion Resistance:** MACI/Semaphore + per-proposal salts + per-layer delegation.

---

## 3. Actors & Roles

- **Voter:** Address holding any subset of (ARCx stake, SBTs, RWA proofs).
- **Proposer:** Voter posting a proposal with a proposer bond.
- **Oracle Operator:** Signs RWA updates; posts stake; subject to slashing.
- **Emergency Council (bytecode-restricted):** Can `pause()` protocol, `cancel()` pre-execution. Nothing else.
- **Coordinator (MACI):** Runs anti-collusion tally process under published parameters.

---

## 4. Assets & Attestations

### 4.1 ARCx Stake (Capital)

- **Stake unit:** ARCx tokens locked `stake_amount` with measured `stake_days`.
- **Slashing risk factor:** Multiplier ∈ (0,1] reflecting exposure to slashing (if applied to certain roles).

### 4.2 Identity (SBT)

- **SBT issuance:** EAS attestation + soulbound token mint; one per role; upgradable metadata; non-transferable.
- **Activity decay:** Reduces role weight if no on-chain contribution heartbeat.

### 4.3 RWA Proofs

- **Types:** RWA_Energy, RWA_Carbon, RWA_Data, etc.
- **Attestation:** EAS schema + oracle multi-sig (2-of-N) with operator stakes.
- **Impact score:** Function of quantity, quality, and recency.

---

## 5. Canonical Voting Weight

For a voter `v` on proposal `p` with topic `τ`:

```
W(v,p) = α·f_token(v,p) + β·f_id(v,p) + Σ_k γ_k(τ)·f_rwa,k(v,p)
```

**Components:**

- `f_token = QV( sqrt(stake_days_weight · stake_amount) ) · slashing_risk_factor`
- `stake_days_weight = min(1 + log(1 + stake_days / D0), cap_sd)`
- `QV(x) = min( floor(√x), cap_qv )` (quadratic voting compression)
- `f_id = Σ_i role_i_weight · activity_decay(t_now - t_last_contrib_i)`
- `activity_decay(Δt) = e^(−Δt / T_decay)` (bounded below by decay_floor)
- `f_rwa,k = impact_score_k · recency_decay_k(Δt) · stake_lock_factor_k`
- `recency_decay_k(Δt) = e^(−Δt / R_k)`
- `stake_lock_factor_k ∈ [0.5, 1.2]` depending on lock duration & slashing exposure

**Normalization & Caps:**

- Normalize W to [0, W_max].
- Component ceiling: any single component ≤ max_component_share · W.

**Starter constants (on-chain configurable):**

- α=0.5, β=0.2, γ_energy=0.2, γ_carbon=0.1, W_max=10,000, max_component_share=0.6, D0=30d, cap_sd=2.0, cap_qv=100, T_decay=90d.

_All constants & curves live in on-chain config; changes require governance._

---

## 6. Eligibility Engine (Deterministic)

### 6.1 Topic Taxonomy (Bitmasks)

```text
TREASURY = TOKEN|SBT
PARAMS   = TOKEN|SBT
ENERGY   = TOKEN|SBT|RWA_ENERGY
CARBON   = TOKEN|SBT|RWA_CARBON
GRANTS   = TOKEN|SBT
```

### 6.2 On-chain Check

```solidity
interface IEligibility {
  function canVote(uint256 proposalId, address voter)
    external view returns (
      bool eligible,
      uint256 wToken,
      uint256 wSBT,
      uint256 wRWA
    );
}
```

- Single source of truth used by Governor/MACI tally adapter.
- Returns component weights for transparency.

---

## 7. Attestation & Revocation Semantics

- **EAS schemas** for IdentityRole, RWA_* with strict fields, issuer lists, versioning.
- **Revocation:** Prospective only; a revoked attestation invalidates future votes. Past finalized tallies are immutable.
- **Oracle quorum:** At least 2-of-N unique operators must sign an RWA update; operators post collateral to a slashing vault.

---

## 8. Proposal Types & Templates

- **TREASURY:** Payout/stream (Sablier-compatible), swap, LP add/remove, bond purchases.
- **PARAMS:** Update protocol parameter (`bytes32→{u256,address,bool}`).
- **RWA_ONBOARD:** Register new RWA schema & oracle set; set initial impact function.
- **RWA_UPDATE:** Accept new impact metrics from oracle quorum (subject to challenge window).
- **GRANTS:** Milestone-based grant issuance; clawback rules attached.

Each template declares:

- Topic τ, required quorums, supermajority thresholds, timelock, challenge window, proposer bond, and execution target(s).

---

## 9. Lifecycle & State Machine

```
Draft → Submitted → Review → Voting → (Passed | Failed)
If Passed → Timelock → ChallengeWindow → Execute → Monitor
```

**Key parameters (per topic):**

- quorum (fraction of eligible weight)
- supermajority (e.g., 60% yes)
- votingPeriod (e.g., 5–7 days)
- timelockDays (e.g., 5–14 days)
- challengeWindow (e.g., 48–72h)
- proposerBond (e.g., 0.5–2% of requested outlay for TREASURY; fixed for PARAMS)

**Anti-spam:**

- Proposer bond slashed for invalid/spam.
- Concurrency caps + cooldown for duplicate topics.

---

## 10. Voting & MACI Integration

- **Mode:** MACI for secret voting; classic Governor as fallback (configurable per topic).
- **Delegation:** Per layer (TOKEN, SBT, RWA_k) with independent delegates; revocable at any time; block-level effect.
- **Per-proposal salts:** Prevent replay or sale of vote intent.
- **Tally adapter:** Computes W via IEligibility at snapshot height; applies MACI voice credits → effective weights.

---

## 11. Execution, Timelocks, Emergency Brake

- **Timelock:** OZ TimelockController, per-topic delays; emits Queued, Executed, Cancelled.
- **Executor:** Gnosis Safe module calling target modules (Treasury, ParamManager, RWAOnboarder, Grants).
- **Emergency (dual quorum):**
  - Actions allowed: `pause()`, `cancel()` (pre-execution) only.
  - Requires both (TOKEN quorum subset & SBT quorum subset) within a short window.
  - Bytecode-enforced allowlist—no treasury moves, no param changes.

---

## 12. RWA Integration (Oracles, Slashing, Disputes)

- **Oracle operators:** Register keys, post stake.
- **Updates:** RWA_UPDATE requires 2-of-N signatures + EAS record with payload hash & block timestamp.
- **Slashing:** Proven fraud → operator stake burned/redistributed; proof via dispute module.
- **Dispute module:** Reality.eth-style challenge: bond, evidence, adjudication window; outcome flips or confirms update; losing side forfeits bond.

---

## 13. Contract Map (Minimal)

- **ARCxVotes:** ERC20Votes + stake duration multiplier + optional slashing hook.
- **ARCxIdentitySBT:** Soulbound roles; EAS-linked; `revoke()`, `setRoleWeight()`.
- **ARCxRWARegistry:** RWA schemas, oracle sets, operator stakes, impact functions, slashing vault.
- **ARCxEligibility:** Topic masks; returns eligibility & component weights.
- **ARCxGovernor:** Custom Governor; plugs MACI tally; pulls weights via IEligibility.
- **ARCxTimelock:** Per-topic delays & challenge windows.
- **ARCxExecutor:** Safe module with call routing to:
  - ARCxTreasury (payouts/streams/swaps/LP)
  - ARCxParamManager (protocol params)
  - ARCxRWAOnboarder (register RWA types)
  - ARCxGrants (milestones/clawbacks)
- **ARCxEmergencyBrake:** Bytecode-limited emergency interface.

**Interfaces:**

```solidity
interface IRWARegistry {
  function attest(bytes32 schemaId, bytes calldata data, bytes[] calldata oracleSigs) external;
  function impactOf(address voter, uint256 topicId) external view returns (uint256 weight);
}

interface IParamManager {
  function setUint(bytes32 key, uint256 val) external;
  function setAddr(bytes32 key, address val) external;
  function setBool(bytes32 key, bool val) external;
}
```

---

## 14. Governance Config (on-chain JSON, emitted & stored)

```json
{
  "weights": {
    "alpha_token": 0.5,
    "beta_identity": 0.2,
    "gamma": { "energy": 0.2, "carbon": 0.1 }
  },
  "caps": { "max_component_share": 0.6, "W_max": 10000 },
  "curves": {
    "stake_days": { "D0_days": 30, "cap_sd": 2.0 },
    "decay": { "T_decay_days": 90, "floor": 0.25 },
    "rwa_recency": { "energy_R_days": 60, "carbon_R_days": 90 }
  },
  "topics": {
    "TREASURY": { "quorum": 0.08, "supermajority": 0.60, "votingDays": 5, "timelockDays": 7, "challengeHours": 48, "layers": ["TOKEN","SBT"] },
    "PARAMS":   { "quorum": 0.06, "supermajority": 0.55, "votingDays": 5, "timelockDays": 5, "challengeHours": 48, "layers": ["TOKEN","SBT"] },
    "ENERGY":   { "quorum": 0.07, "supermajority": 0.58, "votingDays": 6, "timelockDays": 7, "challengeHours": 72, "layers": ["TOKEN","SBT","RWA_ENERGY"] },
    "CARBON":   { "quorum": 0.07, "supermajority": 0.58, "votingDays": 6, "timelockDays": 7, "challengeHours": 72, "layers": ["TOKEN","SBT","RWA_CARBON"] },
    "GRANTS":   { "quorum": 0.05, "supermajority": 0.55, "votingDays": 5, "timelockDays": 5, "challengeHours": 48, "layers": ["TOKEN","SBT"] }
  },
  "maci": { "enabled": true, "coordinator": "0x...", "voiceCredits": 100 },
  "emergency": { "dualQuorum": { "tokenPct": 0.04, "sbtPct": 0.20 }, "actions": ["pause","cancel"] },
  "bonds": { "proposerPct_TREASURY": 0.01, "proposerFlat_PARAMS": "1000 ARCx" }
}
```

---

## 15. Security Model & Mitigations

- **Oracle spoofing:** 2-of-N signatures + operator stake + dispute game + slashing.
- **Vote buying:** MACI secrecy, per-proposal salts, layer-scoped delegation, no global brokers.
- **Plutocracy:** QV + component caps + SBT/RWA floors.
- **SBT cartelization:** Activity decay + revocation on inactivity; EAS lineage with issuer rate-limits & audits.
- **Governance halting:** Proposal concurrency caps; proposer bonds; anti-spam filters; liveness alarms.
- **Council capture:** Bytecode-limited emergency actions; dual-quorum; public timelocks.
- **Reorg/MEV risk:** Snapshot block fixed; timelock delays; execution proofs logged.

---

## 16. Upgradability, Migrations, Versioning

- **Modules upgradable** behind Timelock + Executor (no proxy admin keys without gov).
- **Config versioning** with immutable audit trail; semantic version bump on breaking changes.
- **Migration path** for successor governance: one-way bridge proposal that deploys vNext contracts and binds state roots; requires supermajority & extended timelock.

---

## 17. Monitoring & Transparency

- **Subgraph indexing:** proposals, weights, tallies, executions, oracle updates, disputes.
- **Dashboards:** Eligibility explorer (address → topic breakdown), proposal drill-downs, oracle operator SLAs, slashing history.
- **Event canon:** Emitted for every critical transition; IPFS/Arweave pin for deliberation summaries.

---

## 18. Operations & Rollout Plan

**T-2 weeks**
- Publish math spec & config.
- Deploy: ARCxVotes, ARCxTimelock, ARCxExecutor (Safe module).
- EAS schemas: IdentityRole, RWA_Energy, RWA_Carbon.
- Register oracle operators; collect stake.

**T-1 week**
- Issue initial SBTs; open attestation issuer UI.
- Shadow MACI vote on test proposal; verify tally adapter vs. IEligibility.
- Launch eligibility explorer (read-only).

**T-0**
- Enable PARAMS & GRANTS topics; keep TREASURY gated for one week.
- Run ratification votes (config constants, issuer lists).

**T+1–2 weeks**
- Enable TREASURY, ENERGY, CARBON once RWA attestations flow cleanly.
- Start RWA pilot (capped weight).

**T+4 weeks**
- Turn on MACI for all topics; publish external audit of eligibility engine & RWA registry.
- Incident response: emergency pause available via dual-quorum; retrospective post-mortems mandated.

---

## 19. Example Walkthroughs

### 19.1 Treasury Grant

- Proposer deposits 1% bond; submits GRANTS with milestones.
- Eligibility: TOKEN+SBT.
- MACI vote → pass (≥ quorum & supermajority) → 5-day timelock → 48h challenge → Execute.
- ARCxGrants streams funds; clawback if milestones missed.

### 19.2 ENERGY Parameter Update via RWA

- Oracle set posts EAS attestation with energy output; 2-of-N signatures.
- RWA_UPDATE proposal auto-filed (or batched) → voters include TOKEN+SBT+RWA_ENERGY.
- On pass: ARCxParamManager.setUint(ENERGY_CAP, …); dispute window allows overturn with bonded challenge.

---

## 20. Off-Chain Artifacts

**EAS schema (example):**

```json
{
  "name": "RWA_Energy_v1",
  "fields": [
    { "name": "plantId", "type": "string" },
    { "name": "kwh", "type": "uint256" },
    { "name": "periodStart", "type": "uint64" },
    { "name": "periodEnd", "type": "uint64" },
    { "name": "sourceHash", "type": "bytes32" }
  ]
}
```

- **Deliberation log:** Forum/Discord threads summarized by AI; content-hash pinned to IPFS/Arweave; CID stored in proposal metadata.

---

## 21. Testing & Formal Methods

- **Unit/property tests:**
  - Weight math (monotonicity, caps, normalization).
  - Eligibility masks & edge cases.
  - Timelock & challenge flows.
  - Oracle disputes & slashing.
- **Fuzzing:** Proposer spam, griefing, timing edge cases.
- **Invariants:** No unauthorized calls from Emergency; component caps never exceeded; RWA updates require quorum.
- **Formal spec (TLA+ skeleton):** Invariants for timelock, challenge, dual-quorum emergency, and “no fund movement without TREASURY pass.”

---

## 22. Parameters & Defaults (Suggested, Tune Per Vote)

- **Quorums:** 5–8% depending on topic.
- **Supermajorities:** 55–60%.
- **Windows:** Voting 5–7d; Timelock 5–14d; Challenge 48–72h.
- **Bonds:** 0.5–2% (TREASURY); flat for PARAMS.
- **RWA weights:** Start conservative; raise as data quality proves stable.

---

## 23. Glossary

- **MACI:** Minimal Anti-Collusion Infrastructure.
- **EAS:** Ethereum Attestation Service.
- **SBT:** Soulbound Token—non-transferable identity credential.
- **RWA:** Real-World Asset/Proof.
- **QV:** Quadratic Voting transformation.
- **Dual-quorum:** Simultaneous token & SBT quorums for emergency actions.

---

## Closing

This model is meant to be used, not admired: the math is fixed on-chain, eligibility is deterministic, attestations are revocable, oracles are slashable, and execution is automated with explicit guardrails. Capital, reputation, and verified impact speak together—and only within the domain where each is relevant. That’s the point.
