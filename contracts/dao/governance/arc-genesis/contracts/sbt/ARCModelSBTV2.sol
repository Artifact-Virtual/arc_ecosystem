// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import {IARCModelRegistryV2} from "../registry/IARCModelRegistryV2.sol";

/**
 * @title ARCModelSBTV2
 * @notice Enhanced soulbound token identity layer for AI models
 * @dev Addresses audit gaps:
 *      - Emergency pause mechanism
 *      - Role-based access control
 *      - Enhanced events for tracking
 *      - Batch minting operations
 */
contract ARCModelSBTV2 is AccessControl, Pausable {
    // Roles
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Errors
    error NotAuthorized();
    error AlreadyMinted();
    error NonTransferable();
    error InvalidModel();
    error TokenNotFound();
    error InvalidArrayLength();
    
    // Events
    event ModelMinted(
        uint256 indexed tokenId,
        bytes32 indexed modelId,
        bytes32 indexed classId,
        address minter,
        uint256 timestamp
    );
    
    event ModelRevoked(uint256 indexed tokenId, string reason, uint256 timestamp);
    event BatchMinted(uint256[] tokenIds, bytes32[] modelIds, uint256 timestamp);
    
    // Metadata
    string public name = "ARC Model Identity";
    string public symbol = "ARC-MODEL";
    
    // References
    address public immutable registry;
    
    // State
    uint256 private _nextId = 1;
    mapping(uint256 => bytes32) public tokenModel;
    mapping(bytes32 => uint256) public modelToken;
    mapping(uint256 => bool) public revoked;
    mapping(uint256 => uint256) public mintedAt;
    
    constructor(address registry_, address governance_) {
        require(registry_ != address(0), "INVALID_REGISTRY");
        require(governance_ != address(0), "INVALID_GOVERNANCE");
        
        registry = registry_;
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, governance_);
        _grantRole(GOVERNANCE_ROLE, governance_);
        _grantRole(MINTER_ROLE, governance_);
        _grantRole(PAUSER_ROLE, governance_);
    }
    
    /**
     * @notice Mint a soulbound token for a registered model
     */
    function mint(bytes32 modelId) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256 tokenId) {
        if (modelToken[modelId] != 0) revert AlreadyMinted();
        
        // Verify model exists and is active
        bytes32 classId = IARCModelRegistryV2(registry).modelClass(modelId);
        if (classId == bytes32(0)) revert InvalidModel();
        
        if (!IARCModelRegistryV2(registry).isModelActive(modelId)) revert InvalidModel();
        
        tokenId = _nextId++;
        tokenModel[tokenId] = modelId;
        modelToken[modelId] = tokenId;
        mintedAt[tokenId] = block.timestamp;
        
        emit ModelMinted(tokenId, modelId, classId, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Batch mint multiple SBTs (gas efficient)
     */
    function mintBatch(bytes32[] calldata modelIds) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256[] memory) {
        uint256 length = modelIds.length;
        uint256[] memory tokenIds = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            if (modelToken[modelIds[i]] != 0) revert AlreadyMinted();
            
            bytes32 classId = IARCModelRegistryV2(registry).modelClass(modelIds[i]);
            if (classId == bytes32(0)) revert InvalidModel();
            
            if (!IARCModelRegistryV2(registry).isModelActive(modelIds[i])) revert InvalidModel();
            
            uint256 tokenId = _nextId++;
            tokenIds[i] = tokenId;
            tokenModel[tokenId] = modelIds[i];
            modelToken[modelIds[i]] = tokenId;
            mintedAt[tokenId] = block.timestamp;
            
            emit ModelMinted(tokenId, modelIds[i], classId, msg.sender, block.timestamp);
        }
        
        emit BatchMinted(tokenIds, modelIds, block.timestamp);
        return tokenIds;
    }
    
    /**
     * @notice Revoke a soulbound token
     */
    function revoke(uint256 tokenId, string calldata reason) external onlyRole(GOVERNANCE_ROLE) {
        if (tokenModel[tokenId] == bytes32(0)) revert TokenNotFound();
        
        revoked[tokenId] = true;
        emit ModelRevoked(tokenId, reason, block.timestamp);
    }
    
    /**
     * @notice Batch revoke multiple tokens
     */
    function revokeBatch(uint256[] calldata tokenIds, string calldata reason) external onlyRole(GOVERNANCE_ROLE) {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenModel[tokenIds[i]] == bytes32(0)) revert TokenNotFound();
            
            revoked[tokenIds[i]] = true;
            emit ModelRevoked(tokenIds[i], reason, block.timestamp);
        }
    }
    
    /**
     * @notice Check if token is valid (exists and not revoked)
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        return tokenModel[tokenId] != bytes32(0) && !revoked[tokenId];
    }
    
    /* ========= ERC-721 MINIMAL SURFACE (NON-TRANSFERABLE) ========= */
    
    function ownerOf(uint256) external pure returns (address) {
        revert NonTransferable();
    }
    
    function balanceOf(address) external pure returns (uint256) {
        revert NonTransferable();
    }
    
    function transferFrom(address, address, uint256) external pure {
        revert NonTransferable();
    }
    
    function approve(address, uint256) external pure {
        revert NonTransferable();
    }
    
    function getApproved(uint256) external pure returns (address) {
        return address(0);
    }
    
    function isApprovedForAll(address, address) external pure returns (bool) {
        return false;
    }
    
    /* ========= ERC-5192 SOULBOUND INTERFACE ========= */
    
    function locked(uint256) external pure returns (bool) {
        return true;
    }
    
    /* ========= ADMIN FUNCTIONS ========= */
    
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    function authorizeMinter(address minter) external onlyRole(GOVERNANCE_ROLE) {
        grantRole(MINTER_ROLE, minter);
    }
    
    function revokeMinter(address minter) external onlyRole(GOVERNANCE_ROLE) {
        revokeRole(MINTER_ROLE, minter);
    }
}
