import type { Committee } from "@tietokilta/cms-types/payload";
import { getAllCollectionItems } from "./fetcher";

export const fetchCommittees = getAllCollectionItems<
  { where: { year: { equals: string } } },
  Committee[]
>("committees");
