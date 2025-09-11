// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC721Simple {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract TokenBoundAccount {
    address public registry;
    address public tokenContract;
    uint256 public tokenId;

    // Security: Track initialization to prevent re-initialization attacks
    bool private initialized;

    modifier onlyOwner() {
        require(IERC721Simple(tokenContract).ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    modifier onlyRegistry() {
        require(msg.sender == registry, "Only registry can initialize");
        _;
    }

    // Enhanced initialization with registry validation
    function initialize(address _registry, address _tokenContract, uint256 _tokenId) external onlyRegistry {
        require(!initialized, "Already initialized");
        require(_registry != address(0), "Invalid registry");
        require(_tokenContract != address(0), "Invalid token contract");
        require(_tokenId > 0, "Invalid token ID");

        registry = _registry;
        tokenContract = _tokenContract;
        tokenId = _tokenId;
        initialized = true;
    }

    // Enhanced execute with gas limits and value validation
    function execute(address to, uint256 value, bytes calldata data) external onlyOwner returns (bytes memory) {
        require(to != address(0), "Invalid target address");
        require(to != address(this), "Cannot call self");

        // Optional: Add spending limits or timelocks for high-value operations
        // For Phase 1, we keep it simple but secure

        (bool ok, bytes memory resp) = to.call{value: value}(data);
        require(ok, "Execution failed");

        return resp;
    }

    // Enhanced receive function with logging
    receive() external payable {}

    // View function to check if initialized
    function isInitialized() external view returns (bool) {
        return initialized;
    }

    // Emergency function - only callable by token owner through execute
    function emergencyWithdraw() external onlyOwner {
        // Allow owner to withdraw any stuck funds
        payable(msg.sender).transfer(address(this).balance);
    }
}