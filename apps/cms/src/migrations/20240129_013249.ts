import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "_locales" AS ENUM('fi', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_pages_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__pages_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_board_members_guild_year" AS ENUM('1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_boards_year" AS ENUM('1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_footer_blocks_link_row_links_icon" AS ENUM('AtSign', 'Banknote', 'BookMarked', 'ChevronDown', 'ChevronUp', 'ChevronsUpDown', 'Circle', 'Clock', 'ExternalLink', 'File', 'Facebook', 'Github', 'HelpCircle', 'Image', 'Inbox', 'Instagram', 'Languages', 'Linkedin', 'MapPin', 'Menu', 'Telegram', 'TikLogo', 'Tiktok', 'X');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_footer_blocks_link_row_links_link_type" AS ENUM('external', 'internal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_main_navigation_items_type" AS ENUM('page', 'topic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_main_navigation_items_topic_config_categories_external_links_icon" AS ENUM('AtSign', 'Banknote', 'BookMarked', 'ChevronDown', 'ChevronUp', 'ChevronsUpDown', 'Circle', 'Clock', 'ExternalLink', 'File', 'Facebook', 'Github', 'HelpCircle', 'Image', 'Inbox', 'Instagram', 'Languages', 'Linkedin', 'MapPin', 'Menu', 'Telegram', 'TikLogo', 'Tiktok', 'X');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"sub" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"enable_a_p_i_key" boolean,
	"api_key" varchar,
	"api_key_index" varchar,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" varchar,
	"hidden" boolean,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status"
);

CREATE TABLE IF NOT EXISTS "pages_locales" (
	"title" varchar,
	"description" varchar,
	"content" jsonb,
	"slug" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "pages_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "pages_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"topics_id" integer
);

CREATE TABLE IF NOT EXISTS "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_path" varchar,
	"version_hidden" boolean,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
);

CREATE TABLE IF NOT EXISTS "_pages_v_locales" (
	"version_title" varchar,
	"version_description" varchar,
	"version_content" jsonb,
	"version_slug" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "_pages_v_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"topics_id" integer
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric
);

CREATE TABLE IF NOT EXISTS "media_locales" (
	"alt" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "media_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "topics_locales" (
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "topics_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "board_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"guildYear" "enum_board_members_guild_year" NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"telegram" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "board_members_locales" (
	"title" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "board_members_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "board_members_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "boards_board_members" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" "enum_boards_year" NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "boards_locales" (
	"description" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "boards_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "boards_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer,
	"board_members_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "footer_blocks_link_row_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_footer_blocks_link_row_links_icon" NOT NULL,
	"linkType" "enum_footer_blocks_link_row_links_link_type",
	"url" varchar
);

CREATE TABLE IF NOT EXISTS "footer_blocks_link_row_links_locales" (
	"label" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL,
	CONSTRAINT "footer_blocks_link_row_links_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "footer_blocks_link_row" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"show_label" boolean NOT NULL,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "footer_blocks_logo_row_logos" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "footer_blocks_logo_row" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "footer" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "footer_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "landing_page_hero_images" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "landing_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "landing_page_locales" (
	"hero_text" varchar NOT NULL,
	"body" jsonb NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "landing_page_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "landing_page_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "main_navigation_items_topic_config_categories_pages" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "main_navigation_items_topic_config_categories_external_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"href" varchar,
	"icon" "enum_main_navigation_items_topic_config_categories_external_links_icon"
);

CREATE TABLE IF NOT EXISTS "main_navigation_items_topic_config_categories_external_links_locales" (
	"title" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL,
	CONSTRAINT "main_navigation_items_topic_config_categories_external_links_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "main_navigation_items_topic_config_categories" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "main_navigation_items_topic_config_categories_locales" (
	"title" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL,
	CONSTRAINT "main_navigation_items_topic_config_categories_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "main_navigation_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "enum_main_navigation_items_type"
);

CREATE TABLE IF NOT EXISTS "main_navigation" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "main_navigation_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"topics_id" integer
);

