import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

export class LLMService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    if (config.llm.openai.apiKey) {
      this.openai = new OpenAI({ apiKey: config.llm.openai.apiKey });
    }
    if (config.llm.anthropic.apiKey) {
      this.anthropic = new Anthropic({ apiKey: config.llm.anthropic.apiKey });
    }
  }

  async chat(message: string, sessionId: string, provider: string = 'openai'): Promise<string> {
    try {
      switch (provider) {
        case 'openai':
          return await this.chatOpenAI(message);
        case 'anthropic':
          return await this.chatAnthropic(message);
        case 'ollama':
          return await this.chatOllama(message);
        default:
          throw new Error(\`Unknown provider: \${provider}\`);
      }
    } catch (error) {
      logger.error(\`LLM chat error (\${provider}):\`, error);
      throw error;
    }
  }

  private async chatOpenAI(message: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    const completion = await this.openai.chat.completions.create({
      model: config.llm.openai.model,
      messages: [{ role: 'user', content: message }],
    });
    
    return completion.choices[0]?.message?.content || '';
  }

  private async chatAnthropic(message: string): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic not configured');
    
    const response = await this.anthropic.messages.create({
      model: config.llm.anthropic.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: message }],
    });
    
    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  }

  private async chatOllama(message: string): Promise<string> {
    const response = await axios.post(\`\${config.llm.ollama.baseUrl}/api/generate\`, {
      model: config.llm.ollama.model,
      prompt: message,
      stream: false,
    });
    
    return response.data.response;
  }
}
