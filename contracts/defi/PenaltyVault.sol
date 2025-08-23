// SPDX-License-Identifier: MIT
// Immutable contract
// Treasury Safe = owner

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PenaltyVault - Collector of exit penalties
contract PenaltyVault is Ownable {
    IERC20 public immutable arcx;

    constructor(address _arcx) {
        arcx = IERC20(_arcx);
    }

    /// @notice Sweep penalties to a beneficiary (e.g. Treasury or Vault)
    function sweep(address to) external onlyOwner {
        uint256 bal = arcx.balanceOf(address(this));
        require(bal > 0, "No balance");
        arcx.transfer(to, bal);
    }
}
