// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "../adam/interfaces/IAdamHost.sol";

/**
 * @title AdamGovernorIntegration
 * @dev Integration module for connecting ADAM constitutional engine with ARCGovernor
 * @notice This contract serves as an adapter between governance and constitutional validation
 */
abstract contract AdamGovernorIntegration {
    // ADAM Host reference
    IAdamHost public adamHost;
    
    // Enable/disable ADAM validation
    bool public adamEnabled;
    
    // Mapping of proposal categories to topics
    mapping(uint8 => uint256) public categoryToTopic;
    
    // Events
    event AdamValidationEnabled(bool enabled);
    event AdamHostUpdated(address indexed newHost);
    event CategoryTopicMapped(uint8 indexed category, uint256 indexed topicId);
    event ProposalValidatedByAdam(
        uint256 indexed proposalId,
        bytes4 hook,
        uint8 verdict,
        bytes newDiff
    );

    /**
     * @dev Initialize ADAM integration
     */
    function _initializeAdamIntegration(address _adamHost) internal {
        adamHost = IAdamHost(_adamHost);
        adamEnabled = _adamHost != address(0);
        
        // Map proposal categories to ADAM topics
        _mapCategoryToTopic(0, 0); // Treasury -> TREASURY
        _mapCategoryToTopic(1, 1); // Protocol -> PARAMS
        _mapCategoryToTopic(3, 1); // Emergency -> PARAMS (or special emergency topic)
        _mapCategoryToTopic(6, 4); // Grant -> GRANTS
    }

    /**
     * @dev Validate proposal with ADAM at submission
     */
    function _validateWithAdamOnSubmit(
        uint256 proposalId,
        uint8 category,
        bytes calldata proofBundle,
        bytes calldata diff
    ) internal returns (bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return true; // Skip validation if ADAM not enabled
        }

        uint256 topicId = categoryToTopic[category];
        bytes4 hook = adamHost.HOOK_SUBMIT();
        
        try adamHost.evaluate(hook, topicId, proposalId, proofBundle, diff) returns (
            uint8 verdict,
            bytes memory newDiff
        ) {
            emit ProposalValidatedByAdam(proposalId, hook, verdict, newDiff);
            
            // ALLOW (0) or AMEND (2) are acceptable
            return verdict == 0 || verdict == 2;
        } catch {
            // If ADAM evaluation fails, reject proposal
            return false;
        }
    }

    /**
     * @dev Validate proposal with ADAM at vote start
     */
    function _validateWithAdamOnVoteStart(
        uint256 proposalId,
        uint8 category,
        bytes calldata proofBundle,
        bytes calldata diff
    ) internal returns (bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return true;
        }

        uint256 topicId = categoryToTopic[category];
        bytes4 hook = adamHost.HOOK_VOTE_START();
        
        try adamHost.evaluate(hook, topicId, proposalId, proofBundle, diff) returns (
            uint8 verdict,
            bytes memory newDiff
        ) {
            emit ProposalValidatedByAdam(proposalId, hook, verdict, newDiff);
            return verdict == 0 || verdict == 2;
        } catch {
            return false;
        }
    }

    /**
     * @dev Validate proposal with ADAM at tally
     */
    function _validateWithAdamOnTally(
        uint256 proposalId,
        uint8 category,
        bytes calldata proofBundle,
        bytes calldata diff
    ) internal returns (bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return true;
        }

        uint256 topicId = categoryToTopic[category];
        bytes4 hook = adamHost.HOOK_TALLY();
        
        try adamHost.evaluate(hook, topicId, proposalId, proofBundle, diff) returns (
            uint8 verdict,
            bytes memory newDiff
        ) {
            emit ProposalValidatedByAdam(proposalId, hook, verdict, newDiff);
            return verdict == 0 || verdict == 2;
        } catch {
            return false;
        }
    }

    /**
     * @dev Validate proposal with ADAM at queue
     */
    function _validateWithAdamOnQueue(
        uint256 proposalId,
        uint8 category,
        bytes calldata proofBundle,
        bytes calldata diff
    ) internal returns (bool, bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return (true, false);
        }

        uint256 topicId = categoryToTopic[category];
        bytes4 hook = adamHost.HOOK_QUEUE();
        
        try adamHost.evaluate(hook, topicId, proposalId, proofBundle, diff) returns (
            uint8 verdict,
            bytes memory newDiff
        ) {
            emit ProposalValidatedByAdam(proposalId, hook, verdict, newDiff);
            
            // Check if 2FA is required
            if (verdict == 3) { // REQUIRE_2FA
                return (false, true); // Not approved yet, needs 2FA
            }
            
            return (verdict == 0 || verdict == 2, false);
        } catch {
            return (false, false);
        }
    }

    /**
     * @dev Validate proposal with ADAM at execution
     */
    function _validateWithAdamOnExecute(
        uint256 proposalId,
        uint8 category,
        bytes calldata proofBundle,
        bytes calldata diff
    ) internal returns (bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return true;
        }

        uint256 topicId = categoryToTopic[category];
        bytes4 hook = adamHost.HOOK_EXECUTE();
        
        try adamHost.evaluate(hook, topicId, proposalId, proofBundle, diff) returns (
            uint8 verdict,
            bytes memory newDiff
        ) {
            emit ProposalValidatedByAdam(proposalId, hook, verdict, newDiff);
            return verdict == 0 || verdict == 2;
        } catch {
            return false;
        }
    }

    /**
     * @dev Check if 2FA is satisfied for a proposal
     */
    function _checkAdam2FASatisfied(uint256 proposalId, bytes4 hook) internal view returns (bool) {
        if (!adamEnabled || address(adamHost) == address(0)) {
            return true;
        }
        
        return adamHost.is2FASatisfied(proposalId, hook);
    }

    /**
     * @dev Map category to topic
     */
    function _mapCategoryToTopic(uint8 category, uint256 topicId) internal {
        categoryToTopic[category] = topicId;
        emit CategoryTopicMapped(category, topicId);
    }

    /**
     * @dev Enable/disable ADAM validation (admin only)
     */
    function _setAdamEnabled(bool enabled) internal {
        adamEnabled = enabled;
        emit AdamValidationEnabled(enabled);
    }

    /**
     * @dev Update ADAM host address (admin only)
     */
    function _setAdamHost(address newHost) internal {
        require(newHost != address(0), "AdamIntegration: zero address");
        adamHost = IAdamHost(newHost);
        adamEnabled = true;
        emit AdamHostUpdated(newHost);
    }

    /**
     * @dev Get ADAM validation status
     */
    function getAdamStatus() external view returns (
        bool enabled,
        address host,
        uint256[] memory topicMappings
    ) {
        enabled = adamEnabled;
        host = address(adamHost);
        
        // Return topic mappings for common categories
        topicMappings = new uint256[](7);
        for (uint8 i = 0; i < 7; i++) {
            topicMappings[i] = categoryToTopic[i];
        }
    }
}
