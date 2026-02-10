import type { NextConfig } from "next";
import path from "path";



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  typescript: {
    // ignoreBuildErrors: false, // Default
  },

  /*
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [LOADER]
        }
      }
    }
  */
};

export default nextConfig;
// Orchids restart: 1768655255453
