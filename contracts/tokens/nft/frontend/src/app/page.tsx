'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import CompanionMint from '../components/CompanionMint'
import TraitGallery from '../components/TraitGallery'

// Contract addresses - Update these after deployment
const CONTRACT_ADDRESSES = {
  companion: '0x...', // Replace with deployed address
  traitVault: '0x...', // Replace with deployed address
  moduleManager: '0x...', // Replace with deployed address
  moduleMock: '0x...', // Replace with deployed ModuleMock address
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [currentView, setCurrentView] = useState<'landing' | 'mint' | 'traits'>('landing')
  const [ownedTokens, setOwnedTokens] = useState<number[]>([])

  // Mock owned tokens for demo - in real app, fetch from contract
  useEffect(() => {
    if (isConnected) {
      // Mock data - replace with actual contract call
      setOwnedTokens([1, 2]) // Example owned token IDs
    }
  }, [isConnected])

  const renderLanding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl mx-auto"
    >
      <div className="mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🧬
        </motion.div>
        <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Evolving Companion
        </h1>
        <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
          Self-governing NFT ecosystem where your companions learn, evolve, and make decisions together through verifiable AI
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
        >
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Evolution</h3>
          <p className="text-gray-400 leading-relaxed">Companions learn from on-chain data and evolve through verifiable AI algorithms</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
        >
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold text-white mb-3">Self-Governing</h3>
          <p className="text-gray-400 leading-relaxed">NFT holders vote on protocol decisions and ecosystem upgrades through governance</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
        >
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-semibold text-white mb-3">Token-Bound Accounts</h3>
          <p className="text-gray-400 leading-relaxed">Each NFT controls its own account for autonomous interactions and DeFi participation</p>
        </motion.div>
      </div>

      <div className="space-x-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('mint')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Start Your Journey 🚀
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('traits')}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-200 border border-white/30"
        >
          Browse Traits 🎨
        </motion.button>
      </div>

      {ownedTokens.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 p-6 bg-green-500/20 border border-green-500/30 rounded-xl"
        >
          <p className="text-green-300 text-lg">
            🎉 You own {ownedTokens.length} companion{ownedTokens.length > 1 ? 's' : ''}!
            <a href={`/companion/${ownedTokens[0]}`} className="underline ml-2 hover:text-green-200">
              View your companion →
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-white hover:text-purple-400 transition-colors text-xl font-bold"
          >
            🧬 Evolving Companion
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {isConnected && (
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('landing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'landing' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('mint')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'mint' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Mint
              </button>
              <button
                onClick={() => setCurrentView('traits')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'traits' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Traits
              </button>
            </div>
          )}
          <ConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="not-connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">🔗</div>
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Connect your wallet to start your journey with evolving AI companions
              </p>
              <ConnectButton />
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'landing' && renderLanding()}
              {currentView === 'mint' && (
                <CompanionMint
                  companionContract={CONTRACT_ADDRESSES.companion}
                  moduleMockContract={CONTRACT_ADDRESSES.moduleMock}
                  onMintSuccess={(tokenId) => {
                    setOwnedTokens(prev => [...prev, tokenId])
                    // Could navigate to companion page here
                  }}
                />
              )}
              {currentView === 'traits' && (
                <TraitGallery traitVaultContract={CONTRACT_ADDRESSES.traitVault} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>Built with ❤️ for the future of self-governing NFT ecosystems</p>
      </footer>
    </div>
  )
}
