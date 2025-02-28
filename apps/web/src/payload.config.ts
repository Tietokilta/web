import sharp from "sharp";
import {
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  RelationshipFeature,
} from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig, CollectionSlug } from "payload";
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
import type { Config } from "@payload-types";
import path from "node:path";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- not applicable
  export interface GeneratedTypes extends Config {}
}

export default buildConfig({
  telemetry: false,
  admin: {
    user: Users.slug,
    autoLogin: {
      email: "root@tietokilta.fi",
      password: "root",
    },
  },
  collections: [
    Users,
    Pages,
    // Media,
    // Documents,
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
  globals: [Footer, LandingPage, MainNavigation],
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
  },
  db: mongooseAdapter({
    url: process.env.PAYLOAD_MONGO_CONNECTION_STRING ?? "",
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({
        enabledHeadingSizes: ["h2", "h3"],
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
    ],
  }),
  secret: process.env.PAYLOAD_SECRET ?? "",
  sharp,
  routes: {
    admin: "/admin",
    api: "/admin",
  },
  typescript: {
    outputFile: path.join(__dirname, "..", "payload-types.ts"),
    declare: false,
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
