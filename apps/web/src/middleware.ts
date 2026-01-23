import createMiddleware from "next-intl/middleware";
import { routing } from "@i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!_next|next_api|static|favicon.ico|icon.svg|icon_dark.png|icon_light.png|og-image.png|robots.txt|payload|admin|api).*)",
  ],
};
