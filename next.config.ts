import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** Dev: avoid stale media when replacing files in public/. Prod: cache without `immutable` so same-URL updates can revalidate. */
const staticMediaCache = isDev
  ? "no-store, must-revalidate"
  : "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/craft', destination: '/', permanent: false }];
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: staticMediaCache,
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: staticMediaCache,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
