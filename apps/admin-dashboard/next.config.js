const { securityHeaders } = require('../../packages/shared-types/next-security-headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gentle-reminder/shared-types'],
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  headers: securityHeaders,
};

module.exports = nextConfig;
