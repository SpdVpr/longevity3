/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'longevity3.vercel.app', 'strapi-production-a1c9.up.railway.app'],
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
      {
        protocol: 'https',
        hostname: 'strapi-production-a1c9.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'longevity3.vercel.app',
        pathname: '/**',
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
