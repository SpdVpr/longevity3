/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  // Vypnout kontrolu ESLint při buildu
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Vypnout kontrolu TypeScript při buildu
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable type checking during build
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
