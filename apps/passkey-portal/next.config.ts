import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["smart-account-kit"],
  experimental: {
    esmExternals: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
