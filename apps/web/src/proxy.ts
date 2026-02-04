import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "@i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";
// Old cookie name from next-international, used for migration fallback
const LEGACY_LOCALE_COOKIE = "Next-Locale";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const cookieOptions = {
  path: "/",
  maxAge: ONE_YEAR_IN_SECONDS,
  sameSite: "strict",
} as const;

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
    // URL has locale - proceed and update cookie if needed
    const intlMiddleware = createMiddleware(routing);
    const response = intlMiddleware(request);

    const currentCookie = request.cookies.get(LOCALE_COOKIE)?.value;
    if (currentCookie !== urlLocale) {
      response.cookies.set(LOCALE_COOKIE, urlLocale, cookieOptions);
    }
    migrateLegacyCookie(request, response);

    return response;
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

  // Always set new cookie and clean up legacy cookie
  response.cookies.set(LOCALE_COOKIE, targetLocale, cookieOptions);
  migrateLegacyCookie(request, response);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
