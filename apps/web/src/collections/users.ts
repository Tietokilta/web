import type { CollectionConfig } from "payload";
import { env } from "../env";

export const Users = {
  slug: "users",
  auth: {
    useAPIKey: true,
    loginWithUsername: false,
    cookies: {
      // Local development and E2E run over plain HTTP. The URL is unset when
      // codegen loads this config without environment validation.
      secure:
        typeof env.PUBLIC_FRONTEND_URL === "string" &&
        env.PUBLIC_FRONTEND_URL.startsWith("https://"),
    },
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [],
} as const satisfies CollectionConfig;
