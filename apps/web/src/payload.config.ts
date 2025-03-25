import sharp from "sharp";
import {
  BlocksFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  RelationshipFeature,
} from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import { azureStorage } from "@payloadcms/storage-azure";
import { OAuth2Plugin, defaultGetToken } from "payload-oauth2";
import type { Config } from "@payload-types";
import { Users } from "./collections/users";
import { Pages } from "./collections/pages";
import { Topics } from "./collections/topics";
import { BoardMembers } from "./collections/board/board-members";
import { Boards } from "./collections/board/boards";
import { CommitteeMembers } from "./collections/committees/committee-members";
import { Committees } from "./collections/committees/committees";
import { MagazineIssues } from "./collections/magazines/magazine-issues";
import { Magazines } from "./collections/magazines/magazines";
import { News } from "./collections/news";
import { WeeklyNewsletters } from "./collections/weekly-newsletters/weekly-newsletters";
import { NewsItems } from "./collections/weekly-newsletters/news-items";
import { Honors } from "./collections/honors/honors";
import { AwardedHonors } from "./collections/honors/awarded-honors";
import { Partners } from "./collections/partners";
import { Footer } from "./globals/footer";
import { LandingPage } from "./globals/landing-page";
import { MainNavigation } from "./globals/main-navigation";
import { CommitteesInYear } from "./blocks/committees-in-year";
import { ImageLinkGrid } from "./blocks/image-link-grid";
import { GoogleForm } from "./blocks/google-form";
import { HighlightCard } from "./blocks/highlight-card";
import { EditorInChief } from "./blocks/editor-in-chief";
import { InvoiceGenerator } from "./blocks/invoice-generator";
import { PartnersBlock } from "./blocks/partners-block";
import { Media } from "./collections/media";
import { Documents } from "./collections/documents";
import { isCloudStorageEnabled, isGoogleAuthEnabled } from "./util";
import { revalidateGlobal } from "./hooks/revalidate-globals";
import { InfoScreen } from "./globals/info-screen";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- not applicable
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
  AZURE_STORAGE_ALLOW_CONTAINER_CREATE,
  PAYLOAD_SECRET,
} = process.env;

export default buildConfig({
  telemetry: false,
  admin: {
    user: Users.slug,
    autoLogin: {
      // email: "root@tietokilta.fi",
      // password: "root",
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
    Honors,
    AwardedHonors,
    Partners,
  ],
  globals: [Footer, LandingPage, MainNavigation, InfoScreen],
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    fallback: true,
  },
  typescript: {
    outputFile: new URL("../payload-types.ts", import.meta.url).pathname,
    declare: false,
  },
  db: mongooseAdapter({
    url: process.env.PAYLOAD_MONGO_CONNECTION_STRING ?? "",
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({
        enabledHeadingSizes: ["h2", "h3", "h4"],
      }),
      LinkFeature({
        enabledCollections: [Pages.slug],
      }),
      RelationshipFeature({
        enabledCollections: [
          Pages.slug,
          Boards.slug,
          Committees.slug,
          Magazines.slug,
          Honors.slug,
        ],
      }),
      BlocksFeature({
        blocks: [
          CommitteesInYear,
          ImageLinkGrid,
          GoogleForm,
          HighlightCard,
          EditorInChief,
          InvoiceGenerator,
          PartnersBlock,
        ],
      }),
      // UploadFeature({})
    ],
  }),
  plugins: [
    OAuth2Plugin({
      enabled: isGoogleAuthEnabled(),
      strategyName: "google",
      useEmailAsIdentity: true,
      serverURL: PUBLIC_FRONTEND_URL ?? "",
      clientId: GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      authorizePath: "/api/oauth/google/authorize",
      callbackPath: "/api/oauth/google/callback",
      authCollection: Users.slug,
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      providerAuthorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ],
      getUserInfo: async (accessToken, _req) => {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v4/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const user = await response.json();
        return { email: user.email, sub: user.sub };
      },
      getToken: async (code, req) => {
        const redirectUri = `${PUBLIC_FRONTEND_URL ?? "http://localhost:3000"}/api/users/oauth/google/callback`;
        const token = await defaultGetToken(
          "https://oauth2.googleapis.com/token",
          GOOGLE_OAUTH_CLIENT_ID ?? "",
          GOOGLE_OAUTH_CLIENT_SECRET ?? "",
          redirectUri,
          code,
        );
        ////////////////////////////////////////////////////////////////////////////
        // Consider this section afterToken hook
        ////////////////////////////////////////////////////////////////////////////
        req.payload.logger.info(`Received token: ${token} 👀`);
        if (req.user) {
          void req.payload.update({
            collection: "users",
            id: req.user.id,
            data: {},
          });
        }

        return token;
      },
      successRedirect: () => {
        return "/admin";
      },
      failureRedirect: (req, err) => {
        req.payload.logger.error(err);
        return "/admin/login";
      },
    }),
    azureStorage({
      enabled: isCloudStorageEnabled(),
      connectionString: AZURE_STORAGE_CONNECTION_STRING ?? "",
      containerName: AZURE_MEDIA_STORAGE_CONTAINER_NAME ?? "",
      // TODO: what with different container names?
      allowContainerCreate: AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
      baseURL: AZURE_STORAGE_ACCOUNT_BASEURL ?? "",
      collections: {
        [Media.slug]: {
          disableLocalStorage: true,
          prefix: "",
        },
        [Documents.slug]: {
          disableLocalStorage: true,
          prefix: "",
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
  secret: PAYLOAD_SECRET ?? "",
  sharp,
  routes: {
    admin: "/admin",
    api: "/api",
  },
  defaultDepth: 2,
  loggingLevels: {
    APIError: "trace",
    NotFound: "trace",
    AuthenticationError: "trace",
    ErrorDeletingFile: "trace",
    FileRetrievalError: "trace",
    FileUploadError: "trace",
    Forbidden: "trace",
    Locked: "trace",
    LockedAuth: "trace",
    MissingFile: "trace",
    QueryError: "trace",
    ValidationError: "trace",
  },
});
