import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 480, 640, 768, 1024, 1280],
    minimumCacheTTL: 2592000, // 30 days cache
  },
};

export default nextConfig;
