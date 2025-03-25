import type { CollectionConfig } from "payload";

export const Users = {
  slug: "users",
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [],
} as const satisfies CollectionConfig;
