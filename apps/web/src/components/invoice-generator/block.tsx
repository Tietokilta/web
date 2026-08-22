import type { JSX } from "react";
import { fetchCostPools } from "../../lib/api/cost-pools";
import { getLocale } from "../../locales/server";
import { InvoiceGeneratorForm } from "./index";

export async function InvoiceGenerator(): Promise<JSX.Element> {
  const locale = await getLocale();
  const costPools = await fetchCostPools({ locale });

  if (!costPools || costPools.length === 0) {
    // eslint-disable-next-line no-console -- an empty list means nobody can pick a toimikunta
    console.warn("No cost pools found, rendering the invoice form without one");
  }

  return <InvoiceGeneratorForm costPools={costPools ?? []} />;
}
