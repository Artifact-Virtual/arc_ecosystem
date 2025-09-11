// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IERC721Simple {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract TraitVaultUpgradeable is Initializable, ERC1155Upgradeable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // traitId => name
    mapping(uint256 => string) public traitName;
    // tokenId => traitId => attached
    mapping(uint256 => mapping(uint256 => bool)) public attached;
    // tokenId => traitId => owner who attached (so we can re-mint on detach)
    mapping(uint256 => mapping(uint256 => address)) public attachedBy;

    address public companionContract;

    // Custody tracking for detach
    mapping(uint256 => mapping(uint256 => uint256)) public vaultBalance; // tokenId => traitId => amount in vault

    event TraitAttached(uint256 indexed tokenId, uint256 indexed traitId, address indexed owner);
    event TraitDetached(uint256 indexed tokenId, uint256 indexed traitId, address indexed owner);
    event TraitMinted(address indexed to, uint256 indexed traitId, uint256 amount);
    event CompanionContractSet(address indexed addr);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(string memory uri, address _companionContract, address admin) public initializer {
        __ERC1155_init(uri);
        __AccessControl_init();

        companionContract = _companionContract;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(ADMIN_ROLE, admin);
    }

    function setCompanionContract(address addr) external onlyRole(ADMIN_ROLE) {
        companionContract = addr;
        emit CompanionContractSet(addr);
    }

    function mintTrait(address to, uint256 traitId, uint256 amount, string calldata name) external onlyRole(ADMIN_ROLE) {
        traitName[traitId] = name;
        _mint(to, traitId, amount, "");
        emit TraitMinted(to, traitId, amount);
    }

    /// @notice Attach trait: transfer tokens to vault custody (no burning)
    function attachTrait(uint256 tokenId, uint256 traitId, uint256 amount) external {
        require(companionContract != address(0), "companion not set");
        address owner = IERC721Simple(companionContract).ownerOf(tokenId);
        require(msg.sender == owner, "not companion owner");

        // Transfer trait tokens to vault custody
        _safeTransferFrom(msg.sender, address(this), traitId, amount, "");

        attached[tokenId][traitId] = true;
        attachedBy[tokenId][traitId] = msg.sender;
        vaultBalance[tokenId][traitId] += amount;
        emit TraitAttached(tokenId, traitId, msg.sender);
    }

    /// @notice Detach trait: return tokens from vault custody to original attacher
    function detachTrait(uint256 tokenId, uint256 traitId, uint256 amount) external {
        require(attached[tokenId][traitId], "trait not attached");
        require(attachedBy[tokenId][traitId] == msg.sender, "only attacher");
        require(vaultBalance[tokenId][traitId] >= amount, "insufficient vault balance");

        attached[tokenId][traitId] = false;
        attachedBy[tokenId][traitId] = address(0);
        vaultBalance[tokenId][traitId] -= amount;

        // Return tokens from vault custody to the original attacher
        _safeTransferFrom(address(this), msg.sender, traitId, amount, "");
        emit TraitDetached(tokenId, traitId, msg.sender);
    }
}
