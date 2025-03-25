import type { CollectionConfig } from "payload";
import { signedIn } from "../../access/signed-in";
import { revalidateCollection } from "../../hooks/revalidate-collection";

export const Magazines = {
  slug: "magazines",
  admin: {
    useAsTitle: "type",
    defaultColumns: ["type", "issues"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "type",
      type: "select",
      options: [
        {
          label: "Alkorytmi",
          value: "Alkorytmi",
        },
        {
          label: "Rekrylehti",
          value: "Rekrylehti",
        },
      ],
      required: true,
      unique: true,
    },
    {
      name: "issues",
      type: "array",
      fields: [
        {
          name: "issue",
          type: "relationship",
          relationTo: "magazine-issues",
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCollection("magazines")],
  },
} as const satisfies CollectionConfig;
