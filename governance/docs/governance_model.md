
# ARCx Governance Matrix

<p align="left">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Chain-Base%20(EVM)-blue?style=flat-square" alt="Chain"/>
  <img src="https://img.shields.io/badge/License-AGPL--3.0-blueviolet?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/Admin-Timelock%2BSafe-orange?style=flat-square" alt="Admin"/>
  <img src="https://img.shields.io/badge/Integrates-ARCxGovernor%2C%20MACI%2C%20AdamHost%2C%20EAS%2C%20RWA%20Registry-9cf?style=flat-square" alt="Integrates"/>
</p>

---

**Version:** 1.0 BETA (Lean/Authoritative, hardened)

## 0. Purpose & Scope

Canonical, chain-enforced configuration for topics, layers, quorums, supermajorities, windows, bonds, concurrency, batching, and rounding. Values are on-chain, versioned, and emitted as JSON. No policy prose here—just rules the contracts must enforce.

## 1. Topic & Layer Constants

Layers (bitmask): `TOKEN=1<<0`, `SBT=1<<1`, `RWA_ENERGY=1<<2`, `RWA_CARBON=1<<3`.
Topic IDs (enum): `PARAMS=0`, `TREASURY=1`, `ENERGY=2`, `CARBON=3`, `GRANTS=4`.
Topic→layers:

* `TREASURY: TOKEN|SBT`
* `PARAMS:  TOKEN|SBT`
* `ENERGY:  TOKEN|SBT|RWA_ENERGY`
* `CARBON:  TOKEN|SBT|RWA_CARBON`
* `GRANTS:  TOKEN|SBT`

## 2. Deterministic Math & Rounding

Fixed-point WAD `1e18`. Snapshot at `onVoteStart`.
Eligible totals: `E_total = Σ_v W(v)`; per-layer `E_L = Σ_v W_L(v)`.
Participation (tally): `P_total = Σ_v (yes+no+abstain)`; per-layer `P_L` analogous.
Quorum: `P_total ≥ ceil(qTotalWad * E_total)` and for each layer `L` in topic: `P_L ≥ ceil(qL_Wad * E_L)`.
Approval: `yesRatio = yes / (yes+no)` (WAD); pass if `yesRatio ≥ supermajorityWad`.
Rounding: floor at voter level → sum in WAD → comparisons use ceil as specified. Abstain counts for quorum, not approval.

## 3. Default Topic Configuration

| Topic                                                                            | Layers                  | qTotal | qTOKEN | qSBT | qRWA | Supermajority | Voting | Timelock | Challenge |
| -------------------------------------------------------------------------------- | ----------------------- | :----: | :----: | :--: | :--: | :-----------: | :----: | :------: | :-------: |
| TREASURY                                                                         | TOKEN, SBT              |  0.08  |  0.06  | 0.10 |   —  |      0.60     |   5d   |    7d    |    48h    |
| PARAMS                                                                           | TOKEN, SBT              |  0.06  |  0.05  | 0.08 |   —  |      0.55     |   5d   |    5d    |    48h    |
| ENERGY                                                                           | TOKEN, SBT, RWA\_ENERGY |  0.07  |  0.05  | 0.08 | 0.05 |      0.58     |   6d   |    7d    |    72h    |
| CARBON                                                                           | TOKEN, SBT, RWA\_CARBON |  0.07  |  0.05  | 0.08 | 0.05 |      0.58     |   6d   |    7d    |    72h    |
| GRANTS                                                                           | TOKEN, SBT              |  0.05  |  0.04  | 0.06 |   —  |      0.55     |   5d   |    5d    |    48h    |
| Notes: `qRwaWad=0` **must** be set when the topic lacks an RWA layer (enforced). |                         |        |        |      |      |               |        |          |           |

## 4. Proposers, Bonds, Concurrency & Admission

Eligibility: proposer must be eligible for the topic at snapshot and satisfy identity floor `f_id(addr) ≥ minIdWad` (default `0.1e18`).
Bonds (flat bonds are in ARCx; % bonds are in the requested asset unless `bondAssetOverride` is set):

