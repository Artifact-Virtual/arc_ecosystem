// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

/**
 * @title IAdamHost - ADAM Constitutional Policy Engine Interface
 * @dev Interface for the ADAM Host contract that evaluates constitutional policies
 */
interface IAdamHost {
    event VerdictEmitted(
        uint256 indexed proposalId,
        bytes4 indexed hook,
        uint8 verdict,
        bytes32 proofHash,
        bytes newDiff
    );

    event Pending2FA(
        uint256 indexed proposalId,
        bytes4 indexed hook,
        bytes32 faHash
    );

    event Satisfied2FA(
        uint256 indexed proposalId,
        bytes4 indexed hook,
        bytes32 faHash
    );

    /**
     * @dev Evaluate constitutional policies for a proposal
     * @param hook The hook being evaluated (onSubmit, onExecute, etc.)
     * @param topicId The governance topic (TREASURY, PARAMS, etc.)
     * @param proposalId The proposal identifier
     * @param proofBundle CBOR-encoded proof bundle with attestations
     * @param diff The proposed parameter changes
     * @return verdict The policy verdict (ALLOW, DENY, AMEND, REQUIRE_2FA)
     * @return newDiff The amended diff if verdict is AMEND
     */
    function evaluate(
        bytes4 hook,
        uint256 topicId,
        uint256 proposalId,
        bytes calldata proofBundle,
        bytes calldata diff
    ) external returns (uint8 verdict, bytes memory newDiff);

    /**
     * @dev Satisfy a 2FA requirement
     * @param proposalId The proposal identifier
     * @param hook The hook that required 2FA
     * @param faHash The 2FA hash to satisfy
     * @param signature The 2FA signature from a different address
     */
    function satisfy2FA(
        uint256 proposalId,
        bytes4 hook,
        bytes32 faHash,
        bytes calldata signature
    ) external;

    /**
     * @dev Check if 2FA is satisfied for a proposal
     * @param proposalId The proposal identifier
     * @param hook The hook to check
     * @return True if 2FA is satisfied
     */
    function is2FASatisfied(uint256 proposalId, bytes4 hook) external view returns (bool);

    /**
     * @dev Emergency pause ADAM evaluation
     */
    function emergencyPause() external;

    /**
     * @dev Emergency unpause ADAM evaluation
     */
    function emergencyUnpause() external;

    /**
     * @dev Update ADAM configuration
     * @param _fuelMax Maximum fuel per evaluation
     * @param _memoryMax Maximum memory per evaluation
     * @param _min2FA Minimum blocks for 2FA
     * @param _max2FA Maximum blocks for 2FA
     */
    function updateConfig(
        uint256 _fuelMax,
        uint256 _memoryMax,
        uint256 _min2FA,
        uint256 _max2FA
    ) external;

    /**
     * @dev Get fuel used for a topic/hook combination
     * @param topicId The topic identifier
     * @param hook The hook identifier
     * @return Fuel used in previous evaluations
     */
    function getFuelUsed(uint256 topicId, bytes4 hook) external view returns (uint256);

    /**
     * @dev Get pending 2FA information
     * @param faHash The 2FA hash
     * @return hash The 2FA hash
     * @return blockNumber Block when 2FA was requested
     * @return requester Address that requested 2FA
     * @return satisfied Whether 2FA is satisfied
     */
    function getPending2FA(bytes32 faHash) external view returns (
        bytes32 hash,
        uint256 blockNumber,
        address requester,
        bool satisfied
    );
}
