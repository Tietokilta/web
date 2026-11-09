import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@i18n/routing";

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

/**
 * Without this, next-intl reads the locale from request headers, which opts
 * the route out of static rendering. Call it in every cached layout, page and
 * generateMetadata before using other next-intl APIs.
 */
export async function setLocaleFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
