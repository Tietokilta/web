import type { Page } from "@tietokilta/cms-types/payload";
import { getOne } from "./fetcher";

export const fetchPage = getOne<
  { where: { slug: { equals: string }; topic?: { slug: { equals: string } } } },
  Page
>("/api/pages");
