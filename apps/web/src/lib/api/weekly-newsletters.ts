import type { WeeklyNewsletter } from "@tietokilta/cms-types/payload";
import { getAll, getOne } from "./fetcher";

export const fetchWeeklyNewsletters = getAll<
  Record<string, unknown>,
  WeeklyNewsletter[]
>("/api/weekly-newsletters");

export const fetchWeeklyNewsletter = getOne<
  Record<string, unknown>,
  WeeklyNewsletter
>("/api/weekly-newsletters");

export const fetchWeeklyNewsletterBySlug = getOne<
  { where: { slug: { equals: string } } },
  WeeklyNewsletter
>("/api/weekly-newsletters");
