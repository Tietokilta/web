import type { routing } from "@i18n/routing";
import type en from "../locales/en";
import type fi from "../locales/fi";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof fi | typeof en;
  }
}
