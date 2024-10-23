import type { Node } from "@tietokilta/cms-types/lexical";

export type Locale = (typeof locales)[number];

export const locales = ["fi", "en"] as const;

export const jsxToTextContent = (element: JSX.Element | undefined): string => {
  if (!element) return "";

  if (typeof element === "string") return element;

  const props = element.props as Record<string, unknown>;
  const children = props.children as JSX.Element | JSX.Element[] | undefined;

  if (children instanceof Array) {
    return children.map(jsxToTextContent).join("");
  }

  return jsxToTextContent(children);
};

export const lexicalNodeToTextContent = (node: Node): string => {
  if (!("children" in node)) {
    if (node.type === "text") return node.text;

    return "";
  }

  const children = (node.children ?? []) as Node[];
  return children.map((child) => lexicalNodeToTextContent(child)).join("");
};

export const stringToId = (string: string): string =>
  string
    // split accents and other diacritics
    .normalize("NFD")
    // remove split accents
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim()
    // remove all characters except a-z, 0-9, space and hyphen
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s/g, "-");

interface TocItemChild {
  text: string;
}
export interface TocItem {
  text: string;
  children: TocItemChild[];
}

/**
 * Insert soft hyphens or breaks where lacking in the Finnish dictionary.
 *
 * **Finnish dictionary not supported in Chromium browsers.**
 */
export const insertSoftHyphens = (text: string): string => {
  return (
    text
      // soft-break before @ sign
      .replaceAll(/(?<word>@)/g, "\u200b$<word>")
      // soft-break after /
      .replaceAll(/(?<word>\/)/g, "$<word>\u200b")
      // soft-hyphen after toimikunta
      .replaceAll(/(?<word>toimikunta)/g, "\u00ad$<word>")
      // soft-hyphen after työryhmä
      .replaceAll(/(?<word>työryhmä)/g, "\u00ad$<word>")
      // soft-hyphen after henkilö
      .replaceAll(/(?<word>henkilö)/g, "\u00ad$<word>")
      // soft-hyphen after vastaava
      .replaceAll(/(?<word>vastaava)/g, "\u00ad$<word>")
  );
};

export type GetDateTimeFormatterOptions = Omit<
  Intl.DateTimeFormatOptions,
  "timeZone"
>;

/**
 * Construct a function that formats a date string to a given format.
 */
export function getDateTimeFormatter(
  options: GetDateTimeFormatterOptions,
): (date: string, locale?: Locale, timeZone?: string) => string {
  const formatFn = (
    date: string,
    locale?: Locale,
    timeZone = "Europe/Helsinki",
  ): string => {
    const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
      ...options,
      timeZone,
    });

    return formatter.format(new Date(date));
  };

  return formatFn;
}

export type DateFormatterFn = ReturnType<typeof getDateTimeFormatter>;

export const formatDateTimeSecondsOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
} as const;
/**
 * Get date in format 12.2.2024 18:00:03
 */
export const formatDateTimeSeconds = getDateTimeFormatter(
  formatDateTimeSecondsOptions,
);

export const formatDateTimeOptions = {
  weekday: "short",
  day: "numeric",
  month: "numeric",
  hour: "numeric",
  minute: "numeric",
} as const;
/**
 * Get date in format "su 12.2. klo 18"
 */
export const formatDateTime = getDateTimeFormatter(formatDateTimeOptions);

export const formatDatetimeYearOptions = {
  weekday: "short",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
} as const;
/**
 * Get date in format "su 12.2.2024 klo 18"
 */
export const formatDatetimeYear = getDateTimeFormatter(
  formatDatetimeYearOptions,
);

export const formatDateYearOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
} as const;
/**
 * Get date in format "12.2.2024"
 */
export const formatDateYear = getDateTimeFormatter(formatDateYearOptions);

export const formatDateOptions = {
  day: "numeric",
  month: "numeric",
} as const;
/**
 * Get date in format "12.2."
 */
export const formatDate = getDateTimeFormatter(formatDateOptions);

export const getWeekNumber = (date: Date): number => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const isThisWeek = (date: string): boolean => {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const eventWeek = getWeekNumber(new Date(date));

  return currentWeek === eventWeek;
};

export const isNextWeek = (date: string): boolean => {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const eventWeek = getWeekNumber(new Date(date));

  return currentWeek + 1 === eventWeek;
};
