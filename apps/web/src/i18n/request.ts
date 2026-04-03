import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locales } from "@locales/index";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Europe/Helsinki",
    // Type assertion needed because en.ts and fi.ts have the same structure but different string literal values
    messages: locales[locale],
  };
});
