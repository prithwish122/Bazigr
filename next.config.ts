import { error } from "console";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ignoreBuildErrors: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
