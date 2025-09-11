'use client'

import { useEffect, useState } from 'react'
import { useContractRead, useContractWrite, useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import traits from '../../data/traits.json'
import archetypes from '../../data/archetypes.json'

interface TimelineEvent {
  type: 'mint' | 'xp' | 'trait' | 'transfer'
  description: string
  timestamp: number
  txHash?: string
}

interface CompanionProfileProps {
  companionContract: string
  traitVaultContract: string
  tokenId: number
}

export default function CompanionProfile({
  companionContract,
  traitVaultContract,
  tokenId
}: CompanionProfileProps) {
  const { address } = useAccount()
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  // const [selectedTrait, setSelectedTrait] = useState<number | null>(null)

  // Read companion data
  const { data: xp } = useContractRead({
    address: companionContract as `0x${string}`,
    abi: [
      {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'xp',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'xp',
    args: [BigInt(tokenId)]
  })

  const { data: tbAccount } = useContractRead({
    address: companionContract as `0x${string}`,
    abi: [
      {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'getTokenBoundAccount',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'getTokenBoundAccount',
    args: [BigInt(tokenId)]
  })

  // const { data: metadataURI } = useContractRead({
  //   address: companionContract as `0x${string}`,
  //   abi: [
  //     {
  //       inputs: [{ name: 'tokenId', type: 'uint256' }],
  //       name: 'metadataURI',
  //       outputs: [{ name: '', type: 'string' }],
  //       stateMutability: 'view',
  //       type: 'function'
  //     }
  //   ],
  //   functionName: 'metadataURI',
  //   args: [BigInt(tokenId)]
  // })

  // Trait attachment
  const { writeContract: attachTrait, isPending: isAttaching } = useContractWrite()

  // Load timeline from on-chain events
  useEffect(() => {
    const loadTimeline = async () => {
      if (!window.ethereum) return

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(
          companionContract,
          [
            "event MintWithAccount(address indexed owner, uint256 indexed tokenId, address account)",
            "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
          ],
          provider
        )

        // Get past events for this token
        const mintFilter = contract.filters.MintWithAccount(null, tokenId)
        const transferFilter = contract.filters.Transfer(null, null, tokenId)

        const [mintEvents, transferEvents] = await Promise.all([
          contract.queryFilter(mintFilter, -10000), // Last 10000 blocks
          contract.queryFilter(transferFilter, -10000)
        ])

        const events: TimelineEvent[] = []

        // Process mint events
        mintEvents.forEach(event => {
          events.push({
            type: 'mint',
            description: 'Companion was born into the ecosystem',
            timestamp: event.blockNumber ? Date.now() - Math.random() * 86400000 : Date.now(), // Mock timestamp
            txHash: event.transactionHash
          })
        })

        // Process transfer events
        transferEvents.forEach(event => {
          const eventLog = event as ethers.EventLog
          if (eventLog.args && eventLog.args[0] !== ethers.ZeroAddress) {
            events.push({
              type: 'transfer',
              description: `Transferred to ${eventLog.args[1]?.slice(0, 6)}...${eventLog.args[1]?.slice(-4)}`,
              timestamp: event.blockNumber ? Date.now() - Math.random() * 86400000 : Date.now(),
              txHash: event.transactionHash
            })
          }
        })

        // Add some mock XP and trait events
        events.push({
          type: 'xp',
          description: 'Gained 50 XP from completing a quest',
          timestamp: Date.now() - 86400000 // 1 day ago
        })

        events.push({
          type: 'trait',
          description: 'Attached Fire Wings trait',
          timestamp: Date.now() - 172800000 // 2 days ago
        })

        // Sort by timestamp (most recent first)
        events.sort((a, b) => b.timestamp - a.timestamp)
        setTimeline(events)
      } catch (error) {
        console.error('Error loading timeline:', error)
        // Fallback to mock data
        setTimeline([
          {
            type: 'mint',
            description: 'Companion was born into the ecosystem',
            timestamp: Date.now() - 259200000 // 3 days ago
          },
          {
            type: 'xp',
            description: 'Gained 25 XP from exploration',
            timestamp: Date.now() - 172800000 // 2 days ago
          }
        ])
      }
    }

    loadTimeline()
  }, [companionContract, tokenId])

  const handleAttachTrait = async (traitId: number) => {
    if (!address) return

    try {
      attachTrait({
        address: traitVaultContract as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: 'tokenId', type: 'uint256' },
              { name: 'traitId', type: 'uint256' },
              { name: 'amount', type: 'uint256' }
            ],
            name: 'attachTrait',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'attachTrait',
        args: [BigInt(tokenId), BigInt(traitId), BigInt(1)]
      })
    } catch (error) {
      console.error('Attach trait error:', error)
    }
  }

  const currentXP = Number(xp || 0)
  const currentLevel = Math.floor(currentXP / 1000) + 1
  const xpForNextLevel = 1000 - (currentXP % 1000)
  const xpProgress = ((currentXP % 1000) / 1000) * 100

  // Mock companion data - in real app, fetch from metadataURI
  const companionData = {
    name: `Companion #${tokenId}`,
    archetype: archetypes[Math.floor(Math.random() * archetypes.length)].name,
    image: '/archetypes/explorer.png' // Default image
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'mint': return '🧬'
      case 'xp': return '⭐'
      case 'trait': return '🎨'
      case 'transfer': return '📤'
      default: return '📝'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl mb-8"
      >
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
            🧬
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{companionData.name}</h1>
            <p className="text-xl text-purple-100 mb-4">{companionData.archetype}</p>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Level {currentLevel}</span>
                <span className="text-sm">{currentXP} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                />
              </div>
              <p className="text-xs mt-1 text-purple-200">
                {xpForNextLevel} XP to next level
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats & Wallet */}
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">📊 Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Token ID:</span>
                <span className="text-white font-mono">#{tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Level:</span>
                <span className="text-white font-bold">{currentLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total XP:</span>
                <span className="text-white">{currentXP}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="text-lg font-semibold text-white mb-3">🏦 Token-Bound Wallet</h4>
              <a
                href={`https://etherscan.io/address/${tbAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline text-sm break-all"
              >
                {tbAccount}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">🎨 Available Traits</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {traits.map((trait) => (
                <motion.div
                  key={trait.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
                      {trait.name.includes('Fire') ? '🔥' :
                       trait.name.includes('Healing') ? '💚' :
                       trait.name.includes('Laser') ? '⚡' :
                       trait.name.includes('Crystal') ? '💎' :
                       trait.name.includes('Shadow') ? '🌑' :
                       trait.name.includes('Thunder') ? '⚡' : '✨'}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{trait.name}</h4>
                    <p className="text-gray-400 text-xs mb-3">{trait.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAttachTrait(trait.id)
                      }}
                      disabled={isAttaching}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs py-2 px-3 rounded transition-colors"
                    >
                      {isAttaching ? 'Attaching...' : 'Attach'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">📚 Timeline</h3>
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg"
              >
                <div className="text-2xl">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{event.description}</p>
                  <p className="text-gray-400 text-sm">{formatTimestamp(event.timestamp)}</p>
                  {event.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-xs underline"
                    >
                      View Transaction
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
