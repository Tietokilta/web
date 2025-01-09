const isProd = process.env.NODE_ENV === "production";
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    PUBLIC_FRONTEND_URL: process.env.PUBLIC_FRONTEND_URL,
  },
  images: {
    // TODO: only for dev:
    remotePatterns: !isProd
      ? [
          {
            protocol: "http",
            hostname: "localhost",
            port: process.env.PAYLOAD_PORT,
            pathname: "/media/**",
          },
        ]
      : undefined,
    minimumCacheTTL: 3600,
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
