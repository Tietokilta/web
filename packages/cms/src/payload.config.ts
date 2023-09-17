import Media from "./collections/Media";
import Pages from "./collections/Pages";
import Topics from "./collections/Topics";
import Users from "./collections/Users";
import LandingPage from "./globals/LandingPage";
import MainNavigation from "./globals/MainNavigation";

import { buildConfig } from "payload/config";
import { LexicalPlugin } from "payload-plugin-lexical";

import path from "path";

export default buildConfig({
  admin: {
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_AND_SEEDING === "true"
        ? {
            email: "root@tietokilta.fi",
            password: "root",
          }
        : false,
  },
  collections: [Users, Pages, Media, Topics],
  globals: [MainNavigation, LandingPage],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    fallback: true,
  },
  plugins: [LexicalPlugin({})],
});
