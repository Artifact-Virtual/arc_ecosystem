import { Request, Response } from 'express';
import { ContractService } from '../services/ContractService';
import { logger } from '../utils/logger';

export class ContractController {
  private contractService: ContractService;

  constructor() {
    this.contractService = new ContractService();
  }

  async generate(req: Request, res: Response) {
    try {
      const { prompt, type } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const contract = await this.contractService.generate(prompt, type);
      
      res.json({ contract });
    } catch (error) {
      logger.error('Generate error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async compile(req: Request, res: Response) {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      const result = await this.contractService.compile(code);
      
      res.json(result);
    } catch (error) {
      logger.error('Compile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deploy(req: Request, res: Response) {
    try {
      const { bytecode, abi, args, network } = req.body;
      
      if (!bytecode || !abi) {
        return res.status(400).json({ error: 'Bytecode and ABI are required' });
      }

      const result = await this.contractService.deploy(bytecode, abi, args, network);
      
      res.json(result);
    } catch (error) {
      logger.error('Deploy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
