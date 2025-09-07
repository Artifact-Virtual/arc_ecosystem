// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Uniswap V4 IHooks Interface
 * @dev Interface for Uniswap V4 hooks that can be called during pool operations
 * @notice This interface defines the callback functions that hooks must implement
 */
interface IHooks {
    /**
     * @notice Called before a swap operation
     * @param sender The address that initiated the swap
     * @param key The pool key
     * @param params The swap parameters
     * @return bytes4 The function selector to continue or revert
     */
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params
    ) external returns (bytes4);

    /**
     * @notice Called after a swap operation
     * @param sender The address that initiated the swap
     * @param key The pool key
     * @param params The swap parameters
     * @param delta The net input/output amounts for the swap
     */
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta calldata delta
    ) external returns (bytes4);

    /**
     * @notice Called before a modify position operation
     * @param sender The address that initiated the position modification
     * @param key The pool key
     * @param params The modify position parameters
     */
    function beforeModifyPosition(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyPositionParams calldata params
    ) external returns (bytes4);

    /**
     * @notice Called after a modify position operation
     * @param sender The address that initiated the position modification
     * @param key The pool key
     * @param params The modify position parameters
     * @param delta The net input/output amounts for the position modification
     */
    function afterModifyPosition(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyPositionParams calldata params,
        BalanceDelta calldata delta
    ) external returns (bytes4);

    /**
     * @notice Called before a donate operation
     * @param sender The address that initiated the donate
     * @param key The pool key
     * @param amount0 The amount of token0 to donate
     * @param amount1 The amount of token1 to donate
     */
    function beforeDonate(
        address sender,
        PoolKey calldata key,
        uint256 amount0,
        uint256 amount1
    ) external returns (bytes4);

    /**
     * @notice Called after a donate operation
     * @param sender The address that initiated the donate
     * @param key The pool key
     * @param amount0 The amount of token0 donated
     * @param amount1 The amount of token1 donated
     */
    function afterDonate(
        address sender,
        PoolKey calldata key,
        uint256 amount0,
        uint256 amount1
    ) external returns (bytes4);
}

/**
 * @title Uniswap V4 Pool Key
 * @dev Struct representing a Uniswap V4 pool configuration
 */
struct PoolKey {
    address currency0;
    address currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

/**
 * @title Balance Delta
 * @dev Struct representing the net change in token balances
 */
struct BalanceDelta {
    int256 amount0;
    int256 amount1;
}

/**
 * @title IPoolManager Interface
 * @dev Interface for Uniswap V4 Pool Manager operations
 */
interface IPoolManager {
    struct SwapParams {
        bool zeroForOne;
        int256 amountSpecified;
        uint160 sqrtPriceLimitX96;
    }

    struct ModifyPositionParams {
        int24 tickLower;
        int24 tickUpper;
        int256 liquidityDelta;
    }

    function unlock(bytes calldata data) external returns (bytes memory);
}
