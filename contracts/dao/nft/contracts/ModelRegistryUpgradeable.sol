// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

interface IModuleManager {
    function isModule(address) external view returns (bool);
}

interface IEvolvingCompanion {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract ModelRegistryUpgradeable is OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    using ECDSAUpgradeable for bytes32;

    IModuleManager public moduleManager;
    IEvolvingCompanion public companion;

    struct Model {
        string name;
        string description;
        string ipfsHash;
        address creator;
        uint256 createdAt;
        uint256 version;
        bool active;
        uint256[] dependencies;
        mapping(uint256 => bool) dependencyMap;
    }

    struct ModelVersion {
        string ipfsHash;
        uint256 timestamp;
        string changelog;
        bool deprecated;
    }

    // Model storage
    mapping(uint256 => Model) public models;
    mapping(uint256 => ModelVersion[]) public modelVersions;
    mapping(bytes32 => bool) public usedSignatures;

    // Model relationships (DAG)
    mapping(uint256 => uint256[]) public modelChildren;
    mapping(uint256 => uint256[]) public modelParents;

    // Access control
    mapping(address => bool) public authorizedCreators;
    mapping(uint256 => mapping(address => bool)) public modelCollaborators;

    uint256 public nextModelId;
    uint256 public constant MAX_DEPENDENCIES = 10;
    uint256 public constant MAX_NAME_LENGTH = 100;
    uint256 public constant MAX_DESC_LENGTH = 1000;

