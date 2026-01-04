// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../interfaces/IAdamPolicy.sol";

/**
 * @title ParamsGuardPolicy - Parameter Validation Policy
 * @dev Constitutional policy that validates parameter changes are within bounds
 * @notice Enforces parameter bounds and monotonicity constraints
 *
 * Rules enforced:
 * - All parameter changes must be within defined bounds
 * - Monotonic parameters can only move in their designated direction
 * - Parameters not in allowlist cannot be changed
 */
contract ParamsGuardPolicy is IAdamPolicy {
    // Verdict constants
    uint8 public constant VERDICT_ALLOW = 0;
    uint8 public constant VERDICT_DENY = 1;

    // Parameter bounds
    struct ParamBounds {
        uint256 min;
        uint256 max;
        bool monoUp;      // Can only increase
        bool monoDown;    // Can only decrease
        bool exists;
    }

    // State
    bytes32 private _wasmHash;
    mapping(bytes32 => ParamBounds) public paramBounds;
    mapping(bytes32 => bool) public allowlist;
    mapping(bytes32 => uint256) public currentValues;

    // Admin
    address public admin;

    event ParamBoundsSet(bytes32 indexed paramKey, uint256 min, uint256 max, bool monoUp, bool monoDown);
    event ParamAllowlisted(bytes32 indexed paramKey);
    event ParamRemoved(bytes32 indexed paramKey);

    modifier onlyAdmin() {
        require(msg.sender == admin, "ParamsGuard: not admin");
        _;
    }

    constructor(address _admin, bytes32 wasmHashValue) {
        admin = _admin;
        _wasmHash = wasmHashValue;

        // Initialize common parameter bounds (in WAD format: 1e18 = 100%)
        _setParamBounds(keccak256(abi.encodePacked("FEE_BPS")), 0, 500, false, false); // 0-5%
        _setParamBounds(keccak256(abi.encodePacked("QUORUM_PCT")), 30e16, 200e16, true, false); // 30%-200%, can only increase
        _setParamBounds(keccak256(abi.encodePacked("VOTING_PERIOD")), 1 days, 30 days, false, false); // 1-30 days
        _setParamBounds(keccak256(abi.encodePacked("TIMELOCK_DELAY")), 1 days, 14 days, false, false); // 1-14 days
        _setParamBounds(keccak256(abi.encodePacked("PROPOSAL_THRESHOLD")), 1e18, 1000000e18, false, false); // 1-1M tokens
        _setParamBounds(keccak256(abi.encodePacked("ENERGY_CAP")), 0, type(uint256).max, false, false); // No upper limit
        _setParamBounds(keccak256(abi.encodePacked("CARBON_CAP")), 0, type(uint256).max, false, false); // No upper limit
    }

    /**
     * @dev Get Wasm hash for this policy
     */
    function wasmHash() external view override returns (bytes32) {
        return _wasmHash;
    }

    /**
     * @dev Evaluate parameter change against constitutional rules
     * @param ctx Context containing parameter changes to validate
     * @return verdict ALLOW if all changes valid, DENY otherwise
     * @return data Empty bytes
     */
    function evaluate(bytes calldata ctx) external view override returns (uint8 verdict, bytes memory data) {
        // Decode context - expect array of parameter changes
        // Format: [(key, oldValue, newValue), ...]
        
        if (ctx.length == 0) {
            return (VERDICT_ALLOW, "");
        }

        // Parse context as parameter changes
        uint256 numChanges = ctx.length / 96; // Each change is 3x32 bytes
        
        for (uint256 i = 0; i < numChanges; i++) {
            uint256 offset = i * 96;
            
            // Extract parameter key, old value, new value
            bytes32 paramKey = bytes32(ctx[offset:offset + 32]);
            uint256 oldValue = uint256(bytes32(ctx[offset + 32:offset + 64]));
            uint256 newValue = uint256(bytes32(ctx[offset + 64:offset + 96]));
            
            // Check if parameter is in allowlist
            if (!allowlist[paramKey]) {
                return (VERDICT_DENY, "Parameter not in allowlist");
            }
            
            ParamBounds memory bounds = paramBounds[paramKey];
            if (!bounds.exists) {
                return (VERDICT_DENY, "Parameter bounds not defined");
            }
            
            // Check bounds
            if (newValue < bounds.min || newValue > bounds.max) {
                return (VERDICT_DENY, "Parameter out of bounds");
            }
            
            // Check monotonicity
            if (bounds.monoUp && newValue < oldValue) {
                return (VERDICT_DENY, "Parameter can only increase");
            }
            if (bounds.monoDown && newValue > oldValue) {
                return (VERDICT_DENY, "Parameter can only decrease");
            }
        }
        
        return (VERDICT_ALLOW, "");
    }

    /**
     * @dev Set parameter bounds (admin only)
     */
    function setParamBounds(
        bytes32 paramKey,
        uint256 min,
        uint256 max,
        bool monoUp,
        bool monoDown
    ) external onlyAdmin {
        _setParamBounds(paramKey, min, max, monoUp, monoDown);
    }

    /**
     * @dev Internal function to set parameter bounds
     */
    function _setParamBounds(
        bytes32 paramKey,
        uint256 min,
        uint256 max,
        bool monoUp,
        bool monoDown
    ) internal {
        require(min <= max, "ParamsGuard: invalid bounds");
        require(!(monoUp && monoDown), "ParamsGuard: cannot be both mono up and down");
        
        paramBounds[paramKey] = ParamBounds({
            min: min,
            max: max,
            monoUp: monoUp,
            monoDown: monoDown,
            exists: true
        });
        
        allowlist[paramKey] = true;
        
        emit ParamBoundsSet(paramKey, min, max, monoUp, monoDown);
        emit ParamAllowlisted(paramKey);
    }

    /**
     * @dev Add parameter to allowlist
     */
    function addToAllowlist(bytes32 paramKey) external onlyAdmin {
        allowlist[paramKey] = true;
        emit ParamAllowlisted(paramKey);
    }

    /**
     * @dev Remove parameter from allowlist
     */
    function removeFromAllowlist(bytes32 paramKey) external onlyAdmin {
        allowlist[paramKey] = false;
        emit ParamRemoved(paramKey);
    }

    /**
     * @dev Update current value for a parameter (for monotonicity tracking)
     */
    function updateCurrentValue(bytes32 paramKey, uint256 value) external onlyAdmin {
        currentValues[paramKey] = value;
    }

    /**
     * @dev Transfer admin role
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "ParamsGuard: zero address");
        admin = newAdmin;
    }
}
