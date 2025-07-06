import type { CollectionConfig } from "payload";

export const Users = {
  slug: "users",
  auth: {
    useAPIKey: true,
    loginWithUsername: false,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [],
} as const satisfies CollectionConfig;
