import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Add experimental flag that might help with file system issues
  experimental: {
    // Disable some optimizations that might cause file conflicts
    optimizePackageImports: [],
  },
};

export default nextConfig;
