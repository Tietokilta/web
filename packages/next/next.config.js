module.exports = {
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: `${process.env.NEXT_PUBLIC_CMS_URL}/admin/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_CMS_URL}/api/:path*`,
      },
      // TODO: only for dev:
      {
        source: "/media/:path*",
        destination: `${process.env.NEXT_PUBLIC_CMS_URL}/media/:path*`,
      },
    ];
  },
};
