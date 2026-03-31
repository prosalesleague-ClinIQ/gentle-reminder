import morgan from 'morgan';
import { env } from '../config/env.js';

const format = env.isProduction
  ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
  : ':method :url :status :response-time ms - :res[content-length]';

export const requestLogger = morgan(format, {
  skip: (_req, res) => {
    if (env.isTest) return true;
    // In production, skip successful health checks to reduce noise
    if (env.isProduction && _req.url === '/health' && res.statusCode < 400) return true;
    return false;
  },
});
