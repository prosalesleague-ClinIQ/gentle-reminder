/**
 * Shared security-header config for every Next.js app in the monorepo.
 *
 * Applied via `headers()` in each app's next.config.js. Adds defense-in-depth
 * headers (HSTS, XFO, XCTO, Referrer-Policy, Permissions-Policy, COOP/CORP)
 * plus a /private/* cache-control and robots block.
 *
 * Added 2026-04-22 per fortress-audit finding H-15 (no security headers on
 * any Next config or vercel.json).
 *
 * Note: CSP is intentionally NOT set here because each app uses different
 * inline-script and image-source policies. Each app can extend its own
 * next.config.js to add a CSP when needed; the core hardening headers
 * below are safe for every app.
 */

const BASE_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const PRIVATE_HEADERS = [
  { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, nocache' },
];

/**
 * Returns the Next.js `headers` async function value.
 * Usage:
 *   const { securityHeaders } = require('@gentle-reminder/shared-types/next-security-headers');
 *   module.exports = { ...nextConfig, headers: securityHeaders };
 */
async function securityHeaders() {
  return [
    { source: '/:path*', headers: BASE_HEADERS },
    { source: '/private/:path*', headers: PRIVATE_HEADERS },
  ];
}

module.exports = { securityHeaders, BASE_HEADERS, PRIVATE_HEADERS };
