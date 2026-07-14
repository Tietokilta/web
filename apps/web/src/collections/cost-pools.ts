import type { CollectionConfig } from "payload";
import { signedIn } from "../access/signed-in";
import { revalidateCollection } from "../hooks/revalidate-collection";

/**
 * The account reserved for invoices whose toimikunta could not be resolved. It does not exist
 * in the bookkeeping on purpose, so the treasurer notices and assigns them by hand.
 */
const UNASSIGNED_ACCOUNT = "4999";

export const CostPools = {
  slug: "cost-pools",
  labels: {
    singular: "Cost pool",
    plural: "Cost pools",
  },
  defaultSort: "account",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "account"],
    description:
      "Toimikunnat ja toiminnat, joille laskugeneraattorin laskut kohdistetaan. Tili päätyy laskun viitenumeron neljäksi ensimmäiseksi numeroksi.",
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description:
          "Näkyy laskugeneraattorin valikossa sekä laskun PDF:ssä ja rahastonhoitajan sähköpostissa.",
      },
    },
    {
      name: "account",
      type: "text",
      required: true,
      unique: true,
      // A leading zero is stripped by banking systems, which would shift every digit of the
      // reference number and silently route the payment to the wrong account.
      validate: (value: string | null | undefined) => {
        if (!value) return "Tili on pakollinen.";
        if (!/^[1-9]\d{3}$/.test(value)) {
          return "Tilin on oltava nelinumeroinen eikä se saa alkaa nollalla, esim. 4212.";
        }
        if (value === UNASSIGNED_ACCOUNT) {
          return `Tili ${UNASSIGNED_ACCOUNT} on varattu laskuille, joiden toimikunta ei ole tiedossa.`;
        }
        return true;
      },
      admin: {
        description: "Nelinumeroinen kirjanpidon tili, esim. 4212.",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection("cost-pools")],
  },
} as const satisfies CollectionConfig;

export type CostPoolsSlug = (typeof CostPools)["slug"];
