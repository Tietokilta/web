import type { Page } from "@tietokilta/cms-types/payload";
import { getOneCollectionItem } from "./fetcher";

export const fetchPage = getOneCollectionItem<
  {
    where:
      | { path: { equals: string } }
      | { "path.fi": { equals: string } | { "path.en": { equals: string } } };
  },
  Page
>("pages");
