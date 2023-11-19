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
import { oAuthPlugin } from "payload-oauth";

import path from "path";

const { CLIENT_ID, CLIENT_SECRET, MONGODB_URI } = process.env;
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

export default buildConfig({
  admin: {
    bundler: viteBundler(),
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
    url: MONGODB_URI,
  }),
  plugins: [
    oAuthPlugin({
      databaseUri: MONGODB_URI,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://www.googleapis.com/oauth2/v4/token",
      callbackURL: `${SERVER_URL}/oauth2/callback`,
      scope: ["profile", "email"],
      async userinfo(accessToken) {
        const user = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
        ).then((res) => {
          if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(res);
            throw new Error(res.statusText);
          }

          return res.json() as unknown as {
            sub: string;
            name: string;
            given_name: string;
            family_name: string;
            email: string;
          };
        });
        return {
          sub: user.sub,

          // Custom fields to fill in if user is created
          name:
            user.name ||
            `${user.given_name} ${user.family_name}` ||
            "Teemu Teekkari",
          email: user.email,
        };
      },
      userCollection: Users,
    }),
  ],
});
