// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../../contracts/defi/ARCxDutchAuction.sol";
import "../../contracts/defi/ARCxSmartAirdrop.sol";
import "../../contracts/defi/ARCxToken.sol";
import "../../contracts/defi/ARCx_MVC.sol";

contract ARCDutchAuctionFuzzTest is Test {
    ARCxDutchAuction public auction;
    ARCxToken public token;
    address public owner;
    address public treasury;

    uint256 constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 constant AUCTION_DURATION = 7 days;
    uint256 constant START_PRICE = 1 ether;
    uint256 constant END_PRICE = 0.1 ether;

    function setUp() public {
        owner = address(this);
        treasury = makeAddr("treasury");

        // Deploy token
        token = new ARCxToken();
        token.initialize("ARCx Token", "ARCX", INITIAL_SUPPLY, owner);

        // Deploy auction
        auction = new ARCxDutchAuction();
        auction.initialize(
            address(token),
            treasury,
            START_PRICE,
            END_PRICE,
            AUCTION_DURATION,
            owner
        );

        // Transfer tokens to auction
        token.transfer(address(auction), INITIAL_SUPPLY / 2);
    }

    function testFuzz_BidAmount(uint256 bidAmount) public {
        // Bound bid amount to reasonable range
        bidAmount = bound(bidAmount, 0.01 ether, 100 ether);

        // Move to active auction period
        vm.warp(block.timestamp + 1 days);

        uint256 initialBalance = address(this).balance;
        uint256 initialTokenBalance = token.balanceOf(address(this));

        // Place bid
        vm.deal(address(this), bidAmount);
        auction.bid{value: bidAmount}();

        // Verify bid was accepted
        assertGe(auction.getCurrentPrice(), END_PRICE);
        assertLe(auction.getCurrentPrice(), START_PRICE);
    }

    function testFuzz_MultipleBids(uint256 numBids, uint256 baseBidAmount) public {
        numBids = bound(numBids, 1, 100);
        baseBidAmount = bound(baseBidAmount, 0.1 ether, 10 ether);

        vm.warp(block.timestamp + 1 days);

        for (uint256 i = 0; i < numBids; i++) {
            address bidder = makeAddr(string(abi.encodePacked("bidder", i)));
            uint256 bidAmount = baseBidAmount + (i * 0.01 ether);

            vm.deal(bidder, bidAmount);
            vm.prank(bidder);
            auction.bid{value: bidAmount}();

            // Verify auction state remains consistent
            assertTrue(auction.isActive());
        }
    }

    function testFuzz_PriceCalculation(uint256 timeElapsed) public {
        timeElapsed = bound(timeElapsed, 0, AUCTION_DURATION);

        vm.warp(block.timestamp + timeElapsed);

        uint256 currentPrice = auction.getCurrentPrice();
        uint256 expectedPrice = auction.calculatePriceAt(block.timestamp);

        assertEq(currentPrice, expectedPrice);
        assertGe(currentPrice, END_PRICE);
        assertLe(currentPrice, START_PRICE);
    }

    function testFuzz_AuctionEnd(uint256 endTime) public {
        endTime = bound(endTime, block.timestamp, block.timestamp + AUCTION_DURATION + 1 days);

        vm.warp(endTime);

        if (endTime >= auction.auctionEndTime()) {
            assertFalse(auction.isActive());
        } else {
            assertTrue(auction.isActive());
        }
    }

    function testFuzz_TokenAllocation(uint256 bidAmount, uint256 currentPrice) public {
        bidAmount = bound(bidAmount, 0.1 ether, 100 ether);
        currentPrice = bound(currentPrice, END_PRICE, START_PRICE);

        vm.warp(block.timestamp + 1 days);

        // Mock current price
        vm.mockCall(
            address(auction),
            abi.encodeWithSelector(auction.getCurrentPrice.selector),
            abi.encode(currentPrice)
        );

        uint256 expectedTokens = (bidAmount * 10**18) / currentPrice;

        vm.deal(address(this), bidAmount);
        uint256 tokensReceived = auction.bid{value: bidAmount}();

        // Allow for rounding differences
        assertApproxEqAbs(tokensReceived, expectedTokens, 10**15);
    }
}

