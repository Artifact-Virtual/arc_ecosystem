// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ModelRegistry is Ownable {
    bytes32 public modelRoot;

    // DAG: dataHash => parent hashes
    mapping(bytes32 => bytes32[]) public parents;
    event ModelUpdated(bytes32 indexed oldRoot, bytes32 indexed newRoot, address indexed updater);
    event DataNodeAppended(bytes32 indexed dataHash, address indexed signer);

    constructor(bytes32 initialRoot) {
        modelRoot = initialRoot;
    }

    function submitModelRoot(bytes32 newRoot) external onlyOwner {
        bytes32 old = modelRoot;
        modelRoot = newRoot;
        emit ModelUpdated(old, newRoot, msg.sender);
    }

    function appendDataNode(bytes32 dataHash, bytes32[] calldata parentRoots) external {
        parents[dataHash] = parentRoots;
        emit DataNodeAppended(dataHash, msg.sender);
    }
}