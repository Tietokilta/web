import path from "path";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { azureBlobStorageAdapter } from "@payloadcms/plugin-cloud-storage/azure";
import {
  AlignFeature,
  BlockQuoteFeature,
  BlocksFeature,
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
import { BoardMembers } from "./collections/board/board-members";
import { Boards } from "./collections/board/boards";
import { CommitteeMembers } from "./collections/committees/committee-members";
import { Committees } from "./collections/committees/committees";
import { MagazineIssues } from "./collections/magazines/magazine-issues";
import { Magazines } from "./collections/magazines/magazines";
import { Documents } from "./collections/documents";
import { Media } from "./collections/media";
import { Pages } from "./collections/pages";
import { Topics } from "./collections/topics";
import { Users } from "./collections/users";
import { News } from "./collections/news";
import { Footer } from "./globals/footer";
import { LandingPage } from "./globals/landing-page";
import { MainNavigation } from "./globals/main-navigation";
import { revalidateGlobal } from "./hooks/revalidate-globals";
import { useCloudStorage } from "./util";
import { CommitteesInYear } from "./blocks/committees-in-year";
import { WeeklyNewsletters } from "./collections/weekly-newsletters/weekly-newsletters";
import { NewsItems } from "./collections/weekly-newsletters/news-items";
import { ActionsLink, ActionsView } from "./views/actions-view";
import { ImageLinkGrid } from "./blocks/image-link-grid";
import { GoogleForm } from "./blocks/google-form";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- not applicable
  export interface GeneratedTypes extends Config {}
}

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  MONGODB_URI,
  PUBLIC_FRONTEND_URL,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_MEDIA_STORAGE_CONTAINER_NAME,
  AZURE_DOCUMENTS_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_ACCOUNT_BASEURL,
} = process.env;

export default buildConfig({
  // TODO: should probably enable this for production but it breaks auth in development
  // serverURL: process.env.PUBLIC_SERVER_URL,
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
    components: {
      views: {
        CustomActions: {
          Component: ActionsView,
          path: "/actions",
        },
      },
      actions: [ActionsLink],
    },
  },
  upload: {
    limits: {
      fileSize: 64000000, // 64MB, written in bytes
    },
  },
  collections: [
    Users,
    Pages,
    Media,
    Documents,
    Topics,
    BoardMembers,
    Boards,
    CommitteeMembers,
    Committees,
    MagazineIssues,
    Magazines,
    News,
    WeeklyNewsletters,
    NewsItems,
  ],
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
    connectOptions: {
      dbName: process.env.PAYLOAD_MONGO_DB_NAME,
    },
    // webpack build crashes if these are not set i.e. have to default empty
    url: process.env.PAYLOAD_MONGO_CONNECTION_STRING ?? "",
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
        enabledCollections: [Pages.slug],
      }),
      RelationshipFeature({
        enabledCollections: [
          Pages.slug,
          Boards.slug,
          Committees.slug,
          Magazines.slug,
        ],
      }),
      BlockQuoteFeature(),
      BlocksFeature({
        blocks: [CommitteesInYear, ImageLinkGrid, GoogleForm],
      }),
      UploadFeature({
        collections: {
          [Media.slug]: {
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
          [Documents.slug]: {
            fields: [],
          },
        },
      }),
    ],
  }),
  rateLimit: {
    max: 2000,
    window: 300000,
  },
  plugins: [
    oAuthPlugin({
      databaseUri: MONGODB_URI ?? "",
      clientID: GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET ?? "",
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
      enabled: useCloudStorage(),
      collections: {
        [Media.slug]: {
          disableLocalStorage: true,
          adapter: azureBlobStorageAdapter({
            connectionString: AZURE_STORAGE_CONNECTION_STRING ?? "",
            containerName: AZURE_MEDIA_STORAGE_CONTAINER_NAME ?? "",
            allowContainerCreate:
              process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
            baseURL: AZURE_STORAGE_ACCOUNT_BASEURL ?? "",
          }),
        },
        [Documents.slug]: {
          disableLocalStorage: true,
          adapter: azureBlobStorageAdapter({
            connectionString: AZURE_STORAGE_CONNECTION_STRING ?? "",
            containerName: AZURE_DOCUMENTS_STORAGE_CONTAINER_NAME ?? "",
            allowContainerCreate:
              process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
            baseURL: AZURE_STORAGE_ACCOUNT_BASEURL ?? "",
          }),
        },
      },
    }),
    // add revalidateGlobal hook to all globals
    (config) => {
      return {
        ...config,
        globals: config.globals?.map((global) => ({
          ...global,
          hooks: {
            ...global.hooks,
            afterChange: [
              ...(global.hooks?.afterChange ?? []),
              revalidateGlobal,
            ],
          },
        })),
      };
    },
  ],
});
