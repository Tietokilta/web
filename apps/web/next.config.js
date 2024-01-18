/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // TODO: only for dev:
    remotePatterns:
      process.env.NODE_ENV === "development"
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
};
