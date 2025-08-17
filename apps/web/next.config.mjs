import { withPayload } from "@payloadcms/next/withPayload";

const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

/** @type {import("next").NextConfig} */
const nextConfig = {
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

export default withPayload(nextConfig, { devBundleServerPackages: false });
