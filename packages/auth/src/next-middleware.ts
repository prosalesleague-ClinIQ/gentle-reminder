/**
 * Shared Next.js middleware for dashboard apps.
 *
 * Installed 2026-04-22 per fortress-audit finding C-6 (dashboards have zero
 * auth gate at layout / middleware level). Every dashboard must mount this
 * at `apps/<app>/src/middleware.ts` as:
 *
 *   export { middleware, config } from '@gentle-reminder/auth/next-middleware';
 *
 * Today (pre-wire): acts as a session presence check + Basic Auth fallback.
 * Redirects unauthenticated requests to `/login`. When full API auth is wired
 * (Round 3), this will verify the session cookie against the API's refresh
 * endpoint and populate x-user headers.
 *
 * Env vars:
 *   DASHBOARD_USERNAME — Basic Auth fallback user (default "founder")
 *   DASHBOARD_PASSWORD — REQUIRED in production; absent = 503 fail-closed
 *   SESSION_COOKIE_NAME — name of the Next cookie (default "gr-session")
 */

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  /**
   * Protect everything EXCEPT:
   *   - /login and its assets
   *   - /api/auth/* (auth endpoints must be public)
   *   - static assets, images, robots, favicon
   */
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon|robots|.*\\.).*)'],
};

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'gr-session';

export function middleware(req: NextRequest) {
  // 1. Session-cookie path (future: verifies signature against API)
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie?.value) {
    // TODO(round-3): verify session cookie signature against API.
    // Today: presence check + pass through.
    return withSecurityHeaders(NextResponse.next());
  }

  // 2. Basic Auth fallback (for solo founder access pre-wire)
  const authHeader = req.headers.get('authorization');
  const USERNAME = process.env.DASHBOARD_USERNAME || 'founder';
  const PASSWORD =
    process.env.DASHBOARD_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-access-2026' : undefined);

  if (!PASSWORD) {
    return new NextResponse('Dashboard auth not configured', { status: 503 });
  }

  if (authHeader?.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6).trim());
      const sep = decoded.indexOf(':');
      if (sep > 0) {
        const user = decoded.slice(0, sep);
        const pw = decoded.slice(sep + 1);
        if (user === USERNAME && pw === PASSWORD) {
          return withSecurityHeaders(NextResponse.next());
        }
      }
    } catch {
      /* fall through */
    }
  }

  // 3. Prompt for credentials
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Gentle Reminder — Dashboard"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
