import path from "path";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import {
  AlignFeature,
  BlockQuoteFeature,
  BoldTextFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeTextFeature,
  ItalicTextFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughTextFeature,
  SubscriptTextFeature,
  UnderlineTextFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Config } from "@tietokilta/cms-types/payload";
import { oAuthPlugin } from "payload-plugin-oauth";
import { buildConfig } from "payload/config";
import { azureBlobStorageAdapter } from "@payloadcms/plugin-cloud-storage/azure";
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

const {
  CLIENT_ID,
  CLIENT_SECRET,
  MONGODB_URI,
  PUBLIC_FRONTEND_URL,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_ACCOUNT_BASEURL,
} = process.env;
const useCloudStorage =
  typeof AZURE_STORAGE_CONNECTION_STRING === "string" &&
  typeof AZURE_STORAGE_CONTAINER_NAME === "string" &&
  typeof AZURE_STORAGE_ACCOUNT_BASEURL === "string";

export default buildConfig({
  // TODO: should probably enable this for production but it breaks auth in development
  // serverURL: process.env.SERVER_URL,
  admin: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- stupid eslint doesn't find the type
    bundler: webpackBundler(),
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT === "true" &&
      process.env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_EMAIL &&
      process.env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_PASSWORD
        ? {
            email: process.env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_EMAIL,
            password: process.env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_PASSWORD,
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
  editor: lexicalEditor({
    features: [
      BoldTextFeature(),
      ItalicTextFeature(),
      UnderlineTextFeature(),
      StrikethroughTextFeature(),
      SubscriptTextFeature(),
      InlineCodeTextFeature(),
      ParagraphFeature(),
      HeadingFeature({
        enabledHeadingSizes: ["h2", "h3"],
      }),
      AlignFeature(),
      IndentFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature({
        enabledCollections: ["pages"],
      }),
      RelationshipFeature({
        enabledCollections: ["pages"],
      }),
      BlockQuoteFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: "caption",
                label: "Caption",
                localized: true,
                type: "text",
                minLength: 20,
                maxLength: 100,
              },
            ],
          },
        },
      }),
    ],
  }),
  plugins: [
    oAuthPlugin({
      databaseUri: MONGODB_URI ?? "",
      clientID: CLIENT_ID ?? "",
      clientSecret: CLIENT_SECRET ?? "",
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://www.googleapis.com/oauth2/v4/token",
      callbackURL: `${PUBLIC_FRONTEND_URL ?? "http://localhost:3000"}/oauth2/callback`,
      scope: ["profile", "email"],
      async userinfo(accessToken: string) {
        const user = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
        ).then((res) => {
          if (!res.ok) {
            // eslint-disable-next-line no-console -- logging error here is fine
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
      sessionOptions: {
        resave: false,
        saveUninitialized: false,
        // PAYLOAD_SECRET existing is verified in server.ts
        secret: process.env.PAYLOAD_SECRET ?? "",
      },
    }),
    cloudStorage({
      enabled: useCloudStorage,
      collections: {
        [Media.slug]: {
          adapter: azureBlobStorageAdapter({
            connectionString: AZURE_STORAGE_CONNECTION_STRING ?? "",
            containerName: AZURE_STORAGE_CONTAINER_NAME ?? "",
            allowContainerCreate:
              process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
            baseURL: AZURE_STORAGE_ACCOUNT_BASEURL ?? "",
          }),
        },
      },
    }),
  ],
});
