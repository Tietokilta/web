import { clsx, type ClassValue } from "clsx";
import { TZDate } from "@date-fns/tz";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { JSX } from "react";
import type { EditorState, Node } from "@lexical-types";
import { type Locale } from "../locales/server";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

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

export const makeUniqueId = (
  baseId: string,
  seenIds: Map<string, number>,
): string => {
  const count = seenIds.get(baseId) ?? 0;
  seenIds.set(baseId, count + 1);
  return count === 0 ? baseId : `${baseId}-${count}`;
};

export interface TocItem {
  text: string;
  level: 2 | 3;
  id: string;
}

export const generateTocFromRichText = (
  content?: EditorState,
  onlyTopLevel = false,
): TocItem[] => {
  if (!content) return [];
  const toc: TocItem[] = [];
  const seenIds = new Map<string, number>();

  for (const node of content.root.children) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
    if (node.type === "heading" && (node.tag === "h2" || node.tag === "h3")) {
      const tag = node.tag;
      const level = parseInt(tag[1], 10) as 2 | 3;

      if (onlyTopLevel && level === 3) continue;

      const text = lexicalNodeToTextContent(node);
      const baseId = stringToId(text);
      const id = makeUniqueId(baseId, seenIds);

      toc.push({
        text,
        level,
        id,
      });
    }
  }

  return toc;
};

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
export function getDateTimeFormatter(options: GetDateTimeFormatterOptions) {
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

export function assertUnreachable(value: never) {
  throw new Error("Didn't expect to get here", { cause: { value } });
}

/**
 * Typescript gymnastics
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/naming-convention, @typescript-eslint/no-unnecessary-type-parameters -- used for type assertion
export function assertType<_T>(_val: _T) {}

export type NonNullableKeys<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

export const currencyFormatter = (locale: Locale, amount: number): string => {
  const fullLocale = `${locale}-FI`;
  return new Intl.NumberFormat(fullLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount / 100);
};
