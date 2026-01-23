import { routing } from "@i18n/routing";

export { getTranslations, getLocale, setRequestLocale } from "next-intl/server";

export { routing };
export type { Locale } from "@i18n/routing";

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

/**
 * For static params generation - returns all locales.
 */
export function getStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
