// contracts/ARCxMigration.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ARCxMigration Contract
 * @dev Migration contract to recover tokens from the immutable ARCx contract
 * This contract can be used to facilitate token migration to a new contract
 */
contract ARCxMigration is AccessControl {
    bytes32 public constant MIGRATOR_ROLE = keccak256("MIGRATOR_ROLE");

    address public immutable oldARCxToken;
    address public newARCxToken;
    address public deployer;

    bool public migrationEnabled = false;
    uint256 public totalMigrated = 0;

    mapping(address => uint256) public migratedBalances;
    mapping(address => bool) public hasMigrated;

    event MigrationEnabled(address newToken);
    event TokensMigrated(address indexed user, uint256 amount);
    event MigrationCompleted(uint256 totalMigrated);

    constructor(address _oldARCxToken, address _deployer) {
        oldARCxToken = _oldARCxToken;
        deployer = _deployer;
        _grantRole(DEFAULT_ADMIN_ROLE, _deployer);
        _grantRole(MIGRATOR_ROLE, _deployer);
    }

    /**
     * @dev Enable migration to new token contract
     */
    function enableMigration(address _newARCxToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!migrationEnabled, "Migration already enabled");
        require(_newARCxToken != address(0), "Invalid new token address");

        newARCxToken = _newARCxToken;
        migrationEnabled = true;

        emit MigrationEnabled(_newARCxToken);
    }

    /**
     * @dev Migrate tokens from old contract to new contract
     * User must approve this contract to spend their old tokens
     */
    function migrateTokens(uint256 amount) external {
        require(migrationEnabled, "Migration not enabled");
        require(amount > 0, "Invalid amount");
        require(!hasMigrated[msg.sender], "Already migrated");

        IERC20 oldToken = IERC20(oldARCxToken);
        IERC20 newToken = IERC20(newARCxToken);

        // Check user's balance in old contract
        uint256 userBalance = oldToken.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient balance");

        // Transfer old tokens to this contract
        require(oldToken.transferFrom(msg.sender, address(this), amount), "Transfer from failed");

        // Mint equivalent tokens in new contract (requires minter role)
        require(newToken.transfer(msg.sender, amount), "Transfer to failed");

        migratedBalances[msg.sender] = amount;
        hasMigrated[msg.sender] = true;
        totalMigrated += amount;

        emit TokensMigrated(msg.sender, amount);
    }

    /**
     * @dev Emergency recovery for tokens stuck in old contract
     * Only callable by migrator role for stuck tokens
     */
    function emergencyRecoverStuckTokens(
        address stuckHolder,
        uint256 amount
    ) external onlyRole(MIGRATOR_ROLE) {
        require(migrationEnabled, "Migration not enabled");

        // This would require the stuck contract to have a recovery mechanism
        // For now, this serves as a placeholder for future implementation

        emit TokensMigrated(stuckHolder, amount);
    }

    /**
     * @dev Complete migration process
     */
    function completeMigration() external onlyRole(DEFAULT_ADMIN_ROLE) {
        migrationEnabled = false;
        emit MigrationCompleted(totalMigrated);
    }

    /**
     * @dev Get migration statistics
     */
    function getMigrationStats() external view returns (
        bool enabled,
        address oldToken,
        address newToken,
        uint256 migrated,
        uint256 oldContractBalance
    ) {
        IERC20 oldTokenContract = IERC20(oldARCxToken);
        uint256 stuckBalance = oldTokenContract.balanceOf(oldARCxToken);

        return (
            migrationEnabled,
            oldARCxToken,
            newARCxToken,
            totalMigrated,
            stuckBalance
        );
    }

    /**
     * @dev Emergency self-destruct (only if no tokens left)
     */
    function emergencySelfDestruct() external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20 oldToken = IERC20(oldARCxToken);
        require(oldToken.balanceOf(address(this)) == 0, "Contract still holds tokens");

        selfdestruct(payable(deployer));
    }
}
