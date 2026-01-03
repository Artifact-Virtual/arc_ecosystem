# ARC AI Engine

**Version:** 1.0.0  
**Security Rating:** Target 100/100  
**Status:** Production Ready Architecture

## Overview

The ARC AI Engine is an autonomous, MCP-enabled AI system designed to control and enhance the Artifact Development Engine. It provides natural language contract generation, automated deployment, system management, and self-integration capabilities.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Browser)                       │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Chat UI    │  │ Code Editor  │  │ Deployment Panel │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│                          │                                    │
│                    AI Engine Core                            │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ LLM Client │◄─►  MCP Tools   │◄─► Security Layer  │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌────────▼─────────┐
│ Backend API    │            │   Vector Memory  │
│ (Optional)     │            │   (Browser)      │
│                │            │                  │
│ - Express.js   │            │ - IndexedDB      │
│ - Tool Exec    │            │ - Embeddings     │
│ - Containers   │            │ - Context        │
└────────────────┘            └──────────────────┘
```

## Features

### Core Capabilities
- **Natural Language Contract Generation**: Create complete smart contracts via chat
- **Multi-Provider LLM Support**: OpenAI, Anthropic, Google, Ollama
- **MCP Protocol Integration**: Self-configuring tool execution
- **Browser-First Design**: Fully functional without backend
- **Contextual Memory**: Vector-based conversation history
- **Autonomous Operations**: Self-deployment and management
- **Security-First**: Isolated execution, approval workflows

### Frontend (Browser-Based)
- ✅ **Fully Functional Standalone**: No backend required for core features
- ✅ **MetaMask Integration**: Direct contract deployment
- ✅ **Local Storage Memory**: Persistent conversation history
- ✅ **Code Generation**: Complete contract templates
- ✅ **Real-time Compilation**: In-browser Solidity compilation
- ✅ **Multi-Network Support**: Base, Ethereum, Localhost

### Backend (Optional Enhancement)
- **Advanced LLM Integration**: OpenAI/Anthropic/Ollama
- **Vector Database**: Pinecone/Weaviate for enhanced memory
- **Container Execution**: Docker-based code execution
- **MCP Server**: Full tool calling capabilities
- **External Integrations**: Discord, GitHub, monitoring

## Directory Structure

```
ai-engine/
├── backend/              # Backend services (Node.js/Python)
│   ├── src/
│   │   ├── api/         # Express API endpoints
│   │   ├── llm/         # LLM provider integrations
│   │   ├── mcp/         # MCP protocol implementation
│   │   ├── tools/       # Tool registry and executors
│   │   ├── memory/      # Vector database integration
│   │   └── security/    # Security and audit logging
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/            # Browser-based AI interface
│   ├── ai-assistant.html    # Main AI chat interface
│   ├── components/          # Reusable UI components
│   ├── services/            # Frontend services
│   └── styles/              # CSS styling
│
├── deployment/          # Deployment automation
│   ├── docker-compose.yml
│   ├── kubernetes/
│   ├── scripts/
│   └── terraform/
│
├── config/              # Configuration templates
│   ├── .env.example
│   ├── llm-providers.json
│   ├── mcp-tools.json
│   └── security-policy.json
│
├── docs/                # Comprehensive documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── SECURITY_AUDIT.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── USER_GUIDE.md
│   └── MCP_PROTOCOL.md
│
└── README.md            # This file
```

## Quick Start

### Frontend Only (No Backend Required)

1. **Open the AI Assistant**:
   ```bash
   cd ai-engine/frontend
   # Open ai-assistant.html in your browser
   ```

2. **Connect Wallet**: Click "Connect Wallet" to enable MetaMask

3. **Start Chatting**: Ask the AI to create contracts
   - "Create an ERC20 token with 1 million supply"
   - "Generate an NFT collection contract"
   - "Deploy a governance contract"

4. **Deploy**: Contracts are compiled and deployed directly from browser

### With Backend (Enhanced Features)

1. **Configure Environment**:
   ```bash
   cp config/.env.example .env
   # Add your API keys
   ```

2. **Start Services**:
   ```bash
   cd deployment
   docker-compose up -d
   ```

3. **Access Dashboard**:
   ```
   http://localhost:3000
   ```

## Security

### Security Rating: Target 100/100

**Security Features**:
- ✅ Isolated execution environment
- ✅ API key encryption
- ✅ Rate limiting and cost controls
- ✅ Operation approval workflows
- ✅ Comprehensive audit logging
- ✅ Zero-trust architecture
- ✅ Input sanitization
- ✅ Output validation

**Audit Status**: See `docs/SECURITY_AUDIT.md`

## Configuration

### LLM Providers

```json
{
  "providers": {
    "openai": {
      "enabled": true,
      "model": "gpt-4-turbo-preview",
      "apiKey": "${OPENAI_API_KEY}",
      "maxTokens": 4096
    },
    "anthropic": {
      "enabled": true,
      "model": "claude-3-opus-20240229",
      "apiKey": "${ANTHROPIC_API_KEY}",
      "maxTokens": 4096
    },
    "ollama": {
      "enabled": false,
      "model": "llama2",
      "endpoint": "http://localhost:11434",
      "maxTokens": 2048
    }
  }
}
```

### MCP Tools

The AI has access to these tools:

**Contract Operations**:
- `compile_contract` - Compile Solidity code
- `deploy_contract` - Deploy to blockchain
- `verify_contract` - Verify on Etherscan
- `test_contract` - Run automated tests

**File Operations**:
- `read_file` - Read file contents
- `write_file` - Create/update files
- `delete_file` - Remove files (with approval)
- `list_files` - List directory contents

**System Operations**:
- `execute_command` - Run shell commands (sandboxed)
- `deploy_service` - Deploy containers
- `monitor_system` - Check system status
- `configure_integration` - Set up external services

## API Reference

### Frontend API

```javascript
// Initialize AI Engine
const aiEngine = new AIEngine({
  provider: 'browser', // or 'backend'
  model: 'gpt-4',
  memory: true
});

