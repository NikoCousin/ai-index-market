import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ⚠️ This allows images from ANYWHERE (easiest for now)
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
