import type { CostPool } from "@payload-types";
import { getAllCollectionItems } from "./fetcher";

// No filter: every cost pool in the CMS is selectable
export const fetchCostPools = getAllCollectionItems<
  Record<string, unknown>,
  CostPool[]
>("cost-pools", { sort: "account" });
