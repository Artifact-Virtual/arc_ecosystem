// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../dao/governance/interfaces/IEligibility.sol";

/**
 * @title MockEligibility - Mock contract for testing
 * @dev Simple mock for eligibility checking in tests
 */
contract MockEligibility is IEligibility {
    mapping(address => bool) private _eligible;
    mapping(address => uint256) private _votingPower;

    /**
     * @dev Set eligibility for an address
     */
    function setEligible(address account, bool eligible) external {
        _eligible[account] = eligible;
    }

    /**
     * @dev Set voting power for an address
     */
    function setVotingPower(address account, uint256 power) external {
        _votingPower[account] = power;
    }

    /**
     * @dev Check if address is eligible
     */
    function isEligible(address account) external view override returns (bool) {
        return _eligible[account];
    }

    /**
     * @dev Get voting power for address
     */
    function getVotingPower(address account) external view override returns (uint256) {
        return _votingPower[account];
    }
}
