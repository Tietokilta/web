import en from "./en";
import fi from "./fi";

export const locales = {
  fi,
  en,
} as const;

export type Messages = typeof fi;
