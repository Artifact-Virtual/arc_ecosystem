// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

/**
 * @title IAdamRegistry - ADAM Constitutional Policy Registry Interface
 * @dev Interface for managing constitutional policy chains
 */
interface IAdamRegistry {
    event PolicySet(
        uint256 indexed topicId,
        bytes4 indexed hook,
        bytes32 indexed policyId,
        uint8 order
    );

    event PolicyRemoved(
        uint256 indexed topicId,
        bytes4 indexed hook,
        bytes32 indexed policyId
    );

    /**
     * @dev Set a policy in the chain for a topic and hook
     * @param topicId The governance topic identifier
     * @param hook The hook for policy evaluation
     * @param policyId The unique policy identifier (Wasm hash)
     * @param order The order in the policy chain (0 = first)
     */
    function setPolicy(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId,
        uint8 order
    ) external;

    /**
     * @dev Remove a policy from the chain
     * @param topicId The governance topic identifier
     * @param hook The hook for policy evaluation
     * @param policyId The policy identifier to remove
     */
    function removePolicy(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId
    ) external;

    /**
     * @dev Get the policy chain for a topic and hook
     * @param topicId The governance topic identifier
     * @param hook The hook for policy evaluation
     * @return Array of policy IDs in execution order
     */
    function policyChainOf(uint256 topicId, bytes4 hook) external view returns (bytes32[] memory);

    /**
     * @dev Get policy information
     * @param policyId The policy identifier
     * @return wasmHash Hash of the Wasm constitutional program
     * @return order Order in the policy chain
     * @return active Whether the policy is active
     * @return createdAt Block timestamp when policy was created
     * @return creator Address that created the policy
     */
    function getPolicyInfo(bytes32 policyId) external view returns (
        bytes32 wasmHash,
        uint8 order,
        bool active,
        uint256 createdAt,
        address creator
    );

    /**
     * @dev Check if a policy is in a specific chain
     * @param topicId The topic identifier
     * @param hook The hook identifier
     * @param policyId The policy identifier
     * @return True if policy is in the chain
     */
    function isPolicyInChain(
        uint256 topicId,
        bytes4 hook,
        bytes32 policyId
    ) external view returns (bool);

    /**
     * @dev Get the length of a policy chain
     * @param topicId The topic identifier
     * @param hook The hook identifier
     * @return Length of the policy chain
     */
    function getChainLength(uint256 topicId, bytes4 hook) external view returns (uint256);

    /**
     * @dev Get information about all policy chains
     * @return topicIds Array of topic identifiers
     * @return hooks Array of hook identifiers
     * @return chains Array of policy chains
     */
    function getAllChains() external view returns (
        uint256[] memory topicIds,
        bytes4[] memory hooks,
        bytes32[][] memory chains
    );
}
