/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // TODO: only for dev:
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: process.env.PAYLOAD_PORT,
        pathname: "/media/**",
      },
    ],
  },
};
