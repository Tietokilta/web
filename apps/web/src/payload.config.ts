import { mongooseAdapter } from "@payloadcms/db-mongodb";
import {
  BlocksFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  RelationshipFeature,
} from "@payloadcms/richtext-lexical";
import { azureStorage } from "@payloadcms/storage-azure";
import { buildConfig } from "payload";
import { OAuth2Plugin, defaultGetToken } from "payload-oauth2";
import sharp from "sharp";
import type { Config } from "@payload-types";
import { Collapsible } from "./blocks/collapsible";
import { CommitteesInYear } from "./blocks/committees-in-year";
import { EditorInChief } from "./blocks/editor-in-chief";
import { GoogleForm } from "./blocks/google-form";
import { HighlightCard } from "./blocks/highlight-card";
import { ImageLinkGrid } from "./blocks/image-link-grid";
import { InvoiceGenerator } from "./blocks/invoice-generator";
import { PartnersBlock } from "./blocks/partners-block";
import { BoardMembers } from "./collections/board/board-members";
import { Boards } from "./collections/board/boards";
import { CommitteeMembers } from "./collections/committees/committee-members";
import { Committees } from "./collections/committees/committees";
import { Documents } from "./collections/documents";
import { AwardedHonors } from "./collections/honors/awarded-honors";
import { Honors } from "./collections/honors/honors";
import { MagazineIssues } from "./collections/magazines/magazine-issues";
import { Magazines } from "./collections/magazines/magazines";
import { Media } from "./collections/media";
import { News } from "./collections/news";
import { PageFeedback } from "./collections/page-feedback";
import { Pages } from "./collections/pages";
import { Partners } from "./collections/partners";
import { Topics } from "./collections/topics";
import { Users } from "./collections/users";
import { ViewSessions } from "./collections/view-sessions";
import { NewsItems } from "./collections/weekly-newsletters/news-items";
import { WeeklyNewsletters } from "./collections/weekly-newsletters/weekly-newsletters";
import { Footer } from "./globals/footer";
import { InfoScreen } from "./globals/info-screen";
import { LandingPage } from "./globals/landing-page";
import { MainNavigation } from "./globals/main-navigation";
import { revalidateGlobal } from "./hooks/revalidate-globals";
import { isCloudStorageEnabled, isGoogleAuthEnabled } from "./util";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- not applicable
  export interface GeneratedTypes extends Config {}
}

import { env } from "./env";

const autoLogin =
  env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_EMAIL &&
  env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_PASSWORD
    ? {
        email: env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_EMAIL,
        password: env.PAYLOAD_PUBLIC_DEVELOPMENT_AUTOLOGIN_PASSWORD,
      }
    : undefined;
export default buildConfig({
  telemetry: false,
  admin: {
    user: Users.slug,
    autoLogin,
    components: {
      beforeLogin: [
        {
          path: "/src/components/admin-sign-up-button",
          exportName: "OAuthButton",
          serverProps: { enabled: isGoogleAuthEnabled() },
        },
      ],
      views: {
        CustomActions: {
          Component: "/src/views/actions-view#ActionsView",
          path: "/actions",
        },
      },
      actions: ["/src/views/actions-view#ActionsLink"],
    },
    livePreview: {
      url: ({ data }) => {
        const path = data?.path as string | undefined;
        if (!path) return "";
        return `${env.PUBLIC_FRONTEND_URL}/next_api/preview?url=${path}`;
      },
      collections: ["pages"],
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 414, height: 896 },
        { label: "Tablet", name: "tablet", width: 1024, height: 768 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
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
    ViewSessions,
    PageFeedback,
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
    url: env.PAYLOAD_MONGO_CONNECTION_STRING,
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
          Collapsible,
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
      serverURL: env.PUBLIC_FRONTEND_URL,
      clientId: env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      authorizePath: "/oauth/google/authorize",
      callbackPath: "/oauth/google/callback",
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
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const user = await response.json();
        return { email: user.email, sub: user.sub };
      },
      getToken: async (code, req) => {
        const redirectUri = `${env.PUBLIC_FRONTEND_URL}/api/users/oauth/google/callback`;
        const token = await defaultGetToken(
          "https://oauth2.googleapis.com/token",
          env.GOOGLE_OAUTH_CLIENT_ID ?? "",
          env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
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
      connectionString: env.AZURE_STORAGE_CONNECTION_STRING ?? "",
      containerName: env.AZURE_STORAGE_CONTAINER_NAME ?? "",
      // TODO: what with different container names?
      allowContainerCreate: env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
      baseURL: env.AZURE_STORAGE_ACCOUNT_BASEURL ?? "",
      collections: {
        [Media.slug]: {
          disableLocalStorage: true,
          prefix: Media.slug,
        },
        [Documents.slug]: {
          disableLocalStorage: true,
          prefix: Documents.slug,
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
  secret: env.PAYLOAD_SECRET,
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
  onInit: async (payloadInstance) => {
    payloadInstance.logger.info(
      `Payload Admin URL: ${payloadInstance.getAdminURL()}`,
    );

    // Create TTL index for view-sessions collection (auto-delete after 24 hours)
    try {
      const db = payloadInstance.db;
      // Access the underlying mongoose connection
      if ("connection" in db && db.connection) {
        const conn = db.connection as unknown as {
          connection: { collection: (name: string) => { createIndex: (index: Record<string, number>, options: Record<string, unknown>) => Promise<unknown> } };
        };
        const collection = conn.connection.collection("view-sessions");
        // Create TTL index - documents expire 24 hours after createdAt
        await collection.createIndex(
          { createdAt: 1 },
          { expireAfterSeconds: 86400, background: true },
        );
        payloadInstance.logger.info(
          "TTL index created for view-sessions collection",
        );
      }
    } catch (error) {
      // Index might already exist, that's fine
      payloadInstance.logger.debug(`TTL index setup: ${String(error)}`);
    }
    if (isCloudStorageEnabled()) {
      payloadInstance.logger.info("Using Azure Blob Storage");
    }
    if (isGoogleAuthEnabled()) {
      payloadInstance.logger.info("Using Google OAuth2");
    }
    if (env.PAYLOAD_DEFAULT_USER_EMAIL && env.PAYLOAD_DEFAULT_USER_PASSWORD) {
      const email = env.PAYLOAD_DEFAULT_USER_EMAIL;
      const password = env.PAYLOAD_DEFAULT_USER_PASSWORD;
      if (!email || !password) {
        payloadInstance.logger.warn(
          `PAYLOAD_DEFAULT_USER_EMAIL and PAYLOAD_DEFAULT_USER_PASSWORD are not set, first user has to be created manually through the admin panel`,
        );
      }
      // check if the user exists, if not, create it
      const user = await payloadInstance.find({
        collection: "users",
        where: { email: { equals: email } },
      });
      if (user.totalDocs === 0) {
        payloadInstance.logger.warn(`user ${email} not found, creating...`);
        if (env.NODE_ENV !== "production") {
          payloadInstance.logger.warn(
            "NOTE that it is recommended to use the seeding scripts (`pnpm db:reset`) to a get filled database for local development",
          );
        }
        await payloadInstance.create({
          collection: "users",
          data: {
            email,
            password,
          },
        });
      } else {
        payloadInstance.logger.info(
          `user ${email} found, resetting password...`,
        );
        const defaultUser = user.docs[0];
        await payloadInstance.update({
          collection: "users",
          id: defaultUser.id,
          data: { password },
        });
      }
    }
  },
});
