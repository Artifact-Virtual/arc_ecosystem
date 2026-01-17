// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/registry/ARCModelRegistry.sol";
import "../contracts/sbt/ARCModelSBT.sol";
import "../contracts/libraries/ModelClass.sol";

/**
 * @title DeployGenesis
 * @notice Deployment script for the ARC Genesis ecosystem
 * @dev Deploys Genesis, Registry, and SBT contracts in proper order
 */
contract DeployGenesis is Script {
    // Deployment addresses (will be set after deployment)
    ARCGenesis public genesis;
    ARCModelRegistry public registry;
    ARCModelSBT public sbt;
    
    // Configuration
    bytes32 constant GENESIS_HASH = keccak256("ARC_GENESIS_V1_MAINNET");
    
    function run() external {
        // Get deployer from environment
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address governance = vm.envAddress("GOVERNANCE_ADDRESS");
        
        console.log("Deployer:", deployer);
        console.log("Governance:", governance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy Genesis (immutable root)
        console.log("\n=== Deploying ARCGenesis ===");
        genesis = new ARCGenesis();
        console.log("ARCGenesis deployed at:", address(genesis));
        
        // Step 2: Initialize Genesis with model classes
        console.log("\n=== Initializing Genesis ===");
        uint8[] memory enabledClasses = new uint8[](6);
        enabledClasses[0] = ModelClass.GENERATIVE;
        enabledClasses[1] = ModelClass.DISCRIMINATIVE;
        enabledClasses[2] = ModelClass.REINFORCEMENT;
        enabledClasses[3] = ModelClass.TRANSFORMER;
        enabledClasses[4] = ModelClass.DIFFUSION;
        enabledClasses[5] = ModelClass.CONSTITUTIONAL;
        
        bytes32[] memory invariantHashes = new bytes32[](6);
        invariantHashes[0] = keccak256("INVARIANT_GENERATIVE");
        invariantHashes[1] = keccak256("INVARIANT_DISCRIMINATIVE");
        invariantHashes[2] = keccak256("INVARIANT_REINFORCEMENT");
        invariantHashes[3] = keccak256("INVARIANT_TRANSFORMER");
        invariantHashes[4] = keccak256("INVARIANT_DIFFUSION");
        invariantHashes[5] = keccak256("INVARIANT_CONSTITUTIONAL");
        
        genesis.initialize(GENESIS_HASH, enabledClasses, invariantHashes);
        console.log("Genesis initialized with hash:", vm.toString(GENESIS_HASH));
        
        // Step 3: Deploy Registry (upgradeable)
        console.log("\n=== Deploying ARCModelRegistry ===");
        registry = new ARCModelRegistry();
        console.log("ARCModelRegistry deployed at:", address(registry));
        
        registry.initialize(address(genesis), governance);
        console.log("Registry initialized with governance:", governance);
        
        // Step 4: Deploy SBT (upgradeable)
        console.log("\n=== Deploying ARCModelSBT ===");
        sbt = new ARCModelSBT();
        console.log("ARCModelSBT deployed at:", address(sbt));
        
        sbt.initialize(
            address(registry),
            governance,
            "ARC Model Identity",
            "ARCM"
        );
        console.log("SBT initialized with name: ARC Model Identity");
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("\n=== Deployment Summary ===");
        console.log("Genesis (Immutable):", address(genesis));
        console.log("Registry (Upgradeable):", address(registry));
        console.log("SBT (Upgradeable):", address(sbt));
        console.log("Genesis Hash:", vm.toString(GENESIS_HASH));
        console.log("\nEnabled Model Classes:");
        console.log("- GENERATIVE (1)");
        console.log("- DISCRIMINATIVE (2)");
        console.log("- REINFORCEMENT (3)");
        console.log("- TRANSFORMER (4)");
        console.log("- DIFFUSION (5)");
        console.log("- CONSTITUTIONAL (6)");
        
        // Save deployment addresses to file
        string memory deploymentInfo = string.concat(
            "ARCGenesis=", vm.toString(address(genesis)), "\n",
            "ARCModelRegistry=", vm.toString(address(registry)), "\n",
            "ARCModelSBT=", vm.toString(address(sbt)), "\n",
            "GenesisHash=", vm.toString(GENESIS_HASH), "\n",
            "Governance=", vm.toString(governance), "\n"
        );
        
        vm.writeFile("./arc-genesis-deployment.txt", deploymentInfo);
        console.log("\nDeployment addresses saved to arc-genesis-deployment.txt");
    }
    
    /**
     * @notice Verify deployment integrity
     * @dev Can be called after deployment to verify everything is connected properly
     */
    function verify() external view {
        console.log("\n=== Verifying Deployment ===");
        
        // Verify Genesis
        require(genesis.isInitialized(), "Genesis not initialized");
        require(genesis.genesisHash() == GENESIS_HASH, "Genesis hash mismatch");
        console.log("Genesis: OK");
        
        // Verify Registry
        require(address(registry.genesis()) == address(genesis), "Registry genesis mismatch");
        console.log("Registry: OK");
        
        // Verify SBT
        require(address(sbt.registry()) == address(registry), "SBT registry mismatch");
        console.log("SBT: OK");
        
        console.log("\nAll contracts verified successfully!");
    }
}
