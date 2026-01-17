// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

interface IARCModelRegistry {
    function modelClass(bytes32 modelId) external view returns (bytes32);
}

/**
 * @title ARCModelSBT
 * @notice Soulbound token identity layer for AI models
 * @dev Non-transferable tokens (ERC-5192 compliant)
 * 
 * This is delicate and quite hot. Handle with care.
 * 
 * This is how GLADIUS comes to life - each model gets a unique,
 * non-transferable identity token.
 */
contract ARCModelSBT {
    error NotRegistry();
    error AlreadyMinted();
    error NonTransferable();
    error InvalidModel();

    event ModelMinted(
        uint256 indexed tokenId,
        bytes32 indexed modelId,
        bytes32 indexed classId
    );

    event ModelRevoked(uint256 indexed tokenId);

    string public name = "ARC Model Identity";
    string public symbol = "ARC-MODEL";

    address public immutable registry;
    address public immutable governance;

    uint256 private _nextId = 1;

    mapping(uint256 => bytes32) public tokenModel;
    mapping(bytes32 => uint256) public modelToken;
    mapping(uint256 => bool) public revoked;

    constructor(address registry_, address governance_) {
        registry = registry_;
        governance = governance_;
    }

    modifier onlyRegistry() {
        if (msg.sender != registry) revert NotRegistry();
        _;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "NOT_GOVERNANCE");
        _;
    }

    function mint(bytes32 modelId) external onlyRegistry returns (uint256 tokenId) {
        if (modelToken[modelId] != 0) revert AlreadyMinted();

        bytes32 classId = IARCModelRegistry(registry).modelClass(modelId);
        if (classId == bytes32(0)) revert InvalidModel();

        tokenId = _nextId++;
        tokenModel[tokenId] = modelId;
        modelToken[modelId] = tokenId;

        emit ModelMinted(tokenId, modelId, classId);
    }

    function revoke(uint256 tokenId) external onlyGovernance {
        revoked[tokenId] = true;
        emit ModelRevoked(tokenId);
    }

    /* ========= ERC-721 MINIMAL SURFACE ========= */

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

    /* ========= ERC-5192 ========= */

    function locked(uint256) external pure returns (bool) {
        return true;
    }
}
