'use client'

import { useState } from 'react'
import { useContractWrite, useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import traits from '../../data/traits.json'

interface Trait {
  id: number
  name: string
  image: string
  description: string
  rarity: string
}

interface TraitGalleryProps {
  traitVaultContract: string
}

export default function TraitGallery({ traitVaultContract }: TraitGalleryProps) {
  const { address } = useAccount()
  const [mintingTrait, setMintingTrait] = useState<number | null>(null)

  const { writeContract: mintTrait, isPending: isMintLoading } = useContractWrite()

  const handleMintTrait = async (trait: Trait) => {
    if (!address) return

    setMintingTrait(trait.id)
    try {
      mintTrait({
        address: traitVaultContract as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'traitId', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              { name: 'name', type: 'string' }
            ],
            name: 'mintTrait',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'mintTrait',
        args: [address, BigInt(trait.id), BigInt(1), trait.name]
      })
    } catch (error) {
      console.error('Trait mint error:', error)
      setMintingTrait(null)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-500'
      case 'uncommon': return 'from-green-400 to-green-500'
      case 'rare': return 'from-blue-400 to-blue-500'
      case 'epic': return 'from-purple-400 to-purple-500'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-2xl text-white shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🎨 Trait Library</h2>
        <p className="text-purple-100">Collect powerful traits to enhance your companion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {traits.map((trait: Trait) => (
          <motion.div
            key={trait.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                {trait.name.includes('Fire') ? '🔥' :
                 trait.name.includes('Healing') ? '💚' :
                 trait.name.includes('Laser') ? '⚡' :
                 trait.name.includes('Crystal') ? '💎' :
                 trait.name.includes('Shadow') ? '🌑' :
                 trait.name.includes('Thunder') ? '⚡' : '✨'}
              </div>

              <h3 className="text-lg font-bold mb-1">{trait.name}</h3>
              <p className="text-sm text-purple-100 mb-3">{trait.description}</p>

              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(trait.rarity)} text-white mb-4`}>
                {trait.rarity}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMintTrait(trait)}
              disabled={isMintLoading && mintingTrait === trait.id}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
            >
              {isMintLoading && mintingTrait === trait.id ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Minting...</span>
                </div>
              ) : (
                'Mint Trait'
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-purple-200">
          💡 Traits can be attached to your companions to enhance their abilities and appearance
        </p>
      </div>
    </motion.div>
  )
}
