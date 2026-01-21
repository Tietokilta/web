import type messages from "../../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: "fi" | "en";
    Messages: typeof messages;
  }
}
