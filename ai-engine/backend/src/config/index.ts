import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || '',
  
  llm: {
    openai: { apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4-turbo-preview' },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY, model: 'claude-3-opus-20240229' },
    ollama: { baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434', model: process.env.OLLAMA_MODEL || 'llama3' }
  },
  
  vectorDb: {
    pinecone: { apiKey: process.env.PINECONE_API_KEY, index: process.env.PINECONE_INDEX || 'arc-ai-memory' }
  },
  
  database: { url: process.env.DATABASE_URL || '' },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  blockchain: { base: process.env.BASE_RPC_URL || 'https://mainnet.base.org' }
};
