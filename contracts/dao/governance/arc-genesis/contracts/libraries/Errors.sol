// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Errors
 * @notice Centralized error definitions for the ARC Genesis system
 * @dev Used across ARCGenesis, ARCModelRegistry, and ARCModelSBT
 * 
 * Centralizing errors helps:
 * - Reduce contract size through error code reuse
 * - Maintain consistency across the system
 * - Simplify auditing and testing
 */
library Errors {
    // Genesis errors
    error GenesisAlreadyInitialized();
    error GenesisNotInitialized();
    error InvalidGenesisHash();
    error InvalidInvariantHash();
    
    // Model class errors
    error InvalidModelClass(uint8 classId);
    error ModelClassNotEnabled(uint8 classId);
    error ModelClassAlreadyEnabled(uint8 classId);
    
    // Registry errors
    error ModelAlreadyRegistered(bytes32 modelId);
    error ModelNotRegistered(bytes32 modelId);
    error ModelNotCompliant(bytes32 modelId);
    error ModelFrozen(bytes32 modelId);
    error ModelRevoked(bytes32 modelId);
    error InvalidModelData();
    
    // SBT errors
    error SBTAlreadyIssued(address owner);
    error SBTNotIssued(address owner);
    error SBTTransferNotAllowed();
    error SBTRevoked(uint256 tokenId);
    error InvalidTokenId(uint256 tokenId);
    error InvalidOwner(address owner);
    
    // Authorization errors
    error Unauthorized(address caller);
    error NotGovernance(address caller);
    error NotIssuer(address caller);
    
    // Hash computation errors
    error InvalidHashInput();
    error HashMismatch(bytes32 expected, bytes32 actual);
    
    // General errors
    error ZeroAddress();
    error InvalidParameter(string param);
    error OperationFailed(string reason);
}
