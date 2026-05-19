import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Skip TypeScript type-check during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Required for Vercel: allow images from any origin
  images: {
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
