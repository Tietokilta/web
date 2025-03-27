import type { CollectionConfig } from "payload";
import { isGoogleAuthEnabled } from "../util";

export const Users = {
  slug: "users",
  auth: {
    useAPIKey: true,
    loginWithUsername: false,
    disableLocalStrategy: isGoogleAuthEnabled() ? true : undefined,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [],
} as const satisfies CollectionConfig;