CREATE INDEX IF NOT EXISTS "created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "pages" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "pages_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "pages_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "pages_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "_pages_v" ("created_at");
CREATE INDEX IF NOT EXISTS "updated_at_idx" ON "_pages_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "latest_idx" ON "_pages_v" ("latest");
CREATE INDEX IF NOT EXISTS "autosave_idx" ON "_pages_v" ("autosave");
CREATE INDEX IF NOT EXISTS "order_idx" ON "_pages_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "_pages_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "_pages_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "filename_idx" ON "media" ("filename");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "topics" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "board_members" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "board_members_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "board_members_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "board_members_rels" ("path");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "boards_board_members" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "boards_board_members" ("_parent_id");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "boards" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "boards_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "boards_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "boards_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_migrations" ("created_at");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "footer_blocks_link_row_links" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "footer_blocks_link_row_links" ("_parent_id");
CREATE INDEX IF NOT EXISTS "order_idx" ON "footer_blocks_link_row" ("_order");
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "footer_blocks_link_row" ("_parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "footer_blocks_link_row" ("_path");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "footer_blocks_logo_row_logos" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "footer_blocks_logo_row_logos" ("_parent_id");
CREATE INDEX IF NOT EXISTS "order_idx" ON "footer_blocks_logo_row" ("_order");
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "footer_blocks_logo_row" ("_parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "footer_blocks_logo_row" ("_path");
CREATE INDEX IF NOT EXISTS "order_idx" ON "footer_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "footer_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "footer_rels" ("path");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "landing_page_hero_images" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "landing_page_hero_images" ("_parent_id");
CREATE INDEX IF NOT EXISTS "order_idx" ON "landing_page_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "landing_page_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "landing_page_rels" ("path");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "main_navigation_items_topic_config_categories_pages" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "main_navigation_items_topic_config_categories_pages" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "main_navigation_items_topic_config_categories_external_links" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "main_navigation_items_topic_config_categories_external_links" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "main_navigation_items_topic_config_categories" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "main_navigation_items_topic_config_categories" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_order_idx" ON "main_navigation_items" ("_order");
CREATE INDEX IF NOT EXISTS "_parent_id_idx" ON "main_navigation_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "order_idx" ON "main_navigation_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "main_navigation_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "main_navigation_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales__parent_id_pages_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_topics_id_topics_id_fk" FOREIGN KEY ("topics_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales__parent_id__pages_v_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_id__pages_v_id_fk" FOREIGN KEY ("parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_id_pages_id_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_topics_id_topics_id_fk" FOREIGN KEY ("topics_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales__parent_id_media_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "topics_locales" ADD CONSTRAINT "topics_locales__parent_id_topics_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "board_members_locales" ADD CONSTRAINT "board_members_locales__parent_id_board_members_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "board_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "board_members_rels" ADD CONSTRAINT "board_members_rels_parent_id_board_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "board_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "board_members_rels" ADD CONSTRAINT "board_members_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "boards_board_members" ADD CONSTRAINT "boards_board_members__parent_id_boards_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "boards_locales" ADD CONSTRAINT "boards_locales__parent_id_boards_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "boards_rels" ADD CONSTRAINT "boards_rels_parent_id_boards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "boards_rels" ADD CONSTRAINT "boards_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "boards_rels" ADD CONSTRAINT "boards_rels_board_members_id_board_members_id_fk" FOREIGN KEY ("board_members_id") REFERENCES "board_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_id_payload_preferences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_blocks_link_row_links" ADD CONSTRAINT "footer_blocks_link_row_links__parent_id_footer_blocks_link_row_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "footer_blocks_link_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_blocks_link_row_links_locales" ADD CONSTRAINT "footer_blocks_link_row_links_locales__parent_id_footer_blocks_link_row_links_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "footer_blocks_link_row_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_blocks_link_row" ADD CONSTRAINT "footer_blocks_link_row__parent_id_footer_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "footer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_blocks_logo_row_logos" ADD CONSTRAINT "footer_blocks_logo_row_logos__parent_id_footer_blocks_logo_row_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "footer_blocks_logo_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_blocks_logo_row" ADD CONSTRAINT "footer_blocks_logo_row__parent_id_footer_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "footer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_id_footer_id_fk" FOREIGN KEY ("parent_id") REFERENCES "footer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_id_pages_id_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "landing_page_hero_images" ADD CONSTRAINT "landing_page_hero_images__parent_id_landing_page_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "landing_page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "landing_page_locales" ADD CONSTRAINT "landing_page_locales__parent_id_landing_page_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "landing_page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_parent_id_landing_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "landing_page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items_topic_config_categories_pages" ADD CONSTRAINT "main_navigation_items_topic_config_categories_pages__parent_id_main_navigation_items_topic_config_categories_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation_items_topic_config_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items_topic_config_categories_external_links" ADD CONSTRAINT "main_navigation_items_topic_config_categories_external_links__parent_id_main_navigation_items_topic_config_categories_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation_items_topic_config_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items_topic_config_categories_external_links_locales" ADD CONSTRAINT "main_navigation_items_topic_config_categories_external_links_locales__parent_id_main_navigation_items_topic_config_categories_external_links_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation_items_topic_config_categories_external_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items_topic_config_categories" ADD CONSTRAINT "main_navigation_items_topic_config_categories__parent_id_main_navigation_items_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items_topic_config_categories_locales" ADD CONSTRAINT "main_navigation_items_topic_config_categories_locales__parent_id_main_navigation_items_topic_config_categories_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation_items_topic_config_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items__parent_id_main_navigation_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "main_navigation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_parent_id_main_navigation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "main_navigation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_pages_id_pages_id_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_topics_id_topics_id_fk" FOREIGN KEY ("topics_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "users";
DROP TABLE "pages";
DROP TABLE "pages_locales";
DROP TABLE "pages_rels";
DROP TABLE "_pages_v";
DROP TABLE "_pages_v_locales";
DROP TABLE "_pages_v_rels";
DROP TABLE "media";
DROP TABLE "media_locales";
DROP TABLE "topics";
DROP TABLE "topics_locales";
DROP TABLE "board_members";
DROP TABLE "board_members_locales";
DROP TABLE "board_members_rels";
DROP TABLE "boards_board_members";
DROP TABLE "boards";
DROP TABLE "boards_locales";
DROP TABLE "boards_rels";
DROP TABLE "payload_preferences";
DROP TABLE "payload_preferences_rels";
DROP TABLE "payload_migrations";
DROP TABLE "footer_blocks_link_row_links";
DROP TABLE "footer_blocks_link_row_links_locales";
DROP TABLE "footer_blocks_link_row";
DROP TABLE "footer_blocks_logo_row_logos";
DROP TABLE "footer_blocks_logo_row";
DROP TABLE "footer";
DROP TABLE "footer_rels";
DROP TABLE "landing_page_hero_images";
DROP TABLE "landing_page";
DROP TABLE "landing_page_locales";
DROP TABLE "landing_page_rels";
DROP TABLE "main_navigation_items_topic_config_categories_pages";
DROP TABLE "main_navigation_items_topic_config_categories_external_links";
DROP TABLE "main_navigation_items_topic_config_categories_external_links_locales";
DROP TABLE "main_navigation_items_topic_config_categories";
DROP TABLE "main_navigation_items_topic_config_categories_locales";
DROP TABLE "main_navigation_items";
DROP TABLE "main_navigation";
DROP TABLE "main_navigation_rels";`);

};