contract ARCSmartAirdropFuzzTest is Test {
    ARCxSmartAirdrop public airdrop;
    ARCxToken public token;
    address public owner;

    uint256 constant TOTAL_AIRDROP = 100000 * 10**18;
    uint256 constant AIRDROP_DURATION = 30 days;

    function setUp() public {
        owner = address(this);

        token = new ARCxToken();
        token.initialize("ARCx Token", "ARCX", TOTAL_AIRDROP * 2, owner);

        airdrop = new ARCxSmartAirdrop();
        airdrop.initialize(
            address(token),
            TOTAL_AIRDROP,
            AIRDROP_DURATION,
            owner
        );

        token.transfer(address(airdrop), TOTAL_AIRDROP);
    }

    function testFuzz_ClaimEligibility(uint256 randomSeed) public {
        address claimant = address(uint160(uint256(keccak256(abi.encode(randomSeed)))));

        bool isEligible = airdrop.isEligible(claimant);
        uint256 claimAmount = airdrop.calculateClaimAmount(claimant);

        if (isEligible) {
            assertGt(claimAmount, 0);
        } else {
            assertEq(claimAmount, 0);
        }
    }

    function testFuzz_ClaimAmounts(uint256 numClaims, uint256 baseAmount) public {
        numClaims = bound(numClaims, 1, 50);
        baseAmount = bound(baseAmount, 100 * 10**18, 10000 * 10**18);

        uint256 totalClaimed = 0;

        for (uint256 i = 0; i < numClaims; i++) {
            address claimant = makeAddr(string(abi.encodePacked("claimant", i)));

            // Mock eligibility
            vm.mockCall(
                address(airdrop),
                abi.encodeWithSelector(airdrop.isEligible.selector, claimant),
                abi.encode(true)
            );

            vm.mockCall(
                address(airdrop),
                abi.encodeWithSelector(airdrop.calculateClaimAmount.selector, claimant),
                abi.encode(baseAmount)
            );

            vm.prank(claimant);
            uint256 claimed = airdrop.claim();

            totalClaimed += claimed;
            assertLe(totalClaimed, TOTAL_AIRDROP);
        }
    }

    function testFuzz_TimeBasedClaims(uint256 claimTime) public {
        claimTime = bound(claimTime, block.timestamp, block.timestamp + AIRDROP_DURATION + 1 days);

        vm.warp(claimTime);

        address claimant = makeAddr("testClaimant");

        if (claimTime <= airdrop.endTime()) {
            // Should be able to claim during active period
            vm.mockCall(
                address(airdrop),
                abi.encodeWithSelector(airdrop.isEligible.selector, claimant),
                abi.encode(true)
            );

            vm.prank(claimant);
            airdrop.claim();
        } else {
            // Should not be able to claim after end
            vm.mockCall(
                address(airdrop),
                abi.encodeWithSelector(airdrop.isEligible.selector, claimant),
                abi.encode(true)
            );

            vm.prank(claimant);
            vm.expectRevert("Airdrop: ended");
            airdrop.claim();
        }
    }

    function testFuzz_MerkleProofValidation(bytes32[] calldata proof, uint256 index, uint256 amount) public {
        address claimant = makeAddr("merkleClaimant");
        amount = bound(amount, 1 * 10**18, 10000 * 10**18);

        // Mock merkle root
        bytes32 mockRoot = keccak256(abi.encodePacked("mockRoot"));
        vm.mockCall(
            address(airdrop),
            abi.encodeWithSelector(airdrop.merkleRoot.selector),
            abi.encode(mockRoot)
        );

        // Test with various proof lengths
        vm.prank(claimant);
        if (proof.length > 0) {
            airdrop.claimWithProof(proof, index, amount);
        }
    }
}

contract ARCTokenFuzzTest is Test {
    ARCxToken public token;
    address public owner;
    address public minter;
    address public burner;

    uint256 constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 constant MAX_SUPPLY = 10000000 * 10**18;

    function setUp() public {
        owner = address(this);
        minter = makeAddr("minter");
        burner = makeAddr("burner");

        token = new ARCxToken();
        token.initialize("ARCx Token", "ARCX", INITIAL_SUPPLY, owner);

        token.grantRole(token.MINTER_ROLE(), minter);
        token.grantRole(token.BURNER_ROLE(), burner);
    }

    function testFuzz_TransferAmounts(uint256 amount) public {
        address recipient = makeAddr("recipient");
        amount = bound(amount, 1, INITIAL_SUPPLY);

        uint256 initialBalance = token.balanceOf(owner);

        token.transfer(recipient, amount);

        assertEq(token.balanceOf(recipient), amount);
        assertEq(token.balanceOf(owner), initialBalance - amount);
    }

    function testFuzz_MintBurn(uint256 mintAmount, uint256 burnAmount) public {
        mintAmount = bound(mintAmount, 1, MAX_SUPPLY - token.totalSupply());
        burnAmount = bound(burnAmount, 1, token.totalSupply());

        uint256 initialSupply = token.totalSupply();

        // Mint
        vm.prank(minter);
        token.mint(owner, mintAmount);
        assertEq(token.totalSupply(), initialSupply + mintAmount);

        // Burn
        vm.prank(burner);
        token.burn(burnAmount);
        assertEq(token.totalSupply(), initialSupply + mintAmount - burnAmount);
    }

    function testFuzz_ApprovalAndTransferFrom(uint256 approvalAmount, uint256 transferAmount) public {
        address spender = makeAddr("spender");
        address recipient = makeAddr("recipient");

        approvalAmount = bound(approvalAmount, 1, INITIAL_SUPPLY);
        transferAmount = bound(transferAmount, 1, approvalAmount);

        // Approve
        token.approve(spender, approvalAmount);

        // Transfer from
        vm.prank(spender);
        token.transferFrom(owner, recipient, transferAmount);

        assertEq(token.balanceOf(recipient), transferAmount);
        assertEq(token.allowance(owner, spender), approvalAmount - transferAmount);
    }

    function testFuzz_SupplyInvariants(uint256 numOperations) public {
        numOperations = bound(numOperations, 1, 100);

        uint256 initialSupply = token.totalSupply();

        for (uint256 i = 0; i < numOperations; i++) {
            uint256 operation = i % 4;

            if (operation == 0) {
                // Mint
                uint256 mintAmount = bound(uint256(keccak256(abi.encode(i))), 1, 10000 * 10**18);
                vm.prank(minter);
                token.mint(owner, mintAmount);
            } else if (operation == 1) {
                // Burn
                uint256 burnAmount = bound(uint256(keccak256(abi.encode(i, "burn"))), 1, token.totalSupply() / 2);
                vm.prank(burner);
                token.burn(burnAmount);
            } else if (operation == 2) {
                // Transfer
                address recipient = makeAddr(string(abi.encodePacked("recipient", i)));
                uint256 transferAmount = bound(uint256(keccak256(abi.encode(i, "transfer"))), 1, token.balanceOf(owner) / 2);
                token.transfer(recipient, transferAmount);
            }

            // Invariant: total supply should never exceed max supply
            assertLe(token.totalSupply(), MAX_SUPPLY);

            // Invariant: total supply should be consistent with balances
            uint256 totalBalance = token.balanceOf(owner);
            for (uint256 j = 0; j < 10; j++) {
                address addr = makeAddr(string(abi.encodePacked("addr", j)));
                totalBalance += token.balanceOf(addr);
            }
            assertApproxEqAbs(token.totalSupply(), totalBalance, 10**18); // Allow for rounding
        }
    }
}

