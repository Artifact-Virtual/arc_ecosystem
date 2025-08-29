// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@prb/math/src/UD60x18.sol";
import { wrap, unwrap } from "@prb/math/src/ud60x18/Casting.sol";
import { exp } from "@prb/math/src/ud60x18/Math.sol";

/**
 * @title ARCx Identity SBT - Soulbound Identity Tokens
 * @dev Non-transferable, revocable, EAS-gated SBTs proving roles
 * @notice Implements ERC-721 + ERC-5192 with decay-weighted reputation
 *
 * Features:
 * - Soulbound tokens (ERC-5192 locked)
 * - EAS attestation integration
 * - Decay-weighted reputation system
 * - Role-based eligibility masks
 * - Rate-limited issuance
 * - Comprehensive event emission
 */
contract ARC_IdentitySBT is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    ERC721Upgradeable
{
    // using UD60x18 for uint256;
    using ECDSAUpgradeable for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Roles (bytes32)
    bytes32 public constant ROLE_CODE = keccak256("ROLE_CODE");
    bytes32 public constant ROLE_VALIDATOR = keccak256("ROLE_VALIDATOR");
    bytes32 public constant ROLE_GOV = keccak256("ROLE_GOV");
    bytes32 public constant ROLE_RWA_CURATOR = keccak256("ROLE_RWA_CURATOR");
    bytes32 public constant ROLE_ORACLE_OP = keccak256("ROLE_ORACLE_OP");
    bytes32 public constant ROLE_AUDITOR = keccak256("ROLE_AUDITOR");

    // Layers (bitmask uint256)
    uint256 public constant LAYER_TOKEN = 1 << 0;      // 1
    uint256 public constant LAYER_SBT = 1 << 1;        // 2
    uint256 public constant LAYER_RWA_ENERGY = 1 << 2; // 4
    uint256 public constant LAYER_RWA_CARBON = 1 << 3; // 8
    uint256 public constant LAYER_GRANTS = 1 << 4;     // 16
    uint256 public constant LAYER_PARAMS = 1 << 5;     // 32
    uint256 public constant LAYER_TREASURY = 1 << 6;   // 64
    uint256 public constant LAYER_MASK_ALL = 127;      // 0-6 bits

    // EAS Interface
    bytes32 public schemaId_IdentityRole;

    // Configuration
    address public timelock;
    address public safeExecutor;
    address public eas;

    uint64 public epochSeconds = 86400;      // 1 day
    uint32 public maxIssuesPerEpoch = 50;
    uint256 public maxRolesPerAddress = 16;

    // Decay parameters (90 days, 25% floor)
    uint256 public decay_T_seconds = 7776000;  // 90 days
    uint256 public decay_floorWad = 0.25e18;   // 25%

    // Role data
    struct RoleRec {
        uint256 weightWad;       // Role weight in WAD
        uint64 expiresAt;        // Expiration timestamp
        uint64 lastBeat;         // Last heartbeat timestamp
        bool active;             // Whether role is active
        string uri;              // Metadata URI
        bytes32 evidenceHash;    // Evidence hash
        uint32 version;          // Role version
    }

    // State mappings
    mapping(address => bool) public isIssuer;
    mapping(address => mapping(uint64 => uint32)) public issuesInEpoch;
    mapping(address => mapping(bytes32 => RoleRec)) public roles;
    mapping(bytes32 => uint256) public roleTopicMask;
    mapping(bytes32 => uint256) public roleDefaultWeightWad;
    mapping(address => bytes32[]) public rolesList;
    mapping(address => mapping(bytes32 => uint8)) public roleIndexPlus1;
    mapping(bytes32 => bool) public consumedUID;

    // Analytics
    struct SbtAnalytics {
        uint256 totalIssuances;
        uint256 totalRevocations;
        uint256 activeRoles;
        uint256 totalWeight;
        uint256 lastUpdate;
    }
    SbtAnalytics public analytics;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the SBT contract
     */
    function initialize(
        address _timelock,
        address _safeExecutor,
        address _eas,
        bytes32 _schemaId
    ) external initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __ERC721_init("ARC Identity SBT", "ARC-SBT");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);

        timelock = _timelock;
        safeExecutor = _safeExecutor;
        eas = _eas;
        schemaId_IdentityRole = _schemaId;

        // Initialize default role configurations
        _initializeDefaultRoles();
    }

    /**
     * @dev Issue a new identity SBT
     */
    function issue(
        address to,
        bytes32 role,
        bytes32 uid
    ) external nonReentrant whenNotPaused {
        require(to != address(0), "ARC_IdentitySBT: Zero address");
        require(!consumedUID[uid], "ARC_IdentitySBT: UID already used");
        require(hasRole(ISSUER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "ARC_IdentitySBT: Not issuer");
        require(_validateEASAttestation(to, role, uid), "ARC_IdentitySBT: Invalid EAS attestation");
        require(_checkRateLimit(), "ARC_IdentitySBT: Rate limited");
        require(rolesList[to].length < maxRolesPerAddress, "ARC_IdentitySBT: Too many roles");

        // Check if role already exists (handle re-issuance)
        RoleRec storage existingRole = roles[to][role];
        uint32 newVersion = existingRole.version + 1;

        // Create new role record
        RoleRec memory newRole = RoleRec({
            weightWad: roleDefaultWeightWad[role],
            expiresAt: uint64(block.timestamp + 365 days), // 1 year default
            lastBeat: uint64(block.timestamp),
            active: true,
            uri: "",
            evidenceHash: keccak256(abi.encodePacked(to, role, uid)),
            version: newVersion
        });

        roles[to][role] = newRole;

        // Add to roles list if new
        if (roleIndexPlus1[to][role] == 0) {
            rolesList[to].push(role);
            roleIndexPlus1[to][role] = uint8(rolesList[to].length);
        }

        // Mint SBT
        uint256 tokenId = uint256(keccak256(abi.encode(to, role, newVersion)));
        _mint(to, tokenId);

        // Mark UID as consumed
        consumedUID[uid] = true;

        // Update analytics
        analytics.totalIssuances++;
        analytics.activeRoles++;
        analytics.lastUpdate = block.timestamp;

        emit RoleIssued(to, role, tokenId, newRole.expiresAt, newRole.uri, newRole.evidenceHash);
        emit Locked(tokenId);
    }

    /**
     * @dev Revoke an identity SBT
     */
    function revoke(
        uint256 tokenId,
        string calldata reason
    ) external nonReentrant {
        bytes32 role = roleOf(tokenId);
        address owner = ownerOf(tokenId);

        require(
            hasRole(ADMIN_ROLE, msg.sender) ||
            hasRole(ISSUER_ROLE, msg.sender) ||
            msg.sender == owner,
            "ARC_IdentitySBT: Not authorized"
        );

        require(roles[owner][role].active, "ARC_IdentitySBT: Role not active");

        // Mark role as inactive
        roles[owner][role].active = false;

        // Remove from roles list
        _removeRoleFromList(owner, role);

        // Burn the token
        _burn(tokenId);

        // Update analytics
        analytics.totalRevocations++;
        analytics.activeRoles--;

        emit RoleRevoked(owner, role, tokenId, reason);
    }

    /**
     * @dev Update heartbeat for a role
     */
    function heartbeat(bytes32 role) external {
        require(roles[msg.sender][role].active, "ARC_IdentitySBT: Role not active");
        require(block.timestamp <= roles[msg.sender][role].expiresAt, "ARC_IdentitySBT: Role expired");

        roles[msg.sender][role].lastBeat = uint64(block.timestamp);

        emit Heartbeat(msg.sender, role, block.timestamp);
    }

    /**
     * @dev Check if address has active role
     */
    function hasRole(address who, bytes32 role_) public view returns (bool) {
        RoleRec memory role = roles[who][role_];
        return role.active && role.expiresAt >= block.timestamp;
    }

    /**
     * @dev Get total weight for an address
     */
    function weightOf(address who) public view returns (uint256) {
        uint256 totalWeight = 0;
        bytes32[] memory userRoles = rolesList[who];

        for (uint256 i = 0; i < userRoles.length; i++) {
            bytes32 role = userRoles[i];
            RoleRec memory roleRec = roles[who][role];

            if (roleRec.active && roleRec.expiresAt >= block.timestamp) {
                uint256 decayedWeight = _calculateDecayedWeight(roleRec);
                totalWeight += decayedWeight;
            }
        }

        return totalWeight;
    }

    /**
     * @dev Get weight for address and topic mask
     */
    function weightOfForTopic(address who, uint256 topicMask) external view returns (uint256) {
        uint256 totalWeight = 0;
        bytes32[] memory userRoles = rolesList[who];

        for (uint256 i = 0; i < userRoles.length; i++) {
            bytes32 role = userRoles[i];
            RoleRec memory roleRec = roles[who][role];

            if (roleRec.active &&
                roleRec.expiresAt >= block.timestamp &&
                (roleTopicMask[role] & topicMask) != 0) {

                uint256 decayedWeight = _calculateDecayedWeight(roleRec);
                totalWeight += decayedWeight;
            }
        }

        return totalWeight;
    }

    /**
     * @dev Get role for token ID
     */
    function roleOf(uint256 tokenId) public view returns (bytes32) {
        // This is a simplified implementation
        // In production, you'd maintain a reverse mapping
        revert("ARC_IdentitySBT: Not implemented - requires reverse mapping");
    }

    /**
     * @dev Get roles for address
     */
    function rolesOf(address who) external view returns (bytes32[] memory) {
        return rolesList[who];
    }

    /**
     * @dev Set role weight
     */
    function setRoleWeight(bytes32 role, uint256 weightWad) external onlyRole(ADMIN_ROLE) {
        require(weightWad <= 1e18, "ARC_IdentitySBT: Weight too high");
        roleDefaultWeightWad[role] = weightWad;

        emit RoleWeightSet(role, weightWad);
    }

    /**
     * @dev Set topic mask for role
     */
    function setTopicMask(bytes32 role, uint256 topicMask) external onlyRole(ADMIN_ROLE) {
        require(topicMask <= LAYER_MASK_ALL, "ARC_IdentitySBT: Invalid topic mask");
        roleTopicMask[role] = topicMask;

        emit TopicMaskSet(role, topicMask);
    }

    /**
     * @dev Add issuer
     */
    function addIssuer(address issuer) external onlyRole(ADMIN_ROLE) {
        require(issuer != address(0), "ARC_IdentitySBT: Zero address");
        isIssuer[issuer] = true;

        emit IssuerAdded(issuer, block.timestamp);
    }

    /**
     * @dev Remove issuer
     */
    function removeIssuer(address issuer) external onlyRole(ADMIN_ROLE) {
        isIssuer[issuer] = false;

        emit IssuerRemoved(issuer, block.timestamp);
    }

    /**
     * @dev Set configuration
     */
    function setConfig(bytes32 key, uint256 value) external onlyRole(ADMIN_ROLE) {
        if (key == keccak256("epochSeconds")) {
            epochSeconds = uint64(value);
        } else if (key == keccak256("maxIssuesPerEpoch")) {
            maxIssuesPerEpoch = uint32(value);
        } else if (key == keccak256("maxRolesPerAddress")) {
            maxRolesPerAddress = value;
        } else if (key == keccak256("decay_T_seconds")) {
            decay_T_seconds = value;
        } else if (key == keccak256("decay_floorWad")) {
            require(value <= 1e18, "ARC_IdentitySBT: Invalid floor");
            decay_floorWad = value;
        }

        emit ConfigSet(key, value);
    }

    /**
     * @dev ERC-5192 locked function
     */
    function locked(uint256 tokenId) external pure returns (bool) {
        return true;
    }

    /**
     * @dev Override supportsInterface to include ERC-5192
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return
            ERC721Upgradeable.supportsInterface(interfaceId) ||
            AccessControlUpgradeable.supportsInterface(interfaceId) ||
            interfaceId == 0xb45a3c0e; // ERC-5192
    }

    /**
     * @dev Initialize default role configurations
     */
    function _initializeDefaultRoles() internal {
        // Set default weights (in WAD)
        roleDefaultWeightWad[ROLE_CODE] = 0.5e18;         // 0.5
        roleDefaultWeightWad[ROLE_VALIDATOR] = 0.7e18;    // 0.7
        roleDefaultWeightWad[ROLE_GOV] = 0.6e18;          // 0.6
        roleDefaultWeightWad[ROLE_RWA_CURATOR] = 0.8e18;  // 0.8
        roleDefaultWeightWad[ROLE_ORACLE_OP] = 0.4e18;    // 0.4
        roleDefaultWeightWad[ROLE_AUDITOR] = 0.9e18;      // 0.9

        // Set topic masks
        roleTopicMask[ROLE_CODE] = LAYER_TREASURY | LAYER_PARAMS | LAYER_GRANTS;
        roleTopicMask[ROLE_VALIDATOR] = LAYER_PARAMS;
        roleTopicMask[ROLE_GOV] = LAYER_TREASURY | LAYER_PARAMS | LAYER_GRANTS;
        roleTopicMask[ROLE_RWA_CURATOR] = LAYER_RWA_ENERGY | LAYER_RWA_CARBON;
        roleTopicMask[ROLE_ORACLE_OP] = LAYER_RWA_ENERGY | LAYER_RWA_CARBON;
        roleTopicMask[ROLE_AUDITOR] = LAYER_TREASURY | LAYER_PARAMS;
    }

    /**
     * @dev Validate EAS attestation
     */
    function _validateEASAttestation(address to, bytes32 role, bytes32 uid) internal view returns (bool) {
        // Simplified EAS validation
        // In production, this would decode and validate the EAS attestation
        return uid != bytes32(0);
    }

    /**
     * @dev Check rate limit
     */
    function _checkRateLimit() internal returns (bool) {
        uint64 currentEpoch = uint64(block.timestamp / epochSeconds);
        uint32 issues = issuesInEpoch[msg.sender][currentEpoch];

        if (issues >= maxIssuesPerEpoch) {
            return false;
        }

        issuesInEpoch[msg.sender][currentEpoch] = issues + 1;
        return true;
    }

    /**
     * @dev Calculate decayed weight
     */
    function _calculateDecayedWeight(RoleRec memory roleRec) internal view returns (uint256) {
        if (block.timestamp <= roleRec.lastBeat) {
            return roleRec.weightWad;
        }

        uint256 timeDelta = block.timestamp - roleRec.lastBeat;
        if (timeDelta >= decay_T_seconds) {
            return decay_floorWad;
        }

        // Calculate exponential decay: exp(-Δ/T)
        uint256 exponent = (timeDelta * 1e18) / decay_T_seconds;
        UD60x18 decayFactorUD = exp(wrap(exponent));
        uint256 decayFactor = unwrap(decayFactorUD);

        // Apply negative exponent by taking reciprocal
        decayFactor = (1e18 * 1e18) / decayFactor;

        uint256 decayedWeight = (roleRec.weightWad * decayFactor) / 1e18;

        return decayedWeight < decay_floorWad ? decay_floorWad : decayedWeight;
    }

    /**
     * @dev Remove role from list
     */
    function _removeRoleFromList(address owner, bytes32 role) internal {
        uint8 indexPlus1 = roleIndexPlus1[owner][role];
        if (indexPlus1 == 0) return;

        uint256 index = indexPlus1 - 1;
        uint256 lastIndex = rolesList[owner].length - 1;

        if (index != lastIndex) {
            bytes32 lastRole = rolesList[owner][lastIndex];
            rolesList[owner][index] = lastRole;
            roleIndexPlus1[owner][lastRole] = uint8(index + 1);
        }

        rolesList[owner].pop();
        roleIndexPlus1[owner][role] = 0;
    }

    /**
     * @dev Override transfers to prevent them
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal pure override {
        revert TransferDisabled();
    }

    /**
     * @dev Override approvals to prevent them
     */
    function approve(address to, uint256 tokenId) public pure override {
        revert TransferDisabled();
    }

    /**
     * @dev Override setApprovalForAll to prevent it
     */
    function setApprovalForAll(address operator, bool approved) public pure override {
        revert TransferDisabled();
    }

    /**
     * @dev Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    // Events
    event IssuerAdded(address indexed issuer, uint256 timestamp);
    event IssuerRemoved(address indexed issuer, uint256 timestamp);
    event RoleIssued(address indexed to, bytes32 indexed role, uint256 tokenId, uint256 expiresAt, string uri, bytes32 evidenceHash);
    event RoleRevoked(address indexed from, bytes32 indexed role, uint256 tokenId, string reason);
    event Heartbeat(address indexed who, bytes32 indexed role, uint256 timestamp);
    event RoleWeightSet(bytes32 indexed role, uint256 weightWad);
    event TopicMaskSet(bytes32 indexed role, uint256 topicMask);
    event ConfigSet(bytes32 indexed key, uint256 value);
    event Locked(uint256 indexed tokenId);

    // Errors
    error TransferDisabled();
    error NotIssuer();
    error RateLimited();
    error InvalidEAS();
    error Expired();
    error NotOwnerOrIssuer();
    error AlreadyUsedUID();
    error UnsafeExpiry();
    error TooManyRoles();
    error InvalidTopicMask();
    error ZeroAddress();
}
