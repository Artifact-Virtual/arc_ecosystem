import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/v1', routes);

const PORT = config.port || 3001;

app.listen(PORT, () => {
  logger.info(\`🚀 AI Engine Backend running on port \${PORT}\`);
});
