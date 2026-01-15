// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../libraries/Errors.sol";

/**
 * @title Immutable
 * @notice Base contract for immutable root configurations
 * @dev Provides initialization pattern ensuring data cannot be changed after deployment
 * 
 * This contract implements a simple but effective immutability pattern:
 * - Single initialization allowed
 * - No upgrade mechanism
 * - No admin functions to modify state
 * 
 * Used by ARCGenesis to anchor fundamental protocol constants.
 */
abstract contract Immutable {
    bool private _initialized;
    
    /**
     * @notice Emitted when the contract is initialized
     */
    event Initialized();
    
    /**
     * @notice Modifier to ensure function can only be called during initialization
     */
    modifier initializer() {
        if (_initialized) {
            revert Errors.GenesisAlreadyInitialized();
        }
        _;
        _initialized = true;
        emit Initialized();
    }
    
    /**
     * @notice Modifier to ensure contract has been initialized
     */
    modifier whenInitialized() {
        if (!_initialized) {
            revert Errors.GenesisNotInitialized();
        }
        _;
    }
    
    /**
     * @notice Check if contract has been initialized
     * @return bool True if initialized
     */
    function isInitialized() public view returns (bool) {
        return _initialized;
    }
}
