import { NextRequest, NextResponse } from 'next/server';

/**
 * Family Dashboard — CROSS-TENANT PHI ACCESS (highest IDOR risk).
 * Relatives view patient data; must verify family-member relationship to
 * the specific patient on every request. Basic Auth gate is interim; Round 3
 * binds family-member identity to the `FamilyMember` model's `patientId`.
 *
 * Installed 2026-04-22 per fortress-audit finding C-6.
 *
 * Env vars:
 *   FAMILY_USERNAME — default "founder"
 *   FAMILY_PASSWORD — REQUIRED in production; 503 if absent (fail closed)
 */

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon|robots|.*\\.).*)'],
};

export function middleware(req: NextRequest) {
  const USERNAME = process.env.FAMILY_USERNAME || 'founder';
  const PASSWORD =
    process.env.FAMILY_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-family-2026' : undefined);

  if (!PASSWORD) {
    return new NextResponse('Family dashboard auth not configured', { status: 503 });
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

  return new NextResponse('Family authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Gentle Reminder — Family"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
