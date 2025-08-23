## Smart Contract Overview

### 1. `contracts/SimpleERC20.sol`
A standard, ownable, and mintable ERC20 token contract. This serves as a versatile template for deploying various tokens within the ecosystem, such as:
- **Primary utility token** for swapping (e.g., `AgentToken`)
- **Reward token** for yield farming (e.g., `RewardToken`)

**Features:**
- ERC20 standard compliance
- Ownership control
- Mint function for the owner to create an initial supply

---

### 2. `contracts/SimpleSwapRouter.sol`
A simplified swap router contract for exchanging ETH for a specific ERC20 token at a fixed rate. This provides a clear and predictable on-chain target for the AI agent when acquiring tokens for the user.

**Features:**
- Fixed-rate ETH-to-ERC20 swaps
- Designed for straightforward integration with AI-driven workflows

---

### 3. `contracts/YieldFarm.sol`
A yield farming contract that allows users to stake a token to earn rewards in another token. This enables the AI to propose and execute complex DeFi strategies, such as staking tokens acquired from the swap router to generate yield.

**Features:**
- Stake one token (e.g., `AgentToken`)
- Earn rewards in another token (e.g., `RewardToken`)
- Supports multi-step DeFi strategies

---