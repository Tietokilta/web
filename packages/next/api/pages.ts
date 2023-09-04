import type { Page } from "payload/generated-types";
import { getOne } from "./fetcher";

export const fetchPage = getOne<{ slug: string; topic?: string }, Page>(
  "/api/pages",
);
