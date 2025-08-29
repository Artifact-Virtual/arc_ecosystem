// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

/**
 * @title IRWA Registry Interface
 * @dev Interface for the ARCx RWA Registry contract
 * @notice Defines the external functions for RWA management
 */
interface IRWARegistry {
    // Enums
    enum RWAType {
        ENERGY_CREDITS,
        CARBON_CREDITS,
        REAL_ESTATE,
        COMMODITIES,
        INFRASTRUCTURE,
        OTHER
    }

    enum RWAStatus {
        PROPOSED,
        APPROVED,
        ACTIVE,
        SUSPENDED,
        RETIRED
    }

    // Structs
    struct RWASchema {
        bytes32 schemaId;
        RWAType rwaType;
        string name;
        string description;
        string[] requiredFields;
        bool active;
        uint256 createdAt;
    }

    struct RWARecord {
        bytes32 schemaId;
        bytes32 rwaId;
        address registrant;
        RWAStatus status;
        uint256 registeredAt;
        uint256 lastUpdated;
        bytes32 metadataHash;
        uint256 impactScore;
    }

    struct OperatorStake {
        uint256 amount;
        uint256 lockedUntil;
        bool slashed;
        uint256 slashAmount;
        uint256 lastActivity;
    }

    // Events
    event RWARegistered(bytes32 indexed rwaId, bytes32 indexed schemaId, address registrant, bytes32 metadataHash);
    event RWAApproved(bytes32 indexed rwaId, address approver);
    event RWAActivated(bytes32 indexed rwaId, address activator);
    event RWAUpdated(bytes32 indexed rwaId, bytes32 metadataHash, address updater);
    event RWAAttested(bytes32 indexed rwaId, address attester, bool approved);
    event OperatorStaked(address indexed operator, uint256 amount);
    event OperatorUnstaked(address indexed operator, uint256 amount);
    event OperatorSlashed(address indexed operator, uint256 amount, string reason);
    event OperatorAssignedToRWA(bytes32 indexed rwaId, address operator);
    event ImpactCalculated(bytes32 indexed rwaId, uint256 impactScore);
    event ConfigUpdated(uint256 minStake, uint256 lockPeriod, uint256 slashPct, uint256 maxOperators);

    // Core RWA Management
    function registerRWA(bytes32 schemaId, bytes32 rwaId, bytes32 metadataHash) external;
    function approveRWA(bytes32 rwaId) external;
    function activateRWA(bytes32 rwaId) external;
    function updateRWA(bytes32 rwaId, bytes32 newMetadataHash) external;
    function attestRWA(bytes32 rwaId, bool approved) external;

    // Operator Management
    function stakeAsOperator(uint256 amount) external;
    function unstakeAsOperator() external;
    function slashOperator(address operator, string calldata reason) external;
    function assignOperatorToRWA(bytes32 rwaId, address operator) external;

    // Impact and Analytics
    function calculateImpact(bytes32 rwaId) external returns (uint256);

    // View Functions
    function getRWA(bytes32 rwaId) external view returns (
        bytes32 schemaId,
        address registrant,
        RWAStatus status,
        uint256 registeredAt,
        uint256 impactScore,
        uint256 operatorCount
    );

    function getOperator(address operator) external view returns (
        uint256 stakeAmount,
        uint256 lockedUntil,
        bool slashed,
        uint256 rwaCount
    );

    function getRWAOperators(bytes32 rwaId) external view returns (address[] memory);
    function getOperatorRWAs(address operator) external view returns (bytes32[] memory);

    // Schema Management
    function rwaSchemas(bytes32 schemaId) external view returns (
        bytes32 schemaId_,
        RWAType rwaType,
        string memory name,
        string memory description,
        bool active,
        uint256 createdAt
    );

    // Configuration
    function updateConfig(
        uint256 minStakeAmount,
        uint256 stakeLockPeriod,
        uint256 slashPercentage,
        uint256 maxOperatorsPerRWA
    ) external;

