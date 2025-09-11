// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface ITokenBoundAccountRegistry {
    function createAccount(address tokenContract, uint256 tokenId) external returns (address);
    function getAccount(address tokenContract, uint256 tokenId) external view returns (address);
}

interface ICompanionGovernance {
    function delegateVotingPower(uint256 tokenId, address delegate) external;
}

contract EvolvingCompanion is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    ITokenBoundAccountRegistry public registry;
    ICompanionGovernance public governance;
    uint256 public nextTokenId;

    // basic on-chain state
    mapping(uint256 => uint256) public xp;
    mapping(uint256 => string) public metadataURI;
    mapping(uint256 => address) public tokenBoundAccount;

    // Governance-controlled functions
    mapping(address => bool) public authorizedModules;

    event MintWithAccount(address indexed owner, uint256 indexed tokenId, address account);
    event XPChanged(uint256 indexed tokenId, uint256 newXP);
    event MetadataUpdated(uint256 indexed tokenId, string uri);
    event ModuleAuthorized(address indexed module, bool authorized);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _registry,
        address _governance,
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC721_init(name, symbol);
        __ERC721Enumerable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        registry = ITokenBoundAccountRegistry(_registry);
        governance = ICompanionGovernance(_governance);
    }

    function mint(address to, string calldata uri) external onlyOwner returns (uint256) {
        uint256 id = ++nextTokenId;
        _safeMint(to, id);
        metadataURI[id] = uri;

        address account = registry.createAccount(address(this), id);
        tokenBoundAccount[id] = account;

        // Auto-delegate voting power to the owner
        governance.delegateVotingPower(id, to);

        emit MintWithAccount(to, id, account);
        emit MetadataUpdated(id, uri);
        return id;
    }

    function getTokenBoundAccount(uint256 tokenId) external view returns (address) {
        return tokenBoundAccount[tokenId];
    }

    // Governance-controlled XP updates
    function gainXP(uint256 tokenId, uint256 amount) external {
        require(authorizedModules[msg.sender] || msg.sender == owner(), "Not authorized");
        require(_exists(tokenId), "Token does not exist");
        xp[tokenId] += amount;
        emit XPChanged(tokenId, xp[tokenId]);
    }

    function setMetadataURI(uint256 tokenId, string calldata uri) external {
        require(authorizedModules[msg.sender] || msg.sender == owner(), "Not authorized");
        require(_exists(tokenId), "Token does not exist");
        metadataURI[tokenId] = uri;
        emit MetadataUpdated(tokenId, uri);
    }

    // Governance management
    function authorizeModule(address module, bool authorized) external onlyOwner {
        authorizedModules[module] = authorized;
        emit ModuleAuthorized(module, authorized);
    }

    // Required overrides for ERC721Enumerable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Update voting delegation on transfer
        if (from != address(0)) {
            // Remove old delegation
            governance.delegateVotingPower(tokenId, address(0));
        }
        if (to != address(0)) {
            // Add new delegation
            governance.delegateVotingPower(tokenId, to);
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // UUPS upgrade authorization
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // Emergency function - can only be called through governance
    function emergencyTransfer(uint256 tokenId, address to) external {
        require(authorizedModules[msg.sender], "Not authorized module");
        require(_exists(tokenId), "Token does not exist");
        _transfer(ownerOf(tokenId), to, tokenId);
    }
}