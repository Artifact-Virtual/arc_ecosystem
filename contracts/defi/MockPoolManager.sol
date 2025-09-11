// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockPoolManager {
    struct Pool {
        address token0;
        address token1;
        uint24 fee;
        uint128 liquidity;
        uint256 reserve0;
        uint256 reserve1;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(address => mapping(address => bytes32)) public poolIds;

    event PoolCreated(address indexed token0, address indexed token1, uint24 fee);
    event LiquidityAdded(bytes32 indexed poolId, uint256 amount0, uint256 amount1);
    event Swap(bytes32 indexed poolId, address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out);

    function createPool(address token0, address token1, uint24 fee) external returns (bytes32 poolId) {
        require(token0 < token1, "Tokens must be ordered");
        poolId = keccak256(abi.encodePacked(token0, token1, fee));
        require(pools[poolId].token0 == address(0), "Pool already exists");

        pools[poolId] = Pool(token0, token1, fee, 0, 0, 0);
        poolIds[token0][token1] = poolId;
        poolIds[token1][token0] = poolId;

        emit PoolCreated(token0, token1, fee);
    }

    function addLiquidity(bytes32 poolId, uint256 amount0, uint256 amount1) external {
        Pool storage pool = pools[poolId];
        require(pool.token0 != address(0), "Pool does not exist");

        IERC20(pool.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(pool.token1).transferFrom(msg.sender, address(this), amount1);

        pool.reserve0 += amount0;
        pool.reserve1 += amount1;
        pool.liquidity += uint128(amount0 + amount1); // Simplified

        emit LiquidityAdded(poolId, amount0, amount1);
    }

    function swap(bytes32 poolId, bool zeroForOne, uint256 amountIn, uint256 amountOutMin) external payable returns (uint256 amountOut) {
        Pool storage pool = pools[poolId];
        require(pool.token0 != address(0), "Pool does not exist");

        address tokenIn = zeroForOne ? pool.token0 : pool.token1;
        address tokenOut = zeroForOne ? pool.token1 : pool.token0;
        uint256 reserveIn = zeroForOne ? pool.reserve0 : pool.reserve1;
        uint256 reserveOut = zeroForOne ? pool.reserve1 : pool.reserve0;

        // Constant product AMM with fee
        uint256 amountInWithFee = amountIn * (10000 - pool.fee);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * 10000 + amountInWithFee);
        require(amountOut >= amountOutMin, "Insufficient output amount");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        pool.reserve0 = zeroForOne ? pool.reserve0 + amountIn : pool.reserve0 - amountOut;
        pool.reserve1 = zeroForOne ? pool.reserve1 - amountOut : pool.reserve1 + amountIn;

        emit Swap(poolId, msg.sender, zeroForOne ? amountIn : 0, zeroForOne ? 0 : amountIn, zeroForOne ? 0 : amountOut, zeroForOne ? amountOut : 0);
    }

    function getPool(address token0, address token1, uint24 fee) external view returns (Pool memory) {
        bytes32 poolId = keccak256(abi.encodePacked(token0 < token1 ? token0 : token1, token0 < token1 ? token1 : token0, fee));
        return pools[poolId];
    }
}
