ARC MODEL REGISTRY
------------------
Responsibilities:
- Registers model classes (e.g., GLADIUS, SENTINEL, ORACLE)
- Enforces genesis hash invariants
- Prevents duplicate or rogue models

Security Model:
- Hardcoded expected genesis hash
- Constructor reverts on mismatch
- One-way registration (no delete)