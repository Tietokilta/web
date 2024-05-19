import type { CollectionConfig } from "payload/types";
import { signedIn } from "../access/signed-in";
import { iconField } from "../fields/icon-field";

export const Topics: CollectionConfig = {
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
};
