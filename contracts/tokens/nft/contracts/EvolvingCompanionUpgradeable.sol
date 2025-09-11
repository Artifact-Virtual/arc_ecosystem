// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface ITokenBoundAccountRegistry {
    function createAccount(address tokenContract, uint256 tokenId) external returns (address);
}

contract EvolvingCompanionUpgradeable is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MODULE_ROLE = keccak256("MODULE_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    ITokenBoundAccountRegistry public registry;
    uint256 public nextTokenId;

    mapping(uint256 => uint256) public xp;
    mapping(uint256 => string) public metadataURI;
    mapping(uint256 => address) public tokenBoundAccount;

    event MintWithAccount(address indexed owner, uint256 indexed tokenId, address account);
    event XPChanged(uint256 indexed tokenId, uint256 newXP);
    event MetadataUpdated(uint256 indexed tokenId, string uri);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address _registry, address admin) public initializer {
        __ERC721_init("Evolving Companion","EVC");
        __AccessControl_init();
        __UUPSUpgradeable_init();
        registry = ITokenBoundAccountRegistry(_registry);
        nextTokenId = 0;

        // setup roles
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        // admin can also mint / module by default if desired; but better to grant separately
    }

    /// @dev mint is allowed only to addresses with MINTER_ROLE
    function mint(address to, string calldata uri) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 id = ++nextTokenId;
        _safeMint(to, id);
        metadataURI[id] = uri;

        address account = registry.createAccount(address(this), id);
        tokenBoundAccount[id] = account;

        emit MintWithAccount(to, id, account);
        emit MetadataUpdated(id, uri);
        return id;
    }

    function getTokenBoundAccount(uint256 tokenId) external view returns (address) {
        return tokenBoundAccount[tokenId];
    }

    /// @dev modules (with MODULE_ROLE) can update xp or metadata
    function gainXP(uint256 tokenId, uint256 amount) external onlyRole(MODULE_ROLE) {
        xp[tokenId] += amount;
        emit XPChanged(tokenId, xp[tokenId]);
    }

    function setMetadataURI(uint256 tokenId, string calldata uri) external onlyRole(MODULE_ROLE) {
        metadataURI[tokenId] = uri;
        emit MetadataUpdated(tokenId, uri);
    }

    // for UUPS upgrades - admin only
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // keep tokenBoundAccount mapping intact on transfer
    function _afterTokenTransfer(address from, address to, uint256 tokenId) internal override {
        super._afterTokenTransfer(from, to, tokenId);
    }
}
