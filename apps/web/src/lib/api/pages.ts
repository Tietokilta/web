import type { Page } from "@tietokilta/cms-types/payload";
import { getOne } from "./fetcher";

export const fetchPage = getOne<
  {
    where:
      | { path: { equals: string } }
      | { "path.fi": { equals: string } | { "path.en": { equals: string } } };
  },
  Page
>("pages");
