import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";

const i18nMiddleware = createI18nMiddleware({
  locales: ["fi", "en"],
  defaultLocale: "fi",
  resolveLocaleFromRequest: () => {
    // ignore Accept-Language header and use the default locale always
    return "fi";
  },
});

export function middleware(request: NextRequest) {
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
