// SPDX-License-Identifier: MIT
// Staking Vault ERC-4626, Upgradeable with ARCxs

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./ARCxsToken.sol";

/// @title StakingVault - ARCx → ARCxs staking vault
contract StakingVault is Initializable, ERC4626Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    ARCxsToken public arcxs;
    address public penaltyVault;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, IERC20Upgradeable arcxAsset, ARCxsToken _arcxs, address _penaltyVault) public initializer {
        __ERC20_init("Staked ARCx Vault Share", "sARCx");
        __ERC4626_init(arcxAsset);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        arcxs = _arcxs;
        penaltyVault = _penaltyVault;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        // Allow vault to mint/burn ARCxs
        arcxs.grantRole(_arcxs.VAULT_ROLE(), address(this));
    }

    /// @notice Deposit ARCx and mint ARCxs
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        uint256 shares = super.deposit(assets, receiver);
        arcxs.mint(receiver, shares);
        return shares;
    }

    /// @notice Withdraw ARCx and burn ARCxs
    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
        uint256 shares = super.withdraw(assets, receiver, owner);

        // Example early exit penalty: 1%
        uint256 penalty = (assets * 100) / 10000; // 1%
        if (penalty > 0) {
            IERC20Upgradeable(asset()).transfer(penaltyVault, penalty);
        }

        arcxs.burn(owner, shares);
        return shares;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
