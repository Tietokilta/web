import Media from "./collections/Media";
import Pages from "./collections/Pages";
import Topics from "./collections/Topics";
import Users from "./collections/Users";
import Footer from "./globals/Footer";
import LandingPage from "./globals/LandingPage";
import MainNavigation from "./globals/MainNavigation";

import { viteBundler } from "@payloadcms/bundler-vite";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { LinkFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload/config";

import path from "path";

export default buildConfig({
  admin: {
    bundler: viteBundler(),
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT === "true" &&
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_EMAIL &&
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_PASSWORD
        ? {
            email: process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_EMAIL,
            password: process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_PASSWORD,
          }
        : false,
  },
  collections: [Users, Pages, Media, Topics],
  globals: [MainNavigation, LandingPage, Footer],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    fallback: true,
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, LinkFeature({})],
  }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  plugins: [],
});
