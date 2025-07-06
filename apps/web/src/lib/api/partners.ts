import type { Partner } from "@payload-types";
import { getAllCollectionItems } from "./fetcher";

export const fetchPartners = getAllCollectionItems<
  { where: { or: { status: { equals: Partner["status"] } }[] } },
  Partner[]
>("partners", { sort: "name" });
