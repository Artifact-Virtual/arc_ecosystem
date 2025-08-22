## 3. Establishment & Deployment Plan

### Deployment Phases

#### **Phase 1 (Week 0–2)**
- Deploy SBT contract to Base
- Seed issuers and issue initial roles
- Launch eligibility explorer (read-only)

#### **Phase 2 (Week 2–3)**
- Deploy Governance Matrix and Timelock
- Enable **PARAMS** and **GRANTS** topics only
- Run ratification votes to confirm configurations

#### **Phase 3 (Week 3–5)**
- Deploy ADAM Host and Registry
- Register basic guards: `ParamsGuard`, `RWARecency`
- Dry-run policies on shadow proposals

#### **Phase 4 (Week 5–6)**
- Bind Governor to Host
- Activate Treasury with proposer bonds
- Enable Energy/Carbon with capped weight pilot

#### **Phase 5 (Week 6+)**
- Launch public RWA onboarding
- Add grants and treasury modules fully
- Conduct external audits and set up monitoring dashboards
