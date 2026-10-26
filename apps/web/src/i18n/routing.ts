import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fi", "en"],
  defaultLocale: "fi",
  localePrefix: "always",
  localeDetection: false,
  // src/proxy.ts owns the locale cookie
  localeCookie: false,
  // Pages set their own hreflang links, since slugs differ between locales
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
