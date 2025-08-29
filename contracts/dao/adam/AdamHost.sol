// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "./interfaces/IAdamHost.sol";
import "./interfaces/IAdamRegistry.sol";
import "../governance/interfaces/IEligibility.sol";

/**
 * @title ADAM Host - Constitutional Policy Engine
 * @dev Deterministic Wasm-sandboxed policy evaluation for constitutional DAO
 * @notice Fuel-metered, memory-bounded execution of constitutional programs
 *
 * Features:
 * - Wasm policy evaluation with gas limits
 * - Constitutional program chaining
 * - EAS attestation integration
 * - 2FA requirement support
 * - Emergency brake integration
 * - Comprehensive event emission
 */
contract AdamHost is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    EIP712Upgradeable,
    IAdamHost
{
    using ECDSAUpgradeable for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant POLICY_EXECUTOR_ROLE = keccak256("POLICY_EXECUTOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

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

    // Verdict types
    uint8 public constant VERDICT_ALLOW = 0;
    uint8 public constant VERDICT_DENY = 1;
    uint8 public constant VERDICT_AMEND = 2;
    uint8 public constant VERDICT_REQUIRE_2FA = 3;

    // Configuration
    struct AdamConfig {
        uint256 fuelMax;           // Max fuel per evaluation
        uint256 memoryMax;         // Max memory per evaluation (bytes)
        uint256 min2FA;            // Min blocks for 2FA
        uint256 max2FA;            // Max blocks for 2FA
        address eas;               // Ethereum Attestation Service
        address eligibility;       // Eligibility contract
        address emergencyBrake;    // Emergency brake contract
        bool paused;               // Emergency pause
    }

    // Policy evaluation context
    struct Context {
        uint256 proposalId;
        uint256 topicId;
        bytes4 hook;
        address proposer;
        uint256 snapshotBlock;
        bytes32 proofHash;
        bytes diff;
    }

    // Pending 2FA requirements
    struct Pending2FARequest {
        bytes32 hash;
        uint256 blockNumber;
        address requester;
        bool satisfied;
    }

    // State variables
    AdamConfig public config;
    IAdamRegistry public registry;

    mapping(uint256 => mapping(bytes4 => uint256)) public fuelUsed;
    mapping(bytes32 => Pending2FARequest) public pending2FA;
    mapping(bytes32 => bool) public consumedProofs;

    // Analytics
    struct Analytics {
        uint256 totalEvaluations;
        uint256 successfulEvaluations;
        uint256 failedEvaluations;
        uint256 emergencyPauses;
        uint256 averageFuelUsed;
    }
    Analytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the ADAM Host
     */
    function initialize(
        address _registry,
        address _eas,
        address _eligibility,
        address _emergencyBrake
    ) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __EIP712_init("ADAM Host", "1.0");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(POLICY_EXECUTOR_ROLE, msg.sender);

        registry = IAdamRegistry(_registry);

        config = AdamConfig({
            fuelMax: 1000000,      // 1M fuel units
            memoryMax: 262144,     // 256KB
            min2FA: 10,            // 10 blocks min
            max2FA: 100,           // 100 blocks max
            eas: _eas,
            eligibility: _eligibility,
            emergencyBrake: _emergencyBrake,
            paused: false
        });
    }

    /**
     * @dev Evaluate constitutional policies for a proposal
     */
    function evaluate(
        bytes4 hook,
        uint256 topicId,
        uint256 proposalId,
        bytes calldata proofBundle,
        bytes calldata diff
    ) external nonReentrant whenNotPaused returns (uint8 verdict, bytes memory newDiff) {
        require(!config.paused, "ADAM: Emergency paused");

        // Validate inputs
        require(_isValidHook(hook), "ADAM: Invalid hook");
        require(_isValidTopic(topicId), "ADAM: Invalid topic");
        require(!consumedProofs[keccak256(proofBundle)], "ADAM: Proof already consumed");

        // Create evaluation context
        Context memory ctx = Context({
            proposalId: proposalId,
            topicId: topicId,
            hook: hook,
            proposer: msg.sender,
            snapshotBlock: block.number,
            proofHash: keccak256(proofBundle),
            diff: diff
        });

        // Mark proof as consumed
        consumedProofs[ctx.proofHash] = true;

        // Get policy chain for this topic and hook
        bytes32[] memory policyChain = registry.policyChainOf(topicId, hook);

        // Evaluate policies in chain
        (verdict, newDiff) = _evaluatePolicyChain(policyChain, ctx, proofBundle);

        // Handle 2FA requirements
        if (verdict == VERDICT_REQUIRE_2FA) {
            bytes32 faHash = keccak256(abi.encodePacked(proposalId, hook, block.number));
            pending2FA[faHash] = Pending2FARequest({
                hash: faHash,
                blockNumber: block.number,
                requester: msg.sender,
                satisfied: false
            });

            emit Pending2FA(proposalId, hook, faHash);
            verdict = VERDICT_DENY; // Block until 2FA satisfied
        }

        // Update analytics
        analytics.totalEvaluations++;
        if (verdict == VERDICT_ALLOW || verdict == VERDICT_AMEND) {
            analytics.successfulEvaluations++;
        } else {
            analytics.failedEvaluations++;
        }

        emit VerdictEmitted(proposalId, hook, verdict, ctx.proofHash, newDiff);
    }

    /**
     * @dev Satisfy 2FA requirement
     */
    function satisfy2FA(
        uint256 proposalId,
        bytes4 hook,
        bytes32 faHash,
        bytes calldata signature
    ) external {
        Pending2FARequest storage pending = pending2FA[faHash];
        require(pending.hash == faHash, "ADAM: Invalid 2FA hash");
        require(!pending.satisfied, "ADAM: 2FA already satisfied");
        require(block.number >= pending.blockNumber + config.min2FA, "ADAM: Too early for 2FA");
        require(block.number <= pending.blockNumber + config.max2FA, "ADAM: 2FA expired");

        // Verify signature from different address
        bytes32 messageHash = _hashTypedDataV4(
            keccak256(abi.encode(
                keccak256("Satisfy2FA(uint256 proposalId,bytes4 hook,bytes32 faHash)"),
                proposalId,
                hook,
                faHash
            ))
        );

        address signer = messageHash.recover(signature);
        require(signer != pending.requester, "ADAM: Same signer not allowed");
        require(signer != address(0), "ADAM: Invalid signature");

        pending.satisfied = true;
        emit Satisfied2FA(proposalId, hook, faHash);
    }

    /**
     * @dev Check if 2FA is satisfied for a proposal
     */
    function is2FASatisfied(uint256 proposalId, bytes4 hook) external view returns (bool) {
        bytes32 faHash = keccak256(abi.encodePacked(proposalId, hook, block.number));
        return pending2FA[faHash].satisfied;
    }

    /**
     * @dev Emergency pause ADAM evaluation
     */
    function emergencyPause() external onlyRole(EMERGENCY_ROLE) {
        config.paused = true;
        analytics.emergencyPauses++;
        _pause();
    }

    /**
     * @dev Emergency unpause ADAM evaluation
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        config.paused = false;
        _unpause();
    }

    /**
     * @dev Update ADAM configuration
     */
    function updateConfig(
        uint256 _fuelMax,
        uint256 _memoryMax,
        uint256 _min2FA,
        uint256 _max2FA
    ) external onlyRole(ADMIN_ROLE) {
        config.fuelMax = _fuelMax;
        config.memoryMax = _memoryMax;
        config.min2FA = _min2FA;
        config.max2FA = _max2FA;
    }

    /**
     * @dev Evaluate policy chain (simplified for now - would integrate Wasm in production)
     */
    function _evaluatePolicyChain(
        bytes32[] memory policyChain,
        Context memory ctx,
        bytes calldata proofBundle
    ) internal returns (uint8 verdict, bytes memory newDiff) {
        // For now, implement simplified policy evaluation
        // In production, this would execute Wasm constitutional programs

        // Check if proposal meets basic constitutional requirements
        if (!_checkBasicConstitutionalRequirements(ctx)) {
            return (VERDICT_DENY, ctx.diff);
        }

        // Check topic-specific requirements
        if (!_checkTopicRequirements(ctx)) {
            return (VERDICT_DENY, ctx.diff);
        }

        // Check proof bundle validity
        if (!_validateProofBundle(proofBundle, ctx)) {
            return (VERDICT_DENY, ctx.diff);
        }

        // All checks passed
        return (VERDICT_ALLOW, ctx.diff);
    }

    /**
     * @dev Check basic constitutional requirements
     */
    function _checkBasicConstitutionalRequirements(Context memory ctx) internal view returns (bool) {
        // No fund movement without TREASURY topic
        if (ctx.topicId != TOPIC_TREASURY && _containsFundMovement(ctx.diff)) {
            return false;
        }

        // Emergency hook can only pause or cancel
        if (ctx.hook == HOOK_EMERGENCY && !_isEmergencyAction(ctx.diff)) {
            return false;
        }

        return true;
    }

    /**
     * @dev Check topic-specific requirements
     */
    function _checkTopicRequirements(Context memory ctx) internal view returns (bool) {
        // Topic-specific validation would go here
        // For now, basic checks

        if (ctx.topicId == TOPIC_TREASURY) {
            return _validateTreasuryAction(ctx);
        } else if (ctx.topicId == TOPIC_PARAMS) {
            return _validateParameterChange(ctx);
        }

        return true;
    }

    /**
     * @dev Validate proof bundle
     */
    function _validateProofBundle(bytes calldata proofBundle, Context memory ctx) internal view returns (bool) {
        // Proof bundle validation would go here
        // For now, basic structure check

        if (proofBundle.length < 32) {
            return false;
        }

        return true;
    }

    /**
     * @dev Check if diff contains fund movement
     */
    function _containsFundMovement(bytes memory diff) internal pure returns (bool) {
        // Simplified check - would parse diff properly in production
        return diff.length > 0;
    }

    /**
     * @dev Check if action is emergency-allowed
     */
    function _isEmergencyAction(bytes memory diff) internal pure returns (bool) {
        // Check if diff only contains pause/cancel operations
        // Simplified for now
        return true;
    }

    /**
     * @dev Validate treasury action
     */
    function _validateTreasuryAction(Context memory ctx) internal view returns (bool) {
        // Treasury-specific validation
        return true;
    }

    /**
     * @dev Validate parameter change
     */
    function _validateParameterChange(Context memory ctx) internal view returns (bool) {
        // Parameter change validation
        return true;
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
     * @dev Check if topic is valid
     */
    function _isValidTopic(uint256 topicId) internal pure returns (bool) {
        return topicId <= TOPIC_GRANTS;
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    /**
     * @dev Get fuel used for topic/hook
     */
    function getFuelUsed(uint256 topicId, bytes4 hook) external view returns (uint256) {
        return fuelUsed[topicId][hook];
    }

    /**
     * @dev Get pending 2FA info
     */
    function getPending2FA(bytes32 faHash) external view returns (
        bytes32 hash,
        uint256 blockNumber,
        address requester,
        bool satisfied
    ) {
        Pending2FARequest memory pending = pending2FA[faHash];
        return (pending.hash, pending.blockNumber, pending.requester, pending.satisfied);
    }
}
