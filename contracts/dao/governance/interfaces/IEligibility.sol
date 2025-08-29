// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

/**
 * @title IEligibility - Governance Eligibility Interface
 * @dev Interface for checking governance eligibility and voting power
 */
interface IEligibility {
    /**
     * @dev Check if an address is eligible for a specific topic
     * @param who The address to check
     * @param topicMask The topic mask to check eligibility for
     * @return True if eligible
     */
    function isEligible(address who, uint256 topicMask) external view returns (bool);

    /**
     * @dev Get the weight of an address for a specific topic
     * @param who The address to check
     * @param topicMask The topic mask
     * @return The weight (in WAD format, 1e18 = 1.0)
     */
    function weightOf(address who, uint256 topicMask) external view returns (uint256);

    /**
     * @dev Get the total weight for a topic
     * @param topicMask The topic mask
     * @return The total weight across all eligible addresses
     */
    function totalWeight(uint256 topicMask) external view returns (uint256);

    /**
     * @dev Get eligibility components for an address
     * @param who The address to check
     * @param topicMask The topic mask
     * @return components Array of component weights
     * @return total Total weight
     */
    function getEligibilityComponents(address who, uint256 topicMask) external view returns (
        uint256[] memory components,
        uint256 total
    );

    /**
     * @dev Check if quorum is reached for a topic
     * @param topicMask The topic mask
     * @param votes The number of votes
     * @return True if quorum is reached
     */
    function hasQuorum(uint256 topicMask, uint256 votes) external view returns (bool);

    /**
     * @dev Check if supermajority is reached for a topic
     * @param topicMask The topic mask
     * @param votes The number of votes
     * @return True if supermajority is reached
     */
    function hasSupermajority(uint256 topicMask, uint256 votes) external view returns (bool);

    /**
     * @dev Get topic configuration
     * @param topicId The topic identifier
     * @return quorumWad Quorum threshold in WAD
     * @return supermajorityWad Supermajority threshold in WAD
     * @return votingDays Voting period in days
     * @return timelockDays Timelock period in days
     */
    function getTopicConfig(uint256 topicId) external view returns (
        uint256 quorumWad,
        uint256 supermajorityWad,
        uint256 votingDays,
        uint256 timelockDays
    );
}
