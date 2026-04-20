import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for /private/* routes.
 *
 * No authentication — access is by URL knowledge only (security through obscurity).
 * Adds X-Robots-Tag header to prevent search engine indexing.
 *
 * To re-add HTTP Basic Auth protection, see git history at commit 4e5a403.
 */

export const config = {
  matcher: ['/private/:path*'],
};

export function middleware(_req: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  return response;
}
