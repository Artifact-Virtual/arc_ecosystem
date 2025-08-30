// SPDX-License-Identifier: MIT
// Upgradeable ERC20

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @title ARCsToken - Staked ARCx derivative (Upgradeable)
contract ARCsToken is Initializable, ERC20Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant VAULT_ROLE = keccak256("VAULT_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the ARCs token
    /// @param admin the account to receive DEFAULT_ADMIN_ROLE and UPGRADER_ROLE
    function initialize(address admin) public initializer {
        require(admin != address(0), "ARCs: admin is zero address");
        __ERC20_init("ARCx Staked", "ARCs");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        // NOTE: VAULT_ROLE is intentionally NOT granted here.
        // Grant VAULT_ROLE to the vault contract via deployment script:
        // await token.grantRole(VAULT_ROLE, vaultAddress);
    }

    function mint(address to, uint256 amount) external onlyRole(VAULT_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(VAULT_ROLE) {
        _burn(from, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // Storage gap for future variable additions (upgrade safety)
    uint256[50] private __gap;
}
