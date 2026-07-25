import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    // Keep plugin names serializable for Next 16's Turbopack MDX loader.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "github-dark-default",
          keepBackground: false,
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  // Hide Next.js' development route indicator from the bottom-left of the site.
  // Build and runtime errors are still surfaced normally.
  devIndicators: false,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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

export default withMDX(nextConfig);
