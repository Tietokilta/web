import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

/** @type {import("next").NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 3600,
    contentDispositionType: "inline",
  },
  eslint: {
    ignoreDuringBuilds: true,
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
const withNextIntl = createNextIntlPlugin({
  experimental: {
    extract: {
      sourceLocale: "en",
    },
    // Limit extraction to app source paths (can expand later)
    srcPath: "./src",
  },
});

export default withNextIntl(
  withPayload(baseConfig, { devBundleServerPackages: false }),
);
