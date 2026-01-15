// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../contracts/registry/ARCModelRegistry.sol";
import "../contracts/registry/IARCModelRegistry.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/libraries/ModelClass.sol";
import "../contracts/libraries/Errors.sol";

/**
 * @title Registry Test Suite
 * @notice Tests for ARCModelRegistry contract
 */
contract RegistryTest is Test {
    ARCModelRegistry public registry;
    ARCGenesis public genesis;
    
    address public governance = address(0x1);
    address public user = address(0x2);
    
    bytes32 constant GENESIS_HASH = keccak256("ARC_GENESIS_V1");
    bytes32 constant INVARIANT_HASH = keccak256("INVARIANT_GENERATIVE");
    bytes32 constant METADATA_HASH = keccak256("MODEL_METADATA_IPFS");
    bytes32 constant LINEAGE_HASH = keccak256("LINEAGE");
    
    function setUp() public {
        // Deploy genesis
        genesis = new ARCGenesis();
        uint8[] memory classes = new uint8[](1);
        classes[0] = ModelClass.GENERATIVE;
        bytes32[] memory invariants = new bytes32[](1);
        invariants[0] = INVARIANT_HASH;
        genesis.initialize(GENESIS_HASH, classes, invariants);
        
        // Deploy registry
        registry = new ARCModelRegistry();
        registry.initialize(address(genesis), governance);
        
        // Grant registrar role to user
        vm.prank(governance);
        registry.grantRole(registry.REGISTRAR_ROLE(), user);
    }
    
    function testRegisterModel() public {
        vm.prank(user);
        bytes32 modelId = registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
        
        assertTrue(modelId != bytes32(0));
        assertTrue(registry.isModelActive(modelId));
        
        IARCModelRegistry.ModelRecord memory model = registry.getModel(modelId);
        assertEq(model.classId, ModelClass.GENERATIVE);
        assertEq(model.metadataHash, METADATA_HASH);
        assertEq(model.registrant, user);
        assertEq(model.version, 1);
    }
    
    function testCannotRegisterWithDisabledClass() public {
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Errors.ModelClassNotEnabled.selector, ModelClass.TRANSFORMER));
        registry.registerModel(
            ModelClass.TRANSFORMER, // Not enabled in genesis
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
    }
    
    function testCannotRegisterWithoutRole() public {
        address unauthorized = address(0x3);
        
        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSelector(Errors.Unauthorized.selector, unauthorized));
        registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
    }
    
    function testFreezeModel() public {
        vm.prank(user);
        bytes32 modelId = registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
        
        vm.prank(governance);
        registry.freezeModel(modelId, "Test freeze");
        
        assertFalse(registry.isModelActive(modelId));
        
        IARCModelRegistry.ModelRecord memory model = registry.getModel(modelId);
        assertEq(uint(model.status), uint(IARCModelRegistry.ModelStatus.Frozen));
    }
    
    function testUnfreezeModel() public {
        vm.prank(user);
        bytes32 modelId = registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
        
        vm.prank(governance);
        registry.freezeModel(modelId, "Test freeze");
        
        vm.prank(governance);
        registry.unfreezeModel(modelId);
        
        assertTrue(registry.isModelActive(modelId));
    }
    
    function testRevokeModel() public {
        vm.prank(user);
        bytes32 modelId = registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
        
        vm.prank(governance);
        registry.revokeModel(modelId, "Test revoke");
        
        assertFalse(registry.isModelActive(modelId));
        
        IARCModelRegistry.ModelRecord memory model = registry.getModel(modelId);
        assertEq(uint(model.status), uint(IARCModelRegistry.ModelStatus.Revoked));
    }
    
    function testGetModelsByRegistrant() public {
        vm.startPrank(user);
        bytes32 modelId1 = registry.registerModel(ModelClass.GENERATIVE, METADATA_HASH, 1, LINEAGE_HASH);
        bytes32 modelId2 = registry.registerModel(ModelClass.GENERATIVE, keccak256("METADATA2"), 2, LINEAGE_HASH);
        vm.stopPrank();
        
        bytes32[] memory models = registry.getModelsByRegistrant(user);
        assertEq(models.length, 2);
        assertEq(models[0], modelId1);
        assertEq(models[1], modelId2);
    }
    
    function testGetModelsByClass() public {
        vm.prank(user);
        bytes32 modelId1 = registry.registerModel(ModelClass.GENERATIVE, METADATA_HASH, 1, LINEAGE_HASH);
        
        bytes32[] memory models = registry.getModelsByClass(ModelClass.GENERATIVE);
        assertEq(models.length, 1);
        assertEq(models[0], modelId1);
    }
    
    function testPauseUnpause() public {
        vm.prank(governance);
        registry.pause();
        
        vm.prank(user);
        vm.expectRevert("Pausable: paused");
        registry.registerModel(ModelClass.GENERATIVE, METADATA_HASH, 1, LINEAGE_HASH);
        
        vm.prank(governance);
        registry.unpause();
        
        vm.prank(user);
        bytes32 modelId = registry.registerModel(ModelClass.GENERATIVE, METADATA_HASH, 1, LINEAGE_HASH);
        assertTrue(modelId != bytes32(0));
    }
}
