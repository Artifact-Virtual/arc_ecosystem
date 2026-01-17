---
title: API Reference
description: Contract interfaces, key functions, and events for the ARC ecosystem
version: 1.0.0
last_updated: 2026-01-17
---

# API Reference

## Overview

This document provides a comprehensive reference for the ARC ecosystem smart contracts, including interfaces, key functions, events, and usage examples.

---

## ARCx V2 Enhanced Token

### Contract Information

**Address:** `0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437`  
**Network:** Base L2 (Chain ID: 8453)

### Interface: IERC20

Standard ERC20 functions with extensions.

#### Transfer Functions

```solidity
/**
 * @dev Transfers tokens from caller to recipient
 * @param to Recipient address
 * @param amount Amount to transfer
 * @return success Boolean indicating success
 */
function transfer(address to, uint256 amount) external returns (bool);

/**
 * @dev Transfers tokens from one address to another
 * @param from Sender address
 * @param to Recipient address
 * @param amount Amount to transfer
 * @return success Boolean indicating success
 */
function transferFrom(address from, address to, uint256 amount) external returns (bool);
```

#### Approval Functions

```solidity
/**
 * @dev Approves spender to spend tokens on behalf of caller
 * @param spender Address to approve
 * @param amount Amount to approve
 * @return success Boolean indicating success
 */
function approve(address spender, uint256 amount) external returns (bool);

/**
 * @dev Increases allowance for spender
 * @param spender Address to increase allowance for
 * @param addedValue Amount to add to allowance
 * @return success Boolean indicating success
 */
function increaseAllowance(address spender, uint256 addedValue) external returns (bool);

/**
 * @dev Decreases allowance for spender
 * @param spender Address to decrease allowance for
 * @param subtractedValue Amount to subtract from allowance
 * @return success Boolean indicating success
 */
function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);
```

#### View Functions

```solidity
/**
 * @dev Returns the token balance of an account
 * @param account Address to query
 * @return balance Token balance
 */
function balanceOf(address account) external view returns (uint256);

/**
 * @dev Returns the allowance of spender for owner
 * @param owner Address of token owner
 * @param spender Address of spender
 * @return remaining Remaining allowance
 */
function allowance(address owner, address spender) external view returns (uint256);

/**
 * @dev Returns total token supply
 * @return supply Total supply
 */
function totalSupply() external view returns (uint256);

/**
 * @dev Returns token name
 * @return name Token name
 */
function name() external view returns (string memory);

/**
 * @dev Returns token symbol
 * @return symbol Token symbol
 */
function symbol() external view returns (string memory);

/**
 * @dev Returns token decimals
 * @return decimals Number of decimals
 */
function decimals() external view returns (uint8);
```

### Interface: IERC20Permit (EIP-2612)

Gasless approval via signatures.

```solidity
/**
 * @dev Sets approval via signature
 * @param owner Token owner address
 * @param spender Address to approve
 * @param value Amount to approve
 * @param deadline Signature expiration
 * @param v Signature parameter
 * @param r Signature parameter
 * @param s Signature parameter
 */
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;

/**
 * @dev Returns current nonce for address
 * @param owner Address to query
 * @return nonce Current nonce
 */
function nonces(address owner) external view returns (uint256);

/**
 * @dev Returns EIP-712 domain separator
 * @return separator Domain separator
 */
function DOMAIN_SEPARATOR() external view returns (bytes32);
```

### Interface: IERC20Votes

Voting power and delegation.

```solidity
/**
 * @dev Delegates voting power to delegatee
 * @param delegatee Address to delegate to
 */
function delegate(address delegatee) external;

/**
 * @dev Delegates voting power via signature
 * @param delegatee Address to delegate to
 * @param nonce Current nonce
 * @param expiry Signature expiration
 * @param v Signature parameter
 * @param r Signature parameter
 * @param s Signature parameter
 */
function delegateBySig(
    address delegatee,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;

/**
 * @dev Returns current voting power for account
 * @param account Address to query
 * @return votes Current voting power
 */
function getVotes(address account) external view returns (uint256);

/**
 * @dev Returns voting power at specific block
 * @param account Address to query
 * @param blockNumber Block number
 * @return votes Voting power at block
 */
function getPastVotes(address account, uint256 blockNumber) external view returns (uint256);

/**
 * @dev Returns delegate for account
 * @param account Address to query
 * @return delegate Current delegate
 */
function delegates(address account) external view returns (address);
```

### Events

```solidity
/**
 * @dev Emitted when tokens are transferred
 */
event Transfer(address indexed from, address indexed to, uint256 value);

/**
 * @dev Emitted when approval is set
 */
event Approval(address indexed owner, address indexed spender, uint256 value);

/**
 * @dev Emitted when voting power is delegated
 */
event DelegateChanged(
    address indexed delegator,
    address indexed fromDelegate,
    address indexed toDelegate
);

/**
 * @dev Emitted when delegate votes change
 */
event DelegateVotesChanged(
    address indexed delegate,
    uint256 previousBalance,
    uint256 newBalance
);
```