* TREASURY: `ceil(0.01 * requestedOutlay)`; full slash on spam/invalid target or `<20%` yes.
* PARAMS: `1000 ARCx`; 25% slash on out-of-bounds submission.
* ENERGY/CARBON: `100 ARCx`; 50% slash if oracle proofs invalid.
* GRANTS: `0.005 * requestedOutlay`; milestone-based partial refunds.
  Concurrency per topic (max Active): TREASURY=4, PARAMS=6, ENERGY=6, CARBON=6, GRANTS=8.
  Admission when full: FIFO **queue** per topic (maxQueue configurable). If queue full, the **oldest queued** auto-evicts with bond refund minus `queueFee` (configurable). Duplicate cooldown: 14d after fail; 7d after pass (same param key/treasury target).

## 5. Lifecycle & Hooks

`Draft → Submitted → Review(≤24h) → Voting → (Passed|Failed) → Timelock → ChallengeWindow → Execute → Monitor`
Static checks at Review (targets, bounds, diffs). Tally only at period end. Challenge uses bonded dispute; AdamHost re-checks on `onQueue/onExecute`.

## 6. Allowlisted Execution Targets

* TREASURY → `ARCxTreasury.{transfer,stream,swap,lpAdd,lpRemove}`
* PARAMS   → `ARCxParamManager.{setUint,setAddr,setBool}` (bounds enforced)
* ENERGY/CARBON → `ARCxRWARegistry.{attest,update}` (+ allowed `ParamManager` keys)
* GRANTS   → `ARCxGrants.{create,release,clawback}`

## 7. MACI Integration

When `maci.enabled=true`: voice credits `C(v) = floor(W(v)/unitWad)` (`unitWad=1e16` ⇒ 0.01 weight per credit). Adapter enforces per-layer delegations and reverse-maps credits to WAD for quorum/approval. Fallback Governor uses raw `W(v)`.

## 8. DoS & Gas Bounds

* `maxRolesPerAddress=16` (SBT).
* `maxRWAProofsPerProposal=32`.
* `maxParamOpsPerProposal=8`.
* Batched tally: `batchTallySize` voters per batch; `maxVotersPerBatch` hard cap; gas-bounded loop with resumable cursor.

## 9. Emergency (Bytecode-limited)

Actions: `pause()` and `cancel()` only (pre-execution).
Dual-quorum: `TOKEN ≥ 0.04 * E_TOKEN` **and** `SBT ≥ 0.20 * E_SBT`; supermajority `0.60`.
Inter-block 2FA (AdamHost `DUAL_QUORUM`): second confirmation within `[2, 7200]` blocks by SBT-only quorum.

## 10. Interfaces (authoritative types)

```solidity
interface ITopicConfig {
  struct TopicCfg {
    uint256 layerMask;
    uint256 qTotalWad;
    uint256 qTokenWad;
    uint256 qSbtWad;
    uint256 qRwaWad;     // must be 0 when topic has no RWA layer
    uint256 supermajorityWad;
    uint64  votingDays;
    uint64  timelockDays;
    uint64  challengeHours;
    uint8   maxActive;
  }
  function get(uint256 topicId) external view returns (TopicCfg memory);
}

interface IEligibility {
  function canVote(uint256 proposalId, address voter)
    external view returns (bool eligible, uint256 wToken, uint256 wSBT, uint256 wRWA);
}
```

## 11) Canonical On-Chain JSON (WAD strings)

All decimals below are **WAD strings** (base-10 strings representing 1e18-scaled values).

