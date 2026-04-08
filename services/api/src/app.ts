import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { tenantResolver } from './middleware/tenantResolver.js';
import { inputSanitizer } from './middleware/sanitize.js';
import routes from './routes/index.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api', apiLimiter);

// Input sanitization (XSS, injection defense-in-depth)
app.use(inputSanitizer);

// Multi-tenant resolution (no-op when MULTI_TENANT_ENABLED !== 'true')
app.use(tenantResolver);

// Health check (before auth)
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
