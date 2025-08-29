// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

/**
 * @title ARCx RWA Registry - Real-World Asset Registry
 * @dev Manages RWA registration, attestation, and operator staking
 * @notice Handles RWA schemas, operator stakes, impact functions, and slashing
 *
 * Features:
 * - RWA schema management
 * - Operator registration and staking
 * - Attestation validation
 * - Impact function calculation
 * - Slashing mechanism
 * - Emergency controls
 */
contract ARCxRWARegistry is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using ECDSAUpgradeable for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SLASHER_ROLE = keccak256("SLASHER_ROLE");

    // RWA Types
    enum RWAType {
        ENERGY_CREDITS,
        CARBON_CREDITS,
        REAL_ESTATE,
        COMMODITIES,
        INFRASTRUCTURE,
        OTHER
    }

    // RWA Status
    enum RWAStatus {
        PROPOSED,
        APPROVED,
        ACTIVE,
        SUSPENDED,
        RETIRED
    }

    // RWA Schema
    struct RWASchema {
        bytes32 schemaId;
        RWAType rwaType;
        string name;
        string description;
        string[] requiredFields;
        bool active;
        uint256 createdAt;
    }

    // RWA Record
    struct RWARecord {
        bytes32 schemaId;
        bytes32 rwaId;
        address registrant;
        RWAStatus status;
        uint256 registeredAt;
        uint256 lastUpdated;
        bytes32 metadataHash;
        uint256 impactScore;
        mapping(address => bool) attestations;
        address[] attesters;
    }

    // Operator Stake
    struct OperatorStake {
        uint256 amount;
        uint256 lockedUntil;
        bool slashed;
        uint256 slashAmount;
        uint256 lastActivity;
    }

    // Impact Function
    struct ImpactFunction {
        bytes32 functionId;
        RWAType rwaType;
        string description;
        bytes32 bytecodeHash;
        bool active;
    }

    // State variables
    mapping(bytes32 => RWASchema) public rwaSchemas;
    mapping(bytes32 => RWARecord) public rwaRecords;
    mapping(address => OperatorStake) public operatorStakes;
    mapping(bytes32 => ImpactFunction) public impactFunctions;

    mapping(address => bytes32[]) public operatorRWAs;
    mapping(bytes32 => address[]) public rwaOperators;

    // Configuration
    IERC20Upgradeable public stakingToken;
    uint256 public minStakeAmount;
    uint256 public stakeLockPeriod;
    uint256 public slashPercentage;
    uint256 public maxOperatorsPerRWA;

    address public slashingVault;

    // Analytics
    struct RWAAnalytics {
        uint256 totalRWAs;
        uint256 activeRWAs;
        uint256 totalOperators;
        uint256 totalStaked;
        uint256 totalSlashed;
        uint256 lastUpdate;
    }
    RWAAnalytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the RWA Registry
     */
    function initialize(
        address _stakingToken,
        address _slashingVault
    ) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CURATOR_ROLE, msg.sender);

        stakingToken = IERC20Upgradeable(_stakingToken);
        slashingVault = _slashingVault;

        // Default configuration
        minStakeAmount = 1000e18;     // 1000 tokens
        stakeLockPeriod = 365 days;   // 1 year
        slashPercentage = 0.1e18;     // 10%
        maxOperatorsPerRWA = 5;

        // Initialize default schemas
        _initializeDefaultSchemas();
    }

    /**
     * @dev Register a new RWA
     */
    function registerRWA(
        bytes32 schemaId,
        bytes32 rwaId,
        bytes32 metadataHash
    ) external nonReentrant whenNotPaused {
        require(rwaSchemas[schemaId].active, "ARCxRWARegistry: Invalid schema");
        require(rwaRecords[rwaId].registeredAt == 0, "ARCxRWARegistry: RWA already exists");

        rwaRecords[rwaId] = RWARecord({
            schemaId: schemaId,
            rwaId: rwaId,
            registrant: msg.sender,
            status: RWAStatus.PROPOSED,
            registeredAt: block.timestamp,
            lastUpdated: block.timestamp,
            metadataHash: metadataHash,
            impactScore: 0,
            attesters: new address[](0)
        });

        analytics.totalRWAs++;
        emit RWARegistered(rwaId, schemaId, msg.sender, metadataHash);
    }

    /**
     * @dev Approve an RWA registration
     */
    function approveRWA(bytes32 rwaId) external onlyRole(CURATOR_ROLE) {
        RWARecord storage rwa = rwaRecords[rwaId];
        require(rwa.registeredAt != 0, "ARCxRWARegistry: RWA not found");
        require(rwa.status == RWAStatus.PROPOSED, "ARCxRWARegistry: Invalid status");

        rwa.status = RWAStatus.APPROVED;
        rwa.lastUpdated = block.timestamp;

        emit RWAApproved(rwaId, msg.sender);
    }

    /**
     * @dev Activate an RWA
     */
    function activateRWA(bytes32 rwaId) external onlyRole(CURATOR_ROLE) {
        RWARecord storage rwa = rwaRecords[rwaId];
        require(rwa.status == RWAStatus.APPROVED, "ARCxRWARegistry: Not approved");

        rwa.status = RWAStatus.ACTIVE;
        rwa.lastUpdated = block.timestamp;
        analytics.activeRWAs++;

        emit RWAActivated(rwaId, msg.sender);
    }

    /**
     * @dev Update RWA metadata
     */
    function updateRWA(
        bytes32 rwaId,
        bytes32 newMetadataHash
    ) external {
        RWARecord storage rwa = rwaRecords[rwaId];
        require(rwa.registrant == msg.sender, "ARCxRWARegistry: Not registrant");
        require(rwa.status == RWAStatus.ACTIVE, "ARCxRWARegistry: Not active");

        rwa.metadataHash = newMetadataHash;
        rwa.lastUpdated = block.timestamp;

        emit RWAUpdated(rwaId, newMetadataHash, msg.sender);
    }

    /**
     * @dev Attest to an RWA
     */
    function attestRWA(bytes32 rwaId, bool approved) external onlyRole(OPERATOR_ROLE) {
        RWARecord storage rwa = rwaRecords[rwaId];
        require(rwa.registeredAt != 0, "ARCxRWARegistry: RWA not found");
        require(!rwa.attestations[msg.sender], "ARCxRWARegistry: Already attested");

        rwa.attestations[msg.sender] = approved;
        rwa.attesters.push(msg.sender);

        emit RWAAttested(rwaId, msg.sender, approved);
    }

    /**
     * @dev Stake as an operator
     */
    function stakeAsOperator(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= minStakeAmount, "ARCxRWARegistry: Stake too low");
        require(operatorStakes[msg.sender].amount == 0, "ARCxRWARegistry: Already staked");

        // Transfer tokens
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "ARCxRWARegistry: Transfer failed"
        );

        operatorStakes[msg.sender] = OperatorStake({
            amount: amount,
            lockedUntil: block.timestamp + stakeLockPeriod,
            slashed: false,
            slashAmount: 0,
            lastActivity: block.timestamp
        });

        _grantRole(OPERATOR_ROLE, msg.sender);
        analytics.totalOperators++;
        analytics.totalStaked += amount;

        emit OperatorStaked(msg.sender, amount);
    }

    /**
     * @dev Unstake as an operator
     */
    function unstakeAsOperator() external nonReentrant {
        OperatorStake storage stake = operatorStakes[msg.sender];
        require(stake.amount > 0, "ARCxRWARegistry: Not staked");
        require(block.timestamp >= stake.lockedUntil, "ARCxRWARegistry: Still locked");
        require(!stake.slashed, "ARCxRWARegistry: Stake slashed");

        uint256 amount = stake.amount;
        stake.amount = 0;

        // Return tokens
        require(
            stakingToken.transfer(msg.sender, amount),
            "ARCxRWARegistry: Transfer failed"
        );

        _revokeRole(OPERATOR_ROLE, msg.sender);
        analytics.totalOperators--;
        analytics.totalStaked -= amount;

        emit OperatorUnstaked(msg.sender, amount);
    }

    /**
     * @dev Slash an operator
     */
    function slashOperator(address operator, string calldata reason) external onlyRole(SLASHER_ROLE) {
        OperatorStake storage stake = operatorStakes[operator];
        require(stake.amount > 0, "ARCxRWARegistry: Not staked");
        require(!stake.slashed, "ARCxRWARegistry: Already slashed");

        uint256 slashAmount = (stake.amount * slashPercentage) / 1e18;
        stake.slashed = true;
        stake.slashAmount = slashAmount;

        // Transfer slashed amount to vault
        require(
            stakingToken.transfer(slashingVault, slashAmount),
            "ARCxRWARegistry: Slash transfer failed"
        );

        // Return remaining amount
        uint256 remainingAmount = stake.amount - slashAmount;
        if (remainingAmount > 0) {
            require(
                stakingToken.transfer(operator, remainingAmount),
                "ARCxRWARegistry: Return transfer failed"
            );
        }

        analytics.totalSlashed += slashAmount;
        emit OperatorSlashed(operator, slashAmount, reason);
    }

    /**
     * @dev Assign operator to RWA
     */
    function assignOperatorToRWA(bytes32 rwaId, address operator) external onlyRole(CURATOR_ROLE) {
        require(rwaRecords[rwaId].registeredAt != 0, "ARCxRWARegistry: RWA not found");
        require(operatorStakes[operator].amount > 0, "ARCxRWARegistry: Not an operator");
        require(rwaOperators[rwaId].length < maxOperatorsPerRWA, "ARCxRWARegistry: Too many operators");

        // Check if already assigned
        for (uint256 i = 0; i < rwaOperators[rwaId].length; i++) {
            require(rwaOperators[rwaId][i] != operator, "ARCxRWARegistry: Already assigned");
        }

        rwaOperators[rwaId].push(operator);
        operatorRWAs[operator].push(rwaId);

        emit OperatorAssignedToRWA(rwaId, operator);
    }

    /**
     * @dev Calculate impact score for an RWA
     */
    function calculateImpact(bytes32 rwaId) external returns (uint256) {
        RWARecord storage rwa = rwaRecords[rwaId];
        require(rwa.registeredAt != 0, "ARCxRWARegistry: RWA not found");

        // Simplified impact calculation
        // In production, this would use the impact function
        uint256 attestations = 0;
        for (uint256 i = 0; i < rwa.attesters.length; i++) {
            if (rwa.attestations[rwa.attesters[i]]) {
                attestations++;
            }
        }

        uint256 impactScore = (attestations * 1e18) / rwa.attesters.length;
        rwa.impactScore = impactScore;

        emit ImpactCalculated(rwaId, impactScore);
        return impactScore;
    }

    /**
     * @dev Get RWA information
     */
    function getRWA(bytes32 rwaId) external view returns (
        bytes32 schemaId,
        address registrant,
        RWAStatus status,
        uint256 registeredAt,
        uint256 impactScore,
        uint256 operatorCount
    ) {
        RWARecord storage rwa = rwaRecords[rwaId];
        return (
            rwa.schemaId,
            rwa.registrant,
            rwa.status,
            rwa.registeredAt,
            rwa.impactScore,
            rwaOperators[rwaId].length
        );
    }

    /**
     * @dev Get operator information
     */
    function getOperator(address operator) external view returns (
        uint256 stakeAmount,
        uint256 lockedUntil,
        bool slashed,
        uint256 rwaCount
    ) {
        OperatorStake memory stake = operatorStakes[operator];
        return (
            stake.amount,
            stake.lockedUntil,
            stake.slashed,
            operatorRWAs[operator].length
        );
    }

    /**
     * @dev Get operators for an RWA
     */
    function getRWAOperators(bytes32 rwaId) external view returns (address[] memory) {
        return rwaOperators[rwaId];
    }

    /**
     * @dev Get RWAs for an operator
     */
    function getOperatorRWAs(address operator) external view returns (bytes32[] memory) {
        return operatorRWAs[operator];
    }

    /**
     * @dev Update configuration
     */
    function updateConfig(
        uint256 _minStakeAmount,
        uint256 _stakeLockPeriod,
        uint256 _slashPercentage,
        uint256 _maxOperatorsPerRWA
    ) external onlyRole(ADMIN_ROLE) {
        minStakeAmount = _minStakeAmount;
        stakeLockPeriod = _stakeLockPeriod;
        slashPercentage = _slashPercentage;
        maxOperatorsPerRWA = _maxOperatorsPerRWA;

        emit ConfigUpdated(_minStakeAmount, _stakeLockPeriod, _slashPercentage, _maxOperatorsPerRWA);
    }

    /**
     * @dev Initialize default RWA schemas
     */
    function _initializeDefaultSchemas() internal {
        // Energy Credits Schema
        rwaSchemas[keccak256("ENERGY_CREDITS")] = RWASchema({
            schemaId: keccak256("ENERGY_CREDITS"),
            rwaType: RWAType.ENERGY_CREDITS,
            name: "Energy Credits",
            description: "Renewable energy credit certificates",
            requiredFields: ["energyType", "quantity", "vintage", "location", "certifier"],
            active: true,
            createdAt: block.timestamp
        });

        // Carbon Credits Schema
        rwaSchemas[keccak256("CARBON_CREDITS")] = RWASchema({
            schemaId: keccak256("CARBON_CREDITS"),
            rwaType: RWAType.CARBON_CREDITS,
            name: "Carbon Credits",
            description: "Carbon emission reduction credits",
            requiredFields: ["reductionType", "quantity", "vintage", "methodology", "verifier"],
            active: true,
            createdAt: block.timestamp
        });

        // Real Estate Schema
        rwaSchemas[keccak256("REAL_ESTATE")] = RWASchema({
            schemaId: keccak256("REAL_ESTATE"),
            rwaType: RWAType.REAL_ESTATE,
            name: "Real Estate",
            description: "Real property assets",
            requiredFields: ["propertyType", "location", "valuation", "ownership", "appraisal"],
            active: true,
            createdAt: block.timestamp
        });
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

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

    // Errors
    error Unauthorized();
    error InvalidAmount();
    error InsufficientStake();
    error AlreadyStaked();
    error StakeLocked();
    error AlreadySlashed();
    error RWAExists();
    error RWANotFound();
    error InvalidStatus();
    error TooManyOperators();
    error SchemaNotActive();
}
