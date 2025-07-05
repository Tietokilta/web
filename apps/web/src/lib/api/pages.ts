import type { Page } from "@payload-types";
import { getOneCollectionItem } from "./fetcher";

export const fetchPage = getOneCollectionItem<
  {
    where:
      | { path: { equals: string } }
      | { "path.fi": { equals: string } }
      | { "path.en": { equals: string } };
  },
  Page
>("pages");
