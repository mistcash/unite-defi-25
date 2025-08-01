import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use export mode in production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),

  // Development-specific optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Disable problematic features in dev
    experimental: {
      optimizePackageImports: [],
    },
    // Ensure proper dev server behavior
    eslint: {
      ignoreDuringBuilds: false,
    },
  }),

  // Universal settings
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