```json
{
  "governance": {
    "version": "1.0.0-beta",
    "scale": "wad",
    "topics": {
      "TREASURY": {
        "id": 1,
        "layers": ["TOKEN","SBT"],
        "qTotalWad": "80000000000000000",
        "qTokenWad": "60000000000000000",
        "qSbtWad":   "100000000000000000",
        "qRwaWad":   "0",
        "supermajorityWad":"600000000000000000",
        "votingDays":5,"timelockDays":7,"challengeHours":48,"maxActive":4
      },
      "PARAMS": {
        "id": 0,
        "layers": ["TOKEN","SBT"],
        "qTotalWad": "60000000000000000",
        "qTokenWad": "50000000000000000",
        "qSbtWad":   "80000000000000000",
        "qRwaWad":   "0",
        "supermajorityWad":"550000000000000000",
        "votingDays":5,"timelockDays":5,"challengeHours":48,"maxActive":6
      },
      "ENERGY": {
        "id": 2,
        "layers": ["TOKEN","SBT","RWA_ENERGY"],
        "qTotalWad": "70000000000000000",
        "qTokenWad": "50000000000000000",
        "qSbtWad":   "80000000000000000",
        "qRwaWad":   "50000000000000000",
        "supermajorityWad":"580000000000000000",
        "votingDays":6,"timelockDays":7,"challengeHours":72,"maxActive":6
      },
      "CARBON": {
        "id": 3,
        "layers": ["TOKEN","SBT","RWA_CARBON"],
        "qTotalWad": "70000000000000000",
        "qTokenWad": "50000000000000000",
        "qSbtWad":   "80000000000000000",
        "qRwaWad":   "50000000000000000",
        "supermajorityWad":"580000000000000000",
        "votingDays":6,"timelockDays":7,"challengeHours":72,"maxActive":6
      },
      "GRANTS": {
        "id": 4,
        "layers": ["TOKEN","SBT"],
        "qTotalWad": "50000000000000000",
        "qTokenWad": "40000000000000000",
        "qSbtWad":   "60000000000000000",
        "qRwaWad":   "0",
        "supermajorityWad":"550000000000000000",
        "votingDays":5,"timelockDays":5,"challengeHours":48,"maxActive":8
      }
    },
    "bonds": {
      "TREASURY_pctWad":"10000000000000000",
      "PARAMS_flatARCx":"1000000000000000000000",
      "ENERGY_flatARCx":"100000000000000000000",
      "CARBON_flatARCx":"100000000000000000000",
      "GRANTS_pctWad":"5000000000000000",
      "bondAssetOverride":"0x0000000000000000000000000000000000000000"
    },
    "proposer": {
      "minIdWad":"100000000000000000",
      "cooldownDays_pass":7,
      "cooldownDays_fail":14
    },
    "emergency": {
      "dualQuorum": {
        "tokenPctWad":"40000000000000000",
        "sbtPctWad":"200000000000000000"
      },
      "supermajorityWad":"600000000000000000",
      "twoFA":{"minBlocks":2,"maxBlocks":7200}
    },
    "maci":{"enabled":true,"unitWad":"10000000000000000"},
    "limits":{
      "maxRolesPerAddress":16,
      "maxRWAProofsPerProposal":32,
      "maxParamOpsPerProposal":8,
      "batchTallySize":500,
      "maxVotersPerBatch":750,
      "maxQueuePerTopic":24,
      "queueFeeARCx":"1000000000000000000"
    }
  }
}
```

## 12) Enforcement Notes

* Governor must reject transitions to Voting if `Active(topic) == maxActive`; place proposal into FIFO queue.
* When `Queue(topic)` is full, evict the **oldest queued** (refund bond minus `queueFee`).
* Enforce `qRwaWad==0` when `RWA_*` not in `layerMask`; otherwise revert config.

## 13) MACI Equivalence Check

Adapter guarantees `Σ credits * unitWad` equals raw WAD within ≤`unitWad` per voter. Tests must assert reversibility bounds.

## 14) Gas/Bounds Invariants

No unbounded loops; all per-address/per-proposal iterations bounded by config; batched tally must be resumable without duplication; all math uses WAD with ceil/floor rules above.

## 15) Changelog

v1.0-beta — Unified WAD types (incl. supermajority), fixed topic IDs, added FIFO admission/eviction, explicit bond denominations, RWA-absent `qRwaWad=0` rule, and batching limits.
