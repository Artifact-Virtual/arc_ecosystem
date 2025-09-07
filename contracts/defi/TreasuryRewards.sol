// SPDX-License-Identifier: MIT
// Upgradeable Streaming Rewards
// Upgradeable via UUPS.
// Safe (Treasury) controls emission rate + destinations.
// distribute() can be called manually, or by automation (cron, keeper, relayer).
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @title TreasuryRewards - ARCx V2 emission manager with enhanced tokenomics
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
