import { TZDate } from "@date-fns/tz";
import { getISOWeek, getISOWeekYear } from "date-fns";
import type { Node } from "@lexical-types";

export type Locale = (typeof locales)[number];

const locales = ["fi", "en"] as const;

export const lexicalNodeToTextContent = (node: Node): string => {
  if (!("children" in node)) {
    if (node.type === "text") return node.text;

    return "";
  }

  const children = node.children;
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

type GetDateTimeFormatterOptions = Omit<Intl.DateTimeFormatOptions, "timeZone">;

/**
 * Construct a function that formats a date string to a given format.
 */
function getDateTimeFormatter(
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

const formatDateYearOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
} as const;
/**
 * Get date in format "12.2.2024"
 */
export const formatDateYear = getDateTimeFormatter(formatDateYearOptions);

const formatDateOptions = {
  day: "numeric",
  month: "numeric",
} as const;
/**
 * Get date in format "12.2."
 */
export const formatDate = getDateTimeFormatter(formatDateOptions);

const TIMEZONE = "Europe/Helsinki";

export const isThisWeek = (date: string): boolean => {
  const now = new TZDate(new Date(), TIMEZONE);
  const eventDate = new TZDate(new Date(date), TIMEZONE);
  return (
    getISOWeek(now) === getISOWeek(eventDate) &&
    getISOWeekYear(now) === getISOWeekYear(eventDate)
  );
};

export const isNextWeek = (date: string): boolean => {
  const now = new TZDate(new Date(), TIMEZONE);
  const nextWeek = new TZDate(new Date(now.getTime() + 7 * 86400000), TIMEZONE);
  const eventDate = new TZDate(new Date(date), TIMEZONE);
  return (
    getISOWeek(nextWeek) === getISOWeek(eventDate) &&
    getISOWeekYear(nextWeek) === getISOWeekYear(eventDate)
  );
};

export const isLater = (date: string): boolean =>
  !isThisWeek(date) && !isNextWeek(date);

export const byDate = (
  a: { date?: string | null },
  b: { date?: string | null },
): number => {
  if (!a.date || !b.date) return 0;
  return new Date(a.date).getTime() - new Date(b.date).getTime();
};
