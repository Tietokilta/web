import type { Committee } from "@tietokilta/cms-types/payload";
import { getAllCollectionItems } from "./fetcher";

export const fetchCommittees = getAllCollectionItems<
  { where: { year: { equals: string }; hidden: { not_equals: boolean } } },
  Committee[]
>("committees");
