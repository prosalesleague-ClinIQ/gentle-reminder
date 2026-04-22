// Security headers inlined (fortress-audit H-15, 2026-04-22).
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@gentle-reminder/shared-types', '@gentle-reminder/ui-components'],
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: BASE_HEADERS }];
  },
};

module.exports = nextConfig;
