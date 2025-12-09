import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "luxbid.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  eslint: {
        ignoreDuringBuilds: true, 
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
