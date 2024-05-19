import type { Committee } from "@tietokilta/cms-types/payload";
import { getAll } from "./fetcher";

export const fetchCommittees = getAll<
  { where: { year: { equals: string } } },
  Committee[]
>("committees");
