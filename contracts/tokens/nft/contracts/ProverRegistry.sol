// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProverRegistry is Ownable {
    mapping(address => uint256) public stake;
    mapping(address => bool) public registered;

    event ProverRegistered(address indexed prover, uint256 stakeAmount);
    event ProverSlashed(address indexed prover, uint256 amount);

    function registerProver() external payable {
        require(msg.value > 0, "stake required");
        stake[msg.sender] += msg.value;
        registered[msg.sender] = true;
        emit ProverRegistered(msg.sender, msg.value);
    }

    // simple slash function callable by owner (replace with governance/challenge window later)
    function slashProver(address prover, uint256 amount) external onlyOwner {
        require(stake[prover] >= amount, "insufficient stake");
        stake[prover] -= amount;
        emit ProverSlashed(prover, amount);
    }

    function proverStake(address prover) external view returns (uint256) {
        return stake[prover];
    }
}