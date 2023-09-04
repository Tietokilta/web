import { getOne } from "./fetcher";

import type { Page } from "payload/generated-types";

export const fetchPage = getOne<{ slug: string; topic?: string }, Page>(
  "/api/pages",
);
