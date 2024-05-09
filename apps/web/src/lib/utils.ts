import type { EditorState, Node } from "@tietokilta/cms-types/lexical";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Locale } from "../locales/server";
import {
  type EventQuotaWithSignups,
  type EventQuota,
  OPEN_QUOTA_ID,
  QUEUE_QUOTA_ID,
} from "./api/external/ilmomasiina";

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
  string.toLocaleLowerCase().replace(/\s/g, "-");

export interface TocItem {
  text: string;
  level: 2 | 3;
}

export const generateTocFromRichText = (content?: EditorState): TocItem[] => {
  if (!content) return [];
  const toc: TocItem[] = [];

  for (const node of content.root.children) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
    if (node.type === "heading" && (node.tag === "h2" || node.tag === "h3")) {
      const tag = node.tag;
      const level = parseInt(tag[1], 10) as 2 | 3;
      const text = lexicalNodeToTextContent(node);

      toc.push({
        text,
        level,
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
  );
};

/**
 * Get date in format 12.2.2024 18:00:03
 */
export const formatDateTimeSeconds = (
  date: string,
  locale?: Locale,
): string => {
  const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return formatter.format(new Date(date));
};

/**
 * Get date in format "su 12.2. klo 18"
 */
export const formatDatetime = (date: string, locale?: Locale): string => {
  const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formatter.format(new Date(date));
};

/**
 * Get date in format "su 12.2.2024 klo 18"
 */
export const formatDatetimeYear = (date: string, locale?: Locale): string => {
  const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formatter.format(new Date(date));
};

/**
 * Get date in format "12.2.2024"
 */
export const formatDateYear = (date: string, locale?: Locale): string => {
  const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return formatter.format(new Date(date));
};

/**
 * Get date in format "12.2."
 */
export const formatDate = (date: string, locale?: Locale): string => {
  const formatter = new Intl.DateTimeFormat(`${locale ?? "fi"}-FI`, {
    day: "numeric",
    month: "numeric",
  });

  return formatter.format(new Date(date));
};

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

export const getQuotasWithOpenAndQueue = (
  quotas: EventQuota[],
  openQuotaSize: number,
  options: { includeOpen?: boolean; includeQueue?: boolean } = {},
) => {
  const { includeOpen = true, includeQueue = true } = options;
  const openQuota = quotas.reduce<EventQuotaWithSignups>(
    (openQ, quota) => {
      const quotaSignups = quota.signups ?? [];
      const openSignups = quotaSignups
        .filter((signup) => signup.status === "in-open")
        .map((signup) => ({
          ...signup,
          quotaTitle: quota.title,
        }));
      return {
        ...openQ,
        signupCount: openQ.signupCount + openSignups.length,
        signups: [...openQ.signups, ...openSignups],
      };
    },
    {
      id: OPEN_QUOTA_ID,
      title: "Avoin kiintiö",
      size: openQuotaSize,
      signupCount: 0,
      signups: [],
    },
  );

  const queuedQuota = quotas.reduce<EventQuotaWithSignups>(
    (queuedQ, quota) => {
      const quotaSignups = quota.signups ?? [];
      const queuedSignups = quotaSignups
        .filter((signup) => signup.status === "in-queue")
        .map((signup) => ({
          ...signup,
          quotaTitle: quota.title,
        }));
      return {
        ...queuedQ,
        signupCount: queuedQ.signupCount + queuedSignups.length,
        signups: [...queuedQ.signups, ...queuedSignups],
      };
    },
    {
      id: QUEUE_QUOTA_ID,
      title: "Jonossa",
      size: 0,
      signupCount: 0,
      signups: [],
    },
  );

  const quotasWithOpenAndQueue = [
    ...quotas,
    ...(includeOpen && openQuotaSize > 0 ? [openQuota] : []),
    ...(includeQueue && queuedQuota.signupCount > 0 ? [queuedQuota] : []),
  ];

  return quotasWithOpenAndQueue;
};
