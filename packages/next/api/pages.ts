import { getOne } from "./fetcher";

import type { Page } from "payload/generated-types";

export const fetchPage = getOne<
  { where: { slug: { equals: string }; topic?: { slug: { equals: string } } } },
  Page
>("/api/pages");
