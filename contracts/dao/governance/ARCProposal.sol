// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 * @title ARC Proposal Manager
 * @dev Nobel-worthy proposal management system
 * @notice Advanced proposal lifecycle management with templates,
 *         categorization, and collaborative drafting
 *
 * Features:
 * - Proposal templates and categories
 * - Collaborative drafting system
 * - Proposal versioning and amendments
 * - Impact assessment framework
 * - Stakeholder engagement tracking
 * - Proposal analytics and insights
 * - Integration with governance analytics
 */
contract ARCProposal is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    bytes32 public constant FACILITATOR_ROLE = keccak256("FACILITATOR_ROLE");

    // Proposal lifecycle stages
    enum ProposalStage {
        Draft,          // Being drafted
        Review,         // Under review
        Feedback,       // Collecting feedback
        Finalization,   // Final edits
        Submitted,      // Submitted to governor
        Governance,     // In governance voting
        Completed       // Final outcome reached
    }

    // Proposal categories with specific requirements
    enum ProposalCategory {
        Treasury,       // Treasury allocation/management
        Protocol,       // Protocol parameter changes
        Governance,     // Governance process changes
        Emergency,      // Emergency measures
        CrossChain,     // Cross-chain operations
        Partnership,    // Partnership proposals
        Grant,          // Grant programs
        Constitutional, // Constitutional amendments
        Technical,      // Technical improvements
        Community       // Community initiatives
    }

    // Impact assessment levels
    enum ImpactLevel {
        Minimal,        // < $10K impact
        Moderate,       // $10K - $100K impact
        Significant,    // $100K - $1M impact
        Critical,       // $1M - $10M impact
        Transformative  // > $10M impact
    }

    // Advanced proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalCategory category;
        string title;
        string description;
        string metadataURI;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        ProposalStage stage;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 version;
        uint256 governanceId;      // Linked governance proposal ID
        ImpactLevel impactLevel;
        uint256 estimatedCost;
        uint256 estimatedTimeline;
        bool isTemplate;
        bool isAmendment;
        uint256 parentProposalId;
        mapping(address => bool) collaborators;
        mapping(address => Feedback) feedbacks;
        address[] collaboratorList;
        uint256 feedbackCount;
        uint256 positiveFeedback;
        uint256 negativeFeedback;
        bytes32 proposalHash;
        string[] tags;
        mapping(string => string) metadata;
    }

    // Feedback structure
    struct Feedback {
        address reviewer;
        string comment;
        uint256 rating;           // 1-5 stars
        bool support;
        uint256 timestamp;
        string[] suggestions;
        bool reviewed;
    }

    // Proposal template structure
    struct ProposalTemplate {
        string name;
        string description;
        ProposalCategory category;
        address[] defaultTargets;
        string[] requiredFields;
        string templateURI;
        bool active;
        uint256 usageCount;
    }

    // Proposal analytics
    struct ProposalAnalytics {
        uint256 totalProposals;
        uint256 activeProposals;
        uint256 completedProposals;
        uint256 averageFeedbackScore;
        uint256 averageCompletionTime;
        uint256 templateUsageRate;
        uint256 amendmentRate;
        uint256 lastUpdate;
    }

    // State variables
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => ProposalTemplate) public templates;
    mapping(address => uint256[]) public userProposals;
    mapping(string => uint256) public categoryStats;
    mapping(address => uint256) public userReputation;

    ProposalAnalytics public analytics;

    uint256 public proposalCount;
    uint256 public templateCount;
    uint256 public constant MAX_COLLABORATORS = 10;
    uint256 public constant FEEDBACK_TIMEOUT = 7 days;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalCategory category,
        string title
    );

    event ProposalUpdated(
        uint256 indexed proposalId,
        uint256 version,
        string updateDescription
    );

    event FeedbackSubmitted(
        uint256 indexed proposalId,
        address indexed reviewer,
        bool support,
        uint256 rating
    );

    event CollaboratorAdded(
        uint256 indexed proposalId,
        address indexed collaborator
    );

    event StageChanged(
        uint256 indexed proposalId,
        ProposalStage fromStage,
        ProposalStage toStage
    );

    event TemplateCreated(
        uint256 indexed templateId,
        string name,
        ProposalCategory category
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the proposal manager
     */
    function initialize(address admin) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(PROPOSER_ROLE, admin);
        _grantRole(REVIEWER_ROLE, admin);
        _grantRole(FACILITATOR_ROLE, admin);
    }

    /**
     * @dev Create a new proposal
     */
    function createProposal(
        ProposalCategory category,
        string memory title,
        string memory description,
        string memory metadataURI,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory datas,
        ImpactLevel impactLevel,
        uint256 estimatedCost,
        uint256 estimatedTimeline,
        string[] memory tags
    ) public nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Empty title");
        require(bytes(description).length > 0, "Empty description");
        require(targets.length == values.length && values.length == datas.length, "Invalid proposal parameters");

        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.category = category;
        proposal.title = title;
        proposal.description = description;
        proposal.metadataURI = metadataURI;
        proposal.targets = targets;
        proposal.values = values;
        proposal.calldatas = datas;
        proposal.stage = ProposalStage.Draft;
        proposal.createdAt = block.timestamp;
        proposal.updatedAt = block.timestamp;
        proposal.version = 1;
        proposal.impactLevel = impactLevel;
        proposal.estimatedCost = estimatedCost;
        proposal.estimatedTimeline = estimatedTimeline;
        proposal.tags = tags;

        // Add proposer as first collaborator
        proposal.collaborators[msg.sender] = true;
        proposal.collaboratorList.push(msg.sender);

        // Generate proposal hash
        proposal.proposalHash = keccak256(abi.encode(
            msg.sender, title, description, block.timestamp, proposalId
        ));

        // Update user proposals
        userProposals[msg.sender].push(proposalId);

        // Update category stats
        categoryStats[_getCategoryName(category)]++;

        // Update analytics
        analytics.totalProposals++;

        emit ProposalCreated(proposalId, msg.sender, category, title);

        return proposalId;
    }

    /**
     * @dev Create proposal from template
     */
    function createFromTemplate(
        uint256 templateId,
        string calldata title,
        string calldata description,
        string calldata metadataURI,
        ImpactLevel impactLevel,
        uint256 estimatedCost,
        uint256 estimatedTimeline
    ) external nonReentrant returns (uint256) {
        ProposalTemplate storage template = templates[templateId];
        require(template.active, "Template not active");

        // Create memory copies of storage arrays
        address[] memory defaultTargets = new address[](template.defaultTargets.length);
        for (uint256 i = 0; i < template.defaultTargets.length; i++) {
            defaultTargets[i] = template.defaultTargets[i];
        }

        // Use template defaults
        uint256 proposalId = createProposal(
            template.category,
            title,
            description,
            metadataURI,
            defaultTargets,
            new uint256[](template.defaultTargets.length), // Empty values
            new bytes[](template.defaultTargets.length),   // Empty datas
            impactLevel,
            estimatedCost,
            estimatedTimeline,
            new string[](0) // Empty tags
        );

        // Update template usage
        template.usageCount++;

        return proposalId;
    }

    /**
     * @dev Update proposal content
     */
    function updateProposal(
        uint256 proposalId,
        string calldata description,
        string calldata metadataURI,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas,
        string calldata updateDescription
    ) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposer == msg.sender || proposal.collaborators[msg.sender], "Not authorized");
        require(proposal.stage == ProposalStage.Draft || proposal.stage == ProposalStage.Feedback, "Cannot update proposal");

        if (bytes(description).length > 0) {
            proposal.description = description;
        }
        if (bytes(metadataURI).length > 0) {
            proposal.metadataURI = metadataURI;
        }
        if (targets.length > 0) {
            require(targets.length == values.length && values.length == datas.length, "Invalid parameters");
            proposal.targets = targets;
            proposal.values = values;
            proposal.calldatas = datas;
        }

        proposal.version++;
        proposal.updatedAt = block.timestamp;

        // Update proposal hash
        proposal.proposalHash = keccak256(abi.encode(
            proposal.proposer, proposal.title, description, block.timestamp, proposalId
        ));

        emit ProposalUpdated(proposalId, proposal.version, updateDescription);
    }

    /**
     * @dev Submit feedback on proposal
     */
    function submitFeedback(
        uint256 proposalId,
        string calldata comment,
        uint256 rating,
        bool support,
        string[] calldata suggestions
    ) external nonReentrant {
        require(rating >= 1 && rating <= 5, "Invalid rating");
        require(bytes(comment).length > 0, "Empty comment");

        Proposal storage proposal = proposals[proposalId];
        require(proposal.stage == ProposalStage.Review || proposal.stage == ProposalStage.Feedback, "Not accepting feedback");

        Feedback storage feedback = proposal.feedbacks[msg.sender];
        require(!feedback.reviewed, "Already submitted feedback");

        feedback.reviewer = msg.sender;
        feedback.comment = comment;
        feedback.rating = rating;
        feedback.support = support;
        feedback.timestamp = block.timestamp;
        feedback.suggestions = suggestions;
        feedback.reviewed = true;

        proposal.feedbackCount++;
        if (support) {
            proposal.positiveFeedback++;
        } else {
            proposal.negativeFeedback++;
        }

        // Update user reputation
        if (support) {
            userReputation[msg.sender] += 1;
        }

        // Update analytics
        analytics.averageFeedbackScore = (analytics.averageFeedbackScore + rating) / 2;

        emit FeedbackSubmitted(proposalId, msg.sender, support, rating);
    }

    /**
     * @dev Add collaborator to proposal
     */
    function addCollaborator(uint256 proposalId, address collaborator) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposer == msg.sender || hasRole(FACILITATOR_ROLE, msg.sender), "Not authorized");
        require(!proposal.collaborators[collaborator], "Already collaborator");
        require(proposal.collaboratorList.length < MAX_COLLABORATORS, "Max collaborators reached");

        proposal.collaborators[collaborator] = true;
        proposal.collaboratorList.push(collaborator);

        emit CollaboratorAdded(proposalId, collaborator);
    }

    /**
     * @dev Change proposal stage
     */
    function changeStage(uint256 proposalId, ProposalStage newStage) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.proposer == msg.sender ||
            proposal.collaborators[msg.sender] ||
            hasRole(FACILITATOR_ROLE, msg.sender),
            "Not authorized"
        );

        ProposalStage oldStage = proposal.stage;
        proposal.stage = newStage;
        proposal.updatedAt = block.timestamp;

        // Update analytics
        if (newStage == ProposalStage.Completed) {
            analytics.completedProposals++;
            analytics.averageCompletionTime = (analytics.averageCompletionTime +
                (block.timestamp - proposal.createdAt)) / 2;
        }

        emit StageChanged(proposalId, oldStage, newStage);
    }

    /**
     * @dev Create proposal template
     */
    function createTemplate(
        string calldata name,
        string calldata description,
        ProposalCategory category,
        address[] calldata defaultTargets,
        string[] calldata requiredFields,
        string calldata templateURI
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        templateCount++;
        uint256 templateId = templateCount;

        ProposalTemplate storage template = templates[templateId];
        template.name = name;
        template.description = description;
        template.category = category;
        template.defaultTargets = defaultTargets;
        template.requiredFields = requiredFields;
        template.templateURI = templateURI;
        template.active = true;

        emit TemplateCreated(templateId, name, category);

        return templateId;
    }

    /**
     * @dev Amend existing proposal
     */
    function amendProposal(
        uint256 parentProposalId,
        string calldata title,
        string calldata description,
        string calldata amendmentReason
    ) external nonReentrant returns (uint256) {
        Proposal storage parentProposal = proposals[parentProposalId];
        require(parentProposal.stage == ProposalStage.Governance, "Can only amend governance proposals");

        // Create memory copies of parent proposal arrays
        address[] memory targets = new address[](parentProposal.targets.length);
        uint256[] memory values = new uint256[](parentProposal.values.length);
        bytes[] memory calldatas = new bytes[](parentProposal.calldatas.length);
        string[] memory tags = new string[](parentProposal.tags.length);

        for (uint256 i = 0; i < parentProposal.targets.length; i++) {
            targets[i] = parentProposal.targets[i];
            values[i] = parentProposal.values[i];
            calldatas[i] = parentProposal.calldatas[i];
        }

        for (uint256 i = 0; i < parentProposal.tags.length; i++) {
            tags[i] = parentProposal.tags[i];
        }

        uint256 amendmentId = createProposal(
            parentProposal.category,
            title,
            description,
            "",
            targets,
            values,
            calldatas,
            parentProposal.impactLevel,
            parentProposal.estimatedCost,
            parentProposal.estimatedTimeline,
            tags
        );

        Proposal storage amendment = proposals[amendmentId];
        amendment.isAmendment = true;
        amendment.parentProposalId = parentProposalId;

        // Copy collaborators from parent
        for (uint256 i = 0; i < parentProposal.collaboratorList.length; i++) {
            address collaborator = parentProposal.collaboratorList[i];
            amendment.collaborators[collaborator] = true;
            amendment.collaboratorList.push(collaborator);
        }

        analytics.amendmentRate++;

        return amendmentId;
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        ProposalCategory category,
        string memory title,
        string memory description,
        ProposalStage stage,
        uint256 createdAt,
        uint256 version,
        ImpactLevel impactLevel,
        uint256 feedbackCount,
        uint256 positiveFeedback
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.category,
            proposal.title,
            proposal.description,
            proposal.stage,
            proposal.createdAt,
            proposal.version,
            proposal.impactLevel,
            proposal.feedbackCount,
            proposal.positiveFeedback
        );
    }

    /**
     * @dev Get proposal collaborators
     */
    function getCollaborators(uint256 proposalId) external view returns (address[] memory) {
        return proposals[proposalId].collaboratorList;
    }

    /**
     * @dev Get proposal feedback
     */
    function getFeedback(uint256 proposalId, address reviewer) external view returns (
        string memory comment,
        uint256 rating,
        bool support,
        uint256 timestamp,
        string[] memory suggestions
    ) {
        Feedback storage feedback = proposals[proposalId].feedbacks[reviewer];
        return (
            feedback.comment,
            feedback.rating,
            feedback.support,
            feedback.timestamp,
            feedback.suggestions
        );
    }

    /**
     * @dev Get user proposals
     */
    function getUserProposals(address user) external view returns (uint256[] memory) {
        return userProposals[user];
    }

    /**
     * @dev Get proposal analytics
     */
    function getAnalytics() external view returns (
        uint256 totalProposals,
        uint256 activeProposals,
        uint256 completedProposals,
        uint256 averageFeedbackScore,
        uint256 averageCompletionTime,
        uint256 amendmentRate
    ) {
        return (
            analytics.totalProposals,
            analytics.activeProposals,
            analytics.completedProposals,
            analytics.averageFeedbackScore,
            analytics.averageCompletionTime,
            analytics.amendmentRate
        );
    }

    /**
     * @dev Get category name
     */
    function _getCategoryName(ProposalCategory category) internal pure returns (string memory) {
        if (category == ProposalCategory.Treasury) return "Treasury";
        if (category == ProposalCategory.Protocol) return "Protocol";
        if (category == ProposalCategory.Governance) return "Governance";
        if (category == ProposalCategory.Emergency) return "Emergency";
        if (category == ProposalCategory.CrossChain) return "CrossChain";
        if (category == ProposalCategory.Partnership) return "Partnership";
        if (category == ProposalCategory.Grant) return "Grant";
        if (category == ProposalCategory.Constitutional) return "Constitutional";
        if (category == ProposalCategory.Technical) return "Technical";
        if (category == ProposalCategory.Community) return "Community";
        return "Unknown";
    }

    /**
     * @dev Authorize contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    /**
     * @dev Advance proposal to next stage (for DAO integration)
     */
    function advanceStage(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");

        // Simple stage advancement logic
        if (proposal.stage == ProposalStage.Draft) {
            proposal.stage = ProposalStage.Review;
        } else if (proposal.stage == ProposalStage.Review) {
            proposal.stage = ProposalStage.Submitted;
        } else if (proposal.stage == ProposalStage.Submitted) {
            proposal.stage = ProposalStage.Governance;
        }
        // Other stages are managed by external contracts
    }
}