---

## Governance Contracts

### ARCGovernor

Main governance contract for proposal management and voting.

#### Key Functions

```solidity
/**
 * @dev Creates a new proposal
 * @param targets Target addresses
 * @param values ETH values
 * @param calldatas Function call data
 * @param description Proposal description
 * @return proposalId New proposal ID
 */
function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
) external returns (uint256);

/**
 * @dev Casts a vote on proposal
 * @param proposalId Proposal ID
 * @param support Vote direction (0=Against, 1=For, 2=Abstain)
 * @return balance Voter's voting power
 */
function castVote(uint256 proposalId, uint8 support) external returns (uint256);

/**
 * @dev Casts vote with reason
 * @param proposalId Proposal ID
 * @param support Vote direction
 * @param reason Voting reason
 * @return balance Voter's voting power
 */
function castVoteWithReason(
    uint256 proposalId,
    uint8 support,
    string calldata reason
) external returns (uint256);

/**
 * @dev Queues proposal in timelock
 * @param targets Target addresses
 * @param values ETH values
 * @param calldatas Function call data
 * @param descriptionHash Hash of description
 * @return proposalId Proposal ID
 */
function queue(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) external returns (uint256);

/**
 * @dev Executes proposal after timelock
 * @param targets Target addresses
 * @param values ETH values
 * @param calldatas Function call data
 * @param descriptionHash Hash of description
 * @return proposalId Proposal ID
 */
function execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) external payable returns (uint256);

/**
 * @dev Returns proposal state
 * @param proposalId Proposal ID
 * @return state Current state (0=Pending, 1=Active, etc.)
 */
function state(uint256 proposalId) external view returns (ProposalState);

/**
 * @dev Returns voting power for account at block
 * @param account Address to query
 * @param blockNumber Block number
 * @return votes Voting power
 */
function getVotes(address account, uint256 blockNumber) external view returns (uint256);
```

#### Events

```solidity
event ProposalCreated(
    uint256 proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    string[] signatures,
    bytes[] calldatas,
    uint256 startBlock,
    uint256 endBlock,
    string description
);

event VoteCast(
    address indexed voter,
    uint256 proposalId,
    uint8 support,
    uint256 weight,
    string reason
);

event ProposalQueued(uint256 proposalId, uint256 eta);

event ProposalExecuted(uint256 proposalId);

event ProposalCanceled(uint256 proposalId);
```

---

### ARCTimelock

Timelock controller for secure execution delays.

#### Key Functions

```solidity
/**
 * @dev Schedules an operation
 * @param target Target address
 * @param value ETH value
 * @param data Call data
 * @param predecessor Required predecessor operation
 * @param salt Unique salt
 * @param delay Execution delay
 */
function schedule(
    address target,
    uint256 value,
    bytes calldata data,
    bytes32 predecessor,
    bytes32 salt,
    uint256 delay
) external;

/**
 * @dev Executes a ready operation
 * @param target Target address
 * @param value ETH value
 * @param data Call data
 * @param predecessor Required predecessor
 * @param salt Salt used in scheduling
 */
function execute(
    address target,
    uint256 value,
    bytes calldata data,
    bytes32 predecessor,
    bytes32 salt
) external payable;

/**
 * @dev Cancels a pending operation
 * @param id Operation ID
 */
function cancel(bytes32 id) external;

/**
 * @dev Checks if operation is ready
 * @param id Operation ID
 * @return ready Boolean indicating if ready
 */
function isOperationReady(bytes32 id) external view returns (bool);

/**
 * @dev Returns minimum delay
 * @return delay Minimum delay in seconds
 */
function getMinDelay() external view returns (uint256);
```

#### Events

```solidity
event CallScheduled(
    bytes32 indexed id,
    uint256 indexed index,
    address target,
    uint256 value,
    bytes data,
    bytes32 predecessor,
    uint256 delay
);

event CallExecuted(
    bytes32 indexed id,
    uint256 indexed index,
    address target,
    uint256 value,
    bytes data
);

event Cancelled(bytes32 indexed id);

event MinDelayChange(uint256 oldDuration, uint256 newDuration);
```

---

### ARCTreasury

Treasury management contract.

#### Key Functions

```solidity
/**
 * @dev Withdraws funds via governance
 * @param token Token address (address(0) for ETH)
 * @param to Recipient address
 * @param amount Amount to withdraw
 */
function withdraw(address token, address to, uint256 amount) external;

/**
 * @dev Returns treasury balance
 * @param token Token address
 * @return balance Current balance
 */
function balance(address token) external view returns (uint256);

/**
 * @dev Emergency withdrawal (admin only)
 * @param token Token address
 * @param to Recipient address
 * @param amount Amount to withdraw
 */
function emergencyWithdraw(address token, address to, uint256 amount) external;
```

#### Events

