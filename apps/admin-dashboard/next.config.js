/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gentle-reminder/shared-types'],
  reactStrictMode: true,
};

module.exports = nextConfig;
