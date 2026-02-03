import fi from "./fi";
import en from "./en";

export const locales = {
  fi,
  en,
} as const;

export type Messages = typeof fi;
