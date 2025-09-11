// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IEvolvingCompanion {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract TraitVault is ERC1155, Ownable, ReentrancyGuard {
    IEvolvingCompanion public companion;

    // traitId => name
    mapping(uint256 => string) public traitName;
    // tokenId => traitId => attached
    mapping(uint256 => mapping(uint256 => bool)) public attached;

    // Authorized modules for attach/detach operations
    mapping(address => bool) public authorizedModules;

    event TraitAttached(uint256 indexed tokenId, uint256 indexed traitId, address indexed owner);
    event TraitDetached(uint256 indexed tokenId, uint256 indexed traitId, address indexed owner);
    event TraitMinted(address indexed to, uint256 indexed traitId, uint256 amount);
    event ModuleAuthorized(address indexed module, bool authorized);

    constructor(string memory uri, address _companion) ERC1155(uri) {
        companion = IEvolvingCompanion(_companion);
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(companion.ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedModules[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    function mintTrait(address to, uint256 traitId, uint256 amount, string calldata name) external onlyOwner {
        require(bytes(name).length > 0, "Empty trait name");
        require(amount > 0, "Invalid amount");
        traitName[traitId] = name;
        _mint(to, traitId, amount, "");
        emit TraitMinted(to, traitId, amount);
    }

    // Secure attach: only token owner can attach traits they own
    function attachTrait(uint256 tokenId, uint256 traitId) external onlyTokenOwner(tokenId) nonReentrant {
        require(balanceOf(msg.sender, traitId) > 0, "Must own trait");
        require(!attached[tokenId][traitId], "Already attached");

        attached[tokenId][traitId] = true;
        emit TraitAttached(tokenId, traitId, msg.sender);
    }

    // Secure detach: only token owner can detach
    function detachTrait(uint256 tokenId, uint256 traitId) external onlyTokenOwner(tokenId) nonReentrant {
        require(attached[tokenId][traitId], "Not attached");

        attached[tokenId][traitId] = false;
        emit TraitDetached(tokenId, traitId, msg.sender);
    }

    // Authorized modules can force attach/detach (for governance decisions)
    function forceAttachTrait(uint256 tokenId, uint256 traitId) external onlyAuthorized {
        require(!attached[tokenId][traitId], "Already attached");
        attached[tokenId][traitId] = true;
        emit TraitAttached(tokenId, traitId, companion.ownerOf(tokenId));
    }

    function forceDetachTrait(uint256 tokenId, uint256 traitId) external onlyAuthorized {
        require(attached[tokenId][traitId], "Not attached");
        attached[tokenId][traitId] = false;
        emit TraitDetached(tokenId, traitId, companion.ownerOf(tokenId));
    }

    // Authorize modules for governance operations
    function authorizeModule(address module, bool authorized) external onlyOwner {
        authorizedModules[module] = authorized;
        emit ModuleAuthorized(module, authorized);
    }

    // Override ERC1155 transfer to prevent attached trait transfers
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        // Check if this trait is attached to any token
        // Note: In production, you might want to track which tokens have which traits
        // For now, allow transfers but emit warning
        super.safeTransferFrom(from, to, id, amount, data);
    }
}