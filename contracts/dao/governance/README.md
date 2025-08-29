# ARC DECENTRAL AUTONOMOUS ORGANIZATION

## DAO Governance

This repository contains a comprehensive, enterprise-grade governance system for the ARC DAO, featuring advanced voting mechanisms, secure timelock controls, collaborative proposal management, sophisticated treasury operations, and seamless integration with the existing ARC ecosystem.

## Architecture Overview

The ARC DAO governance system consists of six core contracts working in harmony:

### Core Governance Contracts

#### 1. **ARCGovernor.sol** - Advanced Governor Contract

- **Features**: Quadratic voting, conviction voting, proposal lifecycle management
- **Security**: UUPS upgradeable, access control, reentrancy protection
- **Voting Types**: Single choice, quadratic, conviction, ranked choice, weighted
- **Integration**: Native ARCx token integration, timelock controls

#### 2. **ARCTimelock.sol** - Secure Execution Timelock

- **Features**: Multi-approval system, batch operations, emergency execution
- **Security**: Configurable delays, role-based access, operation scheduling
- **Capabilities**: Emergency bypass, operation cancellation, predecessor management

#### 3. **ARCProposal.sol** - Collaborative Proposal Management

- **Features**: Proposal templates, feedback system, amendment support
- **Collaboration**: Multi-author drafting, version control, impact assessment
- **Lifecycle**: Draft → Review → Voting → Execution stages

#### 4. **ARCVoting.sol** - Advanced Voting Mechanisms

- **Features**: Gasless voting, delegation, reputation-based weighting
- **Voting Types**: Single, quadratic, conviction, ranked choice, weighted
- **Delegation**: Voting power delegation, conviction delegation, delegation markets

#### 5. **ARCTreasury.sol** - Multi-Asset Treasury Management

- **Features**: Multi-asset support, yield farming, portfolio rebalancing
- **Security**: Proposal-based spending, emergency controls, risk management
- **Capabilities**: Automated strategies, treasury analytics, circuit breakers

#### 6. **ARCDAO.sol** - Main DAO Orchestrator

- **Features**: Unified interface, proposal orchestration, emergency controls
- **Integration**: Cross-contract communication, upgrade coordination
- **Analytics**: Comprehensive DAO metrics, member management

## Key Features

### Advanced Voting Mechanisms

- **Quadratic Voting**: Fair representation with diminishing returns
- **Conviction Voting**: Time-based voting power accumulation
- **Ranked Choice Voting**: Instant runoff with multiple preferences
- **Weighted Voting**: Flexible voting with custom weight distributions
- **Gasless Voting**: Meta-transaction support for better UX

### Secure Execution Controls

- **Timelock Controllers**: Configurable delays for secure execution
- **Multi-Approval System**: Required approvals for critical operations
- **Emergency Bypass**: Rapid response mechanisms for urgent situations
- **Operation Batching**: Efficient multi-operation execution

### Treasury Management

- **Multi-Asset Support**: ERC-20, native tokens, and LP tokens
- **Yield Farming**: Automated strategy allocation and harvesting
- **Portfolio Rebalancing**: Risk-adjusted asset allocation
- **Spending Proposals**: Governance-controlled fund allocation

### Proposal Lifecycle

- **Collaborative Drafting**: Multi-author proposal creation
- **Feedback System**: Community input and amendment support
- **Stage Management**: Structured progression from draft to execution
- **Impact Assessment**: Automated proposal evaluation

## Prerequisites

- **Solidity**: ^0.8.21
- **OpenZeppelin Contracts**: Latest upgradeable versions
- **Node.js**: ^16.0.0
- **Hardhat/Truffle**: For deployment and testing
- **ARC Ecosystem**: ARCx token, TreasuryRewards, StakingVault

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @openzeppelin/contracts-upgradeable
npm install @openzeppelin/hardhat-upgrades
```

### 2. Environment Configuration

Create a `.env` file with:

```env
PRIVATE_KEY=your_private_key
INFURA_PROJECT_ID=your_infura_id
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Deployment Order

#### Phase 1: Core Infrastructure

```javascript
// 1. Deploy ARCx Governance Token (if not exists)
// 2. Deploy ARCTimelock
const timelock = await deploy("ARCTimelock", [admin, config]);

// 3. Deploy ARCGovernor
const governor = await deploy("ARCGovernor", [arcxToken, timelock.address, config]);
```

#### Phase 2: Advanced Features

```javascript
// 4. Deploy ARCProposal
const proposalManager = await deploy("ARCProposal", [governor.address, config]);

// 5. Deploy ARCVoting
const voting = await deploy("ARCVoting", [admin, arcxToken, votingConfig]);

// 6. Deploy ARCTreasury
const treasury = await deploy("ARCTreasury", [admin, treasuryConfig]);
```

#### Phase 3: DAO Orchestrator

```javascript
// 7. Deploy ARCDAO (Main Interface)
const dao = await deploy("ARCDAO", [
    admin,
    daoConfig,
    arcxToken,
    governor.address,
    timelock.address,
    proposalManager.address,
    voting.address,
    treasury.address
]);
```

## Configuration

### Governor Configuration

```javascript
const governorConfig = {
    votingDelay: 1,           // 1 block
    votingPeriod: 50400,      // ~7 days
    proposalThreshold: ethers.utils.parseEther("1000"), // 1000 ARCx
    quorumPercentage: 4,      // 4%
    timelockDelay: 172800     // 2 days
};
```

### Voting Configuration

