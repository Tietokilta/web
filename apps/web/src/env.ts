import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const httpUrl = z.url({ protocol: /^https?$/ });

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.string().regex(/^\d+$/).optional().default("3000"),

    // Payload CMS
    PAYLOAD_MONGO_CONNECTION_STRING: z.url({
      protocol: /^mongodb(\+srv)?$/,
    }),
    PAYLOAD_SECRET: z.string().min(1),
    PAYLOAD_DEFAULT_USER_EMAIL: z.email().optional(),
    PAYLOAD_DEFAULT_USER_PASSWORD: z.string().min(1).optional(),
    PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_EMAIL: z.email().optional(),
    PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_PASSWORD: z.string().min(1).optional(),

    // Public URLs (server-side only despite the name)
    PUBLIC_FRONTEND_URL: httpUrl.default("http://localhost:3000"),
    PUBLIC_PRODUCTION_URL: httpUrl.default("https://tietokilta.fi"),
    PUBLIC_LEGACY_URL: httpUrl.default("https://old.tietokilta.fi"),

    // Azure Storage (optional, cloud storage disabled if not set)
    AZURE_STORAGE_CONNECTION_STRING: z.string().min(1).optional(),
    AZURE_STORAGE_CONTAINER_NAME: z.string().min(1).optional(),
    AZURE_STORAGE_ACCOUNT_BASEURL: httpUrl.optional(),
    AZURE_STORAGE_ALLOW_CONTAINER_CREATE: z.enum(["true", "false"]).optional(),

    // Google OAuth (optional, disabled if not set)
    GOOGLE_OAUTH_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1).optional(),

    // Mailgun (optional in dev)
    MAILGUN_SENDER: z.string().min(1).optional(),
    MAILGUN_RECEIVER: z.email().optional(),
    MAILGUN_API_KEY: z.string().min(1).optional(),
    MAILGUN_DOMAIN: z.string().min(1).optional(),
    MAILGUN_URL: httpUrl.optional(),

    // Digitransit API
    DIGITRANSIT_SUBSCRIPTION_KEY: z.string().min(1).optional(),

    // Git commit SHA
    GIT_COMMIT_SHA: z.string().default("development"),
  },
  client: {
    NEXT_PUBLIC_ILMOMASIINA_URL: httpUrl.default("https://ilmo.tietokilta.fi"),
    NEXT_PUBLIC_LASKUGENERAATTORI_URL: httpUrl.default(
      "https://laskutus.tietokilta.fi",
    ),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ILMOMASIINA_URL: process.env.NEXT_PUBLIC_ILMOMASIINA_URL,
    NEXT_PUBLIC_LASKUGENERAATTORI_URL:
      process.env.NEXT_PUBLIC_LASKUGENERAATTORI_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
