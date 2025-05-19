import createNextIntlPlugin from 'next-intl/plugin';

// Use the root next-intl config file
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['special-acoustics-b9adb26838.strapiapp.com', 'special-acoustics-b9adb26838.media.strapiapp.com'],
    remotePatterns: [
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
