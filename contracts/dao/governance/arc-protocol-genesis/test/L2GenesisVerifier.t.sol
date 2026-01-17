// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {L2GenesisVerifier} from "../contracts/L2GenesisVerifier.sol";

contract L2GenesisVerifierTest is Test {
    L2GenesisVerifier public verifier;
    
    bytes32 constant L1_GENESIS_HASH = keccak256("TEST_GENESIS_HASH");
    address constant L1_GENESIS_ADDRESS = address(0x1234);
    uint256 constant L1_CHAIN_ID = 1;
    uint256 constant L1_GENESIS_BLOCK = 1000;
    
    function setUp() public {
        // Deploy to Base testnet (chain ID 84532)
        vm.chainId(84532);
        
        verifier = new L2GenesisVerifier(
            L1_GENESIS_HASH,
            L1_GENESIS_ADDRESS,
            L1_CHAIN_ID,
            L1_GENESIS_BLOCK
        );
    }
    
    // ============================================
    // DEPLOYMENT TESTS
    // ============================================
    
    function test_L1ReferenceIsImmutable() public {
        assertEq(verifier.L1_GENESIS_HASH(), L1_GENESIS_HASH);
        assertEq(verifier.L1_GENESIS_ADDRESS(), L1_GENESIS_ADDRESS);
        assertEq(verifier.L1_CHAIN_ID(), L1_CHAIN_ID);
        assertEq(verifier.L1_GENESIS_BLOCK(), L1_GENESIS_BLOCK);
    }
    
    function test_L2DeploymentInfoRecorded() public {
        assertEq(verifier.L2_CHAIN_ID(), 84532);
        assertEq(verifier.L2_DEPLOYMENT_BLOCK(), block.number);
        assertEq(verifier.L2_DEPLOYMENT_TIMESTAMP(), block.timestamp);
    }
    
    function test_GenesisHashMatches() public {
        assertEq(verifier.genesisHash(), L1_GENESIS_HASH);
    }
    
    function test_VerifyGenesisHash() public {
        assertTrue(verifier.verifyGenesisHash(L1_GENESIS_HASH));
        assertFalse(verifier.verifyGenesisHash(keccak256("WRONG_HASH")));
    }
    
    // ============================================
    // VALIDATION MIRRORING TESTS
    // ============================================
    
    function test_TreasuryValidation_MirrorsL1() public {
        uint256 balance = 100 ether;
        uint256 amount = 5 ether;
        
        (bool valid, string memory reason) = verifier.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 2 days,
            0
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_GovernanceValidation_MirrorsL1() public {
        bytes32 paramName = keccak256("quorum");
        uint256 newValue = 1000; // 10%
        
        (bool valid, string memory reason) = verifier.validateGovernanceParameter(
            paramName,
            newValue
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_TokenMintValidation_MirrorsL1() public {
        uint256 currentSupply = 100_000_000 * 1e18;
        uint256 mintAmount = 1_000_000 * 1e18;
        uint256 lastMintTimestamp = block.timestamp - 365 days;
        
        (bool valid, string memory reason) = verifier.validateTokenMint(
            currentSupply,
            mintAmount,
            lastMintTimestamp
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    // ============================================
    // CONSTANTS MIRRORING TESTS
    // ============================================
    
    function test_ConstantsMirrorL1Genesis() public {
        // Verify constants match L1 genesis
        assertEq(verifier.MAX_TREASURY_WITHDRAWAL_BPS(), 1000);
        assertEq(verifier.MIN_TREASURY_RESERVE_BPS(), 2000);
        assertEq(verifier.MAX_DAILY_TREASURY_SPEND_BPS(), 500);
        assertEq(verifier.MIN_PROPOSAL_THRESHOLD_BPS(), 10);
        assertEq(verifier.MAX_PROPOSAL_THRESHOLD_BPS(), 500);
        assertEq(verifier.MIN_QUORUM_BPS(), 400);
        assertEq(verifier.MAX_QUORUM_BPS(), 2000);
        assertEq(verifier.MIN_VOTING_PERIOD(), 1 days);
        assertEq(verifier.MAX_VOTING_PERIOD(), 30 days);
        assertEq(verifier.MAX_TOTAL_SUPPLY(), 1_000_000_000 * 1e18);
        assertEq(verifier.MAX_INFLATION_RATE_BPS(), 500);
        assertEq(verifier.EMERGENCY_PAUSE_DURATION(), 7 days);
    }
    
    // ============================================
    // DEPLOYMENT VALIDATION TESTS
    // ============================================
    
    function testFail_DeployWithZeroGenesisHash() public {
        new L2GenesisVerifier(
            bytes32(0),
            L1_GENESIS_ADDRESS,
            L1_CHAIN_ID,
            L1_GENESIS_BLOCK
        );
    }
    
    function testFail_DeployWithZeroGenesisAddress() public {
        new L2GenesisVerifier(
            L1_GENESIS_HASH,
            address(0),
            L1_CHAIN_ID,
            L1_GENESIS_BLOCK
        );
    }
    
    function testFail_DeployWithInvalidL1ChainId() public {
        new L2GenesisVerifier(
            L1_GENESIS_HASH,
            L1_GENESIS_ADDRESS,
            999, // Not Ethereum mainnet
            L1_GENESIS_BLOCK
        );
    }
}
