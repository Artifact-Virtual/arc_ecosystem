import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';

const router = Router();
const controller = new ChatController();

router.post('/message', (req, res) => controller.sendMessage(req, res));
router.get('/history/:sessionId', (req, res) => controller.getHistory(req, res));

export default router;
