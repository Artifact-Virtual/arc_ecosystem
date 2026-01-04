// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../interfaces/IAdamPolicy.sol";

/**
 * @title Dual2FAPolicy - Two-Factor Authentication Policy
 * @dev Constitutional policy that requires 2FA for high-impact operations
 * @notice Enforces dual-signature requirement for sensitive actions
 *
 * Rules enforced:
 * - High-value treasury operations require 2FA
 * - Critical parameter changes require 2FA
 * - Emergency actions require 2FA
 * - 2FA must come from disjoint signers
 */
contract Dual2FAPolicy is IAdamPolicy {
    // Verdict constants
    uint8 public constant VERDICT_ALLOW = 0;
    uint8 public constant VERDICT_DENY = 1;
    uint8 public constant VERDICT_REQUIRE_2FA = 3;

    // State
    bytes32 private _wasmHash;
    address public admin;

    // 2FA configuration
    mapping(bytes32 => bool) public requires2FA;
    mapping(bytes32 => uint256) public actionThresholds;
    
    // Critical parameters that always require 2FA
    mapping(bytes32 => bool) public criticalParams;

    // High-impact topics
    uint256 public constant TOPIC_TREASURY = 0;
    uint256 public constant TOPIC_PARAMS = 1;
    uint256 public constant TOPIC_EMERGENCY = 99;

    uint256 public treasuryThreshold;
    uint256 public paramChangeThreshold;

    event TwoFARequired(bytes32 indexed actionId, string reason);
    event ThresholdSet(bytes32 indexed key, uint256 threshold);
    event CriticalParamSet(bytes32 indexed paramKey, bool critical);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Dual2FA: not admin");
        _;
    }

    constructor(
        address _admin,
        bytes32 wasmHashValue,
        uint256 _treasuryThreshold,
        uint256 _paramChangeThreshold
    ) {
        admin = _admin;
        _wasmHash = wasmHashValue;
        treasuryThreshold = _treasuryThreshold;
        paramChangeThreshold = _paramChangeThreshold;

        // Initialize critical parameters
        _setCriticalParam(keccak256(abi.encodePacked("QUORUM_PCT")), true);
        _setCriticalParam(keccak256(abi.encodePacked("VOTING_PERIOD")), true);
        _setCriticalParam(keccak256(abi.encodePacked("TIMELOCK_DELAY")), true);
        _setCriticalParam(keccak256(abi.encodePacked("PROPOSAL_THRESHOLD")), true);
    }

    /**
     * @dev Get Wasm hash for this policy
     */
    function wasmHash() external view override returns (bytes32) {
        return _wasmHash;
    }

    /**
     * @dev Evaluate if action requires 2FA
     * @param ctx Context containing action details (ABI-encoded)
     * @return verdict ALLOW, DENY, or REQUIRE_2FA based on evaluation
     * @return data Reason or empty
     * 
     * @notice Context format: abi.encode(topicId, actionType, identifier, value)
     */
    function evaluate(bytes calldata ctx) external view override returns (uint8 verdict, bytes memory data) {
        if (ctx.length == 0) {
            return (VERDICT_DENY, "Empty context");
        }

        // Decode context using ABI encoding
        (uint256 topicId, uint256 actionType, bytes32 identifier, uint256 value) = abi.decode(
            ctx,
            (uint256, uint256, bytes32, uint256)
        );

        // Check if emergency action
        if (topicId == TOPIC_EMERGENCY) {
            return (VERDICT_REQUIRE_2FA, "Emergency action");
        }

        // Check treasury actions
        if (topicId == TOPIC_TREASURY) {
            if (value >= treasuryThreshold) {
                return (VERDICT_REQUIRE_2FA, "Large treasury transaction");
            }
        }

        // Check parameter changes
        if (topicId == TOPIC_PARAMS) {
            // Check if this is a critical parameter
            if (criticalParams[identifier]) {
                return (VERDICT_REQUIRE_2FA, "Critical parameter");
            }
            
            // Check if change magnitude exceeds threshold
            if (actionType == 1) { // Parameter update
                if (value >= paramChangeThreshold) {
                    return (VERDICT_REQUIRE_2FA, "Large parameter change");
                }
            }
        }

        // Check if action explicitly requires 2FA
        bytes32 actionId = keccak256(abi.encodePacked(topicId, actionType, identifier));
        if (requires2FA[actionId]) {
            return (VERDICT_REQUIRE_2FA, "Configured 2FA requirement");
        }

        // No 2FA required
        return (VERDICT_ALLOW, "");
    }

    /**
     * @dev Set whether an action requires 2FA
     */
    function setRequires2FA(
        uint256 topicId,
        uint256 actionType,
        bytes32 identifier,
        bool required
    ) external onlyAdmin {
        bytes32 actionId = keccak256(abi.encodePacked(topicId, actionType, identifier));
        requires2FA[actionId] = required;
    }

    /**
     * @dev Set treasury threshold for 2FA
     */
    function setTreasuryThreshold(uint256 threshold) external onlyAdmin {
        treasuryThreshold = threshold;
        emit ThresholdSet("TREASURY_THRESHOLD", threshold);
    }

    /**
     * @dev Set parameter change threshold for 2FA
     */
    function setParamChangeThreshold(uint256 threshold) external onlyAdmin {
        paramChangeThreshold = threshold;
        emit ThresholdSet("PARAM_CHANGE_THRESHOLD", threshold);
    }

    /**
     * @dev Set whether a parameter is critical (requires 2FA)
     */
    function setCriticalParam(bytes32 paramKey, bool critical) external onlyAdmin {
        _setCriticalParam(paramKey, critical);
    }

    /**
     * @dev Internal function to set critical parameter
     */
    function _setCriticalParam(bytes32 paramKey, bool critical) internal {
        criticalParams[paramKey] = critical;
        emit CriticalParamSet(paramKey, critical);
    }

    /**
     * @dev Set action threshold
     */
    function setActionThreshold(bytes32 actionKey, uint256 threshold) external onlyAdmin {
        actionThresholds[actionKey] = threshold;
        emit ThresholdSet(actionKey, threshold);
    }

    /**
     * @dev Check if action requires 2FA
     */
    function checkRequires2FA(
        uint256 topicId,
        uint256 actionType,
        bytes32 identifier
    ) external view returns (bool) {
        bytes32 actionId = keccak256(abi.encodePacked(topicId, actionType, identifier));
        return requires2FA[actionId];
    }

    /**
     * @dev Check if parameter is critical
     */
    function isCriticalParam(bytes32 paramKey) external view returns (bool) {
        return criticalParams[paramKey];
    }

    /**
     * @dev Get all thresholds
     */
    function getThresholds() external view returns (
        uint256 treasury,
        uint256 paramChange
    ) {
        treasury = treasuryThreshold;
        paramChange = paramChangeThreshold;
    }

    /**
     * @dev Batch set critical parameters
     */
    function batchSetCriticalParams(bytes32[] calldata paramKeys, bool critical) external onlyAdmin {
        for (uint256 i = 0; i < paramKeys.length; i++) {
            _setCriticalParam(paramKeys[i], critical);
        }
    }

    /**
     * @dev Transfer admin role
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Dual2FA: zero address");
        admin = newAdmin;
    }
}
