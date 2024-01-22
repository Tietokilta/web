/** @type {import("next").NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";
const cdnUrl = "https://cdn.alpha.tietokilta.fi";
module.exports = {
  reactStrictMode: true,
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
  assetPrefix: isProd ? cdnUrl : undefined,
};
