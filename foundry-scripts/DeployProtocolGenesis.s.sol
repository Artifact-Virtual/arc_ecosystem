// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ARCProtocolGenesis} from "../contracts/ARCProtocolGenesis.sol";
import {L2GenesisVerifier} from "../contracts/L2GenesisVerifier.sol";

/**
 * @title DeployProtocolGenesis
 * @notice Deployment script for ARC Protocol Genesis system
 * 
 * Usage:
 * 
 * For L1 (Ethereum mainnet or Sepolia testnet):
 * forge script foundry-scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
 *     --rpc-url $RPC_URL \
 *     --private-key $DEPLOYER_PRIVATE_KEY \
 *     --broadcast \
 *     --verify
 * 
 * For L2 (Base, Optimism, Arbitrum):
 * Set L1_GENESIS_HASH and L1_GENESIS_ADDRESS environment variables
 * forge script foundry-scripts/DeployProtocolGenesis.s.sol:DeployProtocolGenesis \
 *     --rpc-url $L2_RPC_URL \
 *     --private-key $DEPLOYER_PRIVATE_KEY \
 *     --broadcast \
 *     --verify
 * 
 * Required Environment Variables:
 * - TREASURY_ADDRESS: Address of treasury contract
 * - TIMELOCK_ADDRESS: Address of timelock contract
 * - GOVERNOR_ADDRESS: Address of governor contract
 * - TOKEN_ADDRESS: Address of ARCx token
 * - ADAM_HOST_ADDRESS: Address of ADAM host
 * - ADAM_REGISTRY_ADDRESS: Address of ADAM registry
 * - AI_GENESIS_ADDRESS: Address of AI Genesis
 * - AI_REGISTRY_ADDRESS: Address of AI Registry
 * - AI_SBT_ADDRESS: Address of AI SBT
 * - L1_L2_MESSENGER_ADDRESS: Address of cross-chain messenger (optional for L2)
 * - L2_VERIFIER_ADDRESS: Address of L2 verifier (optional for L1)
 * - EMERGENCY_COUNCIL_ADDRESS: Address of emergency multisig
 */
