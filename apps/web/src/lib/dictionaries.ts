import "server-only";

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const dictionaries = {
  fi: () => import("../dictionaries/fi.json").then((module) => module.default),
  en: () => import("../dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = (locale: string) =>
  locale in dictionaries ? dictionaries[locale as Locale]() : dictionaries.fi();

export const locales = ["fi", "en"] as const satisfies Locale[];
