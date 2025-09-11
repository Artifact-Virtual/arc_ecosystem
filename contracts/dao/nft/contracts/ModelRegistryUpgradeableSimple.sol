// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ModelRegistryUpgradeable is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public nextModelId;

    struct Model {
        string name;
        string description;
        string ipfsHash;
        address creator;
        uint256 createdAt;
        bool active;
    }

    mapping(uint256 => Model) public models;

    event ModelCreated(uint256 indexed modelId, address indexed creator, string name);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        nextModelId = 1;
    }

    function createModel(
        string calldata name,
        string calldata description,
        string calldata ipfsHash
    ) external returns (uint256) {
        uint256 modelId = nextModelId++;
        models[modelId] = Model({
            name: name,
            description: description,
            ipfsHash: ipfsHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        emit ModelCreated(modelId, msg.sender, name);
        return modelId;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
