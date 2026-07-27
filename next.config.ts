import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide Next.js' development route indicator from the bottom-left of the site.
  // Build and runtime errors are still surfaced normally.
  devIndicators: false,
  // The MADLAB code viewer reads the local React Bits source files at request
  // time. Keep those files in Vercel's traced server output as well.
  outputFileTracingIncludes: {
    "/*": ["./app/lab/react-bits/**/*.tsx"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "ipfs.foundation.app", pathname: "/**" },
    ],
  },
};

export default nextConfig;
