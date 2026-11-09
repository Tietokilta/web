import type { CostPool } from "@payload-types";
import { getAllCollectionItems } from "./fetcher";

// No filter: every cost pool in the CMS is selectable
// The account is validated to be exactly four digits without a leading zero, so sorting it as a
// string gives the same order as sorting it as a number
export const fetchCostPools = getAllCollectionItems<
  Record<string, unknown>,
  CostPool[]
>("cost-pools", { sort: "account" });