contract ARCMasterVestingFuzzTest is Test {
    ARCx_MVC public vesting;
    ARCxToken public token;
    address public owner;
    address public beneficiary;

    uint256 constant TOTAL_VESTING = 100000 * 10**18;
    uint256 constant VESTING_DURATION = 365 days;

    function setUp() public {
        owner = address(this);
        beneficiary = makeAddr("beneficiary");

        token = new ARCxToken();
        token.initialize("ARCx Token", "ARCX", TOTAL_VESTING * 2, owner);

        vesting = new ARCx_MVC();
        vesting.initialize(
            address(token),
            beneficiary,
            TOTAL_VESTING,
            VESTING_DURATION,
            owner
        );

        token.transfer(address(vesting), TOTAL_VESTING);
    }

    function testFuzz_VestingSchedule(uint256 timeElapsed) public {
        timeElapsed = bound(timeElapsed, 0, VESTING_DURATION * 2);

        vm.warp(block.timestamp + timeElapsed);

        uint256 vestedAmount = vesting.getVestedAmount();
        uint256 releasableAmount = vesting.getReleasableAmount();

        // Vested amount should increase over time
        if (timeElapsed == 0) {
            assertEq(vestedAmount, 0);
        } else if (timeElapsed >= VESTING_DURATION) {
            assertEq(vestedAmount, TOTAL_VESTING);
        } else {
            assertLt(vestedAmount, TOTAL_VESTING);
            assertGt(vestedAmount, 0);
        }

        // Releasable amount should not exceed vested amount
        assertLe(releasableAmount, vestedAmount);
    }

    function testFuzz_ReleaseAmounts(uint256 numReleases, uint256 timeBetweenReleases) public {
        numReleases = bound(numReleases, 1, 12);
        timeBetweenReleases = bound(timeBetweenReleases, 1 days, 30 days);

        uint256 totalReleased = 0;

        for (uint256 i = 0; i < numReleases; i++) {
            vm.warp(block.timestamp + timeBetweenReleases);

            uint256 releasable = vesting.getReleasableAmount();
            if (releasable > 0) {
                vm.prank(beneficiary);
                vesting.release();

                totalReleased += releasable;
                assertLe(totalReleased, TOTAL_VESTING);
            }
        }
    }

    function testFuzz_VestingCliff(uint256 cliffTime) public {
        cliffTime = bound(cliffTime, 0, VESTING_DURATION);

        // Set cliff
        vesting.setCliff(cliffTime);

        vm.warp(block.timestamp + cliffTime - 1);
        assertEq(vesting.getReleasableAmount(), 0);

        vm.warp(block.timestamp + 1);
        assertGt(vesting.getReleasableAmount(), 0);
    }

    function testFuzz_Revocation(uint256 revokeTime) public {
        revokeTime = bound(revokeTime, 0, VESTING_DURATION);

        vm.warp(block.timestamp + revokeTime);

        uint256 vestedBeforeRevoke = vesting.getVestedAmount();

        vm.prank(owner);
        vesting.revoke();

        uint256 vestedAfterRevoke = vesting.getVestedAmount();

        // After revocation, no more vesting should occur
        vm.warp(block.timestamp + VESTING_DURATION);
        assertEq(vesting.getVestedAmount(), vestedAfterRevoke);
    }
}
