import type { Committee } from "@payload-types";
import { getAllCollectionItems } from "./fetcher";

export const fetchCommittees = getAllCollectionItems<
  // using not_equals filter for backwards compatibility with old committees
  { where: { year: { equals: string }; hidden: { not_equals: boolean } } },
  Committee[]
>("committees");
