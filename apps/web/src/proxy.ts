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

/**
 * Track page view asynchronously (fire-and-forget).
 * This does not block the response to the user.
 */
function trackPageViewAsync(request: NextRequest): void {
  const path = request.nextUrl.pathname;

  // Skip tracking for non-page routes (already handled by matcher, but double-check)
  if (path.startsWith("/api") || path.startsWith("/admin")) {
    return;
  }

  // Get the base URL for the internal API call
  const baseUrl = request.nextUrl.origin;

  // Fire-and-forget: don't await, don't block
  fetch(`${baseUrl}/next_api/analytics/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Forward headers needed for IP and User-Agent detection
      "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      "x-real-ip": request.headers.get("x-real-ip") ?? "",
      "user-agent": request.headers.get("user-agent") ?? "",
    },
    body: JSON.stringify({ path }),
  }).catch((error) => {
    // Silently ignore errors - analytics should never break the site
    console.error("[Analytics Middleware] Tracking failed:", error);
  });
}

export default function proxy(request: NextRequest) {
  // Track page view asynchronously
  trackPageViewAsync(request);

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
