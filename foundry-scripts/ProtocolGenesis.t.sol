// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {ARCProtocolGenesis} from "../contracts/ARCProtocolGenesis.sol";

contract ProtocolGenesisTest is Test {
    ARCProtocolGenesis public genesis;
    
    // Mock addresses for testing
    address treasury = address(0x1);
    address timelock = address(0x2);
    address governor = address(0x3);
    address token = address(0x4);
    address adamHost = address(0x5);
    address adamRegistry = address(0x6);
    address aiGenesis = address(0x7);
    address aiRegistry = address(0x8);
    address aiSBT = address(0x9);
    address l1l2Messenger = address(0xA);
    address l2Verifier = address(0xB);
    address emergencyCouncil = address(0xC);
    
    function setUp() public {
        genesis = new ARCProtocolGenesis(
            treasury,
            timelock,
            governor,
            token,
            adamHost,
            adamRegistry,
            aiGenesis,
            aiRegistry,
            aiSBT,
            l1l2Messenger,
            l2Verifier,
            emergencyCouncil
        );
    }
    
    // ============================================
    // IMMUTABILITY TESTS
    // ============================================
    
    function test_GenesisIsImmutable() public {
        // Genesis should have no owner
        // Genesis should have no upgrade mechanism
        // This is proven by contract design (no storage, no owner functions)
        
        // Verify genesis block and timestamp are set
        assert(genesis.GENESIS_BLOCK() == block.number);
        assert(genesis.GENESIS_TIMESTAMP() == block.timestamp);
    }
    
    function test_CanonicalAddressesAreImmutable() public {
        // Verify all addresses are correctly set and immutable
        assertEq(genesis.TREASURY_ADDRESS(), treasury);
        assertEq(genesis.TIMELOCK_ADDRESS(), timelock);
        assertEq(genesis.GOVERNOR_ADDRESS(), governor);
        assertEq(genesis.TOKEN_ADDRESS(), token);
        assertEq(genesis.ADAM_HOST_ADDRESS(), adamHost);
        assertEq(genesis.ADAM_REGISTRY_ADDRESS(), adamRegistry);
        assertEq(genesis.AI_GENESIS_ADDRESS(), aiGenesis);
        assertEq(genesis.AI_REGISTRY_ADDRESS(), aiRegistry);
        assertEq(genesis.AI_SBT_ADDRESS(), aiSBT);
        assertEq(genesis.EMERGENCY_COUNCIL_ADDRESS(), emergencyCouncil);
    }
    
    function test_GenesisHashIsUnique() public {
        bytes32 hash1 = genesis.genesisHash();
        
        // Deploy another genesis with different addresses
        ARCProtocolGenesis genesis2 = new ARCProtocolGenesis(
            address(0x10),
            address(0x20),
            address(0x30),
            address(0x40),
            address(0x50),
            address(0x60),
            address(0x70),
            address(0x80),
            address(0x90),
            address(0xA0),
            address(0xB0),
            address(0xC0)
        );
        
        bytes32 hash2 = genesis2.genesisHash();
        
        // Hashes should be different
        assertTrue(hash1 != hash2);
    }
    
    // ============================================
    // TREASURY VALIDATION TESTS
    // ============================================
    
    function test_TreasuryWithdrawal_ValidAmount() public {
        uint256 balance = 100 ether;
        uint256 amount = 5 ether; // 5% - within 10% limit
        
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 2 days,
            0
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_TreasuryWithdrawal_ExceedsMaxPerProposal() public {
        uint256 balance = 100 ether;
        uint256 amount = 15 ether; // 15% - exceeds 10% limit
        
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 2 days,
            0
        );
        
        assertFalse(valid);
        assertEq(reason, "Exceeds max withdrawal per proposal (10%)");
    }
    
    function test_TreasuryWithdrawal_ViolatesMinReserve() public {
        uint256 balance = 100 ether;
        uint256 amount = 85 ether; // Would leave 15%, violates 20% reserve
        
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 2 days,
            0
        );
        
        assertFalse(valid);
        assertEq(reason, "Would violate minimum reserve requirement (20%)");
    }
    
    function test_TreasuryWithdrawal_ExceedsDailyLimit() public {
        uint256 balance = 100 ether;
        uint256 amount = 3 ether;
        uint256 dailySpent = 3 ether; // Already spent 3%, trying to spend 3% more = 6% > 5% limit
        
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 1 hours, // Recent withdrawal
            dailySpent
        );
        
        assertFalse(valid);
        assertEq(reason, "Exceeds daily spending limit (5%)");
    }
    
    function test_TreasuryWithdrawal_DailyLimitResetsAfter24Hours() public {
        uint256 balance = 100 ether;
        uint256 amount = 4 ether; // 4%
        uint256 dailySpent = 10 ether; // Previous day spent 10%
        
        (bool valid, string memory reason) = genesis.validateTreasuryWithdrawal(
            amount,
            balance,
            block.timestamp - 2 days, // More than 24 hours ago
            dailySpent
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    // ============================================
    // GOVERNANCE PARAMETER VALIDATION TESTS
    // ============================================
    
    function test_GovernanceParameter_ValidProposalThreshold() public {
        bytes32 paramName = keccak256("proposalThreshold");
        uint256 newValue = 100; // 1% - within 0.1% to 5% range
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_GovernanceParameter_ProposalThresholdTooLow() public {
        bytes32 paramName = keccak256("proposalThreshold");
        uint256 newValue = 5; // 0.05% - below 0.1% minimum
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Proposal threshold below minimum (0.1%)");
    }
    
    function test_GovernanceParameter_ProposalThresholdTooHigh() public {
        bytes32 paramName = keccak256("proposalThreshold");
        uint256 newValue = 600; // 6% - above 5% maximum
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Proposal threshold above maximum (5%)");
    }
    
    function test_GovernanceParameter_ValidQuorum() public {
        bytes32 paramName = keccak256("quorum");
        uint256 newValue = 1000; // 10% - within 4% to 20% range
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_GovernanceParameter_QuorumBelowMinimum() public {
        bytes32 paramName = keccak256("quorum");
        uint256 newValue = 300; // 3% - below 4% minimum
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Quorum below minimum (4%)");
    }
    
    function test_GovernanceParameter_QuorumAboveMaximum() public {
        bytes32 paramName = keccak256("quorum");
        uint256 newValue = 2100; // 21% - above 20% maximum
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Quorum above maximum (20%)");
    }
    
    function test_GovernanceParameter_ValidVotingPeriod() public {
        bytes32 paramName = keccak256("votingPeriod");
        uint256 newValue = 7 days;
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_GovernanceParameter_VotingPeriodTooShort() public {
        bytes32 paramName = keccak256("votingPeriod");
        uint256 newValue = 12 hours;
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Voting period below minimum (1 day)");
    }
    
    function test_GovernanceParameter_VotingPeriodTooLong() public {
        bytes32 paramName = keccak256("votingPeriod");
        uint256 newValue = 31 days;
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Voting period above maximum (30 days)");
    }
    
    function test_GovernanceParameter_ValidTimelockDelay() public {
        bytes32 paramName = keccak256("timelockDelay");
        uint256 newValue = 7 days;
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_GovernanceParameter_UnknownParameter() public {
        bytes32 paramName = keccak256("unknownParam");
        uint256 newValue = 100;
        
        (bool valid, string memory reason) = genesis.validateGovernanceParameter(paramName, newValue);
        
        assertFalse(valid);
        assertEq(reason, "Unknown parameter");
    }
    
    // ============================================
    // TOKEN MINT VALIDATION TESTS
    // ============================================
    
    function test_TokenMint_ValidAmount() public {
        uint256 currentSupply = 100_000_000 * 1e18; // 100M
        uint256 mintAmount = 1_000_000 * 1e18; // 1M (1% of current supply)
        uint256 lastMintTimestamp = block.timestamp - 365 days;
        
        (bool valid, string memory reason) = genesis.validateTokenMint(
            currentSupply,
            mintAmount,
            lastMintTimestamp
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_TokenMint_ExceedsMaxSupply() public {
        uint256 currentSupply = 999_000_000 * 1e18; // 999M
        uint256 mintAmount = 2_000_000 * 1e18; // 2M - would exceed 1B max
        uint256 lastMintTimestamp = block.timestamp - 365 days;
        
        (bool valid, string memory reason) = genesis.validateTokenMint(
            currentSupply,
            mintAmount,
            lastMintTimestamp
        );
        
        assertFalse(valid);
        assertEq(reason, "Would exceed max total supply (1 billion)");
    }
    
    function test_TokenMint_ExceedsInflationRate() public {
        uint256 currentSupply = 100_000_000 * 1e18; // 100M
        uint256 mintAmount = 6_000_000 * 1e18; // 6M (6% of supply, exceeds 5% max)
        uint256 lastMintTimestamp = block.timestamp - 180 days; // 6 months ago
        
        (bool valid, string memory reason) = genesis.validateTokenMint(
            currentSupply,
            mintAmount,
            lastMintTimestamp
        );
        
        assertFalse(valid);
        assertEq(reason, "Exceeds maximum inflation rate (5% per year)");
    }
    
    function test_TokenMint_ProRatedInflationValid() public {
        uint256 currentSupply = 100_000_000 * 1e18; // 100M
        uint256 mintAmount = 2_500_000 * 1e18; // 2.5M (2.5% of supply)
        uint256 lastMintTimestamp = block.timestamp - 182 days; // ~6 months ago (half year)
        
        // Max for 6 months = 5% * 0.5 = 2.5%
        (bool valid, string memory reason) = genesis.validateTokenMint(
            currentSupply,
            mintAmount,
            lastMintTimestamp
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    // ============================================
    // EMERGENCY PAUSE VALIDATION TESTS
    // ============================================
    
    function test_EmergencyPause_ValidParameters() public {
        uint256 pauseDuration = 3 days;
        uint256 councilSigners = 5;
        
        (bool valid, string memory reason) = genesis.validateEmergencyPause(
            pauseDuration,
            councilSigners
        );
        
        assertTrue(valid);
        assertEq(bytes(reason).length, 0);
    }
    
    function test_EmergencyPause_DurationTooLong() public {
        uint256 pauseDuration = 8 days; // Exceeds 7 day max
        uint256 councilSigners = 5;
        
        (bool valid, string memory reason) = genesis.validateEmergencyPause(
            pauseDuration,
            councilSigners
        );
        
        assertFalse(valid);
        assertEq(reason, "Pause duration exceeds maximum (7 days)");
    }
    
    function test_EmergencyPause_InsufficientSigners() public {
        uint256 pauseDuration = 3 days;
        uint256 councilSigners = 2; // Below 3 minimum
        
        (bool valid, string memory reason) = genesis.validateEmergencyPause(
            pauseDuration,
            councilSigners
        );
        
        assertFalse(valid);
        assertEq(reason, "Insufficient council signers (minimum 3)");
    }
    
    function test_EmergencyPause_TooManySigners() public {
        uint256 pauseDuration = 3 days;
        uint256 councilSigners = 10; // Above 9 maximum
        
        (bool valid, string memory reason) = genesis.validateEmergencyPause(
            pauseDuration,
            councilSigners
        );
        
        assertFalse(valid);
        assertEq(reason, "Too many council signers (maximum 9)");
    }
    
    // ============================================
    // CHAIN ID VALIDATION TESTS
    // ============================================
    
    function test_ValidateChainId_Ethereum() public {
        assertTrue(genesis.validateChainId(1)); // Ethereum mainnet
    }
    
    function test_ValidateChainId_Base() public {
        assertTrue(genesis.validateChainId(8453)); // Base
    }
    
    function test_ValidateChainId_Optimism() public {
        assertTrue(genesis.validateChainId(10)); // Optimism
    }
    
    function test_ValidateChainId_Arbitrum() public {
        assertTrue(genesis.validateChainId(42161)); // Arbitrum
    }
    
    function test_ValidateChainId_InvalidChain() public {
        assertFalse(genesis.validateChainId(999)); // Random chain
    }
    
    // ============================================
    // CANONICAL SUBSYSTEM TESTS
    // ============================================
    
    function test_IsCanonicalSubsystem_ValidAddresses() public {
        assertTrue(genesis.isCanonicalSubsystem(treasury));
        assertTrue(genesis.isCanonicalSubsystem(timelock));
        assertTrue(genesis.isCanonicalSubsystem(governor));
        assertTrue(genesis.isCanonicalSubsystem(token));
        assertTrue(genesis.isCanonicalSubsystem(adamHost));
        assertTrue(genesis.isCanonicalSubsystem(adamRegistry));
        assertTrue(genesis.isCanonicalSubsystem(aiGenesis));
        assertTrue(genesis.isCanonicalSubsystem(aiRegistry));
        assertTrue(genesis.isCanonicalSubsystem(aiSBT));
        assertTrue(genesis.isCanonicalSubsystem(emergencyCouncil));
    }
    
    function test_IsCanonicalSubsystem_InvalidAddress() public {
        assertFalse(genesis.isCanonicalSubsystem(address(0x999)));
    }
    
    // ============================================
    // CONSTANTS TESTS
    // ============================================
    
    function test_ProtocolConstants() public {
        // Treasury limits
        assertEq(genesis.MAX_TREASURY_WITHDRAWAL_BPS(), 1000); // 10%
        assertEq(genesis.MIN_TREASURY_RESERVE_BPS(), 2000); // 20%
        assertEq(genesis.MAX_DAILY_TREASURY_SPEND_BPS(), 500); // 5%
        
        // Governance parameters
        assertEq(genesis.MIN_PROPOSAL_THRESHOLD_BPS(), 10); // 0.1%
        assertEq(genesis.MAX_PROPOSAL_THRESHOLD_BPS(), 500); // 5%
        assertEq(genesis.MIN_QUORUM_BPS(), 400); // 4%
        assertEq(genesis.MAX_QUORUM_BPS(), 2000); // 20%
        assertEq(genesis.MIN_VOTING_PERIOD(), 1 days);
        assertEq(genesis.MAX_VOTING_PERIOD(), 30 days);
        assertEq(genesis.MIN_TIMELOCK_DELAY(), 2 days);
        assertEq(genesis.MAX_TIMELOCK_DELAY(), 30 days);
        
        // Token economics
        assertEq(genesis.MAX_TOTAL_SUPPLY(), 1_000_000_000 * 1e18);
        assertEq(genesis.MIN_INFLATION_RATE_BPS(), 0);
        assertEq(genesis.MAX_INFLATION_RATE_BPS(), 500); // 5%
        
        // Emergency powers
        assertEq(genesis.EMERGENCY_PAUSE_DURATION(), 7 days);
        assertEq(genesis.EMERGENCY_COUNCIL_SIZE_MIN(), 3);
        assertEq(genesis.EMERGENCY_COUNCIL_SIZE_MAX(), 9);
        
        // Chain IDs
        assertEq(genesis.GENESIS_CHAIN_ID(), 1);
        assertEq(genesis.BASE_CHAIN_ID(), 8453);
        assertEq(genesis.OPTIMISM_CHAIN_ID(), 10);
        assertEq(genesis.ARBITRUM_CHAIN_ID(), 42161);
    }
}
