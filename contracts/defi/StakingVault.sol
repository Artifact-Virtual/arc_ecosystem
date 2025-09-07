// SPDX-License-Identifier: MIT
// Staking Vault ERC-4626, Upgradeable with ARCs
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../tokens/arc-s/ARCs.sol";
import "../tokens/arc-x/ARCxV2.sol"; // ARCx V2 Enhanced integration
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/// @title StakingVault - ARCx V2 → ARCxs staking vault with enhanced features
contract StakingVault is Initializable, ERC4626Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PENALTY_MANAGER_ROLE = keccak256("PENALTY_MANAGER_ROLE");

    using SafeERC20Upgradeable for IERC20Upgradeable;

    ARCsToken public arcxs;
    address public penaltyVault;
    // penalty in basis points (1% = 100 bps)
    uint256 public penaltyBps;
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Emitted when a deposit is made
    event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);

    /// @notice Emitted when a withdrawal is made
    event Withdrawn(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares, uint256 penalty);

    /// @notice Emitted when penalty BPS is updated
    event PenaltyBpsUpdated(uint256 previousBps, uint256 newBps, address indexed updater);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, IERC20Upgradeable arcxAsset, ARCsToken _arcxs, address _penaltyVault) public initializer {
        __ERC20_init("Staked ARCx Vault Share", "sARCx");
        __ERC4626_init(arcxAsset);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        arcxs = _arcxs;
        penaltyVault = _penaltyVault;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(PENALTY_MANAGER_ROLE, admin);

        // default penalty: 1% = 100 bps
        penaltyBps = 100;
        // Note: the ARCxs/ARCs token admin must grant VAULT_ROLE to this vault after deployment.
        // The previous automatic grant was removed because the vault cannot grant roles on the token
        // unless the vault already has the token admin role. Please run:
        //   arcxs.grantRole(arcxs.VAULT_ROLE(), <staking-vault-address>)
        // from the token admin account once both contracts are deployed.
    }

    /// @notice Deposit ARCx and mint ARCxs
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        uint256 shares = super.deposit(assets, receiver);
        arcxs.mint(receiver, shares);
    emit Deposited(msg.sender, receiver, assets, shares);
        return shares;
    }

    /// @notice Withdraw ARCx and burn ARCxs
    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
        uint256 shares = super.withdraw(assets, receiver, owner);

        // Example early exit penalty: 1% (PENALTY_BPS)
        uint256 penalty = (assets * penaltyBps) / BPS_DENOMINATOR;
        if (penalty > 0) {
            // use safeTransfer to avoid unexpected reverts
            IERC20Upgradeable(asset()).safeTransfer(penaltyVault, penalty);
        }

        // Burn the vault shares' corresponding ARCxs from the owner
        arcxs.burn(owner, shares);

        emit Withdrawn(msg.sender, receiver, owner, assets, shares, penalty);

        return shares;
    }

    /// @notice Update penalty in basis points (governance-controlled)
    function setPenaltyBps(uint256 newBps) external onlyRole(PENALTY_MANAGER_ROLE) {
        require(newBps <= BPS_DENOMINATOR, "BPS out of range");
        uint256 previous = penaltyBps;
        penaltyBps = newBps;
        emit PenaltyBpsUpdated(previous, newBps, msg.sender);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
