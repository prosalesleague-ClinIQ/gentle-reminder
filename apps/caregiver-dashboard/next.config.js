const { securityHeaders } = require('../../packages/shared-types/next-security-headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@gentle-reminder/shared-types', '@gentle-reminder/ui-components'],
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  headers: securityHeaders,
};

module.exports = nextConfig;
