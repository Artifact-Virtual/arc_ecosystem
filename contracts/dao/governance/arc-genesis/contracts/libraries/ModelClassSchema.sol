// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {ModelClass} from "./ModelClass.sol";

/**
 * @title ModelClassSchema
 * @notice Comprehensive schema defining metadata and capabilities for each model class
 * @dev Provides structured information about model classes for documentation, validation, and integration
 * 
 * This schema is immutable and deterministic, serving as the canonical reference
 * for understanding model class capabilities, constraints, and intended use cases.
 */
library ModelClassSchema {
    /**
     * @dev Capability flags for model classes
     */
    struct Capabilities {
        bool canExecute;        // Can execute on-chain actions
        bool canVerify;         // Can verify or audit other models
        bool canGovern;         // Can participate in governance
        bool canManagePolicy;   // Can manage or update policies
        bool canManageAssets;   // Can manage treasury or assets
        bool canGenerateOutput; // Can generate creative/analytical output
        bool requiresApproval;  // Requires governance approval for actions
        bool isAdvisoryOnly;    // Provides advisory output only (no execution)
    }

    /**
     * @dev Complete schema for a model class
     */
    struct ClassSchema {
        bytes32 classId;           // Class identifier
        string name;               // Human-readable name
        string description;        // Detailed description
        bytes32 invariantHash;     // Invariant constraints hash
        Capabilities capabilities; // Capability flags
        string[] useCases;         // Primary use cases
        string[] restrictions;     // Key restrictions
    }

    /**
     * @notice Get the complete schema for REASONING_CORE class
     * @return ClassSchema Complete schema information
     */
    function getReasoningCoreSchema() internal pure returns (ClassSchema memory) {
        string[] memory useCases = new string[](4);
        useCases[0] = "Strategic analysis and decision support";
        useCases[1] = "Risk assessment and scenario modeling";
        useCases[2] = "Policy recommendation generation";
        useCases[3] = "Constitutional AI guidance (e.g., GLADIUS)";

        string[] memory restrictions = new string[](3);
        restrictions[0] = "Cannot execute on-chain transactions";
        restrictions[1] = "Cannot manage or access treasury assets";
        restrictions[2] = "Cannot participate in governance voting";

        return ClassSchema({
            classId: ModelClass.REASONING_CORE,
            name: "Reasoning Core",
            description: "Advanced reasoning models that provide strategic analysis, decision support, and constitutional guidance. These models operate in an advisory capacity only, with no execution rights.",
            invariantHash: keccak256("NO_EXECUTION|NO_ASSETS|ADVISORY_ONLY"),
            capabilities: Capabilities({
                canExecute: false,
                canVerify: false,
                canGovern: false,
                canManagePolicy: false,
                canManageAssets: false,
                canGenerateOutput: true,
                requiresApproval: false,
                isAdvisoryOnly: true
            }),
            useCases: useCases,
            restrictions: restrictions
        });
    }

    /**
     * @notice Get the complete schema for GENERATIVE_INTERFACE class
     * @return ClassSchema Complete schema information
     */
    function getGenerativeInterfaceSchema() internal pure returns (ClassSchema memory) {
        string[] memory useCases = new string[](4);
        useCases[0] = "Natural language interfaces for user interaction";
        useCases[1] = "Content generation and synthesis";
        useCases[2] = "Query interpretation and response generation";
        useCases[3] = "Documentation and report creation";

        string[] memory restrictions = new string[](4);
        restrictions[0] = "Cannot participate in governance";
        restrictions[1] = "Cannot verify or audit other models";
        restrictions[2] = "Cannot execute privileged operations";
        restrictions[3] = "Limited to interface and content generation";

        return ClassSchema({
            classId: ModelClass.GENERATIVE_INTERFACE,
            name: "Generative Interface",
            description: "Models specialized in natural language interaction and content generation. These models serve as the primary interface layer but have no governance or verification capabilities.",
            invariantHash: keccak256("NO_GOV|NO_VERIFY|NO_EXEC"),
            capabilities: Capabilities({
                canExecute: false,
                canVerify: false,
                canGovern: false,
                canManagePolicy: false,
                canManageAssets: false,
                canGenerateOutput: true,
                requiresApproval: false,
                isAdvisoryOnly: false
            }),
            useCases: useCases,
            restrictions: restrictions
        });
    }

    /**
     * @notice Get the complete schema for OPERATIONAL_AGENT class
     * @return ClassSchema Complete schema information
     */
    function getOperationalAgentSchema() internal pure returns (ClassSchema memory) {
        string[] memory useCases = new string[](4);
        useCases[0] = "Automated task execution";
        useCases[1] = "Workflow orchestration";
        useCases[2] = "System monitoring and maintenance";
        useCases[3] = "Routine operational procedures";

        string[] memory restrictions = new string[](3);
        restrictions[0] = "Cannot modify policies or governance rules";
        restrictions[1] = "Cannot verify or audit other models";
        restrictions[2] = "Limited to pre-approved operational scope";

        return ClassSchema({
            classId: ModelClass.OPERATIONAL_AGENT,
            name: "Operational Agent",
            description: "Models authorized to execute specific operational tasks within defined boundaries. These models can perform actions but cannot set policy or verify other models.",
            invariantHash: keccak256("EXEC_ONLY|NO_POLICY|NO_VERIFY"),
            capabilities: Capabilities({
                canExecute: true,
                canVerify: false,
                canGovern: false,
                canManagePolicy: false,
                canManageAssets: false,
                canGenerateOutput: true,
                requiresApproval: true,
                isAdvisoryOnly: false
            }),
            useCases: useCases,
            restrictions: restrictions
        });
    }

    /**
     * @notice Get the complete schema for VERIFIER_AUDITOR class
     * @return ClassSchema Complete schema information
     */
    function getVerifierAuditorSchema() internal pure returns (ClassSchema memory) {
        string[] memory useCases = new string[](4);
        useCases[0] = "Model output verification";
        useCases[1] = "Compliance checking and auditing";
        useCases[2] = "Security assessment";
        useCases[3] = "Quality assurance and validation";

        string[] memory restrictions = new string[](3);
        restrictions[0] = "Cannot execute operational tasks";
        restrictions[1] = "Cannot modify policies";
        restrictions[2] = "Limited to verification and auditing functions";

        return ClassSchema({
            classId: ModelClass.VERIFIER_AUDITOR,
            name: "Verifier Auditor",
            description: "Models specialized in verification, auditing, and compliance checking. These models can validate other models' outputs but cannot execute operations or set policy.",
            invariantHash: keccak256("VERIFY_ONLY|NO_EXEC|NO_POLICY"),
            capabilities: Capabilities({
                canExecute: false,
                canVerify: true,
                canGovern: false,
                canManagePolicy: false,
                canManageAssets: false,
                canGenerateOutput: true,
                requiresApproval: false,
                isAdvisoryOnly: false
            }),
            useCases: useCases,
            restrictions: restrictions
        });
    }

    /**
     * @notice Get schema for any class by ID
     * @param classId The class identifier
     * @return ClassSchema Complete schema information
     */
    function getSchema(bytes32 classId) internal pure returns (ClassSchema memory) {
        if (classId == ModelClass.REASONING_CORE) {
            return getReasoningCoreSchema();
        }
        if (classId == ModelClass.GENERATIVE_INTERFACE) {
            return getGenerativeInterfaceSchema();
        }
        if (classId == ModelClass.OPERATIONAL_AGENT) {
            return getOperationalAgentSchema();
        }
        if (classId == ModelClass.VERIFIER_AUDITOR) {
            return getVerifierAuditorSchema();
        }
        revert("INVALID_CLASS");
    }

    /**
     * @notice Check if a class has a specific capability
     * @param classId The class identifier
     * @param capability The capability name (as string)
     * @return bool True if class has the capability
     */
    function hasCapability(bytes32 classId, string memory capability) internal pure returns (bool) {
        ClassSchema memory schema = getSchema(classId);
        
        if (keccak256(bytes(capability)) == keccak256("canExecute")) {
            return schema.capabilities.canExecute;
        }
        if (keccak256(bytes(capability)) == keccak256("canVerify")) {
            return schema.capabilities.canVerify;
        }
        if (keccak256(bytes(capability)) == keccak256("canGovern")) {
            return schema.capabilities.canGovern;
        }
        if (keccak256(bytes(capability)) == keccak256("canManagePolicy")) {
            return schema.capabilities.canManagePolicy;
        }
        if (keccak256(bytes(capability)) == keccak256("canManageAssets")) {
            return schema.capabilities.canManageAssets;
        }
        if (keccak256(bytes(capability)) == keccak256("canGenerateOutput")) {
            return schema.capabilities.canGenerateOutput;
        }
        if (keccak256(bytes(capability)) == keccak256("isAdvisoryOnly")) {
            return schema.capabilities.isAdvisoryOnly;
        }
        
        return false;
    }

    /**
     * @notice Get human-readable name for a class
     * @param classId The class identifier
     * @return string The class name
     */
    function getName(bytes32 classId) internal pure returns (string memory) {
        return getSchema(classId).name;
    }

    /**
     * @notice Get description for a class
     * @param classId The class identifier
     * @return string The class description
     */
    function getDescription(bytes32 classId) internal pure returns (string memory) {
        return getSchema(classId).description;
    }

    /**
     * @notice Validate that a class supports required capabilities
     * @param classId The class identifier
     * @param requiredCapabilities Array of required capability names
     * @return bool True if all capabilities are supported
     */
    function validateCapabilities(
        bytes32 classId,
        string[] memory requiredCapabilities
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < requiredCapabilities.length; i++) {
            if (!hasCapability(classId, requiredCapabilities[i])) {
                return false;
            }
        }
        return true;
    }
}
