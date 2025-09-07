// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ARCxAirdropContract
 * @dev Advanced airdrop contract with multiple distribution mechanisms:
 * - Merkle tree verification for gas efficiency
 * - Tiered rewards based on historical participation
 * - Time-limited claiming with bonus multipliers
 * - Anti-sybil mechanisms
 * - Referral bonuses for community growth
 */
contract ARCxAirdropContract is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct AirdropRound {
        bytes32 merkleRoot;       // Merkle root for this round
        uint256 totalAmount;      // Total tokens allocated for this round
        uint256 startTime;        // When claiming starts
        uint256 endTime;          // When claiming ends
        uint256 claimed;          // Amount already claimed
        bool active;              // Whether round is active
        uint256 earlyBirdBonus;   // Bonus multiplier for early claims (basis points)
        uint256 earlyBirdDeadline; // Deadline for early bird bonus
    }

    struct UserClaim {
        uint256 amount;           // Base claim amount
        uint256 tier;             // User tier (affects multipliers)
        bool hasClaimed;          // Whether user has claimed
        uint256 claimTime;        // When user claimed
        address referrer;         // Who referred this user (optional)
    }

    IERC20 public immutable arcxToken;
    
    mapping(uint256 => AirdropRound) public airdropRounds;
    mapping(uint256 => mapping(address => UserClaim)) public userClaims;
    mapping(address => uint256) public totalUserClaimed;
    mapping(address => uint256) public referralRewards;
    mapping(address => uint256) public referralCount;
    
    uint256 public currentRound = 0;
    uint256 public totalDistributed = 0;
    uint256 public referralBonusRate = 500; // 5% bonus for referrals
    uint256 private constant BASIS_POINTS = 10000;
    
    // Anti-sybil protection
    mapping(address => bool) public verifiedUsers;
    mapping(bytes32 => bool) public usedProofs;
    
    bool public emergencyStop = false;

    event AirdropRoundCreated(
        uint256 indexed roundId,
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 startTime,
        uint256 endTime
    );
    
    event TokensClaimed(
        address indexed user,
        uint256 indexed roundId,
        uint256 baseAmount,
        uint256 bonusAmount,
        uint256 totalAmount,
        address referrer
    );
    
    event ReferralRewardPaid(address indexed referrer, address indexed referee, uint256 reward);
    event UserVerified(address indexed user, uint256 verificationLevel);
    event EmergencyStopToggled(bool stopped);

    constructor(address _arcxToken) {
        arcxToken = IERC20(_arcxToken);
    }

    /**
     * @dev Create new airdrop round
     */
    function createAirdropRound(
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 duration,
        uint256 earlyBirdBonus,
        uint256 earlyBirdDuration
    ) external onlyOwner {
        require(merkleRoot != bytes32(0), "Invalid merkle root");
        require(totalAmount > 0, "Invalid amount");
        require(duration > 0, "Invalid duration");
        require(earlyBirdBonus <= 5000, "Bonus too high"); // Max 50%
        require(earlyBirdDuration <= duration, "Early bird duration too long");

        // Transfer tokens to this contract
        require(
            arcxToken.transferFrom(msg.sender, address(this), totalAmount),
            "Token transfer failed"
        );

        uint256 roundId = currentRound++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime.add(duration);
        uint256 earlyBirdDeadline = startTime.add(earlyBirdDuration);

        airdropRounds[roundId] = AirdropRound({
            merkleRoot: merkleRoot,
            totalAmount: totalAmount,
            startTime: startTime,
            endTime: endTime,
            claimed: 0,
            active: true,
            earlyBirdBonus: earlyBirdBonus,
            earlyBirdDeadline: earlyBirdDeadline
        });

        emit AirdropRoundCreated(roundId, merkleRoot, totalAmount, startTime, endTime);
    }

    /**
     * @dev Claim airdrop tokens with merkle proof
     */
    function claimAirdrop(
        uint256 roundId,
        uint256 amount,
        uint256 tier,
        bytes32[] calldata merkleProof,
        address referrer
    ) external nonReentrant {
        require(!emergencyStop, "Emergency stop active");
        require(roundId < currentRound, "Invalid round");
        
        AirdropRound storage round = airdropRounds[roundId];
        require(round.active, "Round not active");
        require(block.timestamp >= round.startTime, "Round not started");
        require(block.timestamp <= round.endTime, "Round ended");
        
        UserClaim storage claim = userClaims[roundId][msg.sender];
        require(!claim.hasClaimed, "Already claimed");

        // Verify merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount, tier));
        require(!usedProofs[leaf], "Proof already used");
        require(
            MerkleProof.verify(merkleProof, round.merkleRoot, leaf),
            "Invalid proof"
        );

        usedProofs[leaf] = true;

        // Calculate final claim amount with bonuses
        uint256 baseAmount = amount;
        uint256 bonusAmount = 0;

        // Early bird bonus
        if (block.timestamp <= round.earlyBirdDeadline) {
            bonusAmount = bonusAmount.add(
                baseAmount.mul(round.earlyBirdBonus).div(BASIS_POINTS)
            );
        }

        // Tier multiplier
        if (tier > 1) {
            uint256 tierBonus = baseAmount.mul(tier.sub(1).mul(250)).div(BASIS_POINTS); // 2.5% per tier
            bonusAmount = bonusAmount.add(tierBonus);
        }

        // Verification bonus
        if (verifiedUsers[msg.sender]) {
            uint256 verificationBonus = baseAmount.mul(1000).div(BASIS_POINTS); // 10% for verified users
            bonusAmount = bonusAmount.add(verificationBonus);
        }

        uint256 finalAmount = baseAmount.add(bonusAmount);

        // Update claim data
        claim.amount = finalAmount;
        claim.tier = tier;
        claim.hasClaimed = true;
        claim.claimTime = block.timestamp;
        claim.referrer = referrer;

        // Update totals
        round.claimed = round.claimed.add(finalAmount);
        totalDistributed = totalDistributed.add(finalAmount);
        totalUserClaimed[msg.sender] = totalUserClaimed[msg.sender].add(finalAmount);

        // Handle referral bonus
        if (referrer != address(0) && referrer != msg.sender && verifiedUsers[referrer]) {
            uint256 referralReward = finalAmount.mul(referralBonusRate).div(BASIS_POINTS);
            if (arcxToken.balanceOf(address(this)) >= finalAmount.add(referralReward)) {
                referralRewards[referrer] = referralRewards[referrer].add(referralReward);
                referralCount[referrer] = referralCount[referrer].add(1);
                
                require(arcxToken.transfer(referrer, referralReward), "Referral transfer failed");
                emit ReferralRewardPaid(referrer, msg.sender, referralReward);
            }
        }

        // Transfer tokens to user
        require(arcxToken.transfer(msg.sender, finalAmount), "Transfer failed");

        emit TokensClaimed(msg.sender, roundId, baseAmount, bonusAmount, finalAmount, referrer);
    }

    /**
     * @dev Verify user for anti-sybil protection and bonuses
     */
    function verifyUser(address user, uint256 verificationLevel) external onlyOwner {
        require(verificationLevel > 0 && verificationLevel <= 3, "Invalid level");
        verifiedUsers[user] = true;
        emit UserVerified(user, verificationLevel);
    }

    /**
     * @dev Batch verify users
     */
    function batchVerifyUsers(
        address[] calldata users,
        uint256 verificationLevel
    ) external onlyOwner {
        require(verificationLevel > 0 && verificationLevel <= 3, "Invalid level");
        
        for (uint256 i = 0; i < users.length; i++) {
            verifiedUsers[users[i]] = true;
            emit UserVerified(users[i], verificationLevel);
        }
    }

    /**
     * @dev End airdrop round early
     */
    function endRound(uint256 roundId) external onlyOwner {
        require(roundId < currentRound, "Invalid round");
        airdropRounds[roundId].active = false;
        airdropRounds[roundId].endTime = block.timestamp;
    }

    /**
     * @dev Withdraw unclaimed tokens from ended round
     */
    function withdrawUnclaimed(uint256 roundId) external onlyOwner {
        require(roundId < currentRound, "Invalid round");
        
        AirdropRound storage round = airdropRounds[roundId];
        require(!round.active || block.timestamp > round.endTime, "Round still active");
        
        uint256 unclaimed = round.totalAmount.sub(round.claimed);
        if (unclaimed > 0) {
            require(arcxToken.transfer(owner(), unclaimed), "Transfer failed");
        }
    }

    /**
     * @dev Update referral bonus rate
     */
    function updateReferralBonusRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Rate too high"); // Max 10%
        referralBonusRate = newRate;
    }

    /**
     * @dev Emergency stop toggle
     */
    function toggleEmergencyStop() external onlyOwner {
        emergencyStop = !emergencyStop;
        emit EmergencyStopToggled(emergencyStop);
    }

    /**
     * @dev Emergency withdraw (only when stopped)
     */
    function emergencyWithdraw() external onlyOwner {
        require(emergencyStop, "Not in emergency mode");
        uint256 balance = arcxToken.balanceOf(address(this));
        require(arcxToken.transfer(owner(), balance), "Transfer failed");
    }

    /**
     * @dev Get round details
     */
    function getRoundDetails(uint256 roundId) external view returns (
        bytes32 merkleRoot,
        uint256 totalAmount,
        uint256 claimed,
        uint256 startTime,
        uint256 endTime,
        bool active,
        uint256 earlyBirdBonus,
        uint256 earlyBirdDeadline
    ) {
        require(roundId < currentRound, "Invalid round");
        AirdropRound memory round = airdropRounds[roundId];
        
        return (
            round.merkleRoot,
            round.totalAmount,
            round.claimed,
            round.startTime,
            round.endTime,
            round.active,
            round.earlyBirdBonus,
            round.earlyBirdDeadline
        );
    }

    /**
     * @dev Get user claim details
     */
    function getUserClaimDetails(
        uint256 roundId,
        address user
    ) external view returns (
        uint256 amount,
        uint256 tier,
        bool hasClaimed,
        uint256 claimTime,
        address referrer
    ) {
        UserClaim memory claim = userClaims[roundId][user];
        return (
            claim.amount,
            claim.tier,
            claim.hasClaimed,
            claim.claimTime,
            claim.referrer
        );
    }

    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 totalRounds,
        uint256 _totalDistributed,
        uint256 remainingBalance,
        uint256 totalVerifiedUsers
    ) {
        uint256 verifiedCount = 0;
        // Note: In production, you'd maintain a counter for verified users
        // rather than iterating through all addresses
        
        return (
            currentRound,
            totalDistributed,
            arcxToken.balanceOf(address(this)),
            verifiedCount
        );
    }

    /**
     * @dev Check if user can claim in a round
     */
    function canClaim(
        uint256 roundId,
        address user,
        uint256 amount,
        uint256 tier,
        bytes32[] calldata merkleProof
    ) external view returns (bool, string memory) {
        if (emergencyStop) return (false, "Emergency stop active");
        if (roundId >= currentRound) return (false, "Invalid round");
        
        AirdropRound memory round = airdropRounds[roundId];
        if (!round.active) return (false, "Round not active");
        if (block.timestamp < round.startTime) return (false, "Round not started");
        if (block.timestamp > round.endTime) return (false, "Round ended");
        
        UserClaim memory claim = userClaims[roundId][user];
        if (claim.hasClaimed) return (false, "Already claimed");
        
        bytes32 leaf = keccak256(abi.encodePacked(user, amount, tier));
        if (usedProofs[leaf]) return (false, "Proof already used");
        
        if (!MerkleProof.verify(merkleProof, round.merkleRoot, leaf)) {
            return (false, "Invalid proof");
        }
        
        return (true, "Can claim");
    }
}
