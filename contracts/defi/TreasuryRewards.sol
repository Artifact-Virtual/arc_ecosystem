// SPDX-License-Identifier: MIT
// Upgradeable contract via UUPS proxy
// Treasury Safe = owner/admin
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @title Treasury Rewards - ARCx V2 Emission Management System
 * @dev Upgradeable streaming rewards contract for managing token emissions across ecosystem
 * @notice Distributes ARCx V2 Enhanced tokens to staking vault and LP staking based on emission schedule
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 * @custom:upgradeable UUPS proxy pattern
 * 
 * FEATURES:
 * - Block-based emission rate system for predictable reward distribution
 * - Dual destination support (Staking Vault + LP Staking rewards)
 * - Treasury Safe controlled emission parameters for governance oversight
 * - Automated distribution callable by keepers or manual triggers
 * - Upgradeable architecture for future tokenomics adjustments
 * 
 * USAGE:
 * - Treasury Safe sets emission rate and destination contracts
 * - Call distribute() manually or via automation to stream rewards
 * - Emission rate represents ARCx tokens distributed per block
 * - Rewards are split between staking vault and liquidity providers
 * 
 * TROUBLESHOOTING:
 * - Distribution failures indicate insufficient contract balance or rate = 0
 * - Ensure destination contracts are set before enabling distributions
 * - Only REWARD_MANAGER_ROLE can modify emission parameters
 * - Check block number progression to verify distribution timing
 */
contract TreasuryRewards is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");

    IERC20Upgradeable public arcx;
    // emissionRate is ARCx per block
    uint256 public emissionRate;
    address public vault;        // StakingVault
    address public lpStaking;    // LPStaking contract
    using SafeERC20Upgradeable for IERC20Upgradeable;
    uint256 public lastDistributedBlock;

    /// @notice Emitted when rewards are distributed
    event Distributed(uint256 blockNumber, uint256 totalAmount, uint256 toVault, uint256 toLP);

    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address _arcx) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        arcx = IERC20Upgradeable(_arcx);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(REWARD_MANAGER_ROLE, admin);
    lastDistributedBlock = block.number;
    }

    function setDestinations(address _vault, address _lpStaking) external onlyRole(REWARD_MANAGER_ROLE) {
        vault = _vault;
        lpStaking = _lpStaking;
    }

    function setEmissionRate(uint256 rate) external onlyRole(REWARD_MANAGER_ROLE) {
        emissionRate = rate;
    }

    /// @notice Stream rewards to StakingVault and LPStaking
    function distribute() external {
        require(emissionRate > 0, "No emission");

        // Calculate blocks since last distribution
        uint256 blocks = block.number - lastDistributedBlock;
        require(blocks > 0, "Already distributed this block");

        uint256 reward = emissionRate * blocks;
        uint256 half = reward / 2;

        // Ensure contract has sufficient balance before transferring
        uint256 balance = arcx.balanceOf(address(this));
        uint256 toVault = 0;
        uint256 toLP = 0;
        if (vault != address(0)) {
            toVault = half;
        }
        if (lpStaking != address(0)) {
            toLP = reward - half;
        }

        uint256 total = toVault + toLP;
        require(balance >= total, "Insufficient reward balance");

        if (toVault > 0) {
            arcx.safeTransfer(vault, toVault);
        }
        if (toLP > 0) {
            arcx.safeTransfer(lpStaking, toLP);
        }

        lastDistributedBlock = block.number;

        emit Distributed(block.number, reward, toVault, toLP);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
