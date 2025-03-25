import type { CollectionConfig } from "payload";
import { signedIn } from "../access/signed-in";
import { iconField } from "../fields/icon-field";

export const Topics = {
  slug: "topics",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["slug", "title"],
    listSearchableFields: ["slug", "title"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      localized: true,
    },
    iconField({ required: false }),
  ],
} as const satisfies CollectionConfig;
