import {
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-mongodb";
import { migrateRelationshipsV2_V3 } from "@payloadcms/db-mongodb/migration-utils";

export async function up({
  payload,
  req,
  session,
}: MigrateUpArgs): Promise<void> {
  await migrateRelationshipsV2_V3({
    batchSize: 100,
    req,
  });
}

export async function down({
  payload,
  req,
  session,
}: MigrateDownArgs): Promise<void> {
  // Migration code
}
