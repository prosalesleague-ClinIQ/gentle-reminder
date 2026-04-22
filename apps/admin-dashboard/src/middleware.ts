import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Dashboard — HIGHEST-PRIVILEGE SURFACE.
 * Routes: /tenants, /api-keys, /users, /system, /audit, /compliance, /facilities, /billing.
 *
 * Installed 2026-04-22 per fortress-audit finding C-6 (no middleware.ts in
 * any of the 4 dashboards). Basic Auth gate is the interim control until
 * session-cookie + MFA integration lands in Round 3.
 *
 * Env vars:
 *   ADMIN_USERNAME — default "founder"
 *   ADMIN_PASSWORD — REQUIRED in production; 503 if absent (fail closed)
 */

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon|robots|.*\\.).*)'],
};

export function middleware(req: NextRequest) {
  const USERNAME = process.env.ADMIN_USERNAME || 'founder';
  const PASSWORD =
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-admin-2026' : undefined);

  if (!PASSWORD) {
    return new NextResponse('Admin dashboard auth not configured', { status: 503 });
  }

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6).trim());
      const sep = decoded.indexOf(':');
      if (sep > 0) {
        const user = decoded.slice(0, sep);
        const pw = decoded.slice(sep + 1);
        if (user === USERNAME && pw === PASSWORD) {
          const res = NextResponse.next();
          res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
          res.headers.set('X-Frame-Options', 'DENY');
          res.headers.set('X-Content-Type-Options', 'nosniff');
          res.headers.set('Referrer-Policy', 'no-referrer');
          res.headers.set('Cache-Control', 'private, no-store, max-age=0');
          return res;
        }
      }
    } catch {
      /* fall through */
    }
  }

  return new NextResponse('Admin authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Gentle Reminder — Admin"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
