import { getTranslations, getLocale } from "next-intl/server";
import { getExtracted } from "next-intl/server";

// Re-export for convenience
export { getTranslations, getLocale, getExtracted };

// Convenience aliases for migration
export const getCurrentLocale = getLocale;
export const getScopedI18n = getTranslations;
export const getI18n = getExtracted;

export type Locale = "fi" | "en";
export const locales = ["fi", "en"] as const;
export const defaultLocale = "fi" as const;
