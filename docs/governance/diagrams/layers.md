Here are clean **Mermaid diagrams** for each core piece, showing how it works in isolation and its purpose. You can paste these into any Mermaid renderer or Markdown viewer with Mermaid enabled.

## **1. ARC Identity SBT (ARCxSBT)**

```mermaid
flowchart TD
    A[EAS Attestation] --> B[ARCxSBT Issue]
    B --> C[Non-Transferable SBT]
    C --> D[Role Weight + Decay]
    D --> E[Eligibility Query]
    E --> F[Identity Component in Voting]

    subgraph Purpose
      F --> G[Non-financial governance weight\nResists plutocracy]
    end
```

## **2. Governance Matrix**

```mermaid
flowchart TD
    A[Proposal Topic] --> B[Layers: Token, SBT, RWA]
    B --> C[Quorum & Supermajority Checks]
    C --> D[Timelock + Challenge Window]
    C --> E[Proposer Bond + FIFO Queue]
    C --> F[Emergency Path: pause()/cancel() + 2FA]

    subgraph Purpose
      D --> G[Deterministic thresholds & rules]
      E --> G
      F --> G
    end
```

## **3. ADAM Protocol**

```mermaid
flowchart TD
    A[Governor Call] --> B[AdamHost Builds Context]
    B --> C[Policy Chain of CPs]
    C --> D1[ALLOW]
    C --> D2[DENY]
    C --> D3[AMEND: rewrite diff within bounds]
    C --> D4[REQUIRE_2FA: store hash + block]
    D4 --> E[Second confirmation required]

    subgraph Purpose
      D1 --> F[Programmable guardrails]
      D2 --> F
      D3 --> F
      E --> F
    end
```

## **4. ARCxGovernor + Timelock + Executor**

```mermaid
flowchart TD
    A[Proposal Submitted] --> B[Voting via MACI/Eligibility]
    B --> C{Passed?}
    C -->|Yes| D[Timelock Delay]
    D --> E[Challenge Window]
    E --> F[Safe Executor Routes Call]
    F --> G[ADAM Host Verdict Validation]
    G --> H[Execution of Allowed Modules]

    subgraph Purpose
      H --> I[Autonomous but delayed execution\nNo rushed/hidden changes]
    end
```

## **5. Execution Modules**

```mermaid
flowchart TD
    A[Executor] --> B[Treasury: transfers/streams/swaps]
    A --> C[ParamManager: bounded param updates]
    A --> D[Grants: milestones & clawbacks]
    A --> E[RWA Registry: onboard, attest, dispute]

    subgraph Purpose
      B --> F[Domain-specific state changes]
      C --> F
      D --> F
      E --> F
    end
```
