import { NextRequest, NextResponse } from 'next/server';

/**
 * HTTP Basic Auth middleware protecting all /private/* routes.
 *
 * Credentials are set via environment variables:
 *   PRIVATE_USERNAME — defaults to "founder"
 *   PRIVATE_PASSWORD — REQUIRED in production
 *
 * In development, the password defaults to "gentle-dev-access-2026"
 * but this MUST be overridden in production.
 */

export const config = {
  matcher: ['/private/:path*'],
};

export function middleware(req: NextRequest) {
  const USERNAME = process.env.PRIVATE_USERNAME || 'founder';
  const PASSWORD =
    process.env.PRIVATE_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'gentle-dev-access-2026' : undefined);

  if (!PASSWORD) {
    // No password configured in production — deny all access
    return new NextResponse('Private area not configured', { status: 503 });
  }

  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const authValue = authHeader.split(' ')[1];
    if (authValue) {
      const decoded = atob(authValue);
      const [user, pw] = decoded.split(':');
      if (user === USERNAME && pw === PASSWORD) {
        // Allow through
        return NextResponse.next();
      }
    }
  }

  // Prompt for credentials
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Gentle Reminder — Private"',
    },
  });
}
