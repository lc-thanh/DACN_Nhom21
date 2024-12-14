import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "57885",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
