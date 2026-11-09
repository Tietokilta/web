import type { Locale } from "./routing";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "strict",
} as const;

/**
 * Remembers an explicit language choice in the browser. Pages must not set
 * cookies themselves, because shared caches refuse to store such responses.
 */
export function rememberLocale(locale: Locale) {
  const { path, maxAge, sameSite } = localeCookieOptions;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
}
