import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xjijyikrsbtwrcwqcael.supabase.co",
        pathname: "/storage/v1/object/public/gallery/**",
      },
    ],
  },
};

export default nextConfig;
