import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, localeCookieOptions } from "@i18n/locale-cookie";
import { routing, type Locale } from "@i18n/routing";

// Old cookie name from next-international, used for migration fallback
const LEGACY_LOCALE_COOKIE = "Next-Locale";

function isValidLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}

function getLocaleFromCookies(request: NextRequest): string | undefined {
  return (
    request.cookies.get(LOCALE_COOKIE)?.value ??
    request.cookies.get(LEGACY_LOCALE_COOKIE)?.value
  );
}

function migrateLegacyCookie(request: NextRequest, response: NextResponse) {
  if (request.cookies.has(LEGACY_LOCALE_COOKIE)) {
    response.cookies.delete(LEGACY_LOCALE_COOKIE);
  }
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if URL already has a valid locale prefix
  const urlLocale = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (urlLocale) {
    // Leave cookies alone so that the response stays cacheable
    return createMiddleware(routing)(request);
  }

  // No locale in URL - check cookie (with legacy fallback), default to Finnish
  const cookieLocale = getLocaleFromCookies(request);
  const targetLocale = isValidLocale(cookieLocale)
    ? cookieLocale
    : routing.defaultLocale;

  // Redirect to the locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${targetLocale}${pathname}`;

  const response = NextResponse.redirect(url);
  // The target depends on the visitor's cookie, so shared caches must not store it
  response.headers.set("Cache-Control", "private, no-store");

  // Always set new cookie and clean up legacy cookie
  response.cookies.set(LOCALE_COOKIE, targetLocale, localeCookieOptions);
  migrateLegacyCookie(request, response);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|apple-touch-icon.png|icon_dark.png|icon_light.png|og-image.png|robots.txt|\\.well-known|payload|admin|api).*)",
  ],
};