    event ModelCreated(uint256 indexed modelId, address indexed creator, string name);
    event ModelUpdated(uint256 indexed modelId, string ipfsHash, uint256 version);
    event ModelVersionAdded(uint256 indexed modelId, uint256 version, string ipfsHash);
    event DependencyAdded(uint256 indexed modelId, uint256 indexed dependencyId);
    event CollaboratorAdded(uint256 indexed modelId, address indexed collaborator);
    event CreatorAuthorized(address indexed creator, bool authorized);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _companion) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        require(_companion != address(0), "Invalid companion address");
        companion = IEvolvingCompanion(_companion);
        nextModelId = 1;
    }

    modifier onlyModule() {
        require(address(moduleManager) != address(0) && moduleManager.isModule(msg.sender), "Not authorized module");
        _;
    }

    modifier onlyAuthorizedCreator() {
        require(authorizedCreators[msg.sender] || msg.sender == owner(), "Not authorized creator");
        _;
    }

    modifier validModel(uint256 modelId) {
        require(modelId > 0 && modelId < nextModelId, "Invalid model ID");
        require(models[modelId].active, "Model not active");
        _;
    }

    modifier onlyModelCreator(uint256 modelId) {
        require(models[modelId].creator == msg.sender || modelCollaborators[modelId][msg.sender] || msg.sender == owner(), "Not model creator or collaborator");
        _;
    }

    function setModuleManager(address mm) external onlyOwner {
        require(mm != address(0), "Invalid module manager address");
        moduleManager = IModuleManager(mm);
    }

    function authorizeCreator(address creator, bool authorized) external onlyOwner {
        require(creator != address(0), "Invalid creator address");
        authorizedCreators[creator] = authorized;
        emit CreatorAuthorized(creator, authorized);
    }

    function createModel(
        string calldata name,
        string calldata description,
        string calldata ipfsHash,
        uint256[] calldata dependencies,
        bytes calldata signature
    ) external onlyAuthorizedCreator nonReentrant returns (uint256) {
        require(bytes(name).length > 0 && bytes(name).length <= MAX_NAME_LENGTH, "Invalid name length");
        require(bytes(description).length <= MAX_DESC_LENGTH, "Description too long");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(dependencies.length <= MAX_DEPENDENCIES, "Too many dependencies");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(name, ipfsHash, block.timestamp));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);

        require(signer == msg.sender, "Invalid signature");
        require(!usedSignatures[ethSignedMessageHash], "Signature already used");

        usedSignatures[ethSignedMessageHash] = true;

        uint256 modelId = nextModelId++;

        Model storage model = models[modelId];
        model.name = name;
        model.description = description;
        model.ipfsHash = ipfsHash;
        model.creator = msg.sender;
        model.createdAt = block.timestamp;
        model.version = 1;
        model.active = true;

        // Add dependencies
        for (uint256 i = 0; i < dependencies.length; i++) {
            uint256 depId = dependencies[i];
            require(depId > 0 && depId < nextModelId, "Invalid dependency");
            require(models[depId].active, "Dependency not active");

            model.dependencies.push(depId);
            model.dependencyMap[depId] = true;

            // Update DAG relationships
            modelParents[modelId].push(depId);
            modelChildren[depId].push(modelId);

            emit DependencyAdded(modelId, depId);
        }

        // Add initial version
        modelVersions[modelId].push(ModelVersion({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            changelog: "Initial version",
            deprecated: false
        }));

        emit ModelCreated(modelId, msg.sender, name);
        emit ModelVersionAdded(modelId, 1, ipfsHash);
        return modelId;
    }

    function updateModel(
        uint256 modelId,
        string calldata ipfsHash,
        string calldata changelog,
        bytes calldata signature
    ) external validModel(modelId) onlyModelCreator(modelId) nonReentrant {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(bytes(changelog).length > 0, "Invalid changelog");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(modelId, ipfsHash, block.timestamp));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);

        require(signer == msg.sender, "Invalid signature");
        require(!usedSignatures[ethSignedMessageHash], "Signature already used");

        usedSignatures[ethSignedMessageHash] = true;

        Model storage model = models[modelId];
        model.ipfsHash = ipfsHash;
        model.version++;

        modelVersions[modelId].push(ModelVersion({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            changelog: changelog,
            deprecated: false
        }));

        emit ModelUpdated(modelId, ipfsHash, model.version);
        emit ModelVersionAdded(modelId, model.version, ipfsHash);
    }

    function addCollaborator(uint256 modelId, address collaborator) external validModel(modelId) onlyModelCreator(modelId) {
        require(collaborator != address(0), "Invalid collaborator address");
        require(!modelCollaborators[modelId][collaborator], "Already collaborator");

        modelCollaborators[modelId][collaborator] = true;
        emit CollaboratorAdded(modelId, collaborator);
    }

    function deprecateModel(uint256 modelId) external onlyOwner validModel(modelId) {
        models[modelId].active = false;
    }

    function deprecateVersion(uint256 modelId, uint256 version) external validModel(modelId) onlyModelCreator(modelId) {
        require(version > 0 && version <= modelVersions[modelId].length, "Invalid version");
        modelVersions[modelId][version - 1].deprecated = true;
    }

    // Batch operations
    function batchCreateModels(
        string[] calldata names,
        string[] calldata descriptions,
        string[] calldata ipfsHashes,
        uint256[][] calldata dependenciesList,
        bytes[] calldata signatures
    ) external onlyAuthorizedCreator nonReentrant returns (uint256[] memory) {
        require(
            names.length == descriptions.length &&
            descriptions.length == ipfsHashes.length &&
            ipfsHashes.length == dependenciesList.length &&
            dependenciesList.length == signatures.length,
            "Array length mismatch"
        );
        require(names.length > 0 && names.length <= 10, "Invalid batch size");

        uint256[] memory modelIds = new uint256[](names.length);

        for (uint256 i = 0; i < names.length; i++) {
            modelIds[i] = createModel(
                names[i],
                descriptions[i],
                ipfsHashes[i],
                dependenciesList[i],
                signatures[i]
            );
        }

        return modelIds;
    }

    // Emergency functions
    function emergencyDeactivateModel(uint256 modelId) external onlyOwner validModel(modelId) {
        models[modelId].active = false;
    }

    function emergencyTransferOwnership(uint256 modelId, address newOwner) external onlyOwner validModel(modelId) {
        require(newOwner != address(0), "Invalid new owner");
        models[modelId].creator = newOwner;
    }

    // UUPS upgrade authorization
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        require(newImplementation != address(0), "Invalid implementation address");
    }

    // View functions
    function getModelInfo(uint256 modelId) external view validModel(modelId) returns (
        string memory name,
        string memory description,
        string memory ipfsHash,
        address creator,
        uint256 createdAt,
        uint256 version,
        uint256[] memory dependencies
    ) {
        Model storage model = models[modelId];
        return (
            model.name,
            model.description,
            model.ipfsHash,
            model.creator,
            model.createdAt,
            model.version,
            model.dependencies
        );
    }

    function getModelVersion(uint256 modelId, uint256 version) external view returns (
        string memory ipfsHash,
        uint256 timestamp,
        string memory changelog,
        bool deprecated
    ) {
        require(version > 0 && version <= modelVersions[modelId].length, "Invalid version");
        ModelVersion storage mv = modelVersions[modelId][version - 1];
        return (mv.ipfsHash, mv.timestamp, mv.changelog, mv.deprecated);
    }

    function getModelVersionsCount(uint256 modelId) external view validModel(modelId) returns (uint256) {
        return modelVersions[modelId].length;
    }

    function getModelChildren(uint256 modelId) external view validModel(modelId) returns (uint256[] memory) {
        return modelChildren[modelId];
    }

    function getModelParents(uint256 modelId) external view validModel(modelId) returns (uint256[] memory) {
        return modelParents[modelId];
    }

    function isModelCollaborator(uint256 modelId, address user) external view validModel(modelId) returns (bool) {
        return modelCollaborators[modelId][user];
    }

    function totalModels() external view returns (uint256) {
        return nextModelId - 1;
    }
}