    // State Variables
    function stakingToken() external view returns (address);
    function slashingVault() external view returns (address);
    function minStakeAmount() external view returns (uint256);
    function stakeLockPeriod() external view returns (uint256);
    function slashPercentage() external view returns (uint256);
    function maxOperatorsPerRWA() external view returns (uint256);
}

/**
 * @title ISlashing Vault Interface
 * @dev Interface for the Slashing Vault contract
 * @notice Defines the external functions for slashed fund management
 */
interface ISlashingVault {
    // Enums
    enum RecoveryStatus {
        PENDING,
        APPROVED,
        DENIED,
        COMPLETED
    }

    // Structs
    struct RecoveryRequest {
        address operator;
        uint256 amount;
        string reason;
        RecoveryStatus status;
        uint256 requestedAt;
        uint256 approvedAt;
        address approver;
        bytes32 evidenceHash;
    }

    struct DistributionSchedule {
        address recipient;
        uint256 amount;
        uint256 releaseTime;
        bool claimed;
        string purpose;
    }

    // Events
    event SlashedFundsReceived(address indexed operator, uint256 amount);
    event RecoveryRequested(bytes32 indexed requestId, address indexed operator, uint256 amount, string reason);
    event RecoveryApproved(bytes32 indexed requestId, address approver);
    event RecoveryDenied(bytes32 indexed requestId, address approver, string reason);
    event RecoveryClaimed(bytes32 indexed requestId, address indexed operator, uint256 amount);
    event TreasuryDistributionScheduled(uint256 indexed scheduleId, uint256 amount, string purpose);
    event TreasuryDistributionClaimed(uint256 indexed scheduleId, address recipient, uint256 amount);
    event FundsBurned(uint256 amount, address burner);
    event EmergencyWithdraw(address token, uint256 amount, address admin);
    event ConfigUpdated(uint256 recoveryCooldown, uint256 maxRecoveryPct, uint256 treasuryPct, uint256 burnPct);

    // Core Functions
    function receiveSlashedFunds(address operator, uint256 amount) external;
    function requestRecovery(uint256 amount, string calldata reason, bytes32 evidenceHash) external returns (bytes32);
    function approveRecovery(bytes32 requestId) external;
    function denyRecovery(bytes32 requestId, string calldata reason) external;
    function claimRecovery(bytes32 requestId) external;
    function distributeToTreasury(uint256 amount, string calldata purpose) external;
    function claimTreasuryDistribution(uint256 scheduleId) external;
    function burnFunds(uint256 amount) external;
    function emergencyWithdraw(address token, uint256 amount) external;

    // View Functions
    function getRecoveryRequest(bytes32 requestId) external view returns (
        address operator,
        uint256 amount,
        string memory reason,
        RecoveryStatus status,
        uint256 requestedAt,
        uint256 approvedAt,
        address approver
    );

    function getDistributionSchedule(uint256 scheduleId) external view returns (
        address recipient,
        uint256 amount,
        uint256 releaseTime,
        bool claimed,
        string memory purpose
    );

    function getVaultBalance() external view returns (uint256);
    function getSlashedBalance(address operator) external view returns (uint256);

    // Configuration
    function updateConfig(
        uint256 recoveryCooldown,
        uint256 maxRecoveryPercentage,
        uint256 treasuryPercentage,
        uint256 burnPercentage
    ) external;

    // State Variables
    function stakingToken() external view returns (address);
    function rwaRegistry() external view returns (address);
    function recoveryCooldown() external view returns (uint256);
    function maxRecoveryPercentage() external view returns (uint256);
    function treasuryPercentage() external view returns (uint256);
    function burnPercentage() external view returns (uint256);
    function totalSlashed() external view returns (uint256);
    function totalRecovered() external view returns (uint256);
    function totalDistributed() external view returns (uint256);
    function totalBurned() external view returns (uint256);
}
