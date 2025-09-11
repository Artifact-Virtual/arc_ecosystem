import { useRouter } from 'next/router'
import CompanionProfile from '../../../components/CompanionProfile'

export default function CompanionPage() {
  const router = useRouter()
  const { id } = router.query

  const companionContract = "0xYourCompanionContract" // Update with deployed address
  const traitVaultContract = "0xYourTraitVaultContract" // Update with deployed address

  if (!id || Array.isArray(id)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Companion...</h2>
          <p className="text-gray-400">Please wait while we fetch your companion data</p>
        </div>
      </div>
    )
  }

  const tokenId = parseInt(id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <CompanionProfile
        companionContract={companionContract}
        traitVaultContract={traitVaultContract}
        tokenId={tokenId}
      />
    </div>
  )
}
