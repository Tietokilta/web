import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    // Match only the real package directories: pnpm also links each libvips
    // package into its sharp package, and Turbopack fails on those symlinks.
    "/*": [
      "../../node_modules/.pnpm/@img+sharp-linux*/node_modules/@img/sharp-linux*/**/*",
      "../../node_modules/.pnpm/@img+sharp-libvips-*/node_modules/@img/sharp-libvips-*/**/*",
    ],
  },
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 3600,
    contentDispositionType: "inline",
    qualities: [50, 75],
  },
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "x-git-commit-sha",
            value: gitSha,
          },
        ],
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
