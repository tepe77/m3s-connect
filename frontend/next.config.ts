import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-alumni.mayoga.sch.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mayoga.sch.id",
        pathname: "/**",
      },
    ],
  },
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
