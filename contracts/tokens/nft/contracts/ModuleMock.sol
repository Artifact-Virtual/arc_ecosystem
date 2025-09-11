// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IEvolvingCompanion {
    function mint(address to, string calldata uri) external returns (uint256);
    function gainXP(uint256 tokenId, uint256 amount) external;
}

contract ModuleMock {
    address public owner;
    IEvolvingCompanion public companion;

    event MintedByModule(address indexed to, uint256 indexed tokenId, string uri);
    event XPGranted(uint256 indexed tokenId, uint256 amount);

    constructor(address _companion) {
        owner = msg.sender;
        companion = IEvolvingCompanion(_companion);
    }

    // sale module function - calls companion.mint (module must have MINTER_ROLE)
    function saleMint(address to, string calldata uri) external returns (uint256) {
        // optionally implement payment logic here (msg.value checks)
        uint256 tokenId = companion.mint(to, uri);
        emit MintedByModule(to, tokenId, uri);
        return tokenId;
    }

    // xp generator - calls companion.gainXP (module must have MODULE_ROLE)
    function grantXP(uint256 tokenId, uint256 amount) external {
        companion.gainXP(tokenId, amount);
        emit XPGranted(tokenId, amount);
    }
}
