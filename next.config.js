/** @type {import('next').NextConfig} */

// Define the Strapi API URL
const STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';

const nextConfig = {
  // Add environment variables
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: STRAPI_API_URL,
    // STRAPI_API_TOKEN should be set via environment variables, not hardcoded
  },

  // Add webpack configuration to replace special-acoustics-b9adb26838.strapiapp.com with the Strapi API URL
  webpack: (config, { webpack }) => {
    // Add a plugin to replace all occurrences of special-acoustics-b9adb26838.strapiapp.com with the Strapi API URL
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.STRAPI_API_URL': JSON.stringify(STRAPI_API_URL),
      })
    );

    return config;
  },
  images: {
    domains: [
      'longevity3.vercel.app',
      'strapi-production-a1c9.up.railway.app',
      'vercel.app',
      'railway.app',
      'wise-growth-11e60bdab7.strapiapp.com',
      'special-acoustics-b9adb26838.strapiapp.com',
      'special-acoustics-b9adb26838.media.strapiapp.com',
      'media.strapiapp.com',
      'strapiapp.com',
      'cloudinary.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
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
        hostname: '**.media.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
