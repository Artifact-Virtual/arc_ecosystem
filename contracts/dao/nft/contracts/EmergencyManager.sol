// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EmergencyManager is Ownable {
    bool public paused;
    mapping(uint256 => bool) public frozenTokenAccounts; // tokenId => frozen

    event Paused();
    event Unpaused();
    event TokenAccountFrozen(uint256 tokenId);
    event TokenAccountUnfrozen(uint256 tokenId);

    modifier whenNotPaused() {
        require(!paused, "paused");
        _;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

    function freezeTokenBoundAccount(uint256 tokenId) external onlyOwner {
        frozenTokenAccounts[tokenId] = true;
        emit TokenAccountFrozen(tokenId);
    }

    function unfreezeTokenBoundAccount(uint256 tokenId) external onlyOwner {
        frozenTokenAccounts[tokenId] = false;
        emit TokenAccountUnfrozen(tokenId);
    }
}