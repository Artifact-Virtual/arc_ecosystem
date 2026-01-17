---
title: Governance Systems
description: DAO structure, voting mechanisms, and proposal lifecycle in the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# Governance Systems

## Overview

The ARC ecosystem features a comprehensive governance framework with multiple voting mechanisms, secure execution controls, and democratic decision-making. This system enables token holders to shape the future of the protocol.

---

## Governance Architecture

### Core Components

1. **ARCGovernor** - Proposal lifecycle and voting
2. **ARCTimelock** - Secure execution delays
3. **ARCProposal** - Proposal management
4. **ARCVoting** - Flexible voting mechanisms
5. **ARCTreasury** - Fund management
6. **ARCDAO** - Unified orchestrator

### Governance Flow

```
Token Holder
    ↓
Create Proposal (ARCProposal)
    ↓
Voting Period Opens (ARCGovernor)
    ↓
Cast Votes (ARCVoting)
    ↓
Proposal Succeeds/Fails
    ↓
Queue in Timelock (ARCTimelock)
    ↓
Execute After Delay
    ↓
Action Executed (Treasury/Contract)
```

---

## Proposal System

### Proposal Types

#### 1. Basic Proposals
Simple governance decisions without fund allocation.

**Examples:**
- Protocol parameter changes
- Feature enablement
- Policy decisions
- Community initiatives

**Requirements:**
- Minimum token threshold
- Simple majority (>50%)
- Standard timelock delay

#### 2. Treasury Proposals
Proposals involving fund allocation or spending.

**Examples:**
- Grant distributions
- Partnership funding
- Development budgets
- Marketing allocations

**Requirements:**
- Higher token threshold
- Supermajority (>66%)
- Extended timelock delay
- Multi-sig approval

#### 3. Parameter Proposals
Technical parameter adjustments.

**Examples:**
- Voting period duration
- Quorum requirements
- Timelock delays
- Fee structures

**Requirements:**
- Technical expertise verification
- Community discussion period
- Standard majority
- Technical review

#### 4. Upgrade Proposals
Contract upgrade proposals.

**Examples:**
- Protocol upgrades
- Security patches
- Feature additions
- Bug fixes

**Requirements:**
- Highest token threshold
- Supermajority vote
- Extended discussion period
- Security audit required
- Maximum timelock delay

### Proposal Lifecycle

#### Stage 1: Creation (Pending)

**Requirements:**
- Minimum tokens held (proposal threshold)
- Valid proposal format
- Clear description and rationale
- Executable actions defined

**Duration:** Instant

```solidity
function createProposal(
    string memory description,
    ProposalType proposalType,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas
) external returns (uint256 proposalId)
```

#### Stage 2: Delay (Pending → Active)

**Purpose:** Allow community to review proposal

**Duration:** Configurable (typically 1-2 days)

**Activities:**
- Community discussion
- Technical review
- Risk assessment
- Delegate consideration

#### Stage 3: Voting (Active)

**Purpose:** Token holders cast votes

**Duration:** Configurable (typically 3-7 days)

**Voting Options:**
- For (support the proposal)
- Against (oppose the proposal)
- Abstain (counted for quorum only)

**Voting Power:**
- Based on token balance at snapshot
- Delegated votes counted
- One address, one vote direction

#### Stage 4: Resolution (Succeeded/Defeated)

**Success Criteria:**
- Quorum reached (minimum participation)
- Majority/supermajority achieved
- No critical issues raised

**Failure Conditions:**
- Quorum not reached
- Majority not achieved
- Proposal cancelled by creator

#### Stage 5: Timelock (Queued)

**Purpose:** Security delay before execution

**Duration:** 
- Basic: 24-48 hours
- Treasury: 48-72 hours
- Upgrades: 72-96 hours

**Activities:**
- Final security review
- Community awareness
- Preparation for execution
- Emergency cancellation possible

#### Stage 6: Execution (Executed)

**Purpose:** Implement proposal actions

**Requirements:**
- Timelock delay completed
- No cancellation
- Executor role authorization

**Actions:**
- Transfer funds (if treasury)
- Update parameters
- Execute contract calls
- Deploy upgrades

---

## Voting Mechanisms

### 1. Standard Voting (One Token, One Vote)

**How it works:**
- Each token = 1 vote
- Simple proportional representation
- Most common mechanism

**Use cases:**
- Basic proposals
- Simple decisions
- Day-to-day governance

**Formula:**
```
Voting Power = Token Balance
```

**Example:**
- Alice: 1,000 tokens = 1,000 votes
- Bob: 500 tokens = 500 votes
- Carol: 100 tokens = 100 votes

---

### 2. Quadratic Voting

**How it works:**
- Voting power = √(tokens)
- Reduces whale dominance
- Encourages broader participation

**Use cases:**
- Community decisions
- Fair representation needed
- Preventing plutocracy

