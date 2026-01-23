// SPDX-License-Identifier: MIT
// Immutable contract
// Treasury Safe = owner
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PenaltyVault - Collector of exit penalties for ARCx V2 staking
contract PenaltyVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable arcx; // ARCx V2 Enhanced token

    /// @notice Emitted when PenaltyVault is deployed
    event PenaltyVaultDeployed(address indexed arcxToken, address indexed owner);
    
    /// @notice Emitted when funds are swept from the penalty vault
    event Swept(address indexed to, uint256 amount, address indexed operator);
    
    /// @notice Emitted when tokens (other than ARCx) are recovered
    event ERC20Recovered(address indexed token, address indexed to, uint256 amount);
    
    /// @notice Emitted when ETH is recovered
    event ETHRecovered(address indexed to, uint256 amount);

    constructor(address _arcx) {
        require(_arcx != address(0), "ARCx token cannot be zero address");
        arcx = IERC20(_arcx);
        emit PenaltyVaultDeployed(_arcx, msg.sender);
    }

    /// @notice Sweep penalties to a beneficiary (e.g. Treasury or Vault)
    function sweep(address to) external onlyOwner {
        require(to != address(0), "Cannot sweep to zero address");
        uint256 bal = arcx.balanceOf(address(this));
        require(bal > 0, "No balance");
        arcx.safeTransfer(to, bal);
        emit Swept(to, bal, msg.sender);
    }

    /// @notice Returns the current ARCx balance held in the penalty vault
    function currentBalance() external view returns (uint256) {
        return arcx.balanceOf(address(this));
    }

    /// @notice Emergency recovery of any ERC20 tokens sent to this contract by mistake
    /// @dev Only callable by owner. Cannot recover ARCx tokens.
    function recoverERC20(address tokenAddress, address to) external onlyOwner {
        require(tokenAddress != address(arcx), "Cannot recover ARCx tokens");
        require(to != address(0), "Cannot recover to zero address");
        
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        require(balance > 0, "No balance to recover");
        
        IERC20(tokenAddress).safeTransfer(to, balance);
        emit ERC20Recovered(tokenAddress, to, balance);
    }

    /// @notice Emergency recovery of any ETH sent to this contract by mistake
    /// @dev Only callable by owner
    function recoverETH(address payable to) external onlyOwner {
        require(to != address(0), "Cannot recover to zero address");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH balance to recover");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(to, balance);
    }

    /// @notice Accept ETH (optional - in case someone sends by mistake)
    receive() external payable {
        // Accept ETH transfers
    }

    /// @notice Accept ETH with calldata (optional)
    fallback() external payable {
        // Accept ETH transfers with data
    }
}
