// contracts/TokenRecovery.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenRecovery Contract
 * @dev Emergency recovery contract for tokens stuck in immutable contracts
 * Uses delegatecall pattern to recover tokens from contracts that hold their own tokens
 */
contract TokenRecovery is AccessControl {
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    address public immutable arcxToken;
    address public deployer;

    event TokensRecovered(address indexed token, address indexed from, address indexed to, uint256 amount);
    event RecoveryAttempted(address indexed contractAddress, bool success);

    constructor(address _arcxToken, address _deployer) {
        arcxToken = _arcxToken;
        deployer = _deployer;
        _grantRole(DEFAULT_ADMIN_ROLE, _deployer);
        _grantRole(RECOVERY_ROLE, _deployer);
    }

    /**
     * @dev Attempt to recover tokens using delegatecall to the stuck contract
     * This works by calling the stuck contract and having it transfer tokens to us
     */
    function recoverTokensDelegateCall(
        address stuckContract,
        address tokenAddress,
        uint256 amount
    ) external onlyRole(RECOVERY_ROLE) returns (bool) {
        require(stuckContract != address(0), "Invalid contract address");
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Invalid amount");

        // Prepare the call data for transfer function
        bytes memory transferData = abi.encodeWithSignature(
            "transfer(address,uint256)",
            deployer,
            amount
        );

        // Attempt delegatecall to the stuck contract
        (bool success, bytes memory returnData) = stuckContract.delegatecall(transferData);

        emit RecoveryAttempted(stuckContract, success);

        if (success) {
            emit TokensRecovered(tokenAddress, stuckContract, deployer, amount);
        }

        return success;
    }

    /**
     * @dev Direct recovery using low-level call
     */
    function recoverTokensLowLevel(
        address stuckContract,
        bytes calldata recoveryCall
    ) external onlyRole(RECOVERY_ROLE) returns (bool, bytes memory) {
        require(stuckContract != address(0), "Invalid contract address");

        (bool success, bytes memory returnData) = stuckContract.call(recoveryCall);

        emit RecoveryAttempted(stuckContract, success);

        return (success, returnData);
    }

    /**
     * @dev Emergency selfdestruct to recover any ETH accidentally sent here
     */
    function emergencySelfDestruct() external onlyRole(DEFAULT_ADMIN_ROLE) {
        selfdestruct(payable(deployer));
    }

    /**
     * @dev Check if a contract has a specific function
     */
    function contractHasFunction(address contractAddress, bytes4 functionSig) external view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(contractAddress)
        }

        if (codeSize == 0) return false;

        bytes memory code = new bytes(codeSize);
        assembly {
            extcodecopy(contractAddress, add(code, 0x20), 0, codeSize)
        }

        // Check if function signature exists in bytecode
        for (uint256 i = 0; i < codeSize - 3; i++) {
            if (bytes4(code[i]) | bytes4(code[i+1]) << 8 | bytes4(code[i+2]) << 16 | bytes4(code[i+3]) << 24 == functionSig) {
                return true;
            }
        }

        return false;
    }
}
