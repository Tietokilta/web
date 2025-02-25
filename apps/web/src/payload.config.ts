import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import { Users } from "./collections/users";

export default buildConfig({
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  db: mongooseAdapter({
    url: process.env.PAYLOAD_MONGO_CONNECTION_STRING ?? "",
  }),
  collections: [Users],
  sharp,
  routes: {
    admin: "/payload/admin",
    api: "/payload/admin",
  },
  typescript: {
    outputFile: "payload-types.ts",
  },
  admin: {
    user: Users.slug,
    autoLogin: {
      email: "root@tietokilta.fi",
      password: "root",
    },
  },
});
