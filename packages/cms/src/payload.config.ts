import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Pages from "./collections/Pages";
import { LexicalPlugin } from "payload-plugin-lexical";
import Media from "./collections/Media";
import { defaultUser } from "./seeding/seedData/user";

export default buildConfig({
  admin: {
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_AND_SEEDING === "true"
        ? defaultUser
        : false,
  },
  collections: [Users, Pages, Media],
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
