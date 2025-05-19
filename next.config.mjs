import createNextIntlPlugin from 'next-intl/plugin';

// Use the root next-intl config file
const withNextIntl = createNextIntlPlugin('./next-intl.config.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimize for production deployment
  poweredByHeader: false, // Remove X-Powered-By header
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
  // Ensure static assets are properly handled
  distDir: '.next',
  // Disable asset prefix to ensure static assets are loaded correctly
  assetPrefix: undefined,
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
};

export default withNextIntl(nextConfig);
