import { Request, Response } from 'express';
import { LLMService } from '../services/LLMService';
import { logger } from '../utils/logger';

export class ChatController {
  private llmService: LLMService;

  constructor() {
    this.llmService = new LLMService();
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { message, sessionId, provider = 'openai' } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await this.llmService.chat(message, sessionId, provider);
      
      res.json({ response, sessionId });
    } catch (error) {
      logger.error('Chat error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      // TODO: Implement history retrieval
      res.json({ history: [], sessionId });
    } catch (error) {
      logger.error('Get history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
