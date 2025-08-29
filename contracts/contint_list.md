Core Voting & Identity

ARCxVotes — ERC20Votes + stake duration multiplier + optional slashing hook

ARC_IdentitySBT — Soulbound roles; EAS-linked; revoke(), setRoleWeight()

Eligibility & Governance

ARC_Eligibility — Topic masks; returns eligibility & component weights

ARCxGovernor — Custom Governor; plugs MACI tally; pulls weights via IEligibility

ARCxTimelock — Per-topic delays & challenge windows

ARCxExecutor — Safe module with call routing to execution modules

Execution Modules

ARCxTreasury — payouts / streams / swaps / LP

ARCxParamManager — protocol parameters (bounded)

ARCxRWAOnboarder — register RWA types

ARCxGrants — milestones / clawbacks

ARCxEmergencyBrake — bytecode-limited emergency interface

Policy & Constitutional Layer

ADAM Host — runs Wasm Constitutional Programs (CPs) deterministically

ADAM Registry — stores per-topic policy chains

Policy Modules (Wasm) — ParamGuard, TreasuryLimiter, RWARecency, EthicalFilter

Interfaces & Surfaces

IEligibility — per-topic eligibility check (weights)

IAdamHost / IAdamRegistry — policy evaluation & chaining

IRWARegistry — attest, update, impactOf

RWA & Data Integration

ARC_RWARegistry — schemas, operator stakes, impact functions, slashing vault

Oracles — sign RWA updates (2-of-N with stake)

EAS — Ethereum Attestation Service (identity roles, RWA proofs)

Security & Monitoring

Slashing Vault — collateralized operator stakes

Audit Registry — proofs of security audits / attestations

2FA Profiles — dual-quorum, auditor attestation, oracle second-signature

Emergency Brake — pause / cancel only

Transparency & Monitoring

Subgraph Indexing — proposals, votes, SBTs, RWAs

Transparency Dashboard — weights, tallies, disputes, operator SLAs

Event Canon — full emitted logs (proposal lifecycle, policy verdicts, attestations)

Upgrade & Lifecycle

Timelock + Safe — admin execution path

Upgrade Controller — governance-controlled upgrades only (no admin keys)

Config JSON — canonical on-chain configuration snapshot