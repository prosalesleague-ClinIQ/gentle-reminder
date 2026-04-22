import { NextRequest, NextResponse } from 'next/server';

/**
 * HTTP Basic Auth middleware protecting all /private/* routes.
 *
 * Credentials are set via environment variables in Vercel:
 *   PRIVATE_USERNAME — defaults to "founder"
 *   PRIVATE_PASSWORD — REQUIRED in production (service returns 503 otherwise)
 *
 * In development, the password defaults to a hardcoded dev value, but this
 * MUST be overridden in production. A missing PRIVATE_PASSWORD in production
 * fails closed (returns 503) rather than allowing access.
 *
 * Re-enabled 2026-04-22 per fortress-audit finding C-5. Previous revision
 * was "security through obscurity only."
 *
 * Also sets defense-in-depth security headers on every /private/* response:
 *   - X-Robots-Tag: no indexing
 *   - X-Frame-Options: prevent clickjacking
 *   - X-Content-Type-Options: prevent MIME sniffing
 *   - Referrer-Policy: no referrer leakage
 */

export const config = {
  matcher: ['/private/:path*'],
};

const WWW_AUTHENTICATE = 'Basic realm="Gentle Reminder — Private"';

export function middleware(req: NextRequest) {
  const USERNAME = process.env.PRIVATE_USERNAME || 'founder';
  const PASSWORD =
    process.env.PRIVATE_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-access-2026' : undefined);

  if (!PASSWORD) {
    // Production without PRIVATE_PASSWORD → fail closed.
    return new NextResponse('Private area not configured', { status: 503 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    const authValue = authHeader.slice(6).trim();
    try {
      const decoded = atob(authValue);
      const sep = decoded.indexOf(':');
      if (sep > 0) {
        const user = decoded.slice(0, sep);
        const pw = decoded.slice(sep + 1);
        if (user === USERNAME && pw === PASSWORD) {
          const response = NextResponse.next();
          response.headers.set(
            'X-Robots-Tag',
            'noindex, nofollow, noarchive, nosnippet'
          );
          response.headers.set('X-Frame-Options', 'DENY');
          response.headers.set('X-Content-Type-Options', 'nosniff');
          response.headers.set('Referrer-Policy', 'no-referrer');
          return response;
        }
      }
    } catch {
      // Malformed Base64 → fall through to 401.
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': WWW_AUTHENTICATE,
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