**Formula:**
```
Voting Power = √(Token Balance)
```

**Example:**
- Alice: 10,000 tokens = 100 votes
- Bob: 2,500 tokens = 50 votes
- Carol: 100 tokens = 10 votes

**Benefits:**
- More balanced influence
- Encourages small holders
- Reduces concentration risk

---

### 3. Conviction Voting

**How it works:**
- Voting power increases over time
- Long-term commitment rewarded
- Time-weighted influence

**Use cases:**
- Long-term decisions
- Strategic planning
- Major upgrades

**Formula:**
```
Voting Power = Token Balance × Time Factor
Time Factor = min(1.0, Days Locked / Max Days)
```

**Example (30-day max):**
- Alice: 1,000 tokens, 30 days = 1,000 votes
- Bob: 1,000 tokens, 15 days = 500 votes
- Carol: 1,000 tokens, 3 days = 100 votes

**Benefits:**
- Rewards commitment
- Discourages short-term manipulation
- Aligns with long-term interests

---

### 4. Ranked Choice Voting

**How it works:**
- Vote for multiple options
- Rank preferences (1st, 2nd, 3rd...)
- Eliminates lowest, redistributes until winner

**Use cases:**
- Multiple candidates
- Grant recipient selection
- Feature prioritization

**Example:**
```
Option A: AI Integration
Option B: Bridge Development  
Option C: NFT Marketplace

Voter rankings:
1st: Option A (3 points)
2nd: Option B (2 points)
3rd: Option C (1 point)
```

**Benefits:**
- More nuanced preferences
- Reduces strategic voting
- Better consensus

---

### 5. Weighted Voting

**How it works:**
- Custom weight distribution
- Different factors considered
- Flexible configuration

**Factors:**
- Token holdings
- Reputation (SBT score)
- Participation history
- Time holding tokens
- NFT ownership

**Formula:**
```
Voting Power = (Token Balance × W1) +
               (Reputation Score × W2) +
               (Participation × W3)
```

**Example:**
```
Alice:
- 1,000 tokens (×0.5) = 500
- Reputation 50 (×0.3) = 15
- Participation 80% (×0.2) = 16
- Total: 531 votes

Bob:
- 2,000 tokens (×0.5) = 1,000
- Reputation 10 (×0.3) = 3
- Participation 20% (×0.2) = 4
- Total: 1,007 votes
```

---

## Voting Parameters

### Configurable Settings

| Parameter | Description | Typical Value |
|-----------|-------------|---------------|
| **Voting Delay** | Time before voting starts | 1-2 days |
| **Voting Period** | Duration of voting | 3-7 days |
| **Proposal Threshold** | Tokens needed to propose | 10,000 ARCX2 |
| **Quorum** | Minimum participation | 100,000 ARCX2 |
| **Execution Delay** | Timelock duration | 48 hours |

### Dynamic Quorum

Quorum adjusts based on:
- Historical participation
- Proposal importance
- Token distribution
- Market conditions

```solidity
function calculateQuorum(uint256 proposalId) public view returns (uint256) {
    // Dynamic calculation based on multiple factors
    uint256 baseQuorum = 100_000 * 1e18; // 100k tokens
    uint256 adjustment = calculateAdjustment();
    return baseQuorum + adjustment;
}
```

---

## Vote Delegation

### How Delegation Works

Token holders can delegate their voting power to trusted delegates without transferring tokens.

**Features:**
- Delegate voting power while keeping tokens
- Revoke delegation anytime
- Delegate to multiple addresses (partial delegation)
- Self-delegation (vote directly)

### Delegation Commands

```solidity
// Delegate to another address
function delegate(address delegatee) external;

// Delegate with signature (gasless)
function delegateBySig(
    address delegatee,
    uint256 nonce,
    uint256 expiry,
    uint8 v, bytes32 r, bytes32 s
) external;

// Check delegation
function delegates(address account) external view returns (address);

// Check voting power
function getVotes(address account) external view returns (uint256);
```

### Delegate Responsibilities

**Professional Delegates:**
- Stay informed on proposals
- Participate consistently
- Communicate voting rationale
- Represent delegators' interests
- Maintain transparency

**Delegator Responsibilities:**
- Choose delegates carefully
- Monitor delegate performance
- Revoke if performance poor
- Stay informed on major issues

---

## DAO Structure

### Organizational Hierarchy

```
Token Holders (Sovereign)
    ↓
Elected Delegates (Representatives)
    ↓
DAO Council (Coordination)
    ↓
Working Groups (Execution)
    ↓
Contributors (Implementation)
```

### Working Groups

#### 1. Technical Working Group
- Protocol development
- Security reviews
- Infrastructure management
- Technical proposals

#### 2. Treasury Working Group
- Fund allocation
- Budget management
- Investment strategy
- Grant programs

