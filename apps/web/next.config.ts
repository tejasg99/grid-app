import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Enable static optimization where possible
  output: "standalone",
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
};

export default nextConfig;