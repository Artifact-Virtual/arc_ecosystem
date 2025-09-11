#!/usr/bin/env python3
"""
ARCX Trading Bot for Ganache
Simulates real ARCX tokenomics with Uniswap V4 mechanics
"""

import time
import random
from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
import os

# Configuration
GANACHE_URL = "http://127.0.0.1:8545"
PRIVATE_KEY = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"  # Ganache default
DEPLOYER_ADDRESS = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

# Contract addresses (update these after deployment)
MOCK_POOL_MANAGER = "0xC89Ce4735882C9F0f0FE26686c53074E09B0D550"
MOCK_ARCX_TOKEN = "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb"

# Token addresses
WETH_ADDRESS = "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7"

# Pool configuration
FEE = 500  # 0.05%

class ARCxTradingBot:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(GANACHE_URL))
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)

        # Load contract ABIs
        with open('artifacts/contracts/defi/MockPoolManager.sol/MockPoolManager.json', 'r') as f:
            pool_abi = json.load(f)['abi']
        with open('artifacts/contracts/tokens/MockARCxToken.sol/MockARCxToken.json', 'r') as f:
            token_abi = json.load(f)['abi']

        self.pool_contract = self.w3.eth.contract(address=self.w3.to_checksum_address(MOCK_POOL_MANAGER), abi=pool_abi)
        self.arcx_contract = self.w3.eth.contract(address=self.w3.to_checksum_address(MOCK_ARCX_TOKEN), abi=token_abi)

    def create_pool(self):
        """Create ARCX/WETH pool"""
        print("Creating ARCX/WETH pool...")
        tx = self.pool_contract.functions.createPool(
            MOCK_ARCX_TOKEN,
            WETH_ADDRESS,
            FEE
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 2000000,
            'gasPrice': self.w3.to_wei('20', 'gwei')
        })

        signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Pool created: {receipt.transactionHash.hex()}")

    def add_liquidity(self, amount_arcx, amount_eth):
        """Add liquidity to the pool"""
        print(f"Adding liquidity: {amount_arcx} ARCX, {amount_eth} ETH")

        # Approve ARCX
        tx = self.arcx_contract.functions.approve(MOCK_POOL_MANAGER, amount_arcx).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 100000,
            'gasPrice': self.w3.to_wei('20', 'gwei')
        })
        signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        self.w3.eth.wait_for_transaction_receipt(tx_hash)

        # Add liquidity
        pool_id = self.w3.keccak(bytes.fromhex(MOCK_ARCX_TOKEN[2:] + WETH_ADDRESS[2:] + FEE.to_bytes(3, 'big').hex()))
        tx = self.pool_contract.functions.addLiquidity(pool_id, amount_arcx, amount_eth).build_transaction({
            'from': self.account.address,
            'value': amount_eth,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 200000,
            'gasPrice': self.w3.to_wei('20', 'gwei')
        })
        signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Liquidity added: {receipt.transactionHash.hex()}")

    def execute_trade(self, amount_in, zero_for_one=True):
        """Execute a trade"""
        print(f"Executing trade: {amount_in} {'ARCX->ETH' if zero_for_one else 'ETH->ARCX'}")

        pool_id = self.w3.keccak(bytes.fromhex(MOCK_ARCX_TOKEN[2:] + WETH_ADDRESS[2:] + FEE.to_bytes(3, 'big').hex()))

        if zero_for_one:  # ARCX to ETH
            tx = self.arcx_contract.functions.approve(MOCK_POOL_MANAGER, amount_in).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 100000,
                'gasPrice': self.w3.to_wei('20', 'gwei')
            })
            signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.w3.eth.wait_for_transaction_receipt(tx_hash)

        tx = self.pool_contract.functions.swap(pool_id, zero_for_one, amount_in, 0).build_transaction({
            'from': self.account.address,
            'value': amount_in if not zero_for_one else 0,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 200000,
            'gasPrice': self.w3.to_wei('20', 'gwei')
        })
        signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Trade executed: {receipt.transactionHash.hex()}")

    def run_simulation(self):
        """Run trading simulation"""
        print("Starting ARCX Trading Bot Simulation...")

        # Create pool
        self.create_pool()

        # Add initial liquidity
        amount_arcx = self.w3.to_wei(10000, 'ether')  # 10k ARCX
        amount_eth = self.w3.to_wei(1, 'ether')       # 1 ETH
        self.add_liquidity(amount_arcx, amount_eth)

        # Run some trades
        for i in range(10):
            amount = random.randint(100, 1000) * 10**18  # Random amount
            direction = random.choice([True, False])
            self.execute_trade(amount, direction)
            time.sleep(1)

        print("Simulation complete!")

if __name__ == "__main__":
    bot = ARCxTradingBot()
    bot.run_simulation()
