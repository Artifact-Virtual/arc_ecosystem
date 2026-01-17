#!/bin/bash

# ARC CLI Quick Start Script
# This script helps users get started with the ARC CLI

echo "═══════════════════════════════════════════════════════════════"
echo "                  ARC CLI - Quick Start                        "
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check Node.js version
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 14.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version must be >= 14.0.0 (found: $(node -v))"
    exit 1
fi
echo "✓ Node.js $(node -v) detected"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install --silent
    echo "✓ Dependencies installed"
fi

# Check for .env file
if [ ! -f "../.env" ]; then
    echo ""
    echo "⚠️  WARNING: .env file not found in project root"
    echo "   Some features may be limited without proper configuration"
    echo ""
    echo "   Create a .env file with:"
    echo "   - INFURA_PROJECT_ID=your_infura_key"
    echo "   - DEPLOYER_PRIVATE_KEY=your_private_key (optional)"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Starting ARC CLI..."
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Run the CLI
node index.js
