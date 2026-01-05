# Security Finding Template

## Finding ID: [SEVERITY]-[NUMBER]

**Example**: MEDIUM-03

---

### Metadata

| Field | Value |
|-------|-------|
| **Severity** | Critical / High / Medium / Low / Informational |
| **Status** | Open / In Progress / Mitigated / Resolved / Won't Fix |
| **Component** | Contract name or module |
| **Discoverer** | Audit team member |
| **Date Discovered** | YYYY-MM-DD |
| **Date Resolved** | YYYY-MM-DD (if resolved) |

---

### Description

Clear, concise description of the security issue or vulnerability.

**Technical Details**:
- What is the issue?
- Where is it located?
- How does it manifest?

---

### Impact

**Potential Impact**:
- Security implications
- Financial risk
- Operational risk
- Reputation risk

**Likelihood**: High / Medium / Low

**Overall Risk**: Critical / High / Medium / Low

---

### Proof of Concept

```solidity
// Code demonstrating the vulnerability
contract ExploitDemo {
    function exploit() external {
        // Attack vector
    }
}
```

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**: What should happen

**Actual Result**: What actually happens

---

### Affected Code

**File**: `contracts/path/to/Contract.sol`

**Lines**: L123-L145

```solidity
// Vulnerable code snippet
function vulnerableFunction() external {
    // Issue here
}
```

---

### Recommendation

**Proposed Fix**:

```solidity
// Fixed code
function secureFunction() external {
    require(validation, "Check failed");
    // Secure implementation
}
```

**Alternative Approaches**:
1. Approach A: ...
2. Approach B: ...

**Implementation Priority**: Immediate / High / Medium / Low

---

### References

- **CWE**: [CWE-XXX](https://cwe.mitre.org/data/definitions/XXX.html)
- **OWASP**: Relevant OWASP category
- **SWC Registry**: [SWC-XXX](https://swcregistry.io/docs/SWC-XXX)
- **Similar Incidents**: Links to similar vulnerabilities

**External Resources**:
- [Resource 1](https://example.com)
- [Resource 2](https://example.com)

---

### Testing

**Test Cases Added**:
- [ ] Unit test covering the vulnerability
- [ ] Integration test validating the fix
- [ ] Regression test to prevent reintroduction

**Test File**: `tests/security/TestContractSecurity.test.ts`

---

### Verification

**Verification Steps**:
1. Apply fix
2. Run test suite
3. Verify no regression
4. Conduct peer review
5. Re-test with automated tools

**Verified By**: Name  
**Verification Date**: YYYY-MM-DD

---

### Additional Notes

Any additional context, discussion, or considerations.

---

**Template Version**: 1.0  
**Last Updated**: 2026-01-05
