// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../contracts/genesis/ARCGenesis.sol";
import "../contracts/registry/ARCModelRegistryV2.sol";
import "../contracts/registry/RegistryProxy.sol";
import "../contracts/sbt/ARCModelSBTV2.sol";
import "../contracts/sbt/SBTProxy.sol";

/**
 * @title DeployGenesisV2
 * @notice Deployment script for GENESIS system V2 with all audit improvements
 * @dev Deploys:
 *      - ARCGenesis (immutable)
 *      - ARCModelRegistryV2 (with metadata, versioning, batch ops)
 *      - RegistryProxy (upgradeable wrapper)
 *      - ARCModelSBTV2 (with pause, batch ops)
 *      - SBTProxy (upgradeable wrapper)
 */
contract DeployGenesisV2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address governance = vm.envAddress("GOVERNANCE_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy Genesis (immutable)
        ARCGenesis genesis = new ARCGenesis();
        console.log("ARCGenesis deployed at:", address(genesis));
        
        // 2. Deploy RegistryV2
        ARCModelRegistryV2 registryImpl = new ARCModelRegistryV2(
            address(genesis),
            governance
        );
        console.log("ARCModelRegistryV2 deployed at:", address(registryImpl));
        
        // 3. Deploy Registry Proxy
        RegistryProxy registryProxy = new RegistryProxy(
            address(registryImpl),
            governance
        );
        console.log("RegistryProxy deployed at:", address(registryProxy));
        
        // 4. Deploy SBTV2
        ARCModelSBTV2 sbtImpl = new ARCModelSBTV2(
            address(registryProxy), // Use proxy for registry calls
            governance
        );
        console.log("ARCModelSBTV2 deployed at:", address(sbtImpl));
        
        // 5. Deploy SBT Proxy
        SBTProxy sbtProxy = new SBTProxy(
            address(sbtImpl),
            governance
        );
        console.log("SBTProxy deployed at:", address(sbtProxy));
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        string memory deploymentInfo = string.concat(
            "# GENESIS V2 Deployment Addresses\n\n",
            "ARCGenesis=", vm.toString(address(genesis)), "\n",
            "ARCModelRegistryV2=", vm.toString(address(registryImpl)), "\n",
            "RegistryProxy=", vm.toString(address(registryProxy)), "\n",
            "ARCModelSBTV2=", vm.toString(address(sbtImpl)), "\n",
            "SBTProxy=", vm.toString(address(sbtProxy)), "\n"
        );
        
        vm.writeFile("./arc-genesis-v2-deployment.txt", deploymentInfo);
        
        console.log("\n=== Deployment Complete ===");
        console.log("Use RegistryProxy and SBTProxy for all interactions");
        console.log("Governance can upgrade implementations via proxy");
    }
    
    function verify() external view {
        // Verification logic
        console.log("Verifying deployment...");
    }
}
