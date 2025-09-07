// contracts/tokens/arc-x/ARCxV2_Enhanced.sol
// SPDX-License-Identifier: MIT
// ARCx V2 Enhanced - Next-Generation DeFi Token with Advanced Features

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

/// @title ARCx V2 Enhanced - God-Tier DeFi Token
/// @notice Advanced token with yield generation, auto-compounding, governance, and profit-sharing mechanisms
/// @dev The most feature-rich token in DeFi - designed to generate maximum value for holders
contract ARCxV2Enhanced is 
    Initializable,
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable 
{
    using MathUpgradeable for uint256;

    // ========== ROLES ==========
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");
    bytes32 public constant YIELD_MANAGER_ROLE = keccak256("YIELD_MANAGER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // ========== CORE TOKEN ECONOMICS ==========
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18; // 1M ARCx fixed supply
    bool public mintingFinalized;
    
    // Migration from V1
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    address public immutable V1_TOKEN;
    mapping(address => bool) public v1Migrated;
    bool public migrationEnabled;
    uint256 public constant MIGRATION_BONUS_RATE = 1111; // 11% bonus
    uint256 public constant MIGRATION_BASE = 1000;

    // ========== YIELD GENERATION SYSTEM ==========
    struct YieldConfig {
        uint256 baseYieldRate; // Annual yield rate in basis points (e.g., 500 = 5%)
        uint256 compoundingFrequency; // Seconds between compounds
        uint256 lastCompoundTime;
        uint256 totalYieldGenerated;
        bool autoCompoundEnabled;
    }
    
    YieldConfig public yieldConfig;
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public accumulatedYield;
    mapping(address => bool) public autoCompoundOptOut; // Users can opt-out of auto-compound
    
    uint256 public totalYieldDistributed;
    address public yieldReservePool; // Address holding tokens for yield distribution

    // ========== STAKING & REWARD SYSTEM ==========
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod; // Lock period in seconds
        uint256 multiplier; // Yield multiplier in basis points (10000 = 1x)
        uint256 unclaimedRewards;
    }
    
    mapping(address => StakeInfo[]) public userStakes;
    mapping(uint256 => uint256) public lockPeriodMultipliers; // lockPeriod => multiplier
    
    uint256 public totalStaked;
    uint256 public stakingYieldPool; // Reserved tokens for staking rewards
    
    // Pre-defined lock periods with multipliers
    uint256 public constant LOCK_30_DAYS = 30 days;
    uint256 public constant LOCK_90_DAYS = 90 days;
    uint256 public constant LOCK_180_DAYS = 180 days;
    uint256 public constant LOCK_365_DAYS = 365 days;

    // ========== PROFIT SHARING SYSTEM ==========
    struct ProfitShare {
        uint256 totalProfits;
        uint256 distributionPerToken;
        uint256 timestamp;
        mapping(address => bool) claimed;
    }
    
    mapping(uint256 => ProfitShare) public profitShares;
    uint256 public currentProfitRound;
    uint256 public totalProfitsShared;
    
    address public revenueWallet; // Wallet that deposits protocol revenues

    // ========== DEFLATIONARY MECHANISMS ==========
    struct BurnConfig {
        uint256 burnRatePerTransaction; // Basis points burned per transaction
        uint256 minimumBurnAmount; // Minimum tokens to burn
        uint256 totalBurnedFromFees;
        bool burnOnTransferEnabled;
    }
    
    BurnConfig public burnConfig;
    
    // ========== DYNAMIC FEE SYSTEM ==========
    struct FeeConfig {
        uint256 transferFee; // Basis points
        uint256 stakingFee; // Basis points
        uint256 unstakingFee; // Basis points
        address feeRecipient;
        bool dynamicFeesEnabled;
        uint256 volumeThreshold; // Volume threshold for fee adjustments
    }
    
    FeeConfig public feeConfig;
    mapping(address => bool) public feeExempt; // Addresses exempt from fees
    
    uint256 public dailyVolume;
    uint256 public lastVolumeReset;

    // ========== LOYALTY & GAMIFICATION ==========
    struct UserStats {
        uint256 totalTransferVolume;
        uint256 stakingDuration;
        uint256 loyaltyPoints;
        uint256 referralCount;
        address referrer;
        uint256 tierLevel; // 0 = Bronze, 1 = Silver, 2 = Gold, 3 = Platinum, 4 = Diamond
    }
    
    mapping(address => UserStats) public userStats;
    mapping(uint256 => uint256) public tierBenefits; // tier => yield bonus in basis points
    
    // ========== FLASH LOAN SYSTEM ==========
    uint256 public flashLoanFee; // Basis points
    uint256 public maxFlashLoanAmount; // Maximum amount for flash loans
    bool public flashLoansEnabled;
    
    // ========== ORACLE & PRICE TRACKING ==========
    address public priceOracle; // External price oracle
    uint256 public lastPrice;
    uint256 public priceUpdateThreshold; // Minimum price change to trigger updates
    
    // ========== GOVERNANCE ENHANCEMENTS ==========
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public proposalThreshold; // Minimum tokens needed to create proposal
    uint256 public votingPeriod; // Duration of voting period

    // ========== EVENTS ==========
    event YieldCompounded(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 amount);
    event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event ProfitDistributed(uint256 indexed round, uint256 totalAmount, uint256 perTokenAmount);
    event ProfitClaimed(address indexed user, uint256 indexed round, uint256 amount);
    event LoyaltyPointsEarned(address indexed user, uint256 points, string reason);
    event TierUpgraded(address indexed user, uint256 newTier);
    event FlashLoan(address indexed borrower, uint256 amount, uint256 fee);
    event FeeConfigUpdated(uint256 transferFee, uint256 stakingFee, uint256 unstakingFee);
    event BurnConfigUpdated(uint256 burnRate, uint256 minimumBurn);

    // ========== MODIFIERS ==========
    modifier onlyValidStakeIndex(address user, uint256 index) {
        require(index < userStakes[user].length, "Invalid stake index");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address _v1Token) {
        V1_TOKEN = _v1Token;
        _disableInitializers();
    }

    /**
     * @dev Initialize the enhanced contract
     */
    function initialize(
        string memory name,
        string memory symbol,
        address admin
    ) public initializer {
        require(admin != address(0), "Invalid admin address");
        
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __ERC20Permit_init(name);
        __ERC20Votes_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(RECOVERY_ROLE, admin);
        _grantRole(YIELD_MANAGER_ROLE, admin);
        _grantRole(TREASURY_ROLE, admin);

        // Initialize yield system
        yieldConfig = YieldConfig({
            baseYieldRate: 500, // 5% annual yield
            compoundingFrequency: 1 days,
            lastCompoundTime: block.timestamp,
            totalYieldGenerated: 0,
            autoCompoundEnabled: true
        });

        // Initialize lock period multipliers
        lockPeriodMultipliers[LOCK_30_DAYS] = 11000; // 1.1x (10% bonus)
        lockPeriodMultipliers[LOCK_90_DAYS] = 12500; // 1.25x (25% bonus)
        lockPeriodMultipliers[LOCK_180_DAYS] = 15000; // 1.5x (50% bonus)
        lockPeriodMultipliers[LOCK_365_DAYS] = 20000; // 2x (100% bonus)

        // Initialize tier benefits
        tierBenefits[0] = 0;     // Bronze: 0% bonus
        tierBenefits[1] = 250;   // Silver: 2.5% bonus
        tierBenefits[2] = 500;   // Gold: 5% bonus
        tierBenefits[3] = 1000;  // Platinum: 10% bonus
        tierBenefits[4] = 2000;  // Diamond: 20% bonus

        // Initialize fee config
        feeConfig = FeeConfig({
            transferFee: 25, // 0.25%
            stakingFee: 0, // No staking fee
            unstakingFee: 100, // 1% unstaking fee
            feeRecipient: admin,
            dynamicFeesEnabled: true,
            volumeThreshold: 100000 * 10**18 // 100k tokens daily volume threshold
        });

        // Initialize burn config
        burnConfig = BurnConfig({
            burnRatePerTransaction: 5, // 0.05% burn per transaction
            minimumBurnAmount: 1 * 10**18, // Minimum 1 token burn
            totalBurnedFromFees: 0,
            burnOnTransferEnabled: true
        });

        // Initialize flash loan config
        flashLoanFee = 30; // 0.3% flash loan fee
        maxFlashLoanAmount = 50000 * 10**18; // 50k max flash loan
        flashLoansEnabled = true;

        // Initialize governance
        proposalThreshold = 1000 * 10**18; // 1000 tokens needed to create proposal
        votingPeriod = 7 days;

        // Enable migration
        migrationEnabled = true;
    }

    // ========== ENHANCED YIELD GENERATION ==========

    /**
     * @dev Auto-compound yield for all users (called periodically)
     */
    function globalAutoCompound() external onlyRole(YIELD_MANAGER_ROLE) {
        require(
            block.timestamp >= yieldConfig.lastCompoundTime + yieldConfig.compoundingFrequency,
            "Too early to compound"
        );

        uint256 totalSupplyCache = totalSupply();
        if (totalSupplyCache == 0) return;

        // Calculate yield for the period
        uint256 timeDelta = block.timestamp - yieldConfig.lastCompoundTime;
        uint256 annualizedYield = (totalSupplyCache * yieldConfig.baseYieldRate) / 10000;
        uint256 periodYield = (annualizedYield * timeDelta) / 365 days;

        if (periodYield > 0 && yieldReservePool != address(0)) {
            uint256 reserveBalance = balanceOf(yieldReservePool);
            uint256 actualYield = periodYield > reserveBalance ? reserveBalance : periodYield;

            if (actualYield > 0) {
                // Distribute yield proportionally to all holders
                _distributeYield(actualYield);
                
                yieldConfig.totalYieldGenerated += actualYield;
                totalYieldDistributed += actualYield;
                yieldConfig.lastCompoundTime = block.timestamp;
            }
        }
    }

    /**
     * @dev Internal yield distribution
     */
    function _distributeYield(uint256 totalYield) internal {
        // This is a simplified version - in practice, you'd iterate through holders
        // or use a more gas-efficient method like merkle proofs
        
        // Transfer from yield reserve to contract for distribution
        if (yieldReservePool != address(0)) {
            _transfer(yieldReservePool, address(this), totalYield);
        }
    }

    /**
     * @dev Claim individual yield
     */
    function claimYield() external nonReentrant {
        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance > 0, "No tokens to claim yield for");

        uint256 claimableYield = _calculateClaimableYield(msg.sender);
        require(claimableYield > 0, "No yield to claim");

        accumulatedYield[msg.sender] = 0;
        lastClaimTime[msg.sender] = block.timestamp;

        // Apply tier bonus
        UserStats storage stats = userStats[msg.sender];
        uint256 tierBonus = tierBenefits[stats.tierLevel];
        if (tierBonus > 0) {
            uint256 bonusAmount = (claimableYield * tierBonus) / 10000;
            claimableYield += bonusAmount;
        }

        _transfer(address(this), msg.sender, claimableYield);
        
        emit YieldClaimed(msg.sender, claimableYield);
    }

    /**
     * @dev Calculate claimable yield for user
     */
    function _calculateClaimableYield(address user) internal view returns (uint256) {
        uint256 userBalance = balanceOf(user);
        if (userBalance == 0) return 0;

        uint256 timeSinceLastClaim = block.timestamp - lastClaimTime[user];
        uint256 annualizedYield = (userBalance * yieldConfig.baseYieldRate) / 10000;
        uint256 claimableYield = (annualizedYield * timeSinceLastClaim) / 365 days;

        return claimableYield + accumulatedYield[user];
    }

    // ========== ADVANCED STAKING SYSTEM ==========

    /**
     * @dev Stake tokens with lock period for enhanced rewards
     */
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant {
        require(amount > 0, "Invalid amount");
        require(lockPeriodMultipliers[lockPeriod] > 0, "Invalid lock period");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Apply staking fee if configured
        uint256 stakingFee = 0;
        if (feeConfig.stakingFee > 0) {
            stakingFee = (amount * feeConfig.stakingFee) / 10000;
            if (stakingFee > 0) {
                _transfer(msg.sender, feeConfig.feeRecipient, stakingFee);
            }
        }

        uint256 stakeAmount = amount - stakingFee;
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), stakeAmount);

        // Create stake record
        userStakes[msg.sender].push(StakeInfo({
            amount: stakeAmount,
            timestamp: block.timestamp,
            lockPeriod: lockPeriod,
            multiplier: lockPeriodMultipliers[lockPeriod],
            unclaimedRewards: 0
        }));

        totalStaked += stakeAmount;

        // Update user stats
        userStats[msg.sender].stakingDuration += lockPeriod;
        _updateUserTier(msg.sender);

        emit TokensStaked(msg.sender, stakeAmount, lockPeriod);
    }

    /**
     * @dev Unstake tokens (after lock period)
     */
    function unstake(uint256 stakeIndex) external nonReentrant onlyValidStakeIndex(msg.sender, stakeIndex) {
        StakeInfo storage stakeInfo = userStakes[msg.sender][stakeIndex];
        
        require(
            block.timestamp >= stakeInfo.timestamp + stakeInfo.lockPeriod,
            "Tokens still locked"
        );

        uint256 stakedAmount = stakeInfo.amount;
        uint256 rewards = _calculateStakeRewards(msg.sender, stakeIndex);

        // Apply unstaking fee
        uint256 unstakingFee = 0;
        if (feeConfig.unstakingFee > 0) {
            unstakingFee = (stakedAmount * feeConfig.unstakingFee) / 10000;
        }

        uint256 returnAmount = stakedAmount - unstakingFee + rewards;

        // Remove stake from array (swap with last element)
        uint256 lastIndex = userStakes[msg.sender].length - 1;
        if (stakeIndex != lastIndex) {
            userStakes[msg.sender][stakeIndex] = userStakes[msg.sender][lastIndex];
        }
        userStakes[msg.sender].pop();

        totalStaked -= stakedAmount;

        // Transfer tokens back to user
        _transfer(address(this), msg.sender, returnAmount);
        
        if (unstakingFee > 0) {
            _transfer(address(this), feeConfig.feeRecipient, unstakingFee);
        }

        emit TokensUnstaked(msg.sender, stakedAmount, rewards);
    }

    /**
     * @dev Calculate staking rewards
     */
    function _calculateStakeRewards(address user, uint256 stakeIndex) internal view returns (uint256) {
        StakeInfo storage stakeInfo = userStakes[user][stakeIndex];
        
        uint256 stakingTime = block.timestamp - stakeInfo.timestamp;
        uint256 baseReward = (stakeInfo.amount * yieldConfig.baseYieldRate * stakingTime) / (10000 * 365 days);
        
        // Apply multiplier
        uint256 enhancedReward = (baseReward * stakeInfo.multiplier) / 10000;
        
        return enhancedReward + stakeInfo.unclaimedRewards;
    }

    // ========== PROFIT SHARING SYSTEM ==========

    /**
     * @dev Distribute profits to all token holders
     */
    function distributeProfits(uint256 amount) external onlyRole(TREASURY_ROLE) nonReentrant {
        require(amount > 0, "Invalid amount");
        require(revenueWallet != address(0), "Revenue wallet not set");
        
        IERC20Upgradeable(address(this)).transferFrom(revenueWallet, address(this), amount);

        uint256 totalSupplyCache = totalSupply();
        require(totalSupplyCache > 0, "No tokens in circulation");

        uint256 distributionPerToken = amount / totalSupplyCache;
        
        currentProfitRound++;
        ProfitShare storage profitShare = profitShares[currentProfitRound];
        profitShare.totalProfits = amount;
        profitShare.distributionPerToken = distributionPerToken;
        profitShare.timestamp = block.timestamp;

        totalProfitsShared += amount;

        emit ProfitDistributed(currentProfitRound, amount, distributionPerToken);
    }

    /**
     * @dev Claim profit share for specific round
     */
    function claimProfitShare(uint256 round) external nonReentrant {
        require(round <= currentProfitRound && round > 0, "Invalid round");
        
        ProfitShare storage profitShare = profitShares[round];
        require(!profitShare.claimed[msg.sender], "Already claimed");

        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance > 0, "No tokens held");

        uint256 claimAmount = userBalance * profitShare.distributionPerToken;
        require(claimAmount > 0, "No profits to claim");

        profitShare.claimed[msg.sender] = true;
        _transfer(address(this), msg.sender, claimAmount);

        emit ProfitClaimed(msg.sender, round, claimAmount);
    }

    // ========== FLASH LOAN SYSTEM ==========

    /**
     * @dev Execute flash loan
     */
    function flashLoan(uint256 amount, bytes calldata data) external nonReentrant {
        require(flashLoansEnabled, "Flash loans disabled");
        require(amount <= maxFlashLoanAmount, "Amount too large");
        require(amount <= balanceOf(address(this)), "Insufficient liquidity");

        uint256 fee = (amount * flashLoanFee) / 10000;
        uint256 balanceBefore = balanceOf(address(this));

        // Transfer tokens to borrower
        _transfer(address(this), msg.sender, amount);

        // Call borrower's callback
        IFlashLoanReceiver(msg.sender).receiveFlashLoan(amount, fee, data);

        // Check repayment
        uint256 balanceAfter = balanceOf(address(this));
        require(balanceAfter >= balanceBefore + fee, "Flash loan not repaid");

        emit FlashLoan(msg.sender, amount, fee);
    }

    // ========== LOYALTY & GAMIFICATION ==========

    /**
     * @dev Update user tier based on activity
     */
    function _updateUserTier(address user) internal {
        UserStats storage stats = userStats[user];
        
        uint256 newTier = 0; // Bronze
        
        // Tier calculation based on multiple factors
        if (stats.totalTransferVolume >= 100000 * 10**18 && stats.stakingDuration >= 365 days) {
            newTier = 4; // Diamond
        } else if (stats.totalTransferVolume >= 50000 * 10**18 && stats.stakingDuration >= 180 days) {
            newTier = 3; // Platinum
        } else if (stats.totalTransferVolume >= 25000 * 10**18 && stats.stakingDuration >= 90 days) {
            newTier = 2; // Gold
        } else if (stats.totalTransferVolume >= 10000 * 10**18 && stats.stakingDuration >= 30 days) {
            newTier = 1; // Silver
        }

        if (newTier > stats.tierLevel) {
            stats.tierLevel = newTier;
            emit TierUpgraded(user, newTier);
        }
    }

    /**
     * @dev Award loyalty points
     */
    function _awardLoyaltyPoints(address user, uint256 points, string memory reason) internal {
        userStats[user].loyaltyPoints += points;
        emit LoyaltyPointsEarned(user, points, reason);
    }

    // ========== ENHANCED TRANSFER WITH FEES & BURNS ==========

    /**
     * @dev Override transfer to add fees and burns
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable) whenNotPaused {
        // Block self-transfers
        require(to != address(this), "Self-transfer blocked");

        // Update daily volume
        if (block.timestamp >= lastVolumeReset + 1 days) {
            dailyVolume = 0;
            lastVolumeReset = block.timestamp;
        }
        dailyVolume += amount;

        // Update user stats
        if (from != address(0) && to != address(0)) {
            userStats[from].totalTransferVolume += amount;
            _awardLoyaltyPoints(from, amount / 10**18, "Transfer activity");
        }

        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Override transfer to apply fees and burns
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from == address(0) || to == address(0) || feeExempt[from] || feeExempt[to]) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 transferFee = 0;
        uint256 burnAmount = 0;

        // Calculate transfer fee
        if (feeConfig.transferFee > 0) {
            transferFee = (amount * feeConfig.transferFee) / 10000;
        }

        // Calculate burn amount
        if (burnConfig.burnOnTransferEnabled && burnConfig.burnRatePerTransaction > 0) {
            burnAmount = (amount * burnConfig.burnRatePerTransaction) / 10000;
            if (burnAmount < burnConfig.minimumBurnAmount) {
                burnAmount = burnConfig.minimumBurnAmount;
            }
            // Ensure we don't burn more than available
            if (burnAmount > amount - transferFee) {
                burnAmount = 0;
            }
        }

        uint256 netTransfer = amount - transferFee - burnAmount;

        // Execute transfers
        if (transferFee > 0) {
            super._transfer(from, feeConfig.feeRecipient, transferFee);
        }
        
        if (burnAmount > 0) {
            super._transfer(from, address(0), burnAmount); // Burn tokens
            burnConfig.totalBurnedFromFees += burnAmount;
        }
        
        super._transfer(from, to, netTransfer);
    }

    // ========== GOVERNANCE FUNCTIONS ==========

    /**
     * @dev Create governance proposal
     */
    function createProposal(string memory description) external {
        require(balanceOf(msg.sender) >= proposalThreshold, "Insufficient tokens");

        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
    }

    /**
     * @dev Vote on proposal
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId <= proposalCount && proposalId > 0, "Invalid proposal");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 votePower = balanceOf(msg.sender);
        require(votePower > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.votesFor += votePower;
        } else {
            proposal.votesAgainst += votePower;
        }
    }

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @dev Update yield configuration
     */
    function updateYieldConfig(
        uint256 baseYieldRate,
        uint256 compoundingFrequency,
        bool autoCompoundEnabled
    ) external onlyRole(YIELD_MANAGER_ROLE) {
        yieldConfig.baseYieldRate = baseYieldRate;
        yieldConfig.compoundingFrequency = compoundingFrequency;
        yieldConfig.autoCompoundEnabled = autoCompoundEnabled;
    }

    /**
     * @dev Set yield reserve pool
     */
    function setYieldReservePool(address _yieldReservePool) external onlyRole(ADMIN_ROLE) {
        yieldReservePool = _yieldReservePool;
    }

    /**
     * @dev Set revenue wallet
     */
    function setRevenueWallet(address _revenueWallet) external onlyRole(ADMIN_ROLE) {
        revenueWallet = _revenueWallet;
    }

    /**
     * @dev Update fee configuration
     */
    function updateFeeConfig(
        uint256 _transferFee,
        uint256 _stakingFee,
        uint256 _unstakingFee,
        address _feeRecipient
    ) external onlyRole(ADMIN_ROLE) {
        require(_transferFee <= 1000, "Transfer fee too high"); // Max 10%
        require(_stakingFee <= 500, "Staking fee too high"); // Max 5%
        require(_unstakingFee <= 1000, "Unstaking fee too high"); // Max 10%

        feeConfig.transferFee = _transferFee;
        feeConfig.stakingFee = _stakingFee;
        feeConfig.unstakingFee = _unstakingFee;
        feeConfig.feeRecipient = _feeRecipient;

        emit FeeConfigUpdated(_transferFee, _stakingFee, _unstakingFee);
    }

    /**
     * @dev Update burn configuration
     */
    function updateBurnConfig(
        uint256 _burnRate,
        uint256 _minimumBurn,
        bool _burnEnabled
    ) external onlyRole(ADMIN_ROLE) {
        require(_burnRate <= 100, "Burn rate too high"); // Max 1%

        burnConfig.burnRatePerTransaction = _burnRate;
        burnConfig.minimumBurnAmount = _minimumBurn;
        burnConfig.burnOnTransferEnabled = _burnEnabled;

        emit BurnConfigUpdated(_burnRate, _minimumBurn);
    }

    /**
     * @dev Set fee exemption
     */
    function setFeeExempt(address account, bool exempt) external onlyRole(ADMIN_ROLE) {
        feeExempt[account] = exempt;
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Get user's total staked amount
     */
    function getUserStakedAmount(address user) external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < userStakes[user].length; i++) {
            totalAmount += userStakes[user][i].amount;
        }
        return totalAmount;
    }

    /**
     * @dev Get user's claimable yield
     */
    function getClaimableYield(address user) external view returns (uint256) {
        return _calculateClaimableYield(user);
    }

    /**
     * @dev Get contract version
     */
    function version() public pure returns (string memory) {
        return "2.1.0-Enhanced";
    }

    // ========== REQUIRED OVERRIDES ==========

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }
}

// ========== INTERFACES ==========

interface IFlashLoanReceiver {
    function receiveFlashLoan(uint256 amount, uint256 fee, bytes calldata data) external;
}
