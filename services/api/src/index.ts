import app from './app.js';
import { env } from './config/env.js';
import { disconnectDatabase } from './config/database.js';

const server = app.listen(env.port, () => {
  console.log(`[API] Gentle Reminder API server running on port ${env.port}`);
  console.log(`[API] Environment: ${env.nodeEnv}`);
  console.log(`[API] Health check: http://localhost:${env.port}/health`);
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n[API] Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('[API] HTTP server closed');

    try {
      await disconnectDatabase();
      console.log('[API] Database connection closed');
    } catch (error) {
      console.error('[API] Error disconnecting database:', error);
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('[API] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[API] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[API] Uncaught Exception:', error);
  shutdown('uncaughtException');
});

export default server;
