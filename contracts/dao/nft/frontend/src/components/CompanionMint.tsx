'use client'

import { useState } from 'react'
import { useContractWrite, useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import archetypes from '../../data/archetypes.json'

interface Archetype {
  id: string
  name: string
  image: string
  description: string
  baseStats: {
    strength: number
    agility: number
    intelligence: number
    charisma: number
  }
  metadataURI: string
}

interface CompanionMintProps {
  companionContract: string
  moduleMockContract: string
  onMintSuccess?: (tokenId: number) => void
}

export default function CompanionMint({ companionContract, moduleMockContract, onMintSuccess }: CompanionMintProps) {
  const { address } = useAccount()
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null)
  const [isMinting, setIsMinting] = useState(false)

  const { writeContract: mint, isPending: isMintLoading } = useContractWrite()

  const handleMint = async () => {
    if (!selectedArchetype || !address) return

    setIsMinting(true)
    try {
      mint({
        address: moduleMockContract as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'uri', type: 'string' }
            ],
            name: 'saleMint',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'saleMint',
        args: [address, selectedArchetype.metadataURI]
      })
      // Note: onMintSuccess will be called from parent component
      // when the transaction is confirmed
    } catch (error) {
      console.error('Mint error:', error)
      setIsMinting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl text-white shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🧬 Mint Your Companion</h2>
        <p className="text-purple-100">Choose an archetype to begin your companion&apos;s journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {archetypes.map((archetype: Archetype) => (
          <motion.div
            key={archetype.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedArchetype?.id === archetype.id
                ? 'border-yellow-400 bg-white/20 shadow-lg'
                : 'border-white/30 bg-white/10 hover:border-white/50'
            }`}
            onClick={() => setSelectedArchetype(archetype)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                🧬
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{archetype.name}</h3>
                <p className="text-sm text-purple-100 mb-3">{archetype.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>STR:</span>
                    <span className="font-bold">{archetype.baseStats.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AGI:</span>
                    <span className="font-bold">{archetype.baseStats.agility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>INT:</span>
                    <span className="font-bold">{archetype.baseStats.intelligence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CHA:</span>
                    <span className="font-bold">{archetype.baseStats.charisma}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedArchetype?.id === archetype.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <span className="text-black text-sm">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedArchetype && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMint}
            disabled={isMinting || isMintLoading}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
          >
            {isMinting || isMintLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                <span>Minting {selectedArchetype.name}...</span>
              </div>
            ) : (
              `Mint ${selectedArchetype.name} Companion`
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
