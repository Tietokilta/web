import type { Partner } from "@tietokilta/cms-types/payload";
import { getAllCollectionItems } from "./fetcher";

export const fetchPartners = getAllCollectionItems<
  {
    where:
      | { or: { status: { equals: Partner["status"] } }[] }
      | { status: { equals: Partner["status"] } };
  },
  Partner[]
>("partners", { sort: "name" });
