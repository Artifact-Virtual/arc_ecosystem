// SPDX-License-Identifier: MIT
// Upgradeable Streaming Rewards
// Upgradeable via UUPS.
// Safe (Treasury) controls emission rate + destinations.
// distribute() can be called manually, or by automation (cron, keeper, relayer).


pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @title TreasuryRewards - ARCx emission manager
contract TreasuryRewards is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");

    IERC20Upgradeable public arcx;
    uint256 public emissionRate; // ARCx per block
    address public vault;        // StakingVault
    address public lpStaking;    // LPStaking contract

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

        uint256 reward = emissionRate;
        uint256 half = reward / 2;

        if (vault != address(0)) {
            arcx.transfer(vault, half);
        }
        if (lpStaking != address(0)) {
            arcx.transfer(lpStaking, reward - half);
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
