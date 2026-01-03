# AI Engine Backend - Deployment Guide

## Quick Deploy (5 Minutes)

### Option 1: Docker (Recommended)

```bash
# 1. Clone and navigate
cd ai-engine/backend

# 2. Configure
cp .env.example .env
# Edit .env with your keys

# 3. Deploy
docker-compose up -d

# 4. Verify
curl http://localhost:3001/health
```

### Option 2: Manual

```bash
# 1. Setup
./scripts/setup.sh

# 2. Start services
npm run build
npm start
```

## Production Deployment

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ running
- [ ] Redis 7+ running
- [ ] At least one LLM provider configured
- [ ] Environment variables configured
- [ ] Firewall rules configured (port 3001)

### Step-by-Step

#### 1. Environment Configuration

```bash
# Copy template
cp .env.example .env

# Required: Add LLM provider (choose one or more)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...
# OR use Ollama (no key needed, just run `ollama serve`)

# Required: Database
DATABASE_URL=postgresql://user:pass@host:5432/arc_ai_engine

# Required: Redis
REDIS_URL=redis://host:6379

# Optional but recommended: Vector memory
PINECONE_API_KEY=...
PINECONE_INDEX=arc-ai-memory

# Blockchain RPC
BASE_RPC_URL=https://mainnet.base.org
```

#### 2. Install Dependencies

```bash
npm install --production
```

#### 3. Build

```bash
npm run build
```

#### 4. Database Setup

```bash
# Create database
createdb arc_ai_engine

# Run migrations (if any)
npm run migrate
```

#### 5. Start Service

```bash
# Production mode
NODE_ENV=production npm start

# Or with PM2
pm2 start dist/index.js --name arc-ai-engine
```

#### 6. Verify

```bash
curl http://localhost:3001/health
# Expected: {"status":"healthy","timestamp":"..."}
```

## Cloud Deployment

### AWS (EC2 + RDS)

```bash
# 1. Launch EC2 instance (t3.medium or larger)
# 2. Install Node.js 18+
# 3. Install PostgreSQL client
# 4. Configure RDS PostgreSQL instance
# 5. Deploy application

# Security group: Allow port 3001 from your IP
# IAM role: Grant necessary permissions
```

### Google Cloud (Compute Engine + Cloud SQL)

```bash
# 1. Create Compute Engine instance
# 2. Create Cloud SQL PostgreSQL instance
# 3. Configure connection
# 4. Deploy application
```

### Azure (App Service + PostgreSQL)

```bash
# 1. Create App Service (Node 18)
# 2. Create Azure Database for PostgreSQL
# 3. Configure connection strings
# 4. Deploy via GitHub Actions
```

## Docker Deployment

### Single Container

```bash
docker build -t arc-ai-engine .
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name arc-ai-engine \
  arc-ai-engine
```

### Docker Compose (Full Stack)

```bash
# Includes: AI Engine, PostgreSQL, Redis, Ollama
docker-compose up -d

# View logs
docker-compose logs -f ai-engine

# Stop
docker-compose down

# Clean restart
docker-compose down -v && docker-compose up -d
```

## Kubernetes Deployment

```bash
# Apply manifests
kubectl apply -f deployment/k8s/

# Check status
kubectl get pods -n arc-ai-engine

# View logs
kubectl logs -f deployment/arc-ai-engine -n arc-ai-engine
```

## Monitoring & Maintenance

### Health Checks

```bash
# Application health
curl http://localhost:3001/health

# Database health
pg_isready -h localhost -p 5432

# Redis health
redis-cli ping
```

### Logs

```bash
# Application logs
tail -f logs/ai-engine.log

# Docker logs
docker-compose logs -f ai-engine

# PM2 logs
pm2 logs arc-ai-engine
```

### Metrics

```bash
# Prometheus metrics
curl http://localhost:9090/metrics
```

## Troubleshooting

### Service Won't Start

1. Check logs: `docker-compose logs ai-engine`
2. Verify environment variables in `.env`
3. Ensure database is accessible
4. Check port 3001 is not in use

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check PostgreSQL is running
sudo systemctl status postgresql

# In Docker
docker-compose ps postgres
```

### Redis Connection Issues

```bash
# Test connection
redis-cli ping

# Check Redis is running
sudo systemctl status redis

# In Docker
docker-compose ps redis
```

### LLM Provider Errors

**OpenAI:**
- Verify API key is valid
- Check quota/billing status
- Ensure internet connectivity

**Anthropic:**
- Verify Claude API access
- Check API key permissions

**Ollama:**
- Ensure Ollama is running: `ollama serve`
- Pull model: `ollama pull llama3`
- Check Ollama API: `curl http://localhost:11434/api/tags`

## Scaling

### Horizontal Scaling

```bash
# Run multiple instances behind load balancer
docker-compose up -d --scale ai-engine=3
```

### Vertical Scaling

- Increase EC2 instance size
- Add more CPU/RAM
- Optimize database

### Caching

- Redis is used for caching
- Configure TTL in environment
- Monitor cache hit rates

## Security Hardening

1. **Enable HTTPS**
   - Use reverse proxy (Nginx/Caddy)
   - Obtain SSL certificate

2. **Firewall Rules**
   - Only allow necessary ports
   - Restrict database access

3. **Environment Variables**
   - Never commit .env
   - Use secrets manager in production
   - Rotate API keys regularly

4. **Rate Limiting**
   - Configured by default
   - Adjust limits in .env

5. **Monitoring**
   - Set up alerts
   - Monitor error rates
   - Track resource usage

## Backup & Recovery

### Database Backup

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Automated (in cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/arc_ai_$(date +\%Y\%m\%d).sql
```

### Redis Backup

```bash
# Manual backup
redis-cli SAVE

# Backup file location
cp /var/lib/redis/dump.rdb /backups/
```

## Updates

### Rolling Update

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Restart (zero downtime with PM2)
pm2 reload arc-ai-engine
```

### Docker Update

```bash
# 1. Pull new image
docker-compose pull

# 2. Restart
docker-compose up -d
```

## Performance Tuning

### Node.js

```bash
# Increase memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Database

```sql
-- Create indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
```

### Redis

```bash
# Configure maxmemory
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Support

- Documentation: README.md
- Issues: GitHub Issues
- Security: security@arc-ecosystem.com
