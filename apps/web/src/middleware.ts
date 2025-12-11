import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["fi", "en"],
  defaultLocale: "fi",
  localePrefix: "always",
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  // Persist locale cookie similar to previous patch behavior
  const res = NextResponse.next();
  const url = new URL(request.url);
  const locale = url.pathname.split("/")[1] || "fi";
  res.cookies.set("NEXT_LOCALE", locale, {
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
  return response ?? res;
}

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
