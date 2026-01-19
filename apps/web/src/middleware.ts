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

export function middleware(request: NextRequest) {
  // Track page view asynchronously
  trackPageViewAsync(request);

  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
