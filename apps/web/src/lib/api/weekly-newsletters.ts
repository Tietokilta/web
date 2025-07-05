import type { WeeklyNewsletter } from "@payload-types";
import { getAllCollectionItems, getOneCollectionItem } from "./fetcher";

export const fetchWeeklyNewsletters = getAllCollectionItems<
  Record<string, unknown>,
  WeeklyNewsletter[]
>("weekly-newsletters", {
  sort: "-createdAt",
});

export const fetchWeeklyNewsletter = getOneCollectionItem<
  Record<string, unknown>,
  WeeklyNewsletter
>("weekly-newsletters", {
  sort: "-createdAt",
});

export const fetchWeeklyNewsletterBySlug = getOneCollectionItem<
  { where: { slug: { equals: string } } },
  WeeklyNewsletter
>("weekly-newsletters", {
  sort: "-createdAt",
});
