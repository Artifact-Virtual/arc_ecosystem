// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../interfaces/IAdamPolicy.sol";

/**
 * @title RWARecencyPolicy - Real World Asset Recency Validation
 * @dev Constitutional policy that validates RWA oracle data recency and operator SLA
 * @notice Ensures RWA updates meet recency requirements and operator stakes
 *
 * Rules enforced:
 * - Oracle data must be within recency window
 * - Minimum number of oracle confirmations required
 * - Operators must meet SLA thresholds
 * - Operator stakes must be active and sufficient
 */
contract RWARecencyPolicy is IAdamPolicy {
    // Verdict constants
    uint8 public constant VERDICT_ALLOW = 0;
    uint8 public constant VERDICT_DENY = 1;

    // State
    bytes32 private _wasmHash;
    address public admin;
    address public rwaRegistry;

    // Recency requirements per topic
    mapping(uint256 => uint256) public topicRecencyWindow; // topic => max age in seconds
    mapping(uint256 => uint256) public topicMinOracles;    // topic => min confirmations
    mapping(uint256 => uint256) public topicMinSLA;        // topic => min SLA percentage (in basis points)

    // Operator tracking
    mapping(address => uint256) public operatorStake;
    mapping(address => uint256) public operatorSLA;
    mapping(address => bool) public operatorActive;
    uint256 public minOperatorStake;

    event RecencyWindowSet(uint256 indexed topicId, uint256 window);
    event MinOraclesSet(uint256 indexed topicId, uint256 minOracles);
    event MinSLASet(uint256 indexed topicId, uint256 minSLA);
    event OperatorRegistered(address indexed operator, uint256 stake);
    event OperatorStakeUpdated(address indexed operator, uint256 newStake);
    event OperatorSLAUpdated(address indexed operator, uint256 newSLA);

    modifier onlyAdmin() {
        require(msg.sender == admin, "RWARecency: not admin");
        _;
    }

    constructor(
        address _admin,
        address _rwaRegistry,
        bytes32 wasmHashValue,
        uint256 _minOperatorStake
    ) {
        admin = _admin;
        rwaRegistry = _rwaRegistry;
        _wasmHash = wasmHashValue;
        minOperatorStake = _minOperatorStake;

        // Initialize default recency windows
        topicRecencyWindow[2] = 1 hours;  // ENERGY - 1 hour
        topicRecencyWindow[3] = 1 hours;  // CARBON - 1 hour
        
        // Initialize default min oracles
        topicMinOracles[2] = 2;  // ENERGY - 2 oracles
        topicMinOracles[3] = 2;  // CARBON - 2 oracles
        
        // Initialize default min SLA (95% = 9500 basis points)
        topicMinSLA[2] = 9500;
        topicMinSLA[3] = 9500;
    }

    /**
     * @dev Get Wasm hash for this policy
     */
    function wasmHash() external view override returns (bytes32) {
        return _wasmHash;
    }

    /**
     * @dev Evaluate RWA update against recency and operator requirements
     * @param ctx Context containing RWA update details
     * @return verdict ALLOW if valid, DENY otherwise
     * @return data Reason for verdict
     */
    function evaluate(bytes calldata ctx) external view override returns (uint8 verdict, bytes memory data) {
        if (ctx.length == 0) {
            return (VERDICT_DENY, "Empty context");
        }

        // Parse context - expect: (topicId, numOracles, timestamp, operators[])
        // Format: 32 bytes topicId, 32 bytes numOracles, 32 bytes timestamp, then operator addresses
        require(ctx.length >= 96, "RWARecency: invalid context length");
        
        uint256 topicId = uint256(bytes32(ctx[0:32]));
        uint256 numOracles = uint256(bytes32(ctx[32:64]));
        uint256 timestamp = uint256(bytes32(ctx[64:96]));

        // Check recency
        uint256 recencyWindow = topicRecencyWindow[topicId];
        if (recencyWindow == 0) {
            return (VERDICT_DENY, "Recency window not configured for topic");
        }
        
        if (block.timestamp - timestamp > recencyWindow) {
            return (VERDICT_DENY, "Oracle data too old");
        }

        // Check minimum oracle count
        uint256 minOracles = topicMinOracles[topicId];
        if (numOracles < minOracles) {
            return (VERDICT_DENY, "Insufficient oracle confirmations");
        }

        // Check operators
        uint256 expectedOperatorBytes = numOracles * 32; // 20 bytes address + 12 bytes padding
        if (ctx.length < 96 + expectedOperatorBytes) {
            return (VERDICT_DENY, "Incomplete operator data");
        }

        // Validate each operator
        for (uint256 i = 0; i < numOracles; i++) {
            uint256 offset = 96 + (i * 32);
            address operator = address(bytes20(ctx[offset:offset + 20]));
            
            // Check if operator is active
            if (!operatorActive[operator]) {
                return (VERDICT_DENY, "Inactive operator in update");
            }
            
            // Check operator stake
            if (operatorStake[operator] < minOperatorStake) {
                return (VERDICT_DENY, "Operator stake below minimum");
            }
            
            // Check operator SLA
            uint256 minSLA = topicMinSLA[topicId];
            if (operatorSLA[operator] < minSLA) {
                return (VERDICT_DENY, "Operator SLA below minimum");
            }
        }

        return (VERDICT_ALLOW, "");
    }

    /**
     * @dev Set recency window for a topic
     */
    function setRecencyWindow(uint256 topicId, uint256 window) external onlyAdmin {
        require(window >= 5 minutes, "RWARecency: min 5 minutes");
        require(window <= 7 days, "RWARecency: max 7 days");
        topicRecencyWindow[topicId] = window;
        emit RecencyWindowSet(topicId, window);
    }

    /**
     * @dev Set minimum oracle count for a topic
     */
    function setMinOracles(uint256 topicId, uint256 minOracles) external onlyAdmin {
        require(minOracles >= 1, "RWARecency: min 1 oracle");
        require(minOracles <= 10, "RWARecency: max 10 oracles");
        topicMinOracles[topicId] = minOracles;
        emit MinOraclesSet(topicId, minOracles);
    }

    /**
     * @dev Set minimum SLA for a topic (in basis points)
     */
    function setMinSLA(uint256 topicId, uint256 minSLA) external onlyAdmin {
        require(minSLA <= 10000, "RWARecency: max 10000 bps");
        topicMinSLA[topicId] = minSLA;
        emit MinSLASet(topicId, minSLA);
    }

    /**
     * @dev Register an operator
     */
    function registerOperator(address operator, uint256 stake, uint256 sla) external onlyAdmin {
        require(operator != address(0), "RWARecency: zero address");
        require(stake >= minOperatorStake, "RWARecency: stake below minimum");
        require(sla <= 10000, "RWARecency: invalid SLA");
        
        operatorStake[operator] = stake;
        operatorSLA[operator] = sla;
        operatorActive[operator] = true;
        
        emit OperatorRegistered(operator, stake);
    }

    /**
     * @dev Update operator stake
     */
    function updateOperatorStake(address operator, uint256 newStake) external onlyAdmin {
        require(operatorActive[operator], "RWARecency: operator not active");
        operatorStake[operator] = newStake;
        emit OperatorStakeUpdated(operator, newStake);
    }

    /**
     * @dev Update operator SLA
     */
    function updateOperatorSLA(address operator, uint256 newSLA) external onlyAdmin {
        require(operatorActive[operator], "RWARecency: operator not active");
        require(newSLA <= 10000, "RWARecency: invalid SLA");
        operatorSLA[operator] = newSLA;
        emit OperatorSLAUpdated(operator, newSLA);
    }

    /**
     * @dev Deactivate an operator
     */
    function deactivateOperator(address operator) external onlyAdmin {
        operatorActive[operator] = false;
    }

    /**
     * @dev Reactivate an operator
     */
    function reactivateOperator(address operator) external onlyAdmin {
        require(operatorStake[operator] >= minOperatorStake, "RWARecency: stake below minimum");
        operatorActive[operator] = true;
    }

    /**
     * @dev Set minimum operator stake
     */
    function setMinOperatorStake(uint256 stake) external onlyAdmin {
        minOperatorStake = stake;
    }

    /**
     * @dev Get operator info
     */
    function getOperatorInfo(address operator) external view returns (
        uint256 stake,
        uint256 sla,
        bool active
    ) {
        stake = operatorStake[operator];
        sla = operatorSLA[operator];
        active = operatorActive[operator];
    }

    /**
     * @dev Get topic requirements
     */
    function getTopicRequirements(uint256 topicId) external view returns (
        uint256 recencyWindow,
        uint256 minOracles,
        uint256 minSLA
    ) {
        recencyWindow = topicRecencyWindow[topicId];
        minOracles = topicMinOracles[topicId];
        minSLA = topicMinSLA[topicId];
    }

    /**
     * @dev Transfer admin role
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "RWARecency: zero address");
        admin = newAdmin;
    }

    /**
     * @dev Update RWA registry address
     */
    function setRWARegistry(address newRegistry) external onlyAdmin {
        require(newRegistry != address(0), "RWARecency: zero address");
        rwaRegistry = newRegistry;
    }
}
