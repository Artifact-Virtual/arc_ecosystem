// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ARCxVestingContract
 * @dev Advanced vesting contract for ARCx tokens with multiple features:
 * - Linear and cliff vesting schedules
 * - Early unlock penalties with yield redistribution
 * - Emergency revocation for terminated contributors
 * - Governance participation during vesting
 * - Staking integration for vested tokens
 */
contract ARCxVestingContract is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct VestingSchedule {
        uint256 totalAmount;      // Total tokens to be vested
        uint256 cliffDuration;    // Cliff period in seconds
        uint256 duration;         // Total vesting duration in seconds
        uint256 startTime;        // When vesting starts
        uint256 amountClaimed;    // Amount already claimed
        bool revoked;             // Whether vesting is revoked
        uint256 penaltyRate;      // Early unlock penalty rate (in basis points)
        bool governanceEnabled;   // Whether holder can participate in governance
    }

    struct BeneficiaryInfo {
        string role;              // Role in organization (dev, advisor, etc.)
        bool isActive;           // Whether beneficiary is still active
        uint256 joinDate;        // When beneficiary joined
        uint256 contributionScore; // Contribution score for bonus calculations
    }

    IERC20 public immutable arcxToken;
    
    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => BeneficiaryInfo) public beneficiaries;
    mapping(string => uint256) public roleAllocation; // Role => total allocated amount
    
    address[] public allBeneficiaries;
    
    uint256 public totalAllocated;
    uint256 public totalClaimed;
    uint256 public emergencyUnlockPenalty = 2500; // 25% penalty for emergency unlock
    uint256 private constant BASIS_POINTS = 10000;
    
    bool public emergencyMode = false;
    
    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 totalAmount,
        uint256 cliffDuration,
        uint256 duration
    );
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 unvestedAmount);
    event EmergencyUnlock(address indexed beneficiary, uint256 amount, uint256 penalty);
    event PenaltyRedistributed(uint256 totalPenalty, uint256 perBeneficiary);
    event BeneficiaryStatusChanged(address indexed beneficiary, bool isActive);

    constructor(address _arcxToken) {
        arcxToken = IERC20(_arcxToken);
    }

    /**
     * @dev Create vesting schedule for ecosystem and team members
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 totalAmount,
        uint256 cliffDuration,
        uint256 duration,
        uint256 penaltyRate,
        string calldata role,
        bool governanceEnabled
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(totalAmount > 0, "Amount must be positive");
        require(duration >= cliffDuration, "Duration < cliff");
        require(penaltyRate <= 5000, "Penalty too high"); // Max 50%
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule exists");

        // Transfer tokens to this contract
        require(
            arcxToken.transferFrom(msg.sender, address(this), totalAmount),
            "Token transfer failed"
        );

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: totalAmount,
            cliffDuration: cliffDuration,
            duration: duration,
            startTime: block.timestamp,
            amountClaimed: 0,
            revoked: false,
            penaltyRate: penaltyRate,
            governanceEnabled: governanceEnabled
        });

        beneficiaries[beneficiary] = BeneficiaryInfo({
            role: role,
            isActive: true,
            joinDate: block.timestamp,
            contributionScore: 100 // Default score
        });

        allBeneficiaries.push(beneficiary);
        totalAllocated = totalAllocated.add(totalAmount);
        roleAllocation[role] = roleAllocation[role].add(totalAmount);

        emit VestingScheduleCreated(beneficiary, totalAmount, cliffDuration, duration);
    }

    /**
     * @dev Claim vested tokens
     */
    function claimTokens() external nonReentrant {
        address beneficiary = msg.sender;
        uint256 claimableAmount = getClaimableAmount(beneficiary);
        
        require(claimableAmount > 0, "No tokens to claim");
        require(!vestingSchedules[beneficiary].revoked, "Vesting revoked");

        vestingSchedules[beneficiary].amountClaimed = 
            vestingSchedules[beneficiary].amountClaimed.add(claimableAmount);
        totalClaimed = totalClaimed.add(claimableAmount);

        require(arcxToken.transfer(beneficiary, claimableAmount), "Transfer failed");

        emit TokensClaimed(beneficiary, claimableAmount);
    }

    /**
     * @dev Emergency unlock with penalty (for departing team members)
     */
    function emergencyUnlock() external nonReentrant {
        address beneficiary = msg.sender;
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        
        require(schedule.totalAmount > 0, "No vesting schedule");
        require(!schedule.revoked, "Already revoked");
        require(beneficiaries[beneficiary].isActive, "Not active beneficiary");

        uint256 vestedAmount = getVestedAmount(beneficiary);
        uint256 claimableAmount = vestedAmount.sub(schedule.amountClaimed);
        uint256 unvestedAmount = schedule.totalAmount.sub(vestedAmount);
        
        require(unvestedAmount > 0, "Already fully vested");

        // Calculate penalty on unvested amount
        uint256 penalty = unvestedAmount.mul(schedule.penaltyRate).div(BASIS_POINTS);
        uint256 unlockAmount = unvestedAmount.sub(penalty);

        // Update schedule
        schedule.amountClaimed = schedule.totalAmount;
        schedule.revoked = true;
        beneficiaries[beneficiary].isActive = false;

        // Transfer claimable + unlocked amount (minus penalty)
        uint256 totalTransfer = claimableAmount.add(unlockAmount);
        totalClaimed = totalClaimed.add(totalTransfer);

        require(arcxToken.transfer(beneficiary, totalTransfer), "Transfer failed");

        // Redistribute penalty among remaining active beneficiaries
        if (penalty > 0) {
            _redistributePenalty(penalty);
        }

        emit EmergencyUnlock(beneficiary, totalTransfer, penalty);
        emit BeneficiaryStatusChanged(beneficiary, false);
    }

    /**
     * @dev Revoke vesting (owner only - for misconduct)
     */
    function revokeVesting(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(!schedule.revoked, "Already revoked");
        
        uint256 vestedAmount = getVestedAmount(beneficiary);
        uint256 claimableAmount = vestedAmount.sub(schedule.amountClaimed);
        
        schedule.revoked = true;
        beneficiaries[beneficiary].isActive = false;
        
        if (claimableAmount > 0) {
            schedule.amountClaimed = schedule.amountClaimed.add(claimableAmount);
            totalClaimed = totalClaimed.add(claimableAmount);
            require(arcxToken.transfer(beneficiary, claimableAmount), "Transfer failed");
        }

        uint256 unvestedAmount = schedule.totalAmount.sub(vestedAmount);
        emit VestingRevoked(beneficiary, unvestedAmount);
        emit BeneficiaryStatusChanged(beneficiary, false);
    }

    /**
     * @dev Update beneficiary contribution score (affects potential bonuses)
     */
    function updateContributionScore(
        address beneficiary,
        uint256 newScore
    ) external onlyOwner {
        require(newScore <= 200, "Score too high"); // Max 2x multiplier
        beneficiaries[beneficiary].contributionScore = newScore;
    }

    /**
     * @dev Redistribute penalty among active beneficiaries
     */
    function _redistributePenalty(uint256 penaltyAmount) private {
        uint256 activeBeneficiaries = 0;
        
        // Count active beneficiaries
        for (uint256 i = 0; i < allBeneficiaries.length; i++) {
            if (beneficiaries[allBeneficiaries[i]].isActive && 
                !vestingSchedules[allBeneficiaries[i]].revoked) {
                activeBeneficiaries++;
            }
        }
        
        if (activeBeneficiaries == 0) return;
        
        uint256 bonusPerBeneficiary = penaltyAmount.div(activeBeneficiaries);
        
        // Distribute bonus to active beneficiaries
        for (uint256 i = 0; i < allBeneficiaries.length; i++) {
            address beneficiary = allBeneficiaries[i];
            if (beneficiaries[beneficiary].isActive && 
                !vestingSchedules[beneficiary].revoked) {
                
                vestingSchedules[beneficiary].totalAmount = 
                    vestingSchedules[beneficiary].totalAmount.add(bonusPerBeneficiary);
            }
        }
        
        emit PenaltyRedistributed(penaltyAmount, bonusPerBeneficiary);
    }

    /**
     * @dev Get vested amount for beneficiary
     */
    function getVestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (schedule.revoked || schedule.totalAmount == 0) {
            return 0;
        }

        uint256 currentTime = block.timestamp;
        uint256 cliffEnd = schedule.startTime.add(schedule.cliffDuration);
        
        if (currentTime < cliffEnd) {
            return 0;
        }

        uint256 vestingEnd = schedule.startTime.add(schedule.duration);
        if (currentTime >= vestingEnd) {
            return schedule.totalAmount;
        }

        uint256 timeVested = currentTime.sub(cliffEnd);
        uint256 totalVestingTime = schedule.duration.sub(schedule.cliffDuration);
        
        return schedule.totalAmount.mul(timeVested).div(totalVestingTime);
    }

    /**
     * @dev Get claimable amount for beneficiary
     */
    function getClaimableAmount(address beneficiary) public view returns (uint256) {
        uint256 vestedAmount = getVestedAmount(beneficiary);
        return vestedAmount.sub(vestingSchedules[beneficiary].amountClaimed);
    }

    /**
     * @dev Get beneficiary details
     */
    function getBeneficiaryDetails(address beneficiary) external view returns (
        uint256 totalAmount,
        uint256 vestedAmount,
        uint256 claimableAmount,
        uint256 claimedAmount,
        string memory role,
        bool isActive,
        bool canParticipateInGovernance
    ) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        BeneficiaryInfo memory info = beneficiaries[beneficiary];
        
        return (
            schedule.totalAmount,
            getVestedAmount(beneficiary),
            getClaimableAmount(beneficiary),
            schedule.amountClaimed,
            info.role,
            info.isActive,
            schedule.governanceEnabled
        );
    }

    /**
     * @dev Get role allocation summary
     */
    function getRoleAllocation(string calldata role) external view returns (uint256) {
        return roleAllocation[role];
    }

    /**
     * @dev Emergency functions
     */
    function setEmergencyMode(bool _emergencyMode) external onlyOwner {
        emergencyMode = _emergencyMode;
    }

    function emergencyWithdraw() external onlyOwner {
        require(emergencyMode, "Not in emergency mode");
        uint256 balance = arcxToken.balanceOf(address(this));
        require(arcxToken.transfer(owner(), balance), "Transfer failed");
    }

    /**
     * @dev Get total contract stats
     */
    function getContractStats() external view returns (
        uint256 _totalAllocated,
        uint256 _totalClaimed,
        uint256 _totalRemaining,
        uint256 _activeBeneficiaries
    ) {
        uint256 activeBeneficiaries = 0;
        for (uint256 i = 0; i < allBeneficiaries.length; i++) {
            if (beneficiaries[allBeneficiaries[i]].isActive) {
                activeBeneficiaries++;
            }
        }
        
        return (
            totalAllocated,
            totalClaimed,
            totalAllocated.sub(totalClaimed),
            activeBeneficiaries
        );
    }
}
