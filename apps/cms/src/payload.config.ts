import path from "path";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Config } from "@tietokilta/cms-types/payload";
import { buildConfig } from "payload/config";
import { Media } from "./collections/media";
import { Pages } from "./collections/pages";
import { Topics } from "./collections/topics";
import { Users } from "./collections/users";
import { Footer } from "./globals/footer";
import { LandingPage } from "./globals/landing-page";
import { MainNavigation } from "./globals/main-navigation";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- not applicable
  export interface GeneratedTypes extends Config {}
}

export default buildConfig({
  // TODO: should probably enable this for production but it breaks auth in development
  // serverURL: process.env.PUBLIC_SERVER_URL,
  admin: {
    bundler: webpackBundler(),
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_LOCAL_DEVELOPMENT === "true" &&
      process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_EMAIL &&
      process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_PASSWORD
        ? {
            email: process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_EMAIL,
            password: process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_PASSWORD,
          }
        : false,
  },
  collections: [Users, Pages, Media, Topics],
  globals: [Footer, LandingPage, MainNavigation],
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    fallback: true,
  },
  typescript: {
    outputFile: path.join(
      __dirname,
      "../../../packages/cms-types",
      "payload.ts",
    ),
    declare: false,
  },
  graphQL: {
    schemaOutputFile: path.join(
      __dirname,
      "../../../packages/cms-types",
      "schema.gql",
    ),
  },
  db: mongooseAdapter({
    // @ts-expect-error DATABASE_URL is validated by payload on start
    url: process.env.PAYLOAD_DATABASE_URL,
  }),
  editor: lexicalEditor({}),
});
