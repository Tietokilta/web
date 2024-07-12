import {
  type MigrateUpArgs,
  type MigrateDownArgs,
} from "@payloadcms/db-mongodb";
import { type PayloadRequest } from "payload/types";
import { CommitteeMembers } from "../collections/committees/committee-members";
import { NewsItems } from "../collections/weekly-newsletters/news-items";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const req = {} as PayloadRequest;

  const committeeMembers = await payload.find({
    collection: CommitteeMembers.slug,
    pagination: false,
  });

  const newsItems = await payload.find({
    collection: NewsItems.slug,
    pagination: false,
  });

  for (const member of committeeMembers.docs) {
    await payload.update({
      collection: CommitteeMembers.slug,
      id: member.id,
      data: {
        displayTitle: `${member.name}, ${member.title}`,
      },
      req,
    });
  }

  for (const item of newsItems.docs) {
    const date = new Date(item.date ?? "");
    const displayTitle = isNaN(date.getTime())
      ? item.title
      : `${item.title} - ${date.toLocaleDateString("fi-FI")}`;
    await payload.update({
      collection: NewsItems.slug,
      id: item.id,
      data: {
        displayTitle,
      },
      req,
    });
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const req = {} as PayloadRequest;

  const committeeMembers = await payload.find({
    collection: CommitteeMembers.slug,
    pagination: false,
    req,
  });

  for (const member of committeeMembers.docs) {
    await payload.update({
      collection: CommitteeMembers.slug,
      id: member.id,
      data: {
        displayTitle: undefined,
      },
      req,
    });
  }

  const newsItems = await payload.find({
    collection: NewsItems.slug,
    pagination: false,
    req,
  });

  for (const item of newsItems.docs) {
    await payload.update({
      collection: NewsItems.slug,
      id: item.id,
      data: {
        displayTitle: undefined,
      },
      req,
    });
  }
}