// Generate contract
const contract = await aiEngine.generateContract({
  prompt: "Create an ERC20 token with 1M supply",
  tokenName: "MyToken",
  symbol: "MTK"
});

// Deploy contract
const deployment = await aiEngine.deployContract({
  code: contract.code,
  network: "base",
  params: contract.constructorParams
});
```

### Backend API

```bash
# Generate contract
POST /api/v1/generate
{
  "prompt": "Create an ERC20 token",
  "parameters": { "name": "MyToken", "supply": "1000000" }
}

# Deploy contract
POST /api/v1/deploy
{
  "code": "...",
  "network": "base",
  "params": [...]
}

# Chat with AI
POST /api/v1/chat
{
  "message": "Help me create an NFT",
  "context": { "conversationId": "uuid" }
}
```

## Deployment

### Option 1: Frontend Only
```bash
# No setup required - just open HTML files
open frontend/ai-assistant.html
```

### Option 2: Docker
```bash
cd deployment
docker-compose up -d
```

### Option 3: Kubernetes
```bash
kubectl apply -f deployment/kubernetes/
```

### Option 4: Manual
```bash
# Backend
cd backend
npm install
npm start

# Frontend (if using dev server)
cd frontend
python -m http.server 8080
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Integration tests
npm run test:integration

# Security audit
npm run audit

# E2E tests
npm run test:e2e
```

## Monitoring

### Health Checks
- Backend: `http://localhost:3000/health`
- Metrics: `http://localhost:3000/metrics`
- Logs: `docker logs ai-engine-backend`

### Metrics
- Request latency
- Token usage
- Error rates
- Memory consumption
- API costs

## Maintenance

### Backup
```bash
# Backup vector database
npm run backup:memory

# Backup configurations
npm run backup:config
```

### Updates
```bash
# Update dependencies
npm update

# Update LLM models
npm run update:models

# Database migrations
npm run migrate
```

## Troubleshooting

### Common Issues

**AI not responding**:
- Check API keys in `.env`
- Verify network connectivity
- Check browser console for errors

**Deployment fails**:
- Ensure MetaMask is connected
- Check wallet has funds for gas
- Verify network is correct

**Backend connection issues**:
- Check Docker containers are running
- Verify ports are not in use
- Check firewall settings

### Debug Mode

```javascript
// Enable debug logging
const aiEngine = new AIEngine({
  debug: true,
  logLevel: 'verbose'
});
```

## Roadmap

### Phase 1: Core (Current)
- ✅ Frontend AI assistant
- ✅ Browser-based deployment
- ✅ Basic MCP tools
- ✅ Local memory

### Phase 2: Backend
- ⏳ Full LLM integration
- ⏳ Vector database
- ⏳ Container execution
- ⏳ Advanced tools

### Phase 3: Autonomous
- ⏳ Self-deployment
- ⏳ External integrations
- ⏳ Monitoring systems
- ⏳ Auto-optimization

## Contributing

See `CONTRIBUTING.md` for development guidelines.

## License

MIT License - See `LICENSE` file

## Support

- **Documentation**: `docs/`
- **Issues**: GitHub Issues
- **Discord**: ARC Community Server
- **Email**: support@arc-ecosystem.com

---

**Built with ❤️ for the ARC Ecosystem**  
*Making blockchain development accessible through AI*
