import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // proxy.ts buffers every /api/admin/* request body; the 10MB default
    // truncated large photo uploads and broke FormData parsing. Allow headroom
    // above the upload route's own size limit (large phone photos can exceed 10MB).
    proxyClientMaxBodySize: "30mb",
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pulsedrivemotors.ca",
      },
    ],
  },
};

export default nextConfig;
