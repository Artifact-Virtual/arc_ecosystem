// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/genesis/IARCGenesis.sol";
import "../contracts/libraries/ModelClass.sol";
import "../contracts/libraries/Errors.sol";

/**
 * @title Genesis Test Suite
 * @notice Tests for ARCGenesis immutable root contract
 */
contract GenesisTest is Test {
    ARCGenesis public genesis;
    
    // Test data
    bytes32 constant GENESIS_HASH = keccak256("ARC_GENESIS_V1");
    bytes32 constant INVARIANT_HASH_1 = keccak256("INVARIANT_GENERATIVE");
    bytes32 constant INVARIANT_HASH_2 = keccak256("INVARIANT_TRANSFORMER");
    
    function setUp() public {
        genesis = new ARCGenesis();
    }
    
    function testInitialize() public {
        uint8[] memory classes = new uint8[](2);
        classes[0] = ModelClass.GENERATIVE;
        classes[1] = ModelClass.TRANSFORMER;
        
        bytes32[] memory invariants = new bytes32[](2);
        invariants[0] = INVARIANT_HASH_1;
        invariants[1] = INVARIANT_HASH_2;
        
        vm.expectEmit(true, false, false, true);
        emit IARCGenesis.ModelClassEnabled(ModelClass.GENERATIVE, INVARIANT_HASH_1);
        
        genesis.initialize(GENESIS_HASH, classes, invariants);
        
        assertEq(genesis.genesisHash(), GENESIS_HASH);
        assertTrue(genesis.isClassEnabled(ModelClass.GENERATIVE));
        assertTrue(genesis.isClassEnabled(ModelClass.TRANSFORMER));
        assertEq(genesis.getInvariantHash(ModelClass.GENERATIVE), INVARIANT_HASH_1);
    }
    
    function testCannotInitializeTwice() public {
        uint8[] memory classes = new uint8[](1);
        classes[0] = ModelClass.GENERATIVE;
        
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH_1;
        
        genesis.initialize(GENESIS_HASH, classes, invariants);
        
        vm.expectRevert(Errors.GenesisAlreadyInitialized.selector);
        genesis.initialize(GENESIS_HASH, classes, invariants);
    }
    
    function testCannotInitializeWithZeroGenesisHash() public {
        uint8[] memory classes = new uint8[](1);
        classes[0] = ModelClass.GENERATIVE;
        
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH_1;
        
        vm.expectRevert(Errors.InvalidGenesisHash.selector);
        genesis.initialize(bytes32(0), classes, invariants);
    }
    
    function testCannotInitializeWithInvalidClass() public {
        uint8[] memory classes = new uint8[](1);
        classes[0] = 99; // Invalid class
        
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH_1;
        
        vm.expectRevert(abi.encodeWithSelector(Errors.InvalidModelClass.selector, 99));
        genesis.initialize(GENESIS_HASH, classes, invariants);
    }
    
    function testCannotInitializeWithMismatchedArrays() public {
        uint8[] memory classes = new uint8[](2);
        classes[0] = ModelClass.GENERATIVE;
        classes[1] = ModelClass.TRANSFORMER;
        
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH_1;
        
        vm.expectRevert(abi.encodeWithSelector(Errors.InvalidParameter.selector, "Array length mismatch"));
        genesis.initialize(GENESIS_HASH, classes, invariants);
    }
    
    function testGetEnabledClasses() public {
        uint8[] memory classes = new uint8[](3);
        classes[0] = ModelClass.GENERATIVE;
        classes[1] = ModelClass.TRANSFORMER;
        classes[2] = ModelClass.CONSTITUTIONAL;
        
        bytes32[] memory invariants = new bytes32[](3);
        invariants[0] = INVARIANT_HASH_1;
        invariants[1] = INVARIANT_HASH_2;
        invariants[2] = keccak256("INVARIANT_CONSTITUTIONAL");
        
        genesis.initialize(GENESIS_HASH, classes, invariants);
        
        uint8[] memory enabled = genesis.getEnabledClasses();
        assertEq(enabled.length, 3);
        assertEq(enabled[0], ModelClass.GENERATIVE);
        assertEq(enabled[1], ModelClass.TRANSFORMER);
        assertEq(enabled[2], ModelClass.CONSTITUTIONAL);
    }
    
    function testVerifyModelClass() public {
        uint8[] memory classes = new uint8[](1);
        classes[0] = ModelClass.GENERATIVE;
        
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH_1;
        
        genesis.initialize(GENESIS_HASH, classes, invariants);
        
        assertTrue(genesis.verifyModelClass(ModelClass.GENERATIVE, INVARIANT_HASH_1));
        assertFalse(genesis.verifyModelClass(ModelClass.GENERATIVE, INVARIANT_HASH_2));
        assertFalse(genesis.verifyModelClass(ModelClass.TRANSFORMER, INVARIANT_HASH_1));
    }
    
    function testCannotQueryBeforeInitialization() public {
        vm.expectRevert(Errors.GenesisNotInitialized.selector);
        genesis.genesisHash();
        
        vm.expectRevert(Errors.GenesisNotInitialized.selector);
        genesis.isClassEnabled(ModelClass.GENERATIVE);
    }
}
