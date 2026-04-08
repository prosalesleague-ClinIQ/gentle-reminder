import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for read operations (GET requests).
 * 100 requests per minute per IP.
 */
export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many read requests. Please try again later.',
    },
  },
});

/**
 * Rate limiter for write operations (POST, PUT, DELETE requests).
 * 30 requests per minute per IP.
 */
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many write requests. Please try again later.',
    },
  },
});
