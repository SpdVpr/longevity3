/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'longevity3.vercel.app',
      'strapi-production-a1c9.up.railway.app',
      'vercel.app',
      'railway.app',
      'wise-growth-11e60bdab7.strapiapp.com',
      'special-acoustics-b9adb26838.strapiapp.com',
      'special-acoustics-b9adb26838.media.strapiapp.com',
      'strapiapp.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi-production-a1c9.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'longevity3.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wise-growth-11e60bdab7.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'special-acoustics-b9adb26838.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'special-acoustics-b9adb26838.media.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.strapiapp.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
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
