// SPDX-License-Identifier: MIT
// Interface contract - immutable
// No ownership required for interfaces
// Updated for ARCx V2 Enhanced integration

pragma solidity ^0.8.21;

/**
 * @title IPoolManager - Uniswap V4 Pool Manager Interface
 * @dev Interface for interacting with Uniswap V4 pool management functions
 * @notice Defines pool operations for ARCx V2 Enhanced token liquidity management
 * 
 * @custom:security-contact security@arcexchange.io
 * @custom:version 2.0.0
 * @custom:interface Uniswap V4 integration
 * 
 * FEATURES:
 * - Pool initialization with custom parameters and hooks
 * - Advanced pool key structure with hook integration
 * - Compatible with ARCx V2 Enhanced dynamic fee mechanisms
 * - Supports MEV protection through hook system
 * 
 * USAGE:
 * - Used by ARCSwap and pool deployment scripts
 * - Enables creation of ARCX2/WETH and ARCX2/USDC pools
 * - Integrates with custom hooks for enhanced trading features
 * 
 * TROUBLESHOOTING:
 * - Ensure proper fee tier selection (0.05% for stablecoins)
 * - Hook address must be valid and properly deployed
 * - Pool initialization requires sufficient liquidity provision
 */

struct PoolKey {
    address currency0;
    address currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

interface IPoolManager {
    function initialize(
        PoolKey memory key,
        uint160 sqrtPriceX96
    ) external returns (int24 tick);
    
    function getSlot0(bytes32 id)
        external
        view
        returns (
            uint160 sqrtPriceX96,
            int24 tick,
            uint8 protocolFee,
            uint24 lpFee
        );
}
