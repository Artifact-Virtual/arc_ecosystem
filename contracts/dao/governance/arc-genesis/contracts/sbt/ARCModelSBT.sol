// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./IARCModelSBT.sol";
import "../registry/IARCModelRegistry.sol";
import "../libraries/ModelClass.sol";
import "../libraries/Errors.sol";

/**
 * @title ARCModelSBT
 * @notice Soulbound token identity layer for AI models
 * @dev ERC721-based non-transferable tokens (ERC-5192 compliant)
 * 
 * RESPONSIBILITIES:
 * - Issue soulbound identity to models
 * - Encode class, version, lineage on-chain
 * - Enforce non-transferability
 * - Support revocation for compliance
 * 
 * This is how GLADIUS comes to life - each model gets a unique,
 * non-transferable identity token that proves its existence and
 * encodes its fundamental properties.
 * 
 * @custom:security-contact security@arcexchange.io
 */
contract ARCModelSBT is
    IARCModelSBT,
    Initializable,
    ERC721Upgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    // Roles
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");
    
    // Reference to Registry contract
    IARCModelRegistry public registry;
    
    // Token ID counter
    uint256 private _nextTokenId;
    
    // Token metadata
    mapping(uint256 => SBTMetadata) private _metadata;
    
    // Owner => token IDs
    mapping(address => uint256[]) private _ownedTokens;
    
    // ModelId => tokenId (for uniqueness check)
    mapping(bytes32 => uint256) private _modelToToken;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @notice Initialize the SBT contract
     * @param registry_ Address of the ARCModelRegistry contract
     * @param governance Address to receive admin roles
     * @param name_ Token name
     * @param symbol_ Token symbol
     */
    function initialize(
        address registry_,
        address governance,
        string memory name_,
        string memory symbol_
    ) external initializer {
        if (registry_ == address(0) || governance == address(0)) {
            revert Errors.ZeroAddress();
        }
        
        __ERC721_init(name_, symbol_);
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        
        registry = IARCModelRegistry(registry_);
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, governance);
        _grantRole(ISSUER_ROLE, governance);
        _grantRole(REVOKER_ROLE, governance);
        
        _nextTokenId = 1; // Start from 1
    }
    
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
    ) external override onlyRole(ISSUER_ROLE) whenNotPaused returns (uint256 tokenId) {
        // Validate recipient
        if (to == address(0)) {
            revert Errors.InvalidOwner(to);
        }
        
        // Validate model class
        if (!ModelClass.isValid(classId)) {
            revert Errors.InvalidModelClass(classId);
        }
        
        // Verify model exists in registry and is active
        if (!registry.isModelActive(modelId)) {
            revert Errors.ModelNotRegistered(modelId);
        }
        
        // Check if SBT already issued for this model
        if (_modelToToken[modelId] != 0) {
            revert Errors.SBTAlreadyIssued(to);
        }
        
        // Mint token
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        // Store metadata
        _metadata[tokenId] = SBTMetadata({
            modelId: modelId,
            classId: classId,
            version: version,
            lineageHash: lineageHash,
            issuedAt: block.timestamp,
            revoked: false
        });
        
        // Update indices
        _ownedTokens[to].push(tokenId);
        _modelToToken[modelId] = tokenId;
        
        emit SBTIssued(to, tokenId, modelId, classId);
        
        return tokenId;
    }
    
    /**
     * @notice Revoke an SBT
     * @param tokenId The token to revoke
     * @param reason Reason for revocation
     */
    function revokeSBT(
        uint256 tokenId,
        string calldata reason
    ) external override onlyRole(REVOKER_ROLE) {
        if (!_exists(tokenId)) {
            revert Errors.InvalidTokenId(tokenId);
        }
        
        SBTMetadata storage metadata = _metadata[tokenId];
        
        if (metadata.revoked) {
            revert Errors.SBTRevoked(tokenId);
        }
        
        metadata.revoked = true;
        
        emit SBTRevoked(tokenId, reason);
    }
    
    /**
     * @notice Get SBT metadata
     * @param tokenId The token ID
     * @return SBTMetadata The metadata
     */
    function getSBTMetadata(uint256 tokenId) external view override returns (SBTMetadata memory) {
        if (!_exists(tokenId)) {
            revert Errors.InvalidTokenId(tokenId);
        }
        return _metadata[tokenId];
    }
    
    /**
     * @notice Check if an SBT is revoked
     * @param tokenId The token ID
     * @return bool True if revoked
     */
    function isRevoked(uint256 tokenId) external view override returns (bool) {
        if (!_exists(tokenId)) {
            revert Errors.InvalidTokenId(tokenId);
        }
        return _metadata[tokenId].revoked;
    }
    
    /**
     * @notice Get SBTs owned by an address
     * @param owner The owner address
     * @return uint256[] Array of token IDs
     */
    function getSBTsByOwner(address owner) external view override returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
    
    /**
     * @notice Check if an address owns an SBT for a specific model
     * @param owner The owner address
     * @param modelId The model ID
     * @return bool True if owns
     */
    function hasSBTForModel(address owner, bytes32 modelId) external view override returns (bool) {
        uint256 tokenId = _modelToToken[modelId];
        if (tokenId == 0) {
            return false;
        }
        return ownerOf(tokenId) == owner && !_metadata[tokenId].revoked;
    }
    
    /**
     * @notice Override transfer functions to make tokens soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Allow minting (from == address(0))
        // Allow burning (to == address(0))
        // Block all other transfers
        if (from != address(0) && to != address(0)) {
            emit TransferAttempted(from, to, tokenId);
            revert Errors.SBTTransferNotAllowed();
        }
    }
    
    /**
     * @notice Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @notice Pause the contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
    
    /**
     * @notice ERC165 support
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
