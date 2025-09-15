import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
  const { pathname, search } = request.nextUrl;
  // Match /fi/.../llms.txt or /en/.../llms.txt (path part optional)
  const match = pathname.match(/^\/(fi|en)(?:\/(.*))?\/llms\.txt$/);
  if (match) {
    const locale = match[1];
    const pathPart = match[2] ?? ""; // zero segments => landing page
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/next_api/llms";
    rewriteUrl.search = `${search ? search + "&" : "?"}locale=${locale}&path=${encodeURIComponent(pathPart)}`;
    return NextResponse.rewrite(rewriteUrl);
  }
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|next_api|llms.txt|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
