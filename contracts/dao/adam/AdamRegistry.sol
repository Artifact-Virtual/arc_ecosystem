// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IAdamRegistry.sol";

/**
 * @title ADAM Registry - Constitutional Policy Management
 * @dev Manages policy chains and constitutional programs per topic/hook
 * @notice Stores ordered lists of Wasm constitutional programs
 *
 * Features:
 * - Policy chain management per topic and hook
 * - Wasm hash validation and storage
 * - Policy ordering and replacement
 * - Governance-controlled updates
 * - Comprehensive event emission
 */
contract AdamRegistry is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    IAdamRegistry
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant POLICY_MANAGER_ROLE = keccak256("POLICY_MANAGER_ROLE");

    // Topics for constitutional governance
    uint256 public constant TOPIC_TREASURY = 0;
    uint256 public constant TOPIC_PARAMS = 1;
    uint256 public constant TOPIC_ENERGY = 2;
    uint256 public constant TOPIC_CARBON = 3;
    uint256 public constant TOPIC_GRANTS = 4;

    // Hooks for policy evaluation
    bytes4 public constant HOOK_SUBMIT = bytes4(keccak256("onSubmit"));
    bytes4 public constant HOOK_VOTE_START = bytes4(keccak256("onVoteStart"));
    bytes4 public constant HOOK_TALLY = bytes4(keccak256("onTally"));
    bytes4 public constant HOOK_QUEUE = bytes4(keccak256("onQueue"));
    bytes4 public constant HOOK_EXECUTE = bytes4(keccak256("onExecute"));
    bytes4 public constant HOOK_RWA_UPDATE = bytes4(keccak256("onRwaUpdate"));
    bytes4 public constant HOOK_EMERGENCY = bytes4(keccak256("onEmergency"));

    // Policy information
    struct PolicyInfo {
        bytes32 wasmHash;        // Hash of the Wasm constitutional program
        uint8 order;             // Order in the policy chain (0 = first)
        bool active;             // Whether policy is active
        uint256 createdAt;       // Block timestamp when added
        address creator;         // Address that added the policy
    }

    // State variables
    mapping(uint256 => mapping(bytes4 => bytes32[])) private _policyChains;
    mapping(bytes32 => PolicyInfo) public policyInfo;
    mapping(bytes32 => bool) public approvedWasmHashes;

    // Analytics
    struct RegistryAnalytics {
        uint256 totalPolicies;
        uint256 activePolicies;
        uint256 totalChains;
        uint256 policyUpdates;
        uint256 lastUpdate;
    }
    RegistryAnalytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the ADAM Registry
     */
    function initialize() external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(POLICY_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Set a policy in the chain for a topic and hook
     */
    function setPolicy(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId,
        uint8 order
    ) external nonReentrant onlyRole(POLICY_MANAGER_ROLE) {
        require(_isValidTopic(topicId), "AdamRegistry: Invalid topic");
        require(_isValidHook(hook), "AdamRegistry: Invalid hook");
        require(approvedWasmHashes[policyId], "AdamRegistry: Policy not approved");

        PolicyInfo storage info = policyInfo[policyId];
        require(info.active || info.createdAt == 0, "AdamRegistry: Policy not active");

        bytes32[] storage chain = _policyChains[topicId][hook];

        // Remove from current position if already in chain
        _removeFromChain(chain, policyId);

        // Insert at new position
        if (order >= chain.length) {
            chain.push(policyId);
        } else {
            chain.push(); // Extend array
            for (uint256 i = chain.length - 1; i > order; i--) {
                chain[i] = chain[i - 1];
            }
            chain[order] = policyId;
        }

        // Update policy info
        if (info.createdAt == 0) {
            info.createdAt = block.timestamp;
            info.creator = msg.sender;
            analytics.totalPolicies++;
        }
        info.order = order;
        info.active = true;

        analytics.policyUpdates++;
        analytics.lastUpdate = block.timestamp;

        emit PolicySet(topicId, hook, policyId, order);
    }

    /**
     * @dev Remove a policy from the chain
     */
    function removePolicy(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId
    ) external nonReentrant onlyRole(POLICY_MANAGER_ROLE) {
        require(_isValidTopic(topicId), "AdamRegistry: Invalid topic");
        require(_isValidHook(hook), "AdamRegistry: Invalid hook");

        bytes32[] storage chain = _policyChains[topicId][hook];
        bool removed = _removeFromChain(chain, policyId);

        require(removed, "AdamRegistry: Policy not in chain");

        // Mark as inactive
        policyInfo[policyId].active = false;

        analytics.policyUpdates++;
        analytics.lastUpdate = block.timestamp;

        emit PolicyRemoved(topicId, hook, policyId);
    }

    /**
     * @dev Approve a Wasm hash for use in policies
     */
    function approveWasmHash(bytes32 wasmHash) external onlyRole(ADMIN_ROLE) {
        require(!approvedWasmHashes[wasmHash], "AdamRegistry: Hash already approved");
        approvedWasmHashes[wasmHash] = true;
    }

    /**
     * @dev Revoke approval for a Wasm hash
     */
    function revokeWasmHash(bytes32 wasmHash) external onlyRole(ADMIN_ROLE) {
        require(approvedWasmHashes[wasmHash], "AdamRegistry: Hash not approved");
        approvedWasmHashes[wasmHash] = false;
    }

    /**
     * @dev Get the policy chain for a topic and hook
     */
    function policyChainOf(uint256 topicId, bytes4 hook) external view returns (bytes32[] memory) {
        return _policyChains[topicId][hook];
    }

    /**
     * @dev Get policy info
     */
    function getPolicyInfo(bytes32 policyId) external view returns (
        bytes32 wasmHash,
        uint8 order,
        bool active,
        uint256 createdAt,
        address creator
    ) {
        PolicyInfo memory info = policyInfo[policyId];
        return (info.wasmHash, info.order, info.active, info.createdAt, info.creator);
    }

    /**
     * @dev Check if a policy is in a specific chain
     */
    function isPolicyInChain(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId
    ) external view returns (bool) {
        bytes32[] memory chain = _policyChains[topicId][hook];
        for (uint256 i = 0; i < chain.length; i++) {
            if (chain[i] == policyId) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get chain length for a topic and hook
     */
    function getChainLength(uint256 topicId, bytes4 hook) external view returns (uint256) {
        return _policyChains[topicId][hook].length;
    }

    /**
     * @dev Get all chains info (for debugging/UI)
     */
    function getAllChains() external view returns (
        uint256[] memory topicIds,
        bytes4[] memory hooks,
        bytes32[][] memory chains
    ) {
        uint256 totalChains = 0;

        // Count total chains
        for (uint256 topic = 0; topic <= TOPIC_GRANTS; topic++) {
            for (uint256 h = 0; h < 7; h++) { // 7 hooks
                if (_policyChains[topic][_getHookByIndex(h)].length > 0) {
                    totalChains++;
                }
            }
        }

        topicIds = new uint256[](totalChains);
        hooks = new bytes4[](totalChains);
        chains = new bytes32[][](totalChains);

        uint256 index = 0;
        for (uint256 topic = 0; topic <= TOPIC_GRANTS; topic++) {
            for (uint256 h = 0; h < 7; h++) {
                bytes4 hook = _getHookByIndex(h);
                bytes32[] memory chain = _policyChains[topic][hook];
                if (chain.length > 0) {
                    topicIds[index] = topic;
                    hooks[index] = hook;
                    chains[index] = chain;
                    index++;
                }
            }
        }
    }

    /**
     * @dev Remove policy from chain (internal)
     */
    function _removeFromChain(bytes32[] storage chain, bytes32 policyId) internal returns (bool) {
        for (uint256 i = 0; i < chain.length; i++) {
            if (chain[i] == policyId) {
                // Shift elements left
                for (uint256 j = i; j < chain.length - 1; j++) {
                    chain[j] = chain[j + 1];
                }
                chain.pop();
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get hook by index (internal)
     */
    function _getHookByIndex(uint256 index) internal pure returns (bytes4) {
        if (index == 0) return HOOK_SUBMIT;
        if (index == 1) return HOOK_VOTE_START;
        if (index == 2) return HOOK_TALLY;
        if (index == 3) return HOOK_QUEUE;
        if (index == 4) return HOOK_EXECUTE;
        if (index == 5) return HOOK_RWA_UPDATE;
        if (index == 6) return HOOK_EMERGENCY;
        revert("AdamRegistry: Invalid hook index");
    }

    /**
     * @dev Check if topic is valid
     */
    function _isValidTopic(uint256 topicId) internal pure returns (bool) {
        return topicId <= TOPIC_GRANTS;
    }

    /**
     * @dev Check if hook is valid
     */
    function _isValidHook(bytes4 hook) internal pure returns (bool) {
        return hook == HOOK_SUBMIT ||
               hook == HOOK_VOTE_START ||
               hook == HOOK_TALLY ||
               hook == HOOK_QUEUE ||
               hook == HOOK_EXECUTE ||
               hook == HOOK_RWA_UPDATE ||
               hook == HOOK_EMERGENCY;
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    /**
     * @dev Update analytics
     */
    function _updateAnalytics() internal {
        analytics.lastUpdate = block.timestamp;

        // Recalculate active policies
        uint256 activeCount = 0;
        for (uint256 topic = 0; topic <= TOPIC_GRANTS; topic++) {
            for (uint256 h = 0; h < 7; h++) {
                bytes4 hook = _getHookByIndex(h);
                bytes32[] memory chain = _policyChains[topic][hook];
                for (uint256 i = 0; i < chain.length; i++) {
                    if (policyInfo[chain[i]].active) {
                        activeCount++;
                    }
                }
            }
        }
        analytics.activePolicies = activeCount;
    }
}
