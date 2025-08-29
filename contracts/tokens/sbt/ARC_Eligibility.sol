// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./ARC_IdentitySBT.sol";

/**
 * @title ARCx Eligibility - Topic-Based Governance Eligibility
 * @dev Determines governance eligibility based on SBT roles and topic masks
 * @notice Calculates voting power and quorum requirements per topic
 *
 * Features:
 * - Topic-based eligibility checking
 * - Component weight calculation
 * - Quorum and supermajority validation
 * - Integration with Identity SBT
 * - Configurable topic parameters
 */
contract ARC_Eligibility is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");

    // Topics
    uint256 public constant TOPIC_TREASURY = 0;
    uint256 public constant TOPIC_PARAMS = 1;
    uint256 public constant TOPIC_ENERGY = 2;
    uint256 public constant TOPIC_CARBON = 3;
    uint256 public constant TOPIC_GRANTS = 4;

    // Topic configuration
    struct TopicConfig {
        uint256 quorumWad;           // Quorum threshold (WAD)
        uint256 supermajorityWad;    // Supermajority threshold (WAD)
        uint256 votingDays;          // Voting period in days
        uint256 timelockDays;        // Timelock period in days
        bool active;                 // Whether topic is active
    }

    // Component weights for eligibility breakdown
    struct EligibilityComponents {
        uint256 sbtWeight;           // SBT-based weight
        uint256 tokenWeight;         // Token-based weight
        uint256 rwaWeight;           // RWA-based weight
        uint256 reputationWeight;    // Reputation-based weight
    }

    // State variables
    ARC_IdentitySBT public identitySBT;
    mapping(uint256 => TopicConfig) public topicConfigs;
    mapping(address => EligibilityComponents) public eligibilityComponents;

    // Component weight caps (per topic)
    mapping(uint256 => uint256) public sbtWeightCap;
    mapping(uint256 => uint256) public tokenWeightCap;
    mapping(uint256 => uint256) public rwaWeightCap;
    mapping(uint256 => uint256) public reputationWeightCap;

    // Analytics
    struct EligibilityAnalytics {
        uint256 totalEligibilityChecks;
        uint256 averageWeight;
        uint256 highestWeight;
        address highestWeightHolder;
        uint256 lastUpdate;
    }
    EligibilityAnalytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the eligibility contract
     */
    function initialize(address _identitySBT) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CONFIG_ROLE, msg.sender);

        identitySBT = ARC_IdentitySBT(_identitySBT);

        // Initialize default topic configurations
        _initializeDefaultTopics();
    }

    /**
     * @dev Check if address is eligible for a topic
     */
    function isEligible(address who, uint256 topicMask) external view returns (bool) {
        return weightOf(who, topicMask) > 0;
    }

    /**
     * @dev Get weight for address and topic mask
     */
    function weightOf(address who, uint256 topicMask) public view returns (uint256) {
        if (who == address(0)) return 0;

        EligibilityComponents memory components = _calculateComponents(who, topicMask);
        uint256 calculatedWeight = components.sbtWeight +
                             components.tokenWeight +
                             components.rwaWeight +
                             components.reputationWeight;

        return _applyCaps(calculatedWeight, topicMask);
    }

    /**
     * @dev Get eligibility components breakdown
     */
    function getEligibilityComponents(address who, uint256 topicMask) external view returns (
        uint256[] memory components,
        uint256 total
    ) {
        EligibilityComponents memory comps = _calculateComponents(who, topicMask);
        uint256 cappedTotal = _applyCaps(
            comps.sbtWeight + comps.tokenWeight + comps.rwaWeight + comps.reputationWeight,
            topicMask
        );

        components = new uint256[](4);
        components[0] = comps.sbtWeight;
        components[1] = comps.tokenWeight;
        components[2] = comps.rwaWeight;
        components[3] = comps.reputationWeight;

        return (components, cappedTotal);
    }

    /**
     * @dev Get total weight for a topic
     */
    function totalWeight(uint256 topicMask) public view returns (uint256) {
        // Simplified - in production, you'd iterate through all eligible addresses
        // For now, return a reasonable estimate
        return 1000000e18; // 1M total weight estimate
    }

    /**
     * @dev Check if quorum is reached
     */
    function hasQuorum(uint256 topicMask, uint256 votes) external view returns (bool) {
        TopicConfig memory config = topicConfigs[_getPrimaryTopic(topicMask)];
        if (!config.active) return false;

        uint256 totalEligible = totalWeight(topicMask);
        if (totalEligible == 0) return false;

        uint256 quorumRequired = (totalEligible * config.quorumWad) / 1e18;
        return votes >= quorumRequired;
    }

    /**
     * @dev Check if supermajority is reached
     */
    function hasSupermajority(uint256 topicMask, uint256 votes) external view returns (bool) {
        TopicConfig memory config = topicConfigs[_getPrimaryTopic(topicMask)];
        if (!config.active) return false;

        uint256 totalEligible = totalWeight(topicMask);
        if (totalEligible == 0) return false;

        uint256 supermajorityRequired = (totalEligible * config.supermajorityWad) / 1e18;
        return votes >= supermajorityRequired;
    }

    /**
     * @dev Get topic configuration
     */
    function getTopicConfig(uint256 topicId) external view returns (
        uint256 quorumWad,
        uint256 supermajorityWad,
        uint256 votingDays,
        uint256 timelockDays
    ) {
        TopicConfig memory config = topicConfigs[topicId];
        return (
            config.quorumWad,
            config.supermajorityWad,
            config.votingDays,
            config.timelockDays
        );
    }

    /**
     * @dev Update topic configuration
     */
    function updateTopicConfig(
        uint256 topicId,
        uint256 quorumWad,
        uint256 supermajorityWad,
        uint256 votingDays,
        uint256 timelockDays
    ) external onlyRole(CONFIG_ROLE) {
        require(quorumWad <= 1e18, "ARC_Eligibility: Invalid quorum");
        require(supermajorityWad <= 1e18, "ARC_Eligibility: Invalid supermajority");
        require(supermajorityWad >= quorumWad, "ARC_Eligibility: Supermajority < quorum");

        topicConfigs[topicId] = TopicConfig({
            quorumWad: quorumWad,
            supermajorityWad: supermajorityWad,
            votingDays: votingDays,
            timelockDays: timelockDays,
            active: true
        });

        emit TopicConfigUpdated(topicId, quorumWad, supermajorityWad, votingDays, timelockDays);
    }

    /**
     * @dev Set component weight caps
     */
    function setWeightCaps(
        uint256 topicMask,
        uint256 _sbtCap,
        uint256 _tokenCap,
        uint256 _rwaCap,
        uint256 _reputationCap
    ) external onlyRole(CONFIG_ROLE) {
        sbtWeightCap[topicMask] = _sbtCap;
        tokenWeightCap[topicMask] = _tokenCap;
        rwaWeightCap[topicMask] = _rwaCap;
        reputationWeightCap[topicMask] = _reputationCap;

        emit WeightCapsSet(topicMask, _sbtCap, _tokenCap, _rwaCap, _reputationCap);
    }

    /**
     * @dev Calculate eligibility components
     */
    function _calculateComponents(address who, uint256 topicMask) internal view returns (EligibilityComponents memory) {
        // SBT-based weight (primary component)
        uint256 sbtWeight = identitySBT.weightOfForTopic(who, topicMask);

        // Token-based weight (secondary component)
        uint256 tokenWeight = _calculateTokenWeight(who, topicMask);

        // RWA-based weight (specialized component)
        uint256 rwaWeight = _calculateRWAWeight(who, topicMask);

        // Reputation-based weight (derived component)
        uint256 reputationWeight = _calculateReputationWeight(who, topicMask);

        return EligibilityComponents({
            sbtWeight: sbtWeight,
            tokenWeight: tokenWeight,
            rwaWeight: rwaWeight,
            reputationWeight: reputationWeight
        });
    }

    /**
     * @dev Apply weight caps
     */
    function _applyCaps(uint256 weight, uint256 topicMask) internal view returns (uint256) {
        uint256 cappedWeight = weight;

        if (sbtWeightCap[topicMask] > 0) {
            // Apply SBT cap as percentage of total
            cappedWeight = (cappedWeight * sbtWeightCap[topicMask]) / 1e18;
        }

        // Additional caps can be applied here for other components

        return cappedWeight;
    }

    /**
     * @dev Calculate token-based weight
     */
    function _calculateTokenWeight(address who, uint256 topicMask) internal view returns (uint256) {
        // Simplified token weight calculation
        // In production, this would check ARCx/ARCs token balances
        return 0.1e18; // 0.1 base weight
    }

    /**
     * @dev Calculate RWA-based weight
     */
    function _calculateRWAWeight(address who, uint256 topicMask) internal view returns (uint256) {
        // RWA-specific weight calculation
        // In production, this would check RWA holdings/stakes
        if (_isRWATopic(topicMask)) {
            return 0.2e18; // 0.2 for RWA topics
        }
        return 0;
    }

    /**
     * @dev Calculate reputation-based weight
     */
    function _calculateReputationWeight(address who, uint256 topicMask) internal view returns (uint256) {
        // Reputation-based weight (activity, tenure, etc.)
        // Simplified for now
        return 0.05e18; // 0.05 base reputation weight
    }

    /**
     * @dev Check if topic mask includes RWA topics
     */
    function _isRWATopic(uint256 topicMask) internal pure returns (bool) {
        return (topicMask & (1 << TOPIC_ENERGY)) != 0 ||
               (topicMask & (1 << TOPIC_CARBON)) != 0;
    }

    /**
     * @dev Get primary topic from mask
     */
    function _getPrimaryTopic(uint256 topicMask) internal pure returns (uint256) {
        // Return the lowest set bit (primary topic)
        for (uint256 i = 0; i < 5; i++) {
            if ((topicMask & (1 << i)) != 0) {
                return i;
            }
        }
        return 0;
    }

    /**
     * @dev Initialize default topic configurations
     */
    function _initializeDefaultTopics() internal {
        // Treasury topic
        topicConfigs[TOPIC_TREASURY] = TopicConfig({
            quorumWad: 0.1e18,        // 10%
            supermajorityWad: 0.66e18, // 66%
            votingDays: 7,
            timelockDays: 2,
            active: true
        });

        // Parameter topic
        topicConfigs[TOPIC_PARAMS] = TopicConfig({
            quorumWad: 0.15e18,       // 15%
            supermajorityWad: 0.75e18, // 75%
            votingDays: 14,
            timelockDays: 7,
            active: true
        });

        // Energy RWA topic
        topicConfigs[TOPIC_ENERGY] = TopicConfig({
            quorumWad: 0.2e18,        // 20%
            supermajorityWad: 0.8e18,  // 80%
            votingDays: 10,
            timelockDays: 5,
            active: true
        });

        // Carbon RWA topic
        topicConfigs[TOPIC_CARBON] = TopicConfig({
            quorumWad: 0.2e18,        // 20%
            supermajorityWad: 0.8e18,  // 80%
            votingDays: 10,
            timelockDays: 5,
            active: true
        });

        // Grants topic
        topicConfigs[TOPIC_GRANTS] = TopicConfig({
            quorumWad: 0.05e18,       // 5%
            supermajorityWad: 0.5e18,  // 50%
            votingDays: 21,
            timelockDays: 3,
            active: true
        });

        // Set default weight caps
        sbtWeightCap[uint256(1 << TOPIC_TREASURY)] = 0.7e18;  // 70%
        sbtWeightCap[uint256(1 << TOPIC_PARAMS)] = 0.8e18;    // 80%
        sbtWeightCap[uint256(1 << TOPIC_ENERGY)] = 0.9e18;    // 90%
        sbtWeightCap[uint256(1 << TOPIC_CARBON)] = 0.9e18;    // 90%
        sbtWeightCap[uint256(1 << TOPIC_GRANTS)] = 0.6e18;    // 60%
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    // Events
    event TopicConfigUpdated(
        uint256 indexed topicId,
        uint256 quorumWad,
        uint256 supermajorityWad,
        uint256 votingDays,
        uint256 timelockDays
    );

    event WeightCapsSet(
        uint256 indexed topicMask,
        uint256 sbtCap,
        uint256 tokenCap,
        uint256 rwaCap,
        uint256 reputationCap
    );
}
