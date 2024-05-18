import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";

const i18nMiddleware = createI18nMiddleware({
  locales: ["fi", "en"],
  defaultLocale: "fi",
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasCMSPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/logos") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/oauth2");
  if (pathnameHasCMSPath) {
    const destination = new URL(process.env.PUBLIC_SERVER_URL ?? "");
    const url = request.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.pathname = pathname;
    return NextResponse.rewrite(url);
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|next_api|static|favicon.ico|icon.svg|robots.txt).*)"],
};
