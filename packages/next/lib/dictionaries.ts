import "server-only";

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const dictionaries = {
  fi: () => import("../dictionaries/fi.json").then((module) => module.default),
  en: () => import("../dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
