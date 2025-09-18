/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
