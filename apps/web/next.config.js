/** @type {import("next").NextConfig} */
const isProd = process.env.NODE_ENV === "production";
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
  assetPrefix: isProd ? "https://cdn.alpha.tietokilta.fi" : undefined,
};
