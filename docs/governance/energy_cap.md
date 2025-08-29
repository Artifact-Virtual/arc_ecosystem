
# Energy Cap Update — End-to-End Walkthrough

```mermaid
flowchart TD
    A[Proposer with SBT+Token] -->|submits Energy Cap proposal| B[Governance Matrix]
    B -->|check quorums & bonds| C[ADAM Protocol Host]
    C -->|run RWARecency + ParamsGuard policies| D[Verdict: ALLOW + AMEND]
    D -->|validated diff| E[ARCxGovernor]
    E -->|vote + tally| F[Timelock & Challenge Window]
    F -->|passed + delay| G[ARCxExecutor]
    G -->|safe module call| H[ARC_RWARegistry]
    H -->|attest energy data + enforce bounds| I[Protocol Params Updated]
````

This diagram shows the **full pipeline**:

1. Proposal originates with identity & token stake.
2. Governance Matrix enforces topic quorums and bonds.
3. ADAM policies check proof recency, bounds, monotonicity.
4. Governor & MACI handle voting.
5. Timelock & challenge window protect against rushed execution.
6. Executor routes only to allowlisted module.
7. RWA Registry validates and commits the Energy Cap update.

````

---

### **Update for `governance_map.md`**  
Add the **bird’s-eye view** of the entire system:

```markdown
# ARCx Governance — Bird’s-Eye System Overview

```mermaid
flowchart TD
    subgraph Identity
        SBT[ARCx Identity SBT]
    end
    subgraph Rules
        Matrix[Governance Matrix]
    end
    subgraph Policy
        ADAM[ADAM Protocol Host + Policies]
    end
    subgraph Engine
        Gov[ARCxGovernor + Timelock + Executor]
    end
    subgraph Modules
        Treasury[Treasury]
        Params[ParamManager]
        Grants[Grants]
        RWA[RWA Registry]
    end

    SBT --> Matrix --> ADAM --> Gov --> Modules
    Gov --> Treasury
    Gov --> Params
    Gov --> Grants
    Gov --> RWA
````

This shows:

* **Who you are** → Identity SBT.
* **What rules apply** → Governance Matrix.
* **How rules evolve** → ADAM policies.
* **When/where execution happens** → Governor + Timelock + Executor.
* **What gets changed** → Execution modules (Treasury, Params, Grants, RWA).

```

---

✅ With these two inserts, you’ll have:  
- `layers.md` → isolated roles.  
- `lifecycle.md` → state machine flow.  
- `enerygy_cap.md` → concrete walkthrough.  
- `governance_map.md` → full bird’s-eye map.  

Do you want me to **patch these into the files directly** so you’ve got them ready in your repo?
```
