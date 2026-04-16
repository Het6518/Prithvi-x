import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"]
  },
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
