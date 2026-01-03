# ARC AI Engine - Backend

Production-ready AI Engine backend with multi-LLM support, MCP protocol, and blockchain integration.

## Features

- **Multi-LLM Support**: OpenAI, Anthropic, Google, Ollama
- **MCP Protocol**: Tool calling and autonomous operations
- **Contract Operations**: Generate, compile, deploy smart contracts
- **Vector Memory**: Long-term context with Pinecone
- **Security First**: Rate limiting, authentication, sandboxing
- **Production Ready**: Docker, monitoring, logging

## Quick Start

### Automated Setup

```bash
# Run automated setup (recommended)
./scripts/setup.sh
```

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Build
npm run build

# 4. Start
npm start
```

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f ai-engine

# Stop services
docker-compose down
```

## Configuration

### Required Environment Variables

```bash
# API Keys (at least one LLM provider)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...
# OR use Ollama (no key needed)

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/arc_ai_engine

# Redis
REDIS_URL=redis://localhost:6379
```

### Optional Configuration

```bash
# Server
PORT=3001
NODE_ENV=production

# Vector Database
PINECONE_API_KEY=...
PINECONE_INDEX=arc-ai-memory

# Local LLM (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Blockchain
BASE_RPC_URL=https://mainnet.base.org
```

## API Endpoints

### Chat
```bash
POST /api/v1/chat/message
{
  "message": "Create an ERC20 token",
  "sessionId": "uuid",
  "provider": "openai"  # openai, anthropic, or ollama
}
```

### Contract Generation
```bash
POST /api/v1/contract/generate
{
  "prompt": "ERC20 token with 1M supply",
  "type": "ERC20"
}
```

### Contract Compilation
```bash
POST /api/v1/contract/compile
{
  "code": "pragma solidity ^0.8.0;..."
}
```

### Contract Deployment
```bash
POST /api/v1/contract/deploy
{
  "bytecode": "0x...",
  "abi": [...],
  "args": ["TokenName", "TKN"],
  "network": "base"
}
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## Architecture

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
┌──────▼───────────────────────────────────────────┐
│                  API Gateway                      │
│  (Express, Rate Limiting, Auth, CORS)            │
└──────┬───────────────────────────────────────────┘
       │
┌──────▼──────────┬──────────────┬─────────────────┐
│  LLM Service    │ Contract Svc │   Memory Svc    │
│ ┌─────────────┐ │ ┌──────────┐ │ ┌─────────────┐ │
│ │   OpenAI    │ │ │ Generate │ │ │  Pinecone   │ │
│ │ Anthropic   │ │ │ Compile  │ │ │  (Vectors)  │ │
│ │   Ollama    │ │ │  Deploy  │ │ └─────────────┘ │
│ └─────────────┘ │ └──────────┘ │                 │
└─────────────────┴──────────────┴─────────────────┘
       │                 │                  │
┌──────▼─────────────────▼──────────────────▼──────┐
│           Infrastructure Layer                    │
│  ┌──────────┐  ┌───────┐  ┌──────────────────┐  │
│  │PostgreSQL│  │ Redis │  │  Blockchain RPC  │  │
│  └──────────┘  └───────┘  └──────────────────┘  │
└───────────────────────────────────────────────────┘
```

## Production Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- (Optional) Ollama for local LLM

### Deploy with Docker

```bash
# 1. Configure environment
cp .env.example .env
# Add production keys

# 2. Deploy
docker-compose up -d

# 3. Check health
curl http://localhost:3001/health
```

### Deploy to Cloud

See `deployment/` directory for:
- AWS deployment scripts
- GCP deployment scripts  
- Azure deployment scripts
- Kubernetes manifests

## Security

- **Authentication**: API key required for all endpoints
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Zod schemas on all inputs
- **Sandboxing**: Contract execution in isolated environment
- **Logging**: Comprehensive audit logs
- **HTTPS**: Required in production

## Monitoring

- Health endpoint: `/health`
- Metrics endpoint: `/metrics` (Prometheus format)
- Logs: JSON structured logging with Pino

## Troubleshooting

### Connection Issues

```bash
# Check services
docker-compose ps

# View logs
docker-compose logs -f

# Restart service
docker-compose restart ai-engine
```

### Database Issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### LLM Provider Issues

- OpenAI: Check API key and quotas
- Anthropic: Verify Claude API access
- Ollama: Ensure service is running (`ollama serve`)

## Support

- Documentation: `../README.md`
- Issues: GitHub Issues
- Security: See `SECURITY_AUDIT.md`

## License

MIT - See LICENSE file
