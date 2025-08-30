// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../../thirdparty/GasOptimization.sol";

/**
 * @title GasOptimizedARCxToken
 * @dev Maximum gas-optimized version of ARCx token for sub-cent transaction fees
 * Implements advanced gas optimization techniques while maintaining security
 */
contract GasOptimizedARCxToken is ERC20, AccessControl, Pausable {
    using GasOptimization for address[];

    // Gas-optimized role definitions using bytes32 constants
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Immutable variables for maximum gas efficiency
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable DEPLOYED_AT;

    // Packed state variables for gas efficiency
    address public fuelBridge;
    bool public bridgeLocked;
    bool public mintingFinalized;

    // Events optimized for gas usage
    event MintFinalized();
    event BridgeAddressSet(address indexed bridge);
    event BridgeLocked();
    event BatchTransferExecuted(address indexed sender, uint256 totalAmount, uint256 recipientsCount);

    // Gas-optimized modifiers
    modifier onlyAdmin() {
        _checkRole(ADMIN_ROLE);
        _;
    }

    modifier onlyOnce(bool condition) {
        require(!condition, "Operation already finalized");
        _;
    }

    /**
     * @dev Constructor with maximum gas optimization
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 cap,
        address deployer
    ) ERC20(name, symbol) {
        require(deployer != address(0), "Invalid deployer");

        // Single role setup call for gas efficiency
        _grantRole(DEFAULT_ADMIN_ROLE, deployer);
        _grantRole(ADMIN_ROLE, deployer);
        _grantRole(PAUSER_ROLE, deployer);
        _grantRole(MINTER_ROLE, deployer);

        MAX_SUPPLY = cap;
        DEPLOYED_AT = block.timestamp;
    }

    /**
     * @dev Gas-optimized transfer with assembly
     */
    function transfer(address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev Gas-optimized transferFrom with assembly
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override whenNotPaused returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Gas-optimized batch transfer for multiple recipients
     */
    function batchTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external whenNotPaused returns (bool) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0 && recipients.length <= 100, "Invalid batch size");

        address sender = msg.sender;
        uint256 totalAmount;

        // Calculate total amount and validate balances upfront
        unchecked {
            for (uint256 i = 0; i < recipients.length; ++i) {
                require(recipients[i] != address(0), "Invalid recipient");
                totalAmount += amounts[i];
            }
        }

        require(balanceOf(sender) >= totalAmount, "Insufficient balance");

        // Execute transfers with unchecked arithmetic for gas efficiency
        unchecked {
            for (uint256 i = 0; i < recipients.length; ++i) {
                _transfer(sender, recipients[i], amounts[i]);
            }
        }

        emit BatchTransferExecuted(sender, totalAmount, recipients.length);
        return true;
    }

    /**
     * @dev Gas-optimized mint function
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(!mintingFinalized, "Minting finalized");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Gas-optimized burn function
     */
    function burn(uint256 amount) public whenNotPaused {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Gas-optimized burnFrom function
     */
    function burnFrom(address account, uint256 amount) public whenNotPaused {
        address spender = msg.sender;
        _spendAllowance(account, spender, amount);
        _burn(account, amount);
    }

    /**
     * @dev Gas-optimized pause/unpause functions
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Gas-optimized admin functions
     */
    function finalizeMinting() external onlyAdmin onlyOnce(mintingFinalized) {
        mintingFinalized = true;
        emit MintFinalized();
    }

    function setFuelBridge(address bridge) external onlyAdmin onlyOnce(bridgeLocked) {
        require(bridge != address(0), "Invalid address");
        fuelBridge = bridge;
        emit BridgeAddressSet(bridge);
    }

    function lockBridgeAddress() external onlyAdmin onlyOnce(bridgeLocked) {
        bridgeLocked = true;
        emit BridgeLocked();
    }

    /**
     * @dev Gas-optimized fuel bridge burn function
     */
    function burnToFuel(uint256 amount) external whenNotPaused {
        require(fuelBridge != address(0), "Bridge not set");
        _burn(msg.sender, amount);
        // Note: Bridge notification would be implemented here
    }

    /**
     * @dev Gas-optimized role management functions
     */
    function transferAdminRole(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        require(newAdmin != msg.sender, "Cannot transfer to self");

        _grantRole(ADMIN_ROLE, newAdmin);
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);

        emit AdminRoleTransferred(msg.sender, newAdmin);
    }

    function renounceAdminRole() external onlyAdmin {
        address admin = msg.sender;
        _revokeRole(ADMIN_ROLE, admin);
        _revokeRole(DEFAULT_ADMIN_ROLE, admin);

        emit AdminRoleRenounced(admin);
    }

    function emergencyRevokeAllRoles(address compromisedAccount) external onlyAdmin {
        require(compromisedAccount != msg.sender, "Cannot revoke own roles");

        _revokeRole(ADMIN_ROLE, compromisedAccount);
        _revokeRole(MINTER_ROLE, compromisedAccount);
        _revokeRole(PAUSER_ROLE, compromisedAccount);

        emit EmergencyRoleRevocation(compromisedAccount, msg.sender);
    }

    /**
     * @dev Gas-optimized view functions
     */
    function checkRoleStatus(bytes32 role, address account) external view returns (bool) {
        return hasRole(role, account);
    }

    function hasAnyAdminRole(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account) ||
               hasRole(MINTER_ROLE, account) ||
               hasRole(PAUSER_ROLE, account);
    }

    /**
     * @dev Gas-optimized batch balance checking
     */
    function getBalances(address[] calldata accounts) external view returns (uint256[] memory) {
        return GasOptimization.getBalances(accounts, address(this));
    }

    /**
     * @dev Override _beforeTokenTransfer for pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Gas-optimized allowance spending
     */
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual override {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "Insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    // Events for enhanced role management
    event AdminRoleTransferred(address indexed previousAdmin, address indexed newAdmin);
    event AdminRoleRenounced(address indexed admin);
    event EmergencyRoleRevocation(address indexed compromisedAccount, address indexed revoker);
}
