import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales } from "./lib/dictionaries";

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const pathnameHasCMSPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/media") ||
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

  return NextResponse.redirect(
    new URL(`/fi${pathname.length === 1 ? "" : pathname}`, request.url),
  );
}
export const config = {
  matcher: ["/((?!_next|next_api).*)"],
};
