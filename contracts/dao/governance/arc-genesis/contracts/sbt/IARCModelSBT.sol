// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IARCModelSBT
 * @notice Interface for soulbound model identity tokens
 * @dev Non-transferable tokens encoding model class, version, and lineage
 * 
 * The SBT layer is how GLADIUS (and other models) come to life:
 * - Each model gets a unique soulbound identity
 * - Tokens encode class, version, and lineage
 * - Non-transferable by design
 * - Optional revocation for compliance
 */
interface IARCModelSBT {
    /**
     * @notice SBT metadata structure
     */
    struct SBTMetadata {
        bytes32 modelId;        // Reference to registry model ID
        uint8 classId;          // Model class
        uint256 version;        // Model version
        bytes32 lineageHash;    // Lineage hash
        uint256 issuedAt;       // When the SBT was issued
        bool revoked;           // Whether the SBT is revoked
    }
    
    /**
     * @notice Emitted when an SBT is issued
     */
    event SBTIssued(
        address indexed owner,
        uint256 indexed tokenId,
        bytes32 indexed modelId,
        uint8 classId
    );
    
    /**
     * @notice Emitted when an SBT is revoked
     */
    event SBTRevoked(uint256 indexed tokenId, string reason);
    
    /**
     * @notice Emitted when transfer is attempted (always fails)
     */
    event TransferAttempted(address indexed from, address indexed to, uint256 indexed tokenId);
    
    /**
     * @notice Issue a soulbound token
     * @param to Address to receive the SBT
     * @param modelId Model ID from registry
     * @param classId Model class
     * @param version Model version
     * @param lineageHash Lineage hash
     * @return tokenId The issued token ID
     */
    function issueSBT(
        address to,
        bytes32 modelId,
        uint8 classId,
        uint256 version,
        bytes32 lineageHash
    ) external returns (uint256 tokenId);
    
    /**
     * @notice Revoke an SBT
     * @param tokenId The token to revoke
     * @param reason Reason for revocation
     */
    function revokeSBT(uint256 tokenId, string calldata reason) external;
    
    /**
     * @notice Get SBT metadata
     * @param tokenId The token ID
     * @return SBTMetadata The metadata
     */
    function getSBTMetadata(uint256 tokenId) external view returns (SBTMetadata memory);
    
    /**
     * @notice Check if an SBT is revoked
     * @param tokenId The token ID
     * @return bool True if revoked
     */
    function isRevoked(uint256 tokenId) external view returns (bool);
    
    /**
     * @notice Get SBTs owned by an address
     * @param owner The owner address
     * @return uint256[] Array of token IDs
     */
    function getSBTsByOwner(address owner) external view returns (uint256[] memory);
    
    /**
     * @notice Check if an address owns an SBT for a specific model
     * @param owner The owner address
     * @param modelId The model ID
     * @return bool True if owns
     */
    function hasSBTForModel(address owner, bytes32 modelId) external view returns (bool);
}
