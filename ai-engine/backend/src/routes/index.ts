import { Router } from 'express';
import chatRoutes from './chat';
import contractRoutes from './contract';

const router = Router();

router.use('/chat', chatRoutes);
router.use('/contract', contractRoutes);

export default router;
