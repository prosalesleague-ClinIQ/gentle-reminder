import { Request, Response, NextFunction } from 'express';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  method: string;
  path: string;
  statusCode?: number;
  durationMs?: number;
  userId?: string;
  requestId: string;
  message?: string;
}

let requestCounter = 0;

function generateRequestId(): string {
  requestCounter++;
  return `mg-${Date.now()}-${requestCounter}`;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

/**
 * Structured request logging middleware.
 * Logs each request with timing, user info, and status.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Attach request ID to the request for downstream use
  (req as any).requestId = requestId;

  // Log on response finish
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs,
      userId: req.user?.userId,
      requestId,
    };

    if (entry.level === 'error') {
      console.error(formatLog(entry));
    } else if (entry.level === 'warn') {
      console.warn(formatLog(entry));
    } else {
      console.log(formatLog(entry));
    }
  });

  next();
}

/**
 * Log a structured message for application events.
 */
export function logEvent(
  level: 'info' | 'warn' | 'error',
  message: string,
  extra?: Record<string, unknown>,
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...extra,
  };
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}
