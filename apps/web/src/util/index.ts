import type { PayloadRequest } from "payload";
import { type Locale } from "@locales/server";

// for internal requests
export const SELF_URL = `http://localhost:${process.env.PORT ?? String(3000)}`;

export const isCloudStorageEnabled = (): boolean => {
  return (
    typeof process.env.AZURE_STORAGE_CONNECTION_STRING === "string" &&
    typeof process.env.AZURE_STORAGE_CONTAINER_NAME === "string" &&
    typeof process.env.AZURE_STORAGE_ACCOUNT_BASEURL === "string"
  );
};
export const isGoogleAuthEnabled = (): boolean => {
  return (
    typeof process.env.GOOGLE_OAUTH_CLIENT_ID === "string" &&
    typeof process.env.GOOGLE_OAUTH_CLIENT_SECRET === "string"
  );
};

export function getLocale(req: PayloadRequest): Locale | "all" {
  const res =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- query may be undefined, payload types are scuffed
    typeof req.query?.locale === "string" ? req.query.locale : req.locale;
  if (!res) {
    req.payload.logger.warn(
      `locale not set for ${req.pathname}, defaulting to fi`,
    );
  }
  return (res as Locale | "all" | undefined) ?? "fi";
}

export function appendToStringOrLocalizedString(
  str: string | null | undefined | Record<string, string | null | undefined>,
  append: string,
): string | Record<string, string> {
  if (!str) {
    return "";
  }

  if (typeof str === "string") {
    return `${str}${append}`;
  }
  const res: Record<string, string> = {};
  for (const locale in str) {
    res[locale] = `${str[locale] ?? ""}${append}`;
  }
  return res;
}
export function checkUrlValidity(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
