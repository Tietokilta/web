import type { MetadataRoute } from "next";
import { routing } from "@i18n/routing";

// Paths below the locale prefix that should not show up in search results:
// personal signup and payment pages, the redirects to the signup system, the
// infoscreen, and the officials page, which lists names and pictures.
const localizedDisallowedPaths = [
  "/signups/",
  "/payment/",
  "/events/ilmo/",
  "/tapahtumat/ilmo/",
  "/infoscreen",
];

// The officials page has a different path in each locale
const officialsPaths = ["/fi/kilta/toimarit", "/en/guild/officials"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ...routing.locales.flatMap((locale) =>
          localizedDisallowedPaths.map((path) => `/${locale}${path}`),
        ),
        ...officialsPaths,
        "/admin",
        "/api/",
        "/next_api/",
      ],
    },
  };
}
