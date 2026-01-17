// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title AIAttestation
 * @dev Decentralized attestation service for AI model outputs and credentials
 * @notice This contract stores cryptographic proofs of AI model outputs on-chain
 * while keeping the full data on IPFS/IPNS for efficient storage
 */
contract AIAttestation is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // ============ Roles ============

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");

    // ============ Enums ============

    enum AttestationType {
        MODEL_OUTPUT,      // AI model inference result
        CREDENTIAL,        // User credential or achievement
        VERIFICATION,      // Verification of another attestation
        IDENTITY,          // Identity verification
        SKILL,             // Skill or expertise attestation
        REPUTATION         // Reputation score
    }

    enum AttestationStatus {
        ACTIVE,
        REVOKED,
        EXPIRED,
        DISPUTED
    }

    // ============ Structs ============

    struct Attestation {
        uint256 id;
        AttestationType attestationType;
        address subject;           // Who/what is being attested
        address issuer;            // Who issued the attestation
        bytes32 dataHash;          // Hash of the attested data
        string metadataURI;        // IPFS/IPNS URI for full data
        uint256 timestamp;         // When attestation was created
        uint256 expiryTimestamp;   // When attestation expires (0 = never)
        AttestationStatus status;
        bytes signature;           // Issuer's signature
        uint256 chainId;           // Chain ID for cross-chain verification
    }

    struct AttestationMetadata {
        string modelHash;          // Hash of AI model (if applicable)
        string inputHash;          // Hash of input data
        string outputHash;         // Hash of output data
        uint256 confidence;        // Confidence score (0-10000, basis points)
        string[] tags;             // Searchable tags
    }

    // ============ State Variables ============

    uint256 private _attestationIdCounter;
    
    // Mapping from attestation ID to attestation data
    mapping(uint256 => Attestation) public attestations;
    
    // Mapping from subject address to their attestation IDs
    mapping(address => uint256[]) public subjectAttestations;
    
    // Mapping from issuer address to their issued attestation IDs
    mapping(address => uint256[]) public issuerAttestations;
    
    // Mapping from data hash to attestation ID (prevent duplicates)
    mapping(bytes32 => uint256) public dataHashToAttestation;
    
    // Mapping from attestation ID to metadata
    mapping(uint256 => AttestationMetadata) public attestationMetadata;
    
    // Mapping to track disputes
    mapping(uint256 => address[]) public attestationDisputes;

    // Trusted IPFS gateways for verification
    string[] public trustedIPFSGateways;

    // ============ Events ============

    event AttestationCreated(
        uint256 indexed attestationId,
        AttestationType indexed attestationType,
        address indexed subject,
        address issuer,
        bytes32 dataHash,
        string metadataURI
    );

    event AttestationRevoked(
        uint256 indexed attestationId,
        address indexed revoker,
        string reason
    );

    event AttestationDisputed(
        uint256 indexed attestationId,
        address indexed disputer,
        string reason
    );

    event AttestationVerified(
        uint256 indexed attestationId,
        address indexed verifier,
        bool isValid
    );

    event IPFSGatewayAdded(string gateway);
    event IPFSGatewayRemoved(string gateway);

    // ============ Modifiers ============

    modifier attestationExists(uint256 attestationId) {
        require(attestations[attestationId].id != 0, "Attestation does not exist");
        _;
    }

    modifier attestationActive(uint256 attestationId) {
        require(
            attestations[attestationId].status == AttestationStatus.ACTIVE,
            "Attestation is not active"
        );
        _;
    }

    // ============ Initialization ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ATTESTER_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
        _grantRole(REVOKER_ROLE, admin);

        _attestationIdCounter = 1;

        // Add default IPFS gateways
        trustedIPFSGateways.push("https://ipfs.io/ipfs/");
        trustedIPFSGateways.push("https://gateway.pinata.cloud/ipfs/");
        trustedIPFSGateways.push("https://cloudflare-ipfs.com/ipfs/");
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new attestation
     * @param attestationType Type of attestation
     * @param subject Address being attested
     * @param dataHash Hash of the attested data
     * @param metadataURI IPFS/IPNS URI containing full attestation data
     * @param expiryTimestamp Expiry time (0 for no expiry)
     * @param signature Issuer's signature
     * @return attestationId The ID of the created attestation
     */
    function createAttestation(
        AttestationType attestationType,
        address subject,
        bytes32 dataHash,
        string calldata metadataURI,
        uint256 expiryTimestamp,
        bytes calldata signature
    ) external whenNotPaused onlyRole(ATTESTER_ROLE) returns (uint256) {
        require(subject != address(0), "Invalid subject address");
        require(dataHash != bytes32(0), "Invalid data hash");
        require(bytes(metadataURI).length > 0, "Invalid metadata URI");
        require(
            expiryTimestamp == 0 || expiryTimestamp > block.timestamp,
            "Invalid expiry timestamp"
        );
        require(dataHashToAttestation[dataHash] == 0, "Attestation already exists for this data hash");

        uint256 attestationId = _attestationIdCounter++;

        Attestation storage attestation = attestations[attestationId];
        attestation.id = attestationId;
        attestation.attestationType = attestationType;
        attestation.subject = subject;
        attestation.issuer = msg.sender;
        attestation.dataHash = dataHash;
        attestation.metadataURI = metadataURI;
        attestation.timestamp = block.timestamp;
        attestation.expiryTimestamp = expiryTimestamp;
        attestation.status = AttestationStatus.ACTIVE;
        attestation.signature = signature;
        attestation.chainId = block.chainid;

        // Update mappings
        dataHashToAttestation[dataHash] = attestationId;
        subjectAttestations[subject].push(attestationId);
        issuerAttestations[msg.sender].push(attestationId);

        emit AttestationCreated(
            attestationId,
            attestationType,
            subject,
            msg.sender,
            dataHash,
            metadataURI
        );

        return attestationId;
    }

    /**
     * @notice Create attestation with additional metadata
     * @param attestationType Type of attestation
     * @param subject Address being attested
     * @param dataHash Hash of the attested data
     * @param metadataURI IPFS/IPNS URI
     * @param expiryTimestamp Expiry time
     * @param signature Issuer's signature
     * @param metadata Additional metadata
     * @return attestationId The ID of the created attestation
     */
    function createAttestationWithMetadata(
        AttestationType attestationType,
        address subject,
        bytes32 dataHash,
        string calldata metadataURI,
        uint256 expiryTimestamp,
        bytes calldata signature,
        AttestationMetadata calldata metadata
    ) external whenNotPaused onlyRole(ATTESTER_ROLE) returns (uint256) {
        uint256 attestationId = this.createAttestation(
            attestationType,
            subject,
            dataHash,
            metadataURI,
            expiryTimestamp,
            signature
        );

        attestationMetadata[attestationId] = metadata;

        return attestationId;
    }

    /**
     * @notice Verify an attestation
     * @param attestationId ID of the attestation to verify
     * @return isValid Whether the attestation is valid
     */
    function verifyAttestation(uint256 attestationId)
        external
        view
        attestationExists(attestationId)
        returns (bool isValid)
    {
        Attestation memory attestation = attestations[attestationId];

        // Check if active
        if (attestation.status != AttestationStatus.ACTIVE) {
            return false;
        }

        // Check if expired
        if (
            attestation.expiryTimestamp != 0 &&
            block.timestamp > attestation.expiryTimestamp
        ) {
            return false;
        }

        // Check chain ID
        if (attestation.chainId != block.chainid) {
            return false;
        }

        return true;
    }

    /**
     * @notice Revoke an attestation
     * @param attestationId ID of the attestation to revoke
     * @param reason Reason for revocation
     */
    function revokeAttestation(uint256 attestationId, string calldata reason)
        external
        attestationExists(attestationId)
        attestationActive(attestationId)
        onlyRole(REVOKER_ROLE)
    {
        Attestation storage attestation = attestations[attestationId];
        
        require(
            msg.sender == attestation.issuer || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Only issuer or admin can revoke"
        );

        attestation.status = AttestationStatus.REVOKED;

        emit AttestationRevoked(attestationId, msg.sender, reason);
    }

    /**
     * @notice Dispute an attestation
     * @param attestationId ID of the attestation to dispute
     * @param reason Reason for dispute
     */
    function disputeAttestation(uint256 attestationId, string calldata reason)
        external
        attestationExists(attestationId)
    {
        Attestation storage attestation = attestations[attestationId];
        
        require(attestation.status == AttestationStatus.ACTIVE, "Can only dispute active attestations");

        attestation.status = AttestationStatus.DISPUTED;
        attestationDisputes[attestationId].push(msg.sender);

        emit AttestationDisputed(attestationId, msg.sender, reason);
    }

    /**
     * @notice Resolve a disputed attestation
     * @param attestationId ID of the attestation
     * @param isValid Whether to mark as active or revoked
     */
    function resolveDispute(uint256 attestationId, bool isValid)
        external
        attestationExists(attestationId)
        onlyRole(VERIFIER_ROLE)
    {
        Attestation storage attestation = attestations[attestationId];
        
        require(attestation.status == AttestationStatus.DISPUTED, "Attestation is not disputed");

        attestation.status = isValid ? AttestationStatus.ACTIVE : AttestationStatus.REVOKED;

        emit AttestationVerified(attestationId, msg.sender, isValid);
    }

    // ============ Query Functions ============

    /**
     * @notice Get attestation details
     * @param attestationId ID of the attestation
     * @return Attestation data
     */
    function getAttestation(uint256 attestationId)
        external
        view
        attestationExists(attestationId)
        returns (Attestation memory)
    {
        return attestations[attestationId];
    }

    /**
     * @notice Get attestations for a subject
     * @param subject Address of the subject
     * @return Array of attestation IDs
     */
    function getSubjectAttestations(address subject)
        external
        view
        returns (uint256[] memory)
    {
        return subjectAttestations[subject];
    }

    /**
     * @notice Get attestations issued by an issuer
     * @param issuer Address of the issuer
     * @return Array of attestation IDs
     */
    function getIssuerAttestations(address issuer)
        external
        view
        returns (uint256[] memory)
    {
        return issuerAttestations[issuer];
    }

    /**
     * @notice Get attestation by data hash
     * @param dataHash Hash of the data
     * @return attestationId ID of the attestation
     */
    function getAttestationByDataHash(bytes32 dataHash)
        external
        view
        returns (uint256 attestationId)
    {
        return dataHashToAttestation[dataHash];
    }

    /**
     * @notice Get attestation metadata
     * @param attestationId ID of the attestation
     * @return Metadata for the attestation
     */
    function getAttestationMetadata(uint256 attestationId)
        external
        view
        attestationExists(attestationId)
        returns (AttestationMetadata memory)
    {
        return attestationMetadata[attestationId];
    }

    /**
     * @notice Get disputes for an attestation
     * @param attestationId ID of the attestation
     * @return Array of disputers
     */
    function getAttestationDisputes(uint256 attestationId)
        external
        view
        attestationExists(attestationId)
        returns (address[] memory)
    {
        return attestationDisputes[attestationId];
    }

    /**
     * @notice Check if an attestation exists
     * @param dataHash Hash of the data
     * @return Whether an attestation exists
     */
    function attestationExistsByHash(bytes32 dataHash) external view returns (bool) {
        return dataHashToAttestation[dataHash] != 0;
    }

    /**
     * @notice Get total number of attestations
     * @return Total count
     */
    function getTotalAttestations() external view returns (uint256) {
        return _attestationIdCounter - 1;
    }

    // ============ IPFS Gateway Management ============

    /**
     * @notice Add a trusted IPFS gateway
     * @param gateway Gateway URL
     */
    function addIPFSGateway(string calldata gateway)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        trustedIPFSGateways.push(gateway);
        emit IPFSGatewayAdded(gateway);
    }

    /**
     * @notice Remove a trusted IPFS gateway
     * @param index Index of the gateway to remove
     */
    function removeIPFSGateway(uint256 index)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(index < trustedIPFSGateways.length, "Invalid index");
        
        string memory gateway = trustedIPFSGateways[index];
        
        // Move last element to deleted position and pop
        trustedIPFSGateways[index] = trustedIPFSGateways[trustedIPFSGateways.length - 1];
        trustedIPFSGateways.pop();
        
        emit IPFSGatewayRemoved(gateway);
    }

    /**
     * @notice Get all trusted IPFS gateways
     * @return Array of gateway URLs
     */
    function getIPFSGateways() external view returns (string[] memory) {
        return trustedIPFSGateways;
    }

    // ============ Admin Functions ============

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
     * @notice Update attestation expiry
     * @param attestationId ID of the attestation
     * @param newExpiry New expiry timestamp
     */
    function updateExpiry(uint256 attestationId, uint256 newExpiry)
        external
        attestationExists(attestationId)
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            newExpiry == 0 || newExpiry > block.timestamp,
            "Invalid expiry timestamp"
        );
        
        attestations[attestationId].expiryTimestamp = newExpiry;
    }
}
