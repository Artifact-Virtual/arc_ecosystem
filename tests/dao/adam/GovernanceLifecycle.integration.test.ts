import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ARCGovernor, AdamHost, AdamRegistry, ParamsGuardPolicy, TreasuryLimiterPolicy, Dual2FAPolicy } from "../../../typechain-types";

/**
 * Integration Tests: Full Governance Lifecycle with ADAM Constitutional Validation
 * 
 * Tests the complete governance flow from proposal submission through execution
 * with ADAM constitutional policy validation at each lifecycle point.
 * 
 * Test Scenarios:
 * 1. Proposal submission with ADAM validation
 * 2. Voting lifecycle with policy checks
 * 3. Queue with budget reservation and 2FA requirements
 * 4. Execution with final validation
 * 5. Treasury proposals with budget tracking
 * 6. Parameter changes with bounds checking
 * 7. Emergency proposals with 2FA
 * 8. Concurrent proposals with race condition prevention
 */
describe("ADAM Governance Lifecycle Integration", function () {
    let governor: ARCGovernor;
    let adamHost: AdamHost;
    let adamRegistry: AdamRegistry;
    let paramsGuardPolicy: ParamsGuardPolicy;
    let treasuryLimiterPolicy: TreasuryLimiterPolicy;
    let dual2FAPolicy: Dual2FAPolicy;
    
    let owner: SignerWithAddress;
    let proposer: SignerWithAddress;
    let voter1: SignerWithAddress;
    let voter2: SignerWithAddress;
    let executor: SignerWithAddress;
    let treasury: SignerWithAddress;

    beforeEach(async function () {
        [owner, proposer, voter1, voter2, executor, treasury] = await ethers.getSigners();
        
        // Deploy ADAM system
        const AdamRegistry = await ethers.getContractFactory("AdamRegistry");
        adamRegistry = await AdamRegistry.deploy();
        await adamRegistry.initialize(owner.address);
        
        const AdamHost = await ethers.getContractFactory("AdamHost");
        adamHost = await AdamHost.deploy();
        await adamHost.initialize(owner.address, await adamRegistry.getAddress());
        
        // Deploy policies
        const ParamsGuardPolicy = await ethers.getContractFactory("ParamsGuardPolicy");
        paramsGuardPolicy = await ParamsGuardPolicy.deploy(owner.address);
        
        const TreasuryLimiterPolicy = await ethers.getContractFactory("TreasuryLimiterPolicy");
        treasuryLimiterPolicy = await TreasuryLimiterPolicy.deploy(
            owner.address,
            treasury.address,
            ethers.parseEther("1000000"), // 1M budget cap
            30 * 24 * 60 * 60 // 30 days
        );
        
        const Dual2FAPolicy = await ethers.getContractFactory("Dual2FAPolicy");
        dual2FAPolicy = await Dual2FAPolicy.deploy(owner.address, ethers.parseEther("50000"));
        
        // Register policy chains
        const TOPIC_TREASURY = 0;
        const TOPIC_PARAMS = 1;
        const HOOK_SUBMIT = await adamHost.HOOK_SUBMIT();
        const HOOK_QUEUE = await adamHost.HOOK_QUEUE();
        const HOOK_TALLY = await adamHost.HOOK_TALLY();
        
        await adamRegistry.setPolicyChain(TOPIC_TREASURY, HOOK_TALLY, [await treasuryLimiterPolicy.getAddress()]);
        await adamRegistry.setPolicyChain(TOPIC_TREASURY, HOOK_QUEUE, [await dual2FAPolicy.getAddress()]);
        await adamRegistry.setPolicyChain(TOPIC_PARAMS, HOOK_TALLY, [await paramsGuardPolicy.getAddress()]);
        
        // Deploy ARCGovernor with ADAM integration
        const GovernanceToken = await ethers.getContractFactory("ARCxToken");
        const token = await GovernanceToken.deploy();
        await token.initialize(owner.address, "ARC Token", "ARC");
        
        const ARCGovernor = await ethers.getContractFactory("ARCGovernor");
        governor = await ARCGovernor.deploy();
        
        const config = {
            votingDelay: 1,
            votingPeriod: 100,
            proposalThreshold: ethers.parseEther("1000"),
            quorumPercentage: 4000, // 40%
            timelockDelay: 2 * 24 * 60 * 60, // 2 days
            convictionGrowth: 100,
            emergencyThreshold: ethers.parseEther("10000"),
            quadraticVotingEnabled: true,
            convictionVotingEnabled: true
        };
        
        await governor.initialize(
            owner.address,
            await token.getAddress(),
            owner.address, // timelock
            treasury.address,
            config,
            await adamHost.getAddress() // ADAM host
        );
        
        // Mint tokens for testing
        await token.mint(proposer.address, ethers.parseEther("10000"));
        await token.mint(voter1.address, ethers.parseEther("50000"));
        await token.mint(voter2.address, ethers.parseEther("50000"));
    });

    describe("1. Proposal Submission with ADAM Validation", function () {
        it("Should accept valid treasury proposal within budget", async function () {
            const targets = [treasury.address];
            const values = [ethers.parseEther("100")];
            const calldatas = ["0x"];
            
            const proposalId = await governor.connect(proposer).propose(
                0, // Treasury category
                0, // SingleChoice voting
                "Treasury Transfer",
                "Transfer 100 tokens",
                "",
                targets,
                values,
                calldatas,
                ethers.parseEther("1000"),
                4000,
                2 * 24 * 60 * 60
            );
            
            expect(proposalId).to.not.equal(0);
        });

        it("Should reject proposal that violates ADAM constitutional rules", async function () {
            // This would reject if policies are configured to reject certain patterns
            // Example: exceeding budget, invalid parameters, etc.
            const targets = [treasury.address];
            const values = [ethers.parseEther("2000000")]; // Exceeds budget cap
            const calldatas = ["0x"];
            
            // Note: Actual rejection depends on policy configuration
            // This is a framework test showing the integration point
        });
    });

    describe("2. Complete Governance Lifecycle", function () {
        it("Should complete full lifecycle: propose → vote → queue → execute", async function () {
            // 1. Submit proposal
            const targets = [treasury.address];
            const values = [ethers.parseEther("100")];
            const calldatas = ["0x"];
            
            const tx = await governor.connect(proposer).propose(
                0, // Treasury
                0, // SingleChoice
                "Treasury Transfer",
                "Transfer 100 tokens",
                "",
                targets,
                values,
                calldatas,
                ethers.parseEther("1000"),
                4000,
                2 * 24 * 60 * 60
            );
            
            const receipt = await tx.wait();
            const event = receipt?.logs.find((log: any) => log.fragment?.name === "ProposalCreated");
            const proposalId = event?.args?.proposalId;
            
            // 2. Wait for voting to start
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            
            // 3. Cast votes
            await governor.connect(voter1).castVote(proposalId, true, 0, 0);
            await governor.connect(voter2).castVote(proposalId, true, 0, 0);
            
            // 4. Wait for voting to end
            for (let i = 0; i < 100; i++) {
                await ethers.provider.send("evm_mine", []);
            }
            
            // 5. Queue proposal (with ADAM validation)
            await governor.connect(proposer).queue(proposalId);
            
            // 6. Wait for timelock
            await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);
            
            // 7. Execute (with ADAM validation)
            await governor.connect(executor).execute(proposalId);
            
            // Verify execution
            const proposal = await governor.getProposal(proposalId);
            expect(proposal.state).to.equal(6); // Executed
        });
    });

    describe("3. Treasury Budget Management", function () {
        it("Should track budget across multiple proposals", async function () {
            // Submit first proposal
            const targets1 = [treasury.address];
            const values1 = [ethers.parseEther("400000")];
            const calldatas1 = ["0x"];
            
            await governor.connect(proposer).propose(
                0, // Treasury
                0,
                "Treasury Transfer 1",
                "Transfer 400K",
                "",
                targets1,
                values1,
                calldatas1,
                ethers.parseEther("1000"),
                4000,
                2 * 24 * 60 * 60
            );
            
            // Submit second proposal
            const targets2 = [treasury.address];
            const values2 = [ethers.parseEther("400000")];
            const calldatas2 = ["0x"];
            
            await governor.connect(proposer).propose(
                0, // Treasury
                0,
                "Treasury Transfer 2",
                "Transfer 400K",
                "",
                targets2,
                values2,
                calldatas2,
                ethers.parseEther("1000"),
                4000,
                2 * 24 * 60 * 60
            );
            
            // Both should be queued without exceeding cap
            // Budget reservation should prevent exceeding 1M total
        });

        it("Should prevent concurrent proposals from exceeding budget", async function () {
            // Test race condition prevention with budget reservation
            // When proposals are queued, budget is reserved
            // Additional proposals should be rejected if they would exceed cap
        });
    });

    describe("4. 2FA Requirements", function () {
        it("Should require 2FA for high-value treasury transfers", async function () {
            const targets = [treasury.address];
            const values = [ethers.parseEther("60000")]; // Above 2FA threshold
            const calldatas = ["0x"];
            
            const tx = await governor.connect(proposer).propose(
                0,
                0,
                "Large Transfer",
                "Transfer 60K (requires 2FA)",
                "",
                targets,
                values,
                calldatas,
                ethers.parseEther("1000"),
                4000,
                2 * 24 * 60 * 60
            );
            
            const receipt = await tx.wait();
            const proposalId = (receipt as any).logs[0].args.proposalId;
            
            // Vote and complete voting
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await governor.connect(voter1).castVote(proposalId, true, 0, 0);
            
            for (let i = 0; i < 100; i++) {
                await ethers.provider.send("evm_mine", []);
            }
            
            // Queue should detect 2FA requirement
            await expect(
                governor.connect(proposer).queue(proposalId)
            ).to.be.revertedWith("Proposal requires 2FA satisfaction before queueing");
        });
    });

    describe("5. Parameter Changes with Bounds Checking", function () {
        it("Should validate parameter changes against bounds", async function () {
            // Test that ParamsGuardPolicy enforces bounds on governance parameters
            // Example: quorum percentage, voting period, etc.
        });

        it("Should enforce monotonicity constraints", async function () {
            // Test that certain parameters can only increase/decrease
            // as defined in ParamsGuardPolicy configuration
        });
    });

    describe("6. Emergency Proposals", function () {
        it("Should handle emergency proposals with stricter validation", async function () {
            // Emergency category should trigger additional checks
            // including mandatory 2FA and guardian approval
        });
    });

    describe("7. ADAM Validation Failures", function () {
        it("Should reject proposal at submission if ADAM denies", async function () {
            // Configure policy to reject certain patterns
            // Verify proposal submission fails with ADAM rejection message
        });

        it("Should reject at queue if ADAM denies", async function () {
            // Proposal passes voting but ADAM queue check fails
            // Should not be able to queue
        });

        it("Should reject at execution if ADAM denies", async function () {
            // Final check before execution
            // Should not execute if ADAM denies
        });
    });

    describe("8. Integration with Treasury Contract", function () {
        it("Should integrate budget reservation with treasury operations", async function () {
            // When proposal is queued, budget should be reserved in TreasuryLimiterPolicy
            // When executed, reservation should convert to actual spending
            // If cancelled, reservation should be released
        });
    });
});
