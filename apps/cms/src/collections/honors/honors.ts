import type { CollectionConfig } from "payload/types";
import { signedIn } from "../../access/signed-in";

export const Honors = {
  slug: "honors",
  defaultSort: "-name",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "awardedHonors"],
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
    },
    {
      name: "awardedHonors",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "awardedHonor",
          type: "relationship",
          relationTo: "awarded-honors",
        },
      ],
    },
  ],
} as const satisfies CollectionConfig;

export type CommitteesSlug = (typeof Honors)["slug"];
