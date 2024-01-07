export const localisePath = (path: string, locale: string) =>
  `/${locale}${path}` as const;
