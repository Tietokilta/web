import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

// Scripts stay unrestricted: nonces would make every page dynamic and bypass
// the shared cache. Framing is limited to our own admin (live preview).
const contentSecurityPolicy = [
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    // Match only the real package directories: pnpm also links each libvips
    // package into its sharp package, and Turbopack fails on those symlinks.
    "/*": [
      "../../node_modules/.pnpm/@img+sharp-linux*/node_modules/@img/sharp-linux*/**/*",
      "../../node_modules/.pnpm/@img+sharp-libvips-*/node_modules/@img/sharp-libvips-*/**/*",
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Caps how long shared caches may serve stale pages (stale-while-revalidate)
  expireTime: 3600,
  images: {
    minimumCacheTTL: 3600,
    contentDispositionType: "inline",
    qualities: [50, 75],
  },
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
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
          // Without includeSubDomains: other services live on our subdomains
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Config headers win over route handlers, so leave uploaded files to
        // Payload, which blocks scripts in SVG and XML uploads with its own CSP
        source: "/:path((?!api/[^/]+/file/).*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
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