```solidity
event Withdrawal(address indexed token, address indexed to, uint256 amount);

event Deposit(address indexed token, address indexed from, uint256 amount);

event EmergencyWithdrawal(address indexed token, address indexed to, uint256 amount);
```

---

## Usage Examples

### Token Transfer

```javascript
const arcx = await ethers.getContractAt(
  "ARCxV2",
  "0xDb3C3f9ECb93f3532b4FD5B050245dd2F2Eec437"
);

// Transfer tokens
await arcx.transfer(recipientAddress, ethers.parseEther("100"));

// Check balance
const balance = await arcx.balanceOf(userAddress);
console.log("Balance:", ethers.formatEther(balance));
```

### Approve and TransferFrom

```javascript
// Approve spender
await arcx.approve(spenderAddress, ethers.parseEther("1000"));

// TransferFrom (as spender)
await arcx.transferFrom(
  ownerAddress,
  recipientAddress,
  ethers.parseEther("100")
);
```

### Gasless Approval (Permit)

```javascript
// Create permit signature
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
const { v, r, s } = await createPermitSignature(
  owner,
  spender,
  amount,
  deadline
);

// Execute permit
await arcx.permit(owner, spender, amount, deadline, v, r, s);
```

### Delegate Voting Power

```javascript
// Delegate to another address
await arcx.delegate(delegateAddress);

// Delegate to self
await arcx.delegate(await signer.getAddress());

// Check voting power
const votes = await arcx.getVotes(userAddress);
console.log("Voting power:", ethers.formatEther(votes));
```

### Create Proposal

```javascript
const governor = await ethers.getContractAt("ARCGovernor", governorAddress);

// Proposal parameters
const targets = [tokenAddress];
const values = [0];
const calldatas = [
  token.interface.encodeFunctionData("transfer", [recipient, amount])
];
const description = "Proposal: Transfer tokens to recipient";

// Create proposal
const tx = await governor.propose(targets, values, calldatas, description);
const receipt = await tx.wait();

// Get proposal ID from event
const event = receipt.events.find(e => e.event === "ProposalCreated");
const proposalId = event.args.proposalId;
```

### Vote on Proposal

```javascript
// Vote for (1), against (0), or abstain (2)
await governor.castVote(proposalId, 1); // Vote FOR

// Vote with reason
await governor.castVoteWithReason(
  proposalId,
  1,
  "I support this proposal because..."
);
```

### Execute Proposal

```javascript
// Queue proposal (after voting succeeds)
await governor.queue(targets, values, calldatas, descriptionHash);

// Wait for timelock delay
await ethers.provider.send("evm_increaseTime", [172800]); // 48 hours

// Execute
await governor.execute(targets, values, calldatas, descriptionHash);
```

---

## Error Codes

### Common Errors

```solidity
// ERC20 Errors
error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
error ERC20InvalidSender(address sender);
error ERC20InvalidReceiver(address receiver);
error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

// Governance Errors
error GovernorInsufficientProposerVotes(address proposer, uint256 votes, uint256 threshold);
error GovernorInvalidProposalId(uint256 proposalId);
error GovernorUnexpectedProposalState(uint256 proposalId, ProposalState current, bytes32 expectedStates);

// Access Control Errors
error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);
error AccessControlBadConfirmation();
```

---

## Data Structures

### Proposal State

```solidity
enum ProposalState {
    Pending,    // 0
    Active,     // 1
    Canceled,   // 2
    Defeated,   // 3
    Succeeded,  // 4
    Queued,     // 5
    Expired,    // 6
    Executed    // 7
}
```

### Vote Type

```solidity
enum VoteType {
    Against,  // 0
    For,      // 1
    Abstain   // 2
}
```

---

## Gas Estimates

### Token Operations

| Operation | Gas Cost (estimate) |
|-----------|---------------------|
| Transfer | ~50,000 |
| Approve | ~46,000 |
| TransferFrom | ~55,000 |
| Permit | ~70,000 |
| Delegate | ~60,000 |

### Governance Operations

| Operation | Gas Cost (estimate) |
|-----------|---------------------|
| Create Proposal | ~150,000 |
| Cast Vote | ~80,000 |
| Queue Proposal | ~100,000 |
| Execute Proposal | Varies by actions |

*Note: Actual gas costs vary based on network conditions and specific operations.*

---

## Related Documentation

- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) - System architecture
- [04_TOKENS.md](./04_TOKENS.md) - Token details
- [05_GOVERNANCE.md](./05_GOVERNANCE.md) - Governance guide
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) - Deployment guide
- [10_SCRIPTS.md](./10_SCRIPTS.md) - Management scripts

---

## Support

For API questions and integration support:
- 📧 Email: dev@arcexchange.io
- 💬 Discord: [Developer channel](https://discord.gg/arc)
- 📝 GitHub: [API issues](https://github.com/Artifact-Virtual/ARC/issues)
- 📚 Docs: [Full documentation](./00_README_FULL.md)
