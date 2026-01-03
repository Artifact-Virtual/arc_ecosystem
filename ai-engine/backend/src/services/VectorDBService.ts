import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config';
import { logger } from '../utils/logger';

export class VectorDBService {
  private client?: Pinecone;
  private index?: any;

  async initialize() {
    if (!config.vectorDb.pinecone.apiKey) {
      logger.warn('Pinecone not configured, vector memory disabled');
      return;
    }

    try {
      this.client = new Pinecone({
        apiKey: config.vectorDb.pinecone.apiKey
      });

      this.index = this.client.index(config.vectorDb.pinecone.index);
      logger.info('✅ Vector DB initialized');
    } catch (error) {
      logger.error('Vector DB initialization failed:', error);
    }
  }

  async storeMemory(id: string, text: string, embedding: number[], metadata: any = {}) {
    if (!this.index) return;

    try {
      await this.index.upsert([{
        id,
        values: embedding,
        metadata: { text, ...metadata, timestamp: Date.now() }
      }]);
    } catch (error) {
      logger.error('Store memory error:', error);
    }
  }

  async searchMemory(embedding: number[], topK: number = 5): Promise<any[]> {
    if (!this.index) return [];

    try {
      const results = await this.index.query({
        vector: embedding,
        topK,
        includeMetadata: true
      });

      return results.matches || [];
    } catch (error) {
      logger.error('Search memory error:', error);
      return [];
    }
  }
}
