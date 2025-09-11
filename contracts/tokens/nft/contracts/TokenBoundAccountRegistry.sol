// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TokenBoundAccount.sol";

contract TokenBoundAccountRegistry {
    // EIP-6551 compatible event
    event AccountCreated(address indexed account, address indexed implementation, uint256 indexed chainId, address tokenContract, uint256 tokenId);

    // tokenContract => tokenId => account
    mapping(address => mapping(uint256 => address)) public accountOf;

    // EIP-6551 standard account implementation
    address public immutable accountImplementation;

    constructor() {
        // Deploy the implementation contract
        accountImplementation = address(new TokenBoundAccount());
    }

    function createAccount(address tokenContract, uint256 tokenId) public returns (address) {
        require(tokenContract != address(0), "Invalid token contract");
        require(tokenId > 0, "Invalid token ID");

        address existing = accountOf[tokenContract][tokenId];
        if (existing != address(0)) return existing;

        TokenBoundAccount acct = new TokenBoundAccount();
        acct.initialize(address(this), tokenContract, tokenId);
        accountOf[tokenContract][tokenId] = address(acct);

        emit AccountCreated(address(acct), accountImplementation, block.chainid, tokenContract, tokenId);
        return address(acct);
    }

    // Batch creation for efficiency
    function createAccounts(address tokenContract, uint256[] calldata tokenIds) external returns (address[] memory) {
        address[] memory accounts = new address[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            accounts[i] = createAccount(tokenContract, tokenIds[i]);
        }
        return accounts;
    }

    function getAccount(address tokenContract, uint256 tokenId) external view returns (address) {
        return accountOf[tokenContract][tokenId];
    }

    // EIP-6551 compatibility: predict account address without deployment
    function account(address tokenContract, uint256 tokenId) external view returns (address) {
        return accountOf[tokenContract][tokenId];
    }

    // View function to check if account exists
    function accountExists(address tokenContract, uint256 tokenId) external view returns (bool) {
        return accountOf[tokenContract][tokenId] != address(0);
    }
}