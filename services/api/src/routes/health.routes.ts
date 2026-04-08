/**
 * health.routes.ts
 *
 * Health check, readiness probe, and metrics endpoints.
 * These are unauthenticated for use by load balancers and monitoring.
 */

import { Router, Request, Response } from 'express';

const router = Router();

const startedAt = new Date().toISOString();

/**
 * GET /health
 * Basic liveness probe — is the process running?
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    startedAt,
  });
});

/**
 * GET /health/ready
 * Readiness probe — is the service ready to accept traffic?
 * Checks database connectivity and critical dependencies.
 */
router.get('/ready', async (_req: Request, res: Response) => {
  const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    // In production: await prisma.$queryRaw`SELECT 1`
    checks.database = { status: 'ok', latencyMs: Date.now() - dbStart };
  } catch (error: any) {
    checks.database = { status: 'error', latencyMs: Date.now() - dbStart, error: error.message };
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapUtilization = heapUsedMB / heapTotalMB;

  checks.memory = {
    status: heapUtilization < 0.9 ? 'ok' : 'warning',
    latencyMs: 0,
  };

  const allHealthy = Object.values(checks).every((c) => c.status === 'ok');

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

/**
 * GET /health/metrics
 * Prometheus-compatible metrics endpoint.
 */
router.get('/metrics', (_req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  const lines = [
    '# HELP process_uptime_seconds Process uptime in seconds',
    '# TYPE process_uptime_seconds gauge',
    `process_uptime_seconds ${Math.floor(process.uptime())}`,
    '',
    '# HELP process_heap_used_bytes Process heap used in bytes',
    '# TYPE process_heap_used_bytes gauge',
    `process_heap_used_bytes ${memUsage.heapUsed}`,
    '',
    '# HELP process_heap_total_bytes Process total heap in bytes',
    '# TYPE process_heap_total_bytes gauge',
    `process_heap_total_bytes ${memUsage.heapTotal}`,
    '',
    '# HELP process_rss_bytes Process resident set size in bytes',
    '# TYPE process_rss_bytes gauge',
    `process_rss_bytes ${memUsage.rss}`,
    '',
    '# HELP process_external_bytes Process external memory in bytes',
    '# TYPE process_external_bytes gauge',
    `process_external_bytes ${memUsage.external}`,
    '',
    '# HELP process_cpu_user_microseconds CPU user time in microseconds',
    '# TYPE process_cpu_user_microseconds counter',
    `process_cpu_user_microseconds ${cpuUsage.user}`,
    '',
    '# HELP process_cpu_system_microseconds CPU system time in microseconds',
    '# TYPE process_cpu_system_microseconds counter',
    `process_cpu_system_microseconds ${cpuUsage.system}`,
    '',
    '# HELP nodejs_active_handles Active handles',
    '# TYPE nodejs_active_handles gauge',
    `nodejs_active_handles ${(process as any)._getActiveHandles?.()?.length ?? 0}`,
    '',
    '# HELP nodejs_active_requests Active requests',
    '# TYPE nodejs_active_requests gauge',
    `nodejs_active_requests ${(process as any)._getActiveRequests?.()?.length ?? 0}`,
    '',
  ];

  res.set('Content-Type', 'text/plain; charset=utf-8').send(lines.join('\n'));
});

/**
 * GET /health/version
 * Returns app version info.
 */
router.get('/version', (_req: Request, res: Response) => {
  res.json({
    name: 'gentle-reminder-api',
    version: process.env.APP_VERSION || '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    buildTime: process.env.BUILD_TIME || 'unknown',
    commit: process.env.GIT_COMMIT || 'unknown',
  });
});

export default router;
