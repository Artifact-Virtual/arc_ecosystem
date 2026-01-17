// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../contracts/sbt/ARCModelSBT.sol";
import "../contracts/sbt/IARCModelSBT.sol";
import "../contracts/registry/ARCModelRegistry.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/libraries/ModelClass.sol";
import "../contracts/libraries/Errors.sol";

/**
 * @title SBT Test Suite
 * @notice Tests for ARCModelSBT soulbound token contract
 */
contract SBTTest is Test {
    ARCModelSBT public sbt;
    ARCModelRegistry public registry;
    ARCGenesis public genesis;
    
    address public governance = address(0x1);
    address public user = address(0x2);
    address public modelOwner = address(0x3);
    
    bytes32 constant GENESIS_HASH = keccak256("ARC_GENESIS_V1");
    bytes32 constant INVARIANT_HASH = keccak256("INVARIANT_GENERATIVE");
    bytes32 constant METADATA_HASH = keccak256("MODEL_METADATA_IPFS");
    bytes32 constant LINEAGE_HASH = keccak256("LINEAGE");
    
    bytes32 public modelId;
    
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
        
        // Deploy SBT
        sbt = new ARCModelSBT();
        sbt.initialize(address(registry), governance, "ARC Model SBT", "ARCM");
        
        // Setup: register a model
        vm.prank(governance);
        registry.grantRole(registry.REGISTRAR_ROLE(), user);
        
        vm.prank(user);
        modelId = registry.registerModel(
            ModelClass.GENERATIVE,
            METADATA_HASH,
            1,
            LINEAGE_HASH
        );
    }
    
    function testIssueSBT() public {
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(
            modelOwner,
            modelId,
            ModelClass.GENERATIVE,
            1,
            LINEAGE_HASH
        );
        
        assertEq(tokenId, 1);
        assertEq(sbt.ownerOf(tokenId), modelOwner);
        assertFalse(sbt.isRevoked(tokenId));
        
        IARCModelSBT.SBTMetadata memory metadata = sbt.getSBTMetadata(tokenId);
        assertEq(metadata.modelId, modelId);
        assertEq(metadata.classId, ModelClass.GENERATIVE);
        assertEq(metadata.version, 1);
        assertEq(metadata.lineageHash, LINEAGE_HASH);
    }
    
    function testCannotIssueSBTWithoutRole() public {
        address unauthorized = address(0x4);
        
        vm.prank(unauthorized);
        vm.expectRevert();
        sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
    }
    
    function testCannotIssueSBTForInactiveModel() public {
        bytes32 fakeModelId = keccak256("FAKE_MODEL");
        
        vm.prank(governance);
        vm.expectRevert(abi.encodeWithSelector(Errors.ModelNotRegistered.selector, fakeModelId));
        sbt.issueSBT(modelOwner, fakeModelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
    }
    
    function testCannotIssueDuplicateSBT() public {
        vm.startPrank(governance);
        sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        vm.expectRevert(abi.encodeWithSelector(Errors.SBTAlreadyIssued.selector, modelOwner));
        sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        vm.stopPrank();
    }
    
    function testRevokeSBT() public {
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(
            modelOwner,
            modelId,
            ModelClass.GENERATIVE,
            1,
            LINEAGE_HASH
        );
        
        vm.prank(governance);
        sbt.revokeSBT(tokenId, "Test revocation");
        
        assertTrue(sbt.isRevoked(tokenId));
    }
    
    function testCannotRevokeAlreadyRevokedSBT() public {
        vm.startPrank(governance);
        uint256 tokenId = sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        sbt.revokeSBT(tokenId, "Test revocation");
        
        vm.expectRevert(abi.encodeWithSelector(Errors.SBTRevoked.selector, tokenId));
        sbt.revokeSBT(tokenId, "Test revocation again");
        vm.stopPrank();
    }
    
    function testGetSBTsByOwner() public {
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        uint256[] memory tokens = sbt.getSBTsByOwner(modelOwner);
        assertEq(tokens.length, 1);
        assertEq(tokens[0], tokenId);
    }
    
    function testHasSBTForModel() public {
        vm.prank(governance);
        sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        assertTrue(sbt.hasSBTForModel(modelOwner, modelId));
        assertFalse(sbt.hasSBTForModel(user, modelId));
    }
    
    function testCannotTransferSBT() public {
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        address recipient = address(0x5);
        
        vm.prank(modelOwner);
        vm.expectRevert(Errors.SBTTransferNotAllowed.selector);
        sbt.transferFrom(modelOwner, recipient, tokenId);
    }
    
    function testCannotSafeTransferSBT() public {
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        address recipient = address(0x5);
        
        vm.prank(modelOwner);
        vm.expectRevert(Errors.SBTTransferNotAllowed.selector);
        sbt.safeTransferFrom(modelOwner, recipient, tokenId);
    }
    
    function testPauseUnpause() public {
        vm.prank(governance);
        sbt.pause();
        
        vm.prank(governance);
        vm.expectRevert("Pausable: paused");
        sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        
        vm.prank(governance);
        sbt.unpause();
        
        vm.prank(governance);
        uint256 tokenId = sbt.issueSBT(modelOwner, modelId, ModelClass.GENERATIVE, 1, LINEAGE_HASH);
        assertEq(tokenId, 1);
    }
}
