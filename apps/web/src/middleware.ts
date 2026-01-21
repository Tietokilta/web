import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["fi", "en"],
  defaultLocale: "fi",
  localePrefix: "always",
  localeDetection: false, // ignore Accept-Language header
});

export default intlMiddleware;

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