#### 3. Marketing Working Group
- Brand development
- Community growth
- Partnership management
- Communications

#### 4. Operations Working Group
- Day-to-day operations
- Legal compliance
- HR and talent
- Administrative tasks

### DAO Council

**Composition:** 5-7 elected members

**Responsibilities:**
- Coordinate working groups
- Emergency decisions
- Proposal shepherding
- Community representation

**Election:**
- Annual elections
- Token-weighted voting
- Minimum participation requirement
- Term limits (2 years)

---

## Treasury Management

### Treasury Structure

**Main Treasury Safe:** `0x8F8fdBFa1AF9f53973a7003CbF26D854De9b2f38`
- 3/5 multi-sig
- Holds main protocol funds
- Requires governance approval for spending

**Ecosystem Safe:** `0x2ebCb38562051b02dae9cAca5ed8Ddb353d225eb`
- 2/3 multi-sig
- Development and operations
- Faster execution for routine expenses

### Fund Allocation

**Revenue Sources:**
- Trading fees (Uniswap LP)
- Platform fees
- Partnership revenue
- Investment returns

**Expense Categories:**
- Development (40%)
- Operations (20%)
- Marketing (20%)
- Security (10%)
- Reserve (10%)

### Grant Programs

**Types of Grants:**

1. **Development Grants**
   - Protocol improvements
   - Integration development
   - Tool building

2. **Community Grants**
   - Community initiatives
   - Content creation
   - Educational materials

3. **Research Grants**
   - Protocol research
   - Economic modeling
   - Security research

**Grant Process:**
1. Application submission
2. Community review
3. Voting (if above threshold)
4. Milestone-based distribution

---

## Emergency Procedures

### Emergency Pause

**Triggers:**
- Critical vulnerability discovered
- Ongoing exploit
- Market manipulation
- Oracle failure

**Authorization:**
- DAO Council (3/5 approval)
- Emergency multi-sig
- Can be challenged by governance

### Emergency Upgrades

**Fast-Track Process:**
- Security-critical only
- Reduced timelock (24 hours)
- Requires supermajority (75%)
- Post-audit mandatory

### Recovery Procedures

**Asset Recovery:**
- Treasury safe restoration
- Contract redeployment
- Fund migration
- Compensation plans

---

## Governance Best Practices

### For Token Holders

1. **Stay Informed**
   - Read proposals thoroughly
   - Participate in discussions
   - Research implications

2. **Vote Consistently**
   - Don't abstain by default
   - Consider long-term effects
   - Vote based on merit

3. **Delegate Wisely**
   - Research delegates
   - Monitor performance
   - Revoke if necessary

### For Proposers

1. **Clear Communication**
   - Detailed description
   - Clear rationale
   - Expected outcomes

2. **Community Engagement**
   - Pre-proposal discussion
   - Address concerns
   - Build consensus

3. **Technical Accuracy**
   - Verify implementation
   - Security review
   - Test thoroughly

### For Delegates

1. **Transparency**
   - Share voting rationale
   - Regular updates
   - Open communication

2. **Consistency**
   - Vote on all proposals
   - Maintain participation
   - Meet expectations

3. **Representation**
   - Represent delegators
   - Consider all viewpoints
   - Balance interests

---

## Governance Analytics

### Key Metrics

- **Participation Rate:** % of tokens voting
- **Proposal Success Rate:** % of proposals passing
- **Average Quorum:** Typical participation level
- **Delegate Concentration:** Voting power distribution
- **Treasury Utilization:** Fund allocation efficiency

### Monitoring Tools

```bash
# Governance status
npx hardhat run scripts/monitor.ts --network base governance

# Proposal analytics
npx hardhat run scripts/monitor.ts --network base proposals

# Voting statistics
npx hardhat run scripts/monitor.ts --network base voting
```

---

## Future Governance Enhancements

### Planned Features

1. **Reputation System**
   - SBT-based reputation
   - Voting power multipliers
   - Contribution tracking

2. **Optimistic Governance**
   - Faster execution
   - Challenge period
   - Reduced overhead

3. **Shielded Voting**
   - Private voting
   - Revealed after period
   - Prevents bandwagon effect

4. **AI-Assisted Proposals**
   - Automated analysis
   - Impact simulation
   - Risk assessment

---

## Related Documentation

- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) - System architecture
- [04_TOKENS.md](./04_TOKENS.md) - Token systems
- [07_SECURITY.md](./07_SECURITY.md) - Security practices
- [08_API_REFERENCE.md](./08_API_REFERENCE.md) - Contract interfaces

---

## Support

For governance questions:
- 📧 Email: governance@arcexchange.io
- 💬 Discord: [Join discussions](https://discord.gg/arc)
- 📝 Forum: [Community forum](https://forum.arcexchange.io)
- 🗳️ Snapshot: [Off-chain voting](https://snapshot.org/#/arc)
