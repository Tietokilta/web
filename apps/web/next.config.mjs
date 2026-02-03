import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 3600,
    contentDispositionType: "inline",
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
