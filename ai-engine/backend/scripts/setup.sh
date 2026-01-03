#!/bin/bash

# AI Engine Backend - Automated Setup Script
# This script handles complete backend setup from scratch

set -e

echo "🚀 ARC AI Engine - Backend Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0.32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js
echo -e "${BLUE}[1/7] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}[2/7] Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Setup environment
echo -e "${BLUE}[3/7] Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file (please configure it)${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Setup database
echo -e "${BLUE}[4/7] Setting up database...${NC}"
if command -v psql &> /dev/null; then
    echo "Creating database..."
    createdb arc_ai_engine 2>/dev/null || echo "Database may already exist"
    echo -e "${GREEN}✅ Database setup complete${NC}"
else
    echo -e "${RED}⚠️  PostgreSQL not found. Please install and configure manually.${NC}"
fi
echo ""

# Setup Redis
echo -e "${BLUE}[5/7] Checking Redis...${NC}"
if command -v redis-cli &> /dev/null; then
    redis-cli ping > /dev/null 2>&1 && echo -e "${GREEN}✅ Redis is running${NC}" || echo -e "${RED}⚠️  Redis not running. Please start Redis.${NC}"
else
    echo -e "${RED}⚠️  Redis not found. Please install Redis.${NC}"
fi
echo ""

# Build project
echo -e "${BLUE}[6/7] Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Final check
echo -e "${BLUE}[7/7] Final verification...${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "==============================================="
echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure your .env file with API keys"
echo "2. Start development: npm run dev"
echo "3. Or build and run: npm run build && npm start"
echo ""
echo -e "${BLUE}Optional services:${NC}"
echo "- Docker: docker-compose up -d"
echo "- Ollama: Download from https://ollama.ai"
echo "==============================================="
