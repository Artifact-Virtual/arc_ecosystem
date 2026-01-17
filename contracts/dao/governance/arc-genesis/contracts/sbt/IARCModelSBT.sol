// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/**
 * @title IARCModelSBT
 * @notice Interface for soulbound model identity tokens
 * @dev Non-transferable tokens encoding model metadata
 */
interface IARCModelSBT {
    event ModelMinted(
        uint256 indexed tokenId,
        bytes32 indexed modelId,
        bytes32 indexed classId
    );

    event ModelRevoked(uint256 indexed tokenId);

    function mint(bytes32 modelId) external returns (uint256 tokenId);
    function revoke(uint256 tokenId) external;
    function tokenModel(uint256 tokenId) external view returns (bytes32);
    function modelToken(bytes32 modelId) external view returns (uint256);
    function revoked(uint256 tokenId) external view returns (bool);
    function locked(uint256 tokenId) external pure returns (bool);
}
