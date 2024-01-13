/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  rewrites: () => [
    {
      source: "/admin/:path*",
      destination: `${process.env.PUBLIC_SERVER_URL}/admin/:path*`,
    },
    {
      source: "/api/:path*",
      destination: `${process.env.PUBLIC_SERVER_URL}/api/:path*`,
    },
    // TODO: only for dev:
    {
      source: "/media/:path*",
      destination: `${process.env.PUBLIC_SERVER_URL}/media/:path*`,
    },
  ],
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
