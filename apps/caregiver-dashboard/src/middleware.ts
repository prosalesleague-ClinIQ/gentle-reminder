import { NextRequest, NextResponse } from 'next/server';

/**
 * Caregiver Dashboard — PHI-handling surface.
 * Routes: /patients, /patients/[id], /incidents, /alerts, /transfers, /analytics, ...
 *
 * Installed 2026-04-22 per fortress-audit finding C-6. Today the app renders
 * mock data only (shell state), so this Basic Auth gate is defense-in-depth
 * BEFORE any live data-fetch PR lands. Round 3 will swap to signed session
 * cookie + RBAC check against the API.
 *
 * Env vars:
 *   CAREGIVER_USERNAME — default "founder"
 *   CAREGIVER_PASSWORD — REQUIRED in production; 503 if absent (fail closed)
 */

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon|robots|.*\\.).*)'],
};

export function middleware(req: NextRequest) {
  const USERNAME = process.env.CAREGIVER_USERNAME || 'founder';
  const PASSWORD =
    process.env.CAREGIVER_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-caregiver-2026' : undefined);

  if (!PASSWORD) {
    return new NextResponse('Caregiver dashboard auth not configured', { status: 503 });
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

  return new NextResponse('Caregiver authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Gentle Reminder — Caregiver"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
