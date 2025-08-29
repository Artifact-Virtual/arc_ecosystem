// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

/**
 * @title ARCx Staking Vault
 * @dev Upgradeable staking contract for ARCx tokens
 * @notice Allows users to stake ARCx and receive ARCs tokens as rewards
 */
contract ARCxStakingVault is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using MathUpgradeable for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Token contracts
    IERC20Upgradeable public arcxToken;
    IERC20Upgradeable public arcsToken;

    // Staking configuration
    uint256 public rewardRate; // Rewards per second (in ARCs tokens)
    uint256 public lockDuration; // Minimum staking duration
    uint256 public maxStakePerUser; // Maximum stake per user

    // Staking data
    struct StakeInfo {
        uint256 amount; // Staked ARCx amount
        uint256 stakedAt; // Timestamp when staked
        uint256 lastRewardTime; // Last time rewards were claimed
        uint256 accumulatedRewards; // Accumulated ARCs rewards
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public isWhitelisted;

    // Analytics
    uint256 public totalStaked;
    uint256 public totalStakers;
    uint256 public totalRewardsDistributed;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    event LockDurationUpdated(uint256 newDuration);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the staking vault
     */
    function initialize(
        address _arcxToken,
        address _arcsToken,
        address _admin
    ) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);

        arcxToken = IERC20Upgradeable(_arcxToken);
        arcsToken = IERC20Upgradeable(_arcsToken);

        // Default configuration
        rewardRate = 1e15; // 0.001 ARCs per second per ARCx staked
        lockDuration = 7 days;
        maxStakePerUser = 100000 * 1e18; // 100k ARCx max per user
    }

    /**
     * @dev Stake ARCx tokens
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "ARCxStakingVault: Cannot stake 0");
        require(amount <= maxStakePerUser, "ARCxStakingVault: Exceeds max stake per user");

        StakeInfo storage userStake = stakes[msg.sender];

        if (userStake.amount == 0) {
            totalStakers++;
        }

        // Update rewards before staking
        _updateRewards(msg.sender);

        // Transfer ARCx tokens from user
        arcxToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update stake info
        userStake.amount += amount;
        userStake.stakedAt = block.timestamp;

        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake ARCx tokens
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "ARCxStakingVault: Insufficient stake");
        require(
            block.timestamp >= userStake.stakedAt + lockDuration,
            "ARCxStakingVault: Lock period not expired"
        );

        // Update rewards before unstaking
        _updateRewards(msg.sender);

        // Update stake info
        userStake.amount -= amount;
        totalStaked -= amount;

        if (userStake.amount == 0) {
            totalStakers--;
        }

        // Transfer ARCx tokens back to user
        arcxToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Claim accumulated ARCs rewards
     */
    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);

        StakeInfo storage userStake = stakes[msg.sender];
        uint256 rewards = userStake.accumulatedRewards;

        require(rewards > 0, "ARCxStakingVault: No rewards to claim");

        // Reset accumulated rewards
        userStake.accumulatedRewards = 0;
        userStake.lastRewardTime = block.timestamp;

        // Mint ARCs tokens to user
        arcsToken.safeTransfer(msg.sender, rewards);
        totalRewardsDistributed += rewards;

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Get pending rewards for a user
     */
    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo storage userStake = stakes[user];

        if (userStake.amount == 0) {
            return userStake.accumulatedRewards;
        }

        uint256 timeElapsed = block.timestamp - userStake.lastRewardTime;
        uint256 newRewards = (userStake.amount * rewardRate * timeElapsed) / 1e18;

        return userStake.accumulatedRewards + newRewards;
    }

    /**
     * @dev Update rewards for a user
     */
    function _updateRewards(address user) internal {
        StakeInfo storage userStake = stakes[user];

        if (userStake.amount == 0) {
            return;
        }

        uint256 timeElapsed = block.timestamp - userStake.lastRewardTime;
        uint256 newRewards = (userStake.amount * rewardRate * timeElapsed) / 1e18;

        userStake.accumulatedRewards += newRewards;
        userStake.lastRewardTime = block.timestamp;
    }

    /**
     * @dev Update reward rate (admin only)
     */
    function updateRewardRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Update lock duration (admin only)
     */
    function updateLockDuration(uint256 newDuration) external onlyRole(ADMIN_ROLE) {
        lockDuration = newDuration;
        emit LockDurationUpdated(newDuration);
    }

    /**
     * @dev Emergency withdraw (admin only)
     */
    function emergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        uint256 balance = arcxToken.balanceOf(address(this));
        arcxToken.safeTransfer(msg.sender, balance);
    }

    /**
     * @dev Pause/unpause contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
