// SPDX-License-Identifier: MIT
// Upgradeable contract via UUPS proxy
// Treasury Safe = owner/admin
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @title ARCs Token - Staked ARCx Derivative Rewards
 * @dev Upgradeable ERC20 token representing staking rewards and ecosystem participation
 * @notice Earn ARCs tokens by staking ARCx V2 Enhanced tokens in the ecosystem vaults
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 * @custom:upgradeable UUPS proxy pattern
 * 
 * FEATURES:
 * - ERC20 token representing staking rewards and ecosystem loyalty
 * - Minted by authorized vault contracts when users stake ARCx V2 tokens
 * - Non-transferable initially to prevent gaming of reward distribution
 * - Future utility for governance, fee discounts, and exclusive features
 * - Deflationary mechanics through burning for utility access
 * 
 * USAGE:
 * - Automatically minted when staking ARCx V2 tokens in approved vaults
 * - Rate of earning depends on staking duration and vault performance
 * - Can be used for enhanced governance voting power (future)
 * - Provides access to premium features and reduced fees
 * 
 * TROUBLESHOOTING:
 * - Only vault contracts with VAULT_ROLE can mint new tokens
 * - Initial non-transferability prevents secondary market speculation
 * - Burning is irreversible so consider utility usage carefully
 * - Check staking vault connection if ARCs are not being earned
 */
contract ARCsToken is Initializable, ERC20Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant VAULT_ROLE = keccak256("VAULT_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the ARCs token
    /// @param admin the account to receive DEFAULT_ADMIN_ROLE and UPGRADER_ROLE
    /// @param vault optional vault address to receive VAULT_ROLE (pass address(0) to defer)
    function initialize(address admin, address vault) public initializer {
        require(admin != address(0), "ARCs: admin is zero address");
        __ERC20_init("ARCx Staked", "ARCs");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        // Optionally grant vault role atomically during initialize
        if (vault != address(0)) {
            _grantRole(VAULT_ROLE, vault);
        }
    }

    /// @notice Grant VAULT_ROLE to a vault contract. Admin only.
    /// @dev Use this if you deferred vault assignment at initialize time.
    function grantVaultRole(address vault) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(vault != address(0), "ARCs: vault is zero");
        _grantRole(VAULT_ROLE, vault);
    }

    /// @notice Revoke VAULT_ROLE from an address. Admin only.
    function revokeVaultRole(address holder) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(holder != address(0), "ARCs: holder is zero");
        _revokeRole(VAULT_ROLE, holder);
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
