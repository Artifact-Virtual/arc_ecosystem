import { Router } from 'express';
import { ContractController } from '../controllers/ContractController';

const router = Router();
const controller = new ContractController();

router.post('/generate', (req, res) => controller.generate(req, res));
router.post('/compile', (req, res) => controller.compile(req, res));
router.post('/deploy', (req, res) => controller.deploy(req, res));

export default router;
