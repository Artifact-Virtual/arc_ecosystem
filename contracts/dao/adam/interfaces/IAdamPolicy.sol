// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

/**
 * @title IAdamPolicy - Constitutional Policy Interface
 * @dev Interface for Wasm-backed constitutional policies
 * @notice All constitutional programs must implement this interface
 */
interface IAdamPolicy {
    /**
     * @dev Get the Wasm hash for this policy
     * @return bytes32 Hash of the Wasm constitutional program
     */
    function wasmHash() external view returns (bytes32);

    /**
     * @dev Evaluate the policy against a context
     * @param ctx Context data for policy evaluation
     * @return verdict Policy verdict (0=ALLOW, 1=DENY, 2=AMEND, 3=REQUIRE_2FA)
     * @return data Additional data (e.g., amended diff for AMEND verdict)
     */
    function evaluate(bytes calldata ctx) external view returns (uint8 verdict, bytes memory data);
}
