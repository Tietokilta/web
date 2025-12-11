import { getTranslations, getLocale } from "next-intl/server";
import type fi from "./fi";

export { getTranslations, getLocale };

export type Locale = (typeof locales)[number];
export type Dictionary = typeof fi;

export const locales = ["fi", "en"] as const;
export const defaultLocale = "fi";
