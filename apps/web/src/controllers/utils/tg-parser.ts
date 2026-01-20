/* eslint-disable no-bitwise -- lexical nodes are defined bitwise*/
import { type Node } from "@lexical-types";
import { type NewsItem, type WeeklyNewsletter } from "@payload-types";
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
} from "../../emails/utils/lexical";
import {
  isThisWeek,
  type Locale,
  type TocItem,
} from "../../emails/utils/utils";

export const parseToTelegramString = (nodes: Node[]): string => {
  let result = "";
  nodes.forEach((node) => {
    if (node.type === "text") {
      let text = node.text;
      if (node.format & IS_BOLD) {
        text = `**${text}**`;
      }
      if (node.format & IS_ITALIC) {
        text = `__${text}__`;
      }
      if (node.format & IS_STRIKETHROUGH) {
        text = `~~${text}~~`;
      }
      result += text;
    }

    if (node.type === "linebreak") {
      result += "\n";
    }

    if (node.type === "paragraph" || node.type === "heading") {
      if ("children" in node) {
        result += parseToTelegramString(node.children);
      }
      result += "\n\n";
    }

    if (node.type === "list") {
      if ("children" in node) {
        result += parseToTelegramString(node.children);
      }
      result += "\n";
    }

    if (node.type === "listitem") {
      result += "- ";
      if ("children" in node) {
        result += parseToTelegramString(node.children);
      }
      result += "\n";
    }

    if (node.type === "quote") {
      if ("children" in node) {
        result += `> ${parseToTelegramString(node.children)}`;
      }
      result += "\n";
    }

    if (node.type === "link" || node.type === "autolink") {
      const url = node.fields.url || "#";
      const linkText = parseToTelegramString(node.children ?? []);
      result += `[${linkText}](${url})`;
    }
  });
  return result;
};

export const parseToc = (
  newsletter: WeeklyNewsletter,
  locale: Locale,
): string => {
  const { PUBLIC_FRONTEND_URL } = process.env;

  const t = {
    en: {
      calendar: "Calendar",
      guild: "Guild",
      "ayy-aalto": "AYY & Aalto",
      other: "Other",
      "bottom-corner": "Bottom Corner",
      read: "Read",
      path: "weekly-newsletters",
      ending: "You can read the whole weekly letter here",
      summary: "Table of Contents",
    },
    fi: {
      calendar: "Kalenteri",
      guild: "Kilta",
      "ayy-aalto": "AYY & Aalto",
      other: "Muut",
      "bottom-corner": "Pohjanurkkaus",
      read: "Lue",
      path: "viikkotiedotteet",
      ending: "Viikkotiedotteen voi kokonaisuudessaan käydä lukemassa täällä",
      summary: "Sisällysluettelo",
    },
  };

  let tgString = `**${t[locale].summary}**\n`;

  const allNewsItems =
    newsletter.newsItems?.map((item) => item.newsItem as NewsItem) ?? [];

  const guildNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "guild",
  );
  const ayyAaltoNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "ayy-aalto",
  );
  const otherNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "other",
  );
  const bottomCornerNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "bottom-corner",
  );

  const eventsThisWeek = allNewsItems.filter(
    (newsItem) => newsItem.date && isThisWeek(newsItem.date),
  );
  const eventsNextWeek = allNewsItems.filter(
    (newsItem) => newsItem.date && !isThisWeek(newsItem.date),
  );
  const signupsThisWeek = allNewsItems.filter(
    (newsItem) =>
      newsItem.signupStartDate && isThisWeek(newsItem.signupStartDate),
  );
  const toc: TocItem[] = [
    eventsThisWeek.length > 0 ||
    eventsNextWeek.length > 0 ||
    signupsThisWeek.length > 0
      ? { text: t[locale].calendar, children: [] }
      : null,
    guildNewsItems.length > 0
      ? {
          text: t[locale].guild,
          children: guildNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    ayyAaltoNewsItems.length > 0
      ? {
          text: t[locale]["ayy-aalto"],
          children: ayyAaltoNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    otherNewsItems.length > 0
      ? {
          text: t[locale].other,
          children: otherNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    bottomCornerNewsItems.length > 0
      ? {
          text: t[locale]["bottom-corner"],
          children: bottomCornerNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
  ].filter((itemOrNull): itemOrNull is NonNullable<typeof itemOrNull> =>
    Boolean(itemOrNull),
  );
  toc.forEach((item, index) => {
    const parentOrder = `${(index + 1).toString()}.`;
    tgString += `${parentOrder} ${item.text}\n`;
    if (item.children.length > 0) {
      item.children.forEach((child, i) => {
        const childOrder = `${(i + 1).toString()}.`;
        tgString += `  ${parentOrder}${childOrder} ${child.text}\n`;
      });
    }
  });
  tgString += `\n----\n${t[locale].ending} (${PUBLIC_FRONTEND_URL ?? ""}/${locale}/${t[locale].path})!`;
  return tgString;
};
