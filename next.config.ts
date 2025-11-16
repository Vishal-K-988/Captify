import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remotion configuration
  // Note: Using webpack for Remotion compatibility
  // Turbopack support for Remotion is still experimental
  webpack: (config, { isServer }) => {
    // Remotion configuration
    // Only set alias for client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Don't override @remotion packages, just add CLI alias if needed
      };
    }
    // Ensure proper module resolution for Remotion packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  // Add empty turbopack config to silence the warning
  // We're using webpack explicitly via --webpack flag
  turbopack: {},
};


export default nextConfig;
