// Security headers inlined (fortress-audit H-15, 2026-04-22).
// NOTE: we can't require() from ../../packages because Vercel uploads the
// pitch-site subdir only. Each app owns its copy. Source of truth remains
// packages/shared-types/next-security-headers.js for monorepo-level changes.

const BASE_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const PRIVATE_HEADERS = [
  { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, nocache' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: BASE_HEADERS },
      { source: '/private/:path*', headers: PRIVATE_HEADERS },
    ];
  },
};

module.exports = nextConfig;
