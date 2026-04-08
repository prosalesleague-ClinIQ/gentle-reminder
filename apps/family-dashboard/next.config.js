/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@gentle-reminder/shared-types', '@gentle-reminder/ui-components'],
};

module.exports = nextConfig;