```javascript
const votingConfig = {
    minVotingPower: ethers.utils.parseEther("1"),
    maxConvictionTime: 2592000, // 30 days
    convictionGrowthRate: 100,   // 1% per day
    quadraticScalingFactor: 50,  // 0.5 scaling
    delegationEnabled: true,
    convictionEnabled: true,
    quadraticEnabled: true,
    rankedChoiceEnabled: true,
    delegationCooldown: 86400,   // 1 day
    undelegationCooldown: 86400  // 1 day
};
```

### Treasury Configuration

```javascript
const treasuryConfig = {
    proposalTimelock: 86400,     // 1 day
    emergencyTimelock: 3600,     // 1 hour
    maxSpendingLimit: ethers.utils.parseEther("10000"),
    requiredApprovals: 3,
    rebalanceThreshold: 500,     // 5%
    yieldHarvestCooldown: 86400, // 1 day
    emergencyMode: false,
    circuitBreakerThreshold: 2000 // 20%
};
```

## Usage Examples

### Creating a Proposal

```javascript
// 1. Create proposal through ARCDAO
const proposalId = await dao.createProposal(
    [targetAddress],           // Target contracts
    [0],                       // ETH values
    [encodedFunctionCall],     // Encoded function calls
    "Proposal description"     // Description
);

// 2. Advance through stages
await dao.advanceProposal(proposalId); // Draft -> Active
await dao.advanceProposal(proposalId); // Active -> Voting

// 3. Cast vote
await dao.castVote(proposalId, 1); // Support = Yes

// 4. Execute after timelock
await dao.advanceProposal(proposalId); // Voting -> Queued
await dao.executeProposal(proposalId); // Execute
```

### Treasury Operations

```javascript
// 1. Deposit assets
await treasury.deposit(tokenAddress, amount);

// 2. Propose spending
const spendingId = await treasury.proposeSpending(
    recipient,
    tokenAddress,
    amount,
    "Spending description"
);

// 3. Approve and execute
await treasury.approveSpending(spendingId);
await treasury.executeSpending(spendingId);
```

### Voting Delegation

```javascript
// 1. Delegate voting power
await voting.delegate(
    delegateAddress,
    amount,
    convictionAmount,
    duration,
    "Delegation reason"
);

// 2. Cast vote on behalf of delegator
await voting.castVote(sessionId, [choice], [weight], convictionAmount);
```

## Security Features

### Access Control

- **Role-Based Access**: ADMIN, TREASURER, EMERGENCY, GOVERNANCE roles
- **Multi-Signature**: Required approvals for critical operations
- **Timelock Delays**: Secure execution delays for all proposals

### Emergency Controls

- **Circuit Breakers**: Automatic system pause on anomalies
- **Emergency Mode**: Rapid response mechanisms
- **Emergency Withdrawal**: Protected emergency fund access

### Risk Management

- **Portfolio Diversification**: Automated rebalancing
- **Risk Assessment**: Strategy risk level evaluation
- **Circuit Breakers**: Threshold-based emergency stops

## Analytics & Monitoring

### DAO Metrics

- Total proposals and execution rate
- Active member participation
- Treasury value and yield performance
- Voting participation and power distribution

### Treasury Analytics

- Asset allocation and performance
- Yield farming returns
- Risk metrics and diversification scores

### Voting Analytics

- Participation rates
- Voting power distribution
- Conviction voting efficiency
- Delegation network analysis

## Upgrade Mechanism

The system uses UUPS upgradeable proxies for seamless upgrades:

```javascript
// Upgrade governor contract
const newGovernor = await deploy("ARCGovernorV2");
await upgrades.upgradeProxy(governor.address, newGovernor);

// Update DAO references
await dao.updateContracts(newGovernor.address, timelock, ...);
```

## Testing

Run the comprehensive test suite:

```bash
npm test
```

Test coverage includes:

- Proposal lifecycle testing
- Voting mechanism validation
- Treasury operation verification
- Emergency control testing
- Integration testing

## API Documentation

### ARCGovernor

- `propose()`: Create new proposal
- `castVote()`: Vote on proposal
- `queue()`: Queue proposal for execution
- `execute()`: Execute proposal after timelock

### ARCTimelock

- `scheduleBatch()`: Schedule operation batch
- `executeBatch()`: Execute scheduled operations
- `cancel()`: Cancel scheduled operation

### ARCProposal

- `createProposal()`: Create collaborative proposal
- `addFeedback()`: Add feedback to proposal
- `advanceStage()`: Move proposal to next stage

### ARCVoting

- `castVote()`: Cast vote with various mechanisms
- `delegate()`: Delegate voting power
- `createVotingSession()`: Create voting session

### ARCTreasury

- `deposit()`: Deposit assets to treasury
- `proposeSpending()`: Propose treasury spending
- `allocateToStrategy()`: Allocate funds to yield strategy

### ARCDAO

- `createProposal()`: Unified proposal creation
- `advanceProposal()`: Advance proposal through stages
- `castVote()`: Cast vote on proposal
- `executeProposal()`: Execute approved proposal

## Contributing

1. Fork the repository
2. Create feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in this repository
- Join our Discord community
- Check the documentation

## Acknowledgments

This governance system represents the cutting edge of DAO technology, incorporating Nobel-worthy concepts in voting theory, mechanism design, and decentralized governance. Special thanks to the OpenZeppelin team for their excellent upgradeable contract patterns and the broader DeFi community for pioneering governance innovations.

---

**ARC DAO Governance System** - Where sophisticated governance meets decentralized execution.