contract DeployProtocolGenesis is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        uint256 chainId = block.chainid;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Check if deploying to L1 or L2
        bool isL1 = (chainId == 1 || chainId == 11155111); // Mainnet or Sepolia
        
        if (isL1) {
            deployL1Genesis();
        } else {
            deployL2Verifier();
        }
        
        vm.stopBroadcast();
    }
    
    function deployL1Genesis() internal {
        console.log("==============================================");
        console.log("Deploying ARC Protocol Genesis to L1");
        console.log("Chain ID:", block.chainid);
        console.log("==============================================");
        
        // Load required addresses from environment
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address timelock = vm.envAddress("TIMELOCK_ADDRESS");
        address governor = vm.envAddress("GOVERNOR_ADDRESS");
        address token = vm.envAddress("TOKEN_ADDRESS");
        address adamHost = vm.envAddress("ADAM_HOST_ADDRESS");
        address adamRegistry = vm.envAddress("ADAM_REGISTRY_ADDRESS");
        address aiGenesis = vm.envAddress("AI_GENESIS_ADDRESS");
        address aiRegistry = vm.envAddress("AI_REGISTRY_ADDRESS");
        address aiSBT = vm.envAddress("AI_SBT_ADDRESS");
        address emergencyCouncil = vm.envAddress("EMERGENCY_COUNCIL_ADDRESS");
        
        // Optional L2 addresses (can be zero initially)
        address l1l2Messenger = vm.envOr("L1_L2_MESSENGER_ADDRESS", address(0));
        address l2Verifier = vm.envOr("L2_VERIFIER_ADDRESS", address(0));
        
        // Deploy genesis
        ARCProtocolGenesis genesis = new ARCProtocolGenesis(
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
        
        console.log("==============================================");
        console.log("ARC Protocol Genesis deployed!");
        console.log("==============================================");
        console.log("Genesis Address:", address(genesis));
        console.log("Genesis Block:", genesis.GENESIS_BLOCK());
        console.log("Genesis Timestamp:", genesis.GENESIS_TIMESTAMP());
        console.log("Genesis Root Hash:", vm.toString(genesis.genesisHash()));
        console.log("Constitutional Hash:", vm.toString(genesis.constitutionalHash()));
        console.log("==============================================");
        console.log("Canonical Subsystem Addresses:");
        console.log("==============================================");
        console.log("Treasury:", genesis.TREASURY_ADDRESS());
        console.log("Timelock:", genesis.TIMELOCK_ADDRESS());
        console.log("Governor:", genesis.GOVERNOR_ADDRESS());
        console.log("Token (ARCx):", genesis.TOKEN_ADDRESS());
        console.log("ADAM Host:", genesis.ADAM_HOST_ADDRESS());
        console.log("ADAM Registry:", genesis.ADAM_REGISTRY_ADDRESS());
        console.log("AI Genesis:", genesis.AI_GENESIS_ADDRESS());
        console.log("AI Registry:", genesis.AI_REGISTRY_ADDRESS());
        console.log("AI SBT:", genesis.AI_SBT_ADDRESS());
        console.log("Emergency Council:", genesis.EMERGENCY_COUNCIL_ADDRESS());
        console.log("==============================================");
        console.log("Protocol Constants:");
        console.log("==============================================");
        console.log("Max Treasury Withdrawal:", genesis.MAX_TREASURY_WITHDRAWAL_BPS() / 100, "%");
        console.log("Min Treasury Reserve:", genesis.MIN_TREASURY_RESERVE_BPS() / 100, "%");
        console.log("Min Quorum:", genesis.MIN_QUORUM_BPS() / 100, "%");
        console.log("Max Quorum:", genesis.MAX_QUORUM_BPS() / 100, "%");
        console.log("Max Total Supply:", genesis.MAX_TOTAL_SUPPLY() / 1e18, "tokens");
        console.log("Emergency Pause Duration:", genesis.EMERGENCY_PAUSE_DURATION() / 1 days, "days");
        console.log("==============================================");
        
        // Save deployment info
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "genesisAddress": "', vm.toString(address(genesis)), '",\n',
            '  "genesisBlock": ', vm.toString(genesis.GENESIS_BLOCK()), ',\n',
            '  "genesisTimestamp": ', vm.toString(genesis.GENESIS_TIMESTAMP()), ',\n',
            '  "genesisRootHash": "', vm.toString(genesis.genesisHash()), '",\n',
            '  "chainId": ', vm.toString(block.chainid), '\n',
            "}"
        ));
        
        vm.writeFile("./deployments/protocol-genesis-l1.json", deploymentInfo);
        console.log("Deployment info saved to: ./deployments/protocol-genesis-l1.json");
        console.log("==============================================");
    }
    
    function deployL2Verifier() internal {
        console.log("==============================================");
        console.log("Deploying L2 Genesis Verifier");
        console.log("Chain ID:", block.chainid);
        console.log("==============================================");
        
        // Load L1 genesis info
        bytes32 l1GenesisHash = vm.envBytes32("L1_GENESIS_HASH");
        address l1GenesisAddress = vm.envAddress("L1_GENESIS_ADDRESS");
        uint256 l1ChainId = vm.envOr("L1_CHAIN_ID", uint256(1)); // Default to Ethereum mainnet
        uint256 l1GenesisBlock = vm.envUint("L1_GENESIS_BLOCK");
        
        // Deploy L2 verifier
        L2GenesisVerifier verifier = new L2GenesisVerifier(
            l1GenesisHash,
            l1GenesisAddress,
            l1ChainId,
            l1GenesisBlock
        );
        
        console.log("==============================================");
        console.log("L2 Genesis Verifier deployed!");
        console.log("==============================================");
        console.log("Verifier Address:", address(verifier));
        console.log("L1 Genesis Hash:", vm.toString(verifier.L1_GENESIS_HASH()));
        console.log("L1 Genesis Address:", verifier.L1_GENESIS_ADDRESS());
        console.log("L1 Chain ID:", verifier.L1_CHAIN_ID());
        console.log("L1 Genesis Block:", verifier.L1_GENESIS_BLOCK());
        console.log("L2 Chain ID:", verifier.L2_CHAIN_ID());
        console.log("L2 Deployment Block:", verifier.L2_DEPLOYMENT_BLOCK());
        console.log("==============================================");
        
        // Save deployment info
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "verifierAddress": "', vm.toString(address(verifier)), '",\n',
            '  "l1GenesisHash": "', vm.toString(verifier.L1_GENESIS_HASH()), '",\n',
            '  "l1GenesisAddress": "', vm.toString(verifier.L1_GENESIS_ADDRESS()), '",\n',
            '  "l2ChainId": ', vm.toString(verifier.L2_CHAIN_ID()), ',\n',
            '  "l2DeploymentBlock": ', vm.toString(verifier.L2_DEPLOYMENT_BLOCK()), '\n',
            "}"
        ));
        
        vm.writeFile("./deployments/protocol-genesis-l2.json", deploymentInfo);
        console.log("Deployment info saved to: ./deployments/protocol-genesis-l2.json");
        console.log("==============================================");
    }
}
