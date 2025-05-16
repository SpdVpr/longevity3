import createNextIntlPlugin from 'next-intl/plugin';

// Use the root next-intl config file
const withNextIntl = createNextIntlPlugin();

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
  // Disable ESLint checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force SWC transforms
  experimental: {
    forceSwcTransforms: true,
  },
};

export default withNextIntl(nextConfig);
