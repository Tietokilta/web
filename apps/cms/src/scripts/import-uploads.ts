#!/usr/bin/env bun
/* eslint-disable no-console -- this is a script */
import path from "path";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import payloadInit from "payload";
import dotenv from "dotenv";
import config from "../payload.config";

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

const { PAYLOAD_SECRET, PUBLIC_PRODUCTION_URL } = process.env;
if (!PAYLOAD_SECRET) {
  throw Error("PAYLOAD_SECRET NOT SET, exiting");
}
if (!PUBLIC_PRODUCTION_URL) {
  throw Error("PUBLIC_PRODUCTION_URL NOT SET, exiting");
}
const supportedCollections = ["media", "documents"] as const;
type SupportedCollection = (typeof supportedCollections)[number];
const helpText = `usage: ${process.argv[1]} [<upload-collection-name>...]\n\ncurrently supported collections: ${supportedCollections.join(", ")}`;
if (["-h", "--help"].includes(process.argv[2])) {
  console.log(helpText);
  process.exit();
}
const collectionsToImport = process.argv
  .slice(2)
  .filter((c): c is SupportedCollection => {
    if (!supportedCollections.includes(c as SupportedCollection)) {
      throw Error(
        `incorrect collection name ${c}, supported collection names: ${supportedCollections.join(", ")}`,
      );
    }
    return true;
  });
if (collectionsToImport.length === 0) {
  throw Error(`no collection provided, expected ${helpText}`);
}

const importUploads = async (): Promise<void> => {
  // stupid hack because of stupidness https://github.com/payloadcms/payload/issues/5282
  const shouldCreateAndDeletePayloadConfigFile =
    !existsSync("payload.config.ts");
  if (shouldCreateAndDeletePayloadConfigFile) {
    writeFileSync("payload.config.ts", "");
  }
  const payload = await payloadInit.init({
    config,
    secret: PAYLOAD_SECRET,
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });
  async function syncUploadCollectionUploads(
    collection: "media" | "documents",
    prodUrl: string,
  ): Promise<void> {
    const itemType = collection === "documents" ? "document" : "media";
    const items = await payload.find({
      collection,
      pagination: false,
    });
    const missingItems = [];
    for (const item of items.docs) {
      console.log(item.filename);
      if (item.url) {
        const itemPath = path.resolve(__dirname, `../../uploads/${item.url}`);
        if (!existsSync(itemPath)) {
          console.log(`${itemType} missing!`);
          const itemWebsiteUrl = prodUrl + item.url;
          missingItems.push({
            itemPath,
            item,
            itemWebsiteUrl,
          });
        }
      }
    }
    if (missingItems.length !== 0) {
      console.log(
        `found ${missingItems.length.toFixed()} missing ${collection}, starting fetching from ${prodUrl}`,
      );
    }
    for (const { item, itemPath, itemWebsiteUrl } of missingItems) {
      console.log(
        `trying to fetch ${item.filename ?? `unknown ${itemType}`} from ${itemWebsiteUrl}`,
      );
      const itemFromMainWebsite = await fetch(itemWebsiteUrl);
      if (itemFromMainWebsite.ok) {
        console.log(`fetch OK, writing to ${itemPath}`);
        writeFileSync(itemPath, await itemFromMainWebsite.bytes());
      } else {
        console.log(`error fetching, ${itemFromMainWebsite.statusText}`);
      }
    }
  }
  for (const collection of collectionsToImport) {
    await syncUploadCollectionUploads(collection, PUBLIC_PRODUCTION_URL);
  }

  if (shouldCreateAndDeletePayloadConfigFile) {
    unlinkSync("payload.config.ts");
  }
  process.exit();
};

void importUploads();
