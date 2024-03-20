import { createI18nServer } from "next-international/server";
import type fi from "./fi";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer({
    fi: () => import("./fi"),
    en: () => import("./en"),
  });

export type Locale = (typeof locales)[number];
export type Dictionary = typeof fi;

export const locales = ["fi", "en"] as const;
export const defaultLocale = "fi";
