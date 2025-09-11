# ARC NFT Frontend

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&labelColor=0D1117&logo=react)
[![License: MIT](https://img.shields.io/badge/License-MIT-00C853?style=for-the-badge&labelColor=0D1117&logo=opensourceinitiative&logoColor=white)](#license)
[![Next.js](https://img.shields.io/badge/Next.js-13.x-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![wagmi](https://img.shields.io/badge/wagmi-1.x-FF6B35?style=for-the-badge)](https://wagmi.sh/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> React Frontend for ARC NFT Ecosystem

A modern, responsive React application for interacting with the ARC NFT ecosystem. Built with Next.js 13, TypeScript, and wagmi for seamless Web3 integration.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-00C853?style=flat-square)](https://github.com/ARTIFACT-VIRTUAL/arc_ecosystem)
[![Framework](https://img.shields.io/badge/Framework-Next.js%2013-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Web3](https://img.shields.io/badge/Web3-wagmi-FF6B35?style=flat-square)](https://wagmi.sh/)

## Overview

The ARC NFT Frontend provides a comprehensive user interface for the ARC NFT ecosystem, featuring:

- **Companion Minting**: Interactive companion creation with archetype selection
- **Trait Gallery**: Visual trait browsing and management
- **Companion Dashboard**: XP tracking and profile management
- **Wallet Integration**: Seamless Web3 wallet connectivity
- **Real-time Updates**: Live XP and trait status updates
- **Responsive Design**: Mobile-first, modern UI/UX

### Key Features

1. **Interactive Minting**
   - Archetype selection interface
   - Real-time minting status
   - Gas estimation and transaction handling

2. **Trait Management**
   - Visual trait gallery
   - Attachment/detachment controls
   - Vault custody status display

3. **Companion Profile**
   - XP and level tracking
   - Trait inventory display
   - Evolution progress visualization

4. **Web3 Integration**
   - Multi-wallet support (MetaMask, WalletConnect, Coinbase Wallet)
   - Network switching (Base, Ethereum, Localhost)
   - Transaction monitoring and error handling

---

## Technology Stack

[![Next.js](https://img.shields.io/badge/Next.js-13.4-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![wagmi](https://img.shields.io/badge/wagmi-1.x-FF6B35?style=flat-square)](https://wagmi.sh/)
[![Viem](https://img.shields.io/badge/Viem-1.x-FF6B35?style=flat-square)](https://viem.sh/)

### Core Dependencies

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Web3**: wagmi v1 + viem for Ethereum interactions
- **State Management**: React hooks + wagmi
- **Icons**: Heroicons + custom SVG assets
- **Forms**: React Hook Form with validation

---

## Project Structure

```bash
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── web3/                     # Web3-specific components
│   ├── nft/                      # NFT-specific components
│   ├── CompanionMint.tsx         # Minting interface
│   ├── TraitGallery.tsx          # Trait browsing
│   ├── CompanionProfile.tsx      # Profile dashboard
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── useNFT.ts                 # NFT contract hooks
│   ├── useWallet.ts              # Wallet connection hooks
│   ├── useTraits.ts              # Trait management hooks
│   └── ...
├── lib/                          # Utility libraries
│   ├── contracts/                # Contract ABIs and addresses
│   ├── utils/                    # Helper functions
│   ├── config/                   # App configuration
│   └── ...
├── types/                        # TypeScript type definitions
│   ├── nft.ts                    # NFT-related types
│   ├── web3.ts                   # Web3-related types
│   └── ...
├── public/                       # Static assets
│   ├── images/                   # NFT images and icons
│   └── ...
└── styles/                       # Additional stylesheets
```

---

## Core Components

### CompanionMint Component

```tsx
// Interactive companion minting with archetype selection
<CompanionMint
  onMint={handleMint}
  isLoading={mintLoading}
  archetypes={availableArchetypes}
/>
```

**Features**:
- Archetype selection grid
- Real-time gas estimation
- Transaction status updates
- Error handling and retry logic

### TraitGallery Component

```tsx
// Visual trait browsing and attachment
<TraitGallery
  companionId={selectedCompanion}
  onAttach={handleAttachTrait}
  onDetach={handleDetachTrait}
/>
```

**Features**:
- Grid layout with trait previews
- Attachment status indicators
- Vault custody information
- Search and filter capabilities

### CompanionProfile Component

```tsx
// Companion dashboard with XP tracking
<CompanionProfile
  companionId={companionId}
  showTraits={true}
  showEvolution={true}
/>
```

**Features**:
- XP progress visualization
- Level indicators
- Trait inventory
- Evolution timeline

---

## Web3 Integration

### Wallet Connection

```tsx
import { useConnect, useAccount } from 'wagmi'

function WalletConnect() {
  const { connect, connectors } = useConnect()
  const { address, isConnected } = useAccount()

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
```

### Contract Interactions

```tsx
import { useContractWrite, useContractRead } from 'wagmi'

function MintCompanion() {
  const { write, isLoading } = useContractWrite({
    address: COMPANION_ADDRESS,
    abi: COMPANION_ABI,
    functionName: 'mint',
  })

  const handleMint = () => {
    write({
      args: [userAddress, metadataURI],
    })
  }

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? 'Minting...' : 'Mint Companion'}
    </button>
  )
}
```

### Supported Networks

- **Base Mainnet**: Primary production network
- **Base Sepolia**: Test network
- **Ethereum Mainnet**: Cross-chain operations
- **Localhost**: Development network

---

## Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ARTIFACT-VIRTUAL/arc_ecosystem.git
cd contracts/tokens/nft/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# Contract addresses
NEXT_PUBLIC_COMPANION_ADDRESS=0x...
NEXT_PUBLIC_TRAIT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_MODULE_MOCK_ADDRESS=0x...
```

### Development Server

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Available Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## Styling & Design

### Design System

The frontend uses a custom design system built on Tailwind CSS:

- **Colors**: ARC brand colors with semantic variants
- **Typography**: Inter font family with responsive scaling
- **Spacing**: 4px grid system
- **Components**: Consistent button, input, and card styles

### Responsive Design

- **Mobile-first approach**: Optimized for mobile devices
- **Tablet breakpoints**: Enhanced layouts for tablets
- **Desktop enhancements**: Full feature set on larger screens
- **Accessibility**: WCAG 2.1 AA compliance

### Dark Mode Support

```tsx
// Theme provider with dark mode
<ThemeProvider attribute="class">
  <App />
</ThemeProvider>
```

---

## API Integration

### Contract ABIs

```typescript
// lib/contracts/abis.ts
export const COMPANION_ABI = [...] as const
export const TRAIT_VAULT_ABI = [...] as const
export const MODULE_MOCK_ABI = [...] as const
```

### Address Configuration

```typescript
// lib/contracts/addresses.ts
export const CONTRACT_ADDRESSES = {
  [base.id]: {
    companion: '0x...',
    traitVault: '0x...',
    moduleMock: '0x...',
  },
  [baseSepolia.id]: {
    // Testnet addresses
  },
} as const
```

---

## Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### E2E Tests

```bash
# Run Playwright tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui
```

### Test Structure

```bash
__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
├── utils/              # Utility tests
├── e2e/                # End-to-end tests
└── ...
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Environment Variables

Ensure these environment variables are set in your deployment platform:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_INFURA_PROJECT_ID=...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
NEXT_PUBLIC_COMPANION_ADDRESS=...
NEXT_PUBLIC_TRAIT_VAULT_ADDRESS=...
NEXT_PUBLIC_MODULE_MOCK_ADDRESS=...
```

### Build Optimization

- **Static Generation**: Marketing pages pre-rendered
- **Dynamic Rendering**: User-specific pages server-side rendered
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting

---

## Performance

### Optimization Features

- **Next.js 13 App Router**: Improved performance and SEO
- **React Server Components**: Reduced bundle size
- **Streaming SSR**: Faster page loads
- **Image Optimization**: Automatic WebP conversion
- **Font Optimization**: Self-hosted fonts with preloading

### Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

---

## Security

### Web3 Security

- **Input validation** for all user inputs
- **Contract interaction safety** with proper error handling
- **Wallet connection security** with secure RPC endpoints
- **Transaction monitoring** with proper gas limits

### Frontend Security

- **XSS protection** with proper sanitization
- **CSRF protection** with SameSite cookies
- **Content Security Policy** headers
- **Dependency security** with npm audit

---

## Contributing

1. **Code Style**: Follow TypeScript and React best practices
2. **Testing**: Add tests for new components and features
3. **Documentation**: Update component documentation
4. **Performance**: Ensure no performance regressions
5. **Accessibility**: Maintain WCAG 2.1 AA compliance

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-component

# Make changes and test
npm run dev
npm run test

# Commit changes
git add .
git commit -m "Add new component"

# Push and create PR
git push origin feature/new-component
```

---

## Troubleshooting

### Common Issues

**Wallet Connection Issues**
```bash
# Clear local storage
localStorage.clear()

# Reset wallet connection
// Use wagmi's disconnect function
```

**Contract Interaction Errors**
```bash
# Check network configuration
// Ensure correct chain ID and RPC URL

# Verify contract addresses
// Check address.book for latest addresses
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## Important Links

- **Main Repository**: `../../../` (ARC Ecosystem root)
- **Contracts**: `../` (NFT smart contracts)
- **Documentation**: `../docs/` (Technical documentation)
- **Address Book**: `../../../address.book` (Deployed addresses)
- **API Docs**: `./docs/` (Frontend API documentation)

---

## License

MIT License — see `LICENSE`.</content>
<parameter name="filePath">l:\worxpace\arc_ecosystem\contracts\tokens\nft\frontend\README.md
