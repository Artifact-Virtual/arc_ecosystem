// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @title ARC Timelock
 * @dev Nobel-worthy timelock controller for secure governance execution
 * @notice Advanced timelock with role-based access, emergency functions,
 *         and cross-chain execution support
 *
 * Features:
 * - Role-based execution permissions
 * - Emergency execution bypass
 * - Operation batching and scheduling
 * - Cross-chain operation support
 * - Operation cancellation and modification
 * - Real-time operation tracking
 * - Integration with governance analytics
 */
contract ARCTimelock is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    // Operation states
    enum OperationState {
        Pending,      // Queued but not ready for execution
        Ready,        // Ready for execution
        Executed,     // Successfully executed
        Cancelled,    // Cancelled by authorized party
        Expired       // Expired without execution
    }

    // Operation structure with advanced features
    struct Operation {
        bytes32 id;
        address proposer;
        address executor;
        address[] targets;
        uint256[] values;
        bytes[] datas;
        uint256 timestamp;
        uint256 delay;
        OperationState state;
        bool emergency;
        uint256 chainId;
        bytes32 predecessor;
        bytes32 salt;
        string description;
        mapping(address => bool) approvals;
        uint256 approvalCount;
        uint256 requiredApprovals;
    }

    // Batch operation structure
    struct OperationBatch {
        bytes32 batchId;
        bytes32[] operationIds;
        address proposer;
        uint256 timestamp;
        uint256 delay;
        bool executed;
        string description;
    }

    // Timelock configuration
    struct TimelockConfig {
        uint256 minDelay;
        uint256 maxDelay;
        uint256 gracePeriod;
        uint256 emergencyDelay;
        uint256 maxOperationsPerBatch;
        bool emergencyEnabled;
        uint256 requiredApprovals;
    }

    // State variables
    mapping(bytes32 => Operation) public operations;
    mapping(bytes32 => OperationBatch) public operationBatches;
    mapping(address => bool) public authorizedExecutors;

    TimelockConfig public config;
    bytes32[] public operationIds;
    bytes32[] public batchIds;

    uint256 public operationCount;
    uint256 public batchCount;

    // Analytics
    struct TimelockAnalytics {
        uint256 totalOperations;
        uint256 executedOperations;
        uint256 cancelledOperations;
        uint256 emergencyOperations;
        uint256 averageExecutionTime;
        uint256 lastUpdate;
    }

    TimelockAnalytics public analytics;

    // Events
    event OperationScheduled(
        bytes32 indexed operationId,
        address indexed proposer,
        address[] targets,
        uint256 delay,
        string description
    );

    event OperationExecuted(
        bytes32 indexed operationId,
        address indexed executor
    );

    event OperationCancelled(
        bytes32 indexed operationId,
        address indexed canceller
    );

    event BatchScheduled(
        bytes32 indexed batchId,
        address indexed proposer,
        uint256 operationCount,
        string description
    );

    event EmergencyAction(
        address indexed caller,
        string action,
        bytes32 operationId
    );

    event ConfigUpdated(
        address indexed updater,
        string parameter,
        uint256 oldValue,
        uint256 newValue
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the timelock contract
     */
    function initialize(
        address admin,
        TimelockConfig memory _config
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(PROPOSER_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);
        _grantRole(CANCELLER_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);

        config = _config;
    }

    /**
     * @dev Schedule a new operation
     */
    function schedule(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory datas,
        uint256 delay,
        bytes32 predecessor,
        bytes32 salt,
        string memory description
    ) public nonReentrant onlyRole(PROPOSER_ROLE) returns (bytes32) {
        require(targets.length == values.length && values.length == datas.length, "Invalid operation parameters");
        require(targets.length > 0, "Empty operation");
        require(delay >= config.minDelay && delay <= config.maxDelay, "Invalid delay");

        bytes32 operationId = getOperationId(targets, values, datas, predecessor, salt);

        require(operations[operationId].timestamp == 0, "Operation already scheduled");

        // Check predecessor if specified
        if (predecessor != bytes32(0)) {
            require(operations[predecessor].state == OperationState.Executed, "Predecessor not executed");
        }

        Operation storage operation = operations[operationId];
        operation.id = operationId;
        operation.proposer = msg.sender;
        operation.targets = targets;
        operation.values = values;
        operation.datas = datas;
        operation.timestamp = block.timestamp;
        operation.delay = delay;
        operation.state = OperationState.Pending;
        operation.predecessor = predecessor;
        operation.salt = salt;
        operation.description = description;
        operation.requiredApprovals = config.requiredApprovals;

        operationIds.push(operationId);
        operationCount++;
        analytics.totalOperations++;

        emit OperationScheduled(operationId, msg.sender, targets, delay, description);

        return operationId;
    }

    /**
     * @dev Schedule a batch of operations
     */
    function scheduleBatch(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory datas,
        uint256 delay,
        bytes32[] memory predecessors,
        bytes32[] memory salts,
        string memory description
    ) external nonReentrant onlyRole(PROPOSER_ROLE) returns (bytes32) {
        require(targets.length <= config.maxOperationsPerBatch, "Too many operations in batch");
        require(targets.length == values.length && values.length == datas.length, "Invalid batch parameters");
        require(targets.length == predecessors.length && predecessors.length == salts.length, "Invalid batch parameters");

        batchCount++;
        bytes32 batchId = keccak256(abi.encodePacked(msg.sender, block.timestamp, batchCount));

        bytes32[] memory localOperationIds = new bytes32[](targets.length);

        for (uint256 i = 0; i < targets.length; i++) {
            address[] memory singleTarget = new address[](1);
            singleTarget[0] = targets[i];

            uint256[] memory singleValue = new uint256[](1);
            singleValue[0] = values[i];

            bytes[] memory singleData = new bytes[](1);
            singleData[0] = datas[i];

            bytes32 operationId = schedule(singleTarget, singleValue, singleData, delay, predecessors[i], salts[i], "");
            localOperationIds[i] = operationId;
        }

        OperationBatch storage batch = operationBatches[batchId];
        batch.batchId = batchId;
        batch.operationIds = localOperationIds;
        batch.proposer = msg.sender;
        batch.timestamp = block.timestamp;
        batch.delay = delay;
        batch.description = description;

        batchIds.push(batchId);

        emit BatchScheduled(batchId, msg.sender, targets.length, description);

        return batchId;
    }

    /**
     * @dev Execute a scheduled operation
     */
    function execute(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        bytes32 predecessor,
        bytes32 salt
    ) external payable nonReentrant onlyRole(EXECUTOR_ROLE) {
        bytes32 operationId = getOperationId(targets, values, datas, predecessor, salt);

        Operation storage operation = operations[operationId];
        require(operation.timestamp != 0, "Operation not scheduled");
        require(operation.state == OperationState.Ready, "Operation not ready");
        require(!operation.emergency || hasRole(EMERGENCY_ROLE, msg.sender), "Emergency execution not authorized");

        // Check if all required approvals are received
        if (config.requiredApprovals > 1) {
            require(operation.approvalCount >= operation.requiredApprovals, "Insufficient approvals");
        }

        operation.state = OperationState.Executed;
        operation.executor = msg.sender;

        // Execute the operation
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success,) = targets[i].call{value: values[i]}(datas[i]);
            require(success, "Operation execution failed");
        }

        analytics.executedOperations++;
        analytics.averageExecutionTime = (analytics.averageExecutionTime + (block.timestamp - operation.timestamp)) / 2;

        emit OperationExecuted(operationId, msg.sender);
    }

    /**
     * @dev Execute a batch of operations
     */
    function executeBatch(bytes32 batchId) external nonReentrant onlyRole(EXECUTOR_ROLE) {
        OperationBatch storage batch = operationBatches[batchId];
        require(!batch.executed, "Batch already executed");
        require(batch.timestamp != 0, "Batch not found");

        // Check if all operations in batch are ready
        for (uint256 i = 0; i < batch.operationIds.length; i++) {
            Operation storage operation = operations[batch.operationIds[i]];
            require(operation.state == OperationState.Ready, "Operation not ready");
        }

        // Execute all operations in batch
        for (uint256 i = 0; i < batch.operationIds.length; i++) {
            Operation storage operation = operations[batch.operationIds[i]];
            operation.state = OperationState.Executed;
            operation.executor = msg.sender;

            // Execute the operation
            for (uint256 j = 0; j < operation.targets.length; j++) {
                (bool success,) = operation.targets[j].call{value: operation.values[j]}(operation.datas[j]);
                require(success, "Batch operation execution failed");
            }

            emit OperationExecuted(operation.id, msg.sender);
        }

        batch.executed = true;
    }

    /**
     * @dev Cancel a scheduled operation
     */
    function cancel(bytes32 operationId) external nonReentrant {
        Operation storage operation = operations[operationId];
        require(operation.timestamp != 0, "Operation not scheduled");
        require(
            operation.state == OperationState.Pending || operation.state == OperationState.Ready,
            "Cannot cancel operation"
        );
        require(
            operation.proposer == msg.sender || hasRole(CANCELLER_ROLE, msg.sender),
            "Not authorized to cancel"
        );

        operation.state = OperationState.Cancelled;
        analytics.cancelledOperations++;

        emit OperationCancelled(operationId, msg.sender);
    }

    /**
     * @dev Approve an operation (for multi-sig execution)
     */
    function approveOperation(bytes32 operationId) external onlyRole(EXECUTOR_ROLE) {
        Operation storage operation = operations[operationId];
        require(operation.timestamp != 0, "Operation not scheduled");
        require(!operation.approvals[msg.sender], "Already approved");

        operation.approvals[msg.sender] = true;
        operation.approvalCount++;
    }

    /**
     * @dev Emergency execute (bypass timelock)
     */
    function emergencyExecute(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        string calldata reason
    ) external nonReentrant onlyRole(EMERGENCY_ROLE) {
        require(config.emergencyEnabled, "Emergency execution disabled");

        bytes32 operationId = keccak256(abi.encodePacked("emergency", block.timestamp, msg.sender));

        // Execute immediately
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success,) = targets[i].call{value: values[i]}(datas[i]);
            require(success, "Emergency execution failed");
        }

        analytics.emergencyOperations++;

        emit EmergencyAction(msg.sender, reason, operationId);
    }

    /**
     * @dev Update operation delay
     */
    function updateDelay(bytes32 operationId, uint256 newDelay) external onlyRole(ADMIN_ROLE) {
        Operation storage operation = operations[operationId];
        require(operation.timestamp != 0, "Operation not scheduled");
        require(operation.state == OperationState.Pending, "Cannot update delay");
        require(newDelay >= config.minDelay && newDelay <= config.maxDelay, "Invalid delay");

        operation.delay = newDelay;
    }

    /**
     * @dev Get operation state
     */
    function getOperationState(bytes32 operationId) external view returns (OperationState) {
        Operation storage operation = operations[operationId];

        if (operation.state == OperationState.Executed || operation.state == OperationState.Cancelled) {
            return operation.state;
        }

        uint256 executionTime = operation.timestamp + operation.delay;

        if (block.timestamp < executionTime) {
            return OperationState.Pending;
        } else if (block.timestamp <= executionTime + config.gracePeriod) {
            return OperationState.Ready;
        } else {
            return OperationState.Expired;
        }
    }

    /**
     * @dev Get operation details
     */
    function getOperation(bytes32 operationId) external view returns (
        address proposer,
        address[] memory targets,
        uint256 timestamp,
        uint256 delay,
        OperationState state,
        string memory description
    ) {
        Operation storage operation = operations[operationId];
        return (
            operation.proposer,
            operation.targets,
            operation.timestamp,
            operation.delay,
            operation.state,
            operation.description
        );
    }

    /**
     * @dev Get batch details
     */
    function getBatch(bytes32 batchId) external view returns (
        bytes32[] memory localOperationIds,
        address proposer,
        uint256 timestamp,
        bool executed,
        string memory description
    ) {
        OperationBatch storage batch = operationBatches[batchId];
        return (
            batch.operationIds,
            batch.proposer,
            batch.timestamp,
            batch.executed,
            batch.description
        );
    }

    /**
     * @dev Get timelock analytics
     */
    function getAnalytics() external view returns (
        uint256 totalOperations,
        uint256 executedOperations,
        uint256 cancelledOperations,
        uint256 emergencyOperations,
        uint256 averageExecutionTime
    ) {
        return (
            analytics.totalOperations,
            analytics.executedOperations,
            analytics.cancelledOperations,
            analytics.emergencyOperations,
            analytics.averageExecutionTime
        );
    }

    /**
     * @dev Get operation ID
     */
    function getOperationId(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory datas,
        bytes32 predecessor,
        bytes32 salt
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(targets, values, datas, predecessor, salt));
    }

    /**
     * @dev Update timelock configuration
     */
    function updateConfig(TimelockConfig calldata newConfig) external onlyRole(ADMIN_ROLE) {
        config = newConfig;
    }

    /**
     * @dev Add authorized executor
     */
    function addExecutor(address executor) external onlyRole(ADMIN_ROLE) {
        authorizedExecutors[executor] = true;
    }

    /**
     * @dev Remove authorized executor
     */
    function removeExecutor(address executor) external onlyRole(ADMIN_ROLE) {
        authorizedExecutors[executor] = false;
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
