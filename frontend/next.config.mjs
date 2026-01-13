/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Disable network-dependent features
  experimental: {
    // Disable webpack build worker to avoid network issues
    webpackBuildWorker: false,
  },
  // Add webpack configuration to handle network issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable hot reloading network checks
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;
