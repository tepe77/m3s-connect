import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/alumni/login",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
