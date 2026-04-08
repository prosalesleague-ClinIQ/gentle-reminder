/**
 * sanitize.ts
 *
 * Input sanitization middleware to prevent XSS, SQL injection,
 * and other injection attacks at the API boundary.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Strip HTML tags from a string.
 */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * Neutralize common SQL injection patterns.
 * Not a substitute for parameterized queries (which Prisma uses),
 * but provides defense-in-depth at the input layer.
 */
function neutralizeSqlPatterns(value: string): string {
  // Remove null bytes
  let sanitized = value.replace(/\0/g, '');
  // Remove common SQL comment sequences from user input
  sanitized = sanitized.replace(/--/g, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
  return sanitized;
}

/**
 * Recursively sanitize all string values in an object.
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    let sanitized = value.trim();
    sanitized = stripHtml(sanitized);
    sanitized = neutralizeSqlPatterns(sanitized);
    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 *
 * - Strips HTML tags (XSS prevention)
 * - Removes null bytes
 * - Strips SQL comment patterns (defense-in-depth)
 * - Trims whitespace from strings
 *
 * Should be applied after body parsing and before route handlers.
 */
export function inputSanitizer(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      const val = req.query[key];
      if (typeof val === 'string') {
        (req.query as Record<string, any>)[key] = sanitizeValue(val);
      }
    }
  }

  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      const val = req.params[key];
      if (typeof val === 'string') {
        req.params[key] = sanitizeValue(val) as string;
      }
    }
  }

  next();
}
