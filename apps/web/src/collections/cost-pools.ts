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
      "The toimikunnat and activities that invoices from the invoice generator are booked against. The account becomes the first four digits of the invoice's reference number.",
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
      localized: true,
      admin: {
        description:
          "Shown in the invoice generator's dropdown, on the invoice PDF and in the treasurer's email.",
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
        if (!value) return "Account is required.";
        if (!/^[1-9]\d{3}$/.test(value)) {
          return "Account must be four digits and must not start with a zero, e.g. 4212.";
        }
        if (value === UNASSIGNED_ACCOUNT) {
          return `Account ${UNASSIGNED_ACCOUNT} is reserved for invoices whose toimikunta is unknown.`;
        }
        return true;
      },
      admin: {
        description: "Four-digit bookkeeping account, e.g. 4212.",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection("cost-pools")],
  },
} as const satisfies CollectionConfig;

export type CostPoolsSlug = (typeof CostPools)["slug"];
