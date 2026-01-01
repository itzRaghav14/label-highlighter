import type { NextConfig } from "next";

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable service worker in development to avoid caching issues while coding
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "export", // Crucial for static generation
  images: {
    unoptimized: true, // Required because we don't have a server for image processing
  },
  /* config options here */
  reactCompiler: true,
};

export default withSerwist(nextConfig);
