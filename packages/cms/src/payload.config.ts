import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Pages from "./collections/Pages";
import { LexicalPlugin } from "payload-plugin-lexical";
import Media from "./collections/Media";

export default buildConfig({
  admin: {
    user: Users.slug,
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
