#!/usr/bin/env tsx
/* eslint-disable no-console -- this is a script */
import path from "node:path";
import fs from "node:fs";
import payloadInit from "payload";
import dotenv from "dotenv";

const __dirname = import.meta.dirname;

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

const writeFile: typeof fs.writeFileSync = (filePath, data, options): void => {
  const dir =
    typeof filePath === "string"
      ? path.dirname(filePath)
      : path.dirname(filePath.toString());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, data, options);
};

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
  const payload = await payloadInit.init({
    config: (await import("../payload.config")).default,
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
        const itemPath = path.resolve(
          __dirname,
          `../../uploads/${decodeURI(item.url)}`,
        );
        if (!fs.existsSync(itemPath)) {
          console.log(`${itemType} missing!`);
          const itemWebsiteUrl = prodUrl + item.url;
          const legacyItemWebsiteUrl = `${prodUrl}/${collection}/${item.filename}`;
          missingItems.push({
            itemPath,
            item,
            itemWebsiteUrl,
            legacyItemWebsiteUrl,
          });
        }
      }
    }
    if (missingItems.length !== 0) {
      console.log(
        `found ${missingItems.length.toFixed()} missing ${collection}, starting fetching from ${prodUrl}`,
      );
    }
    for (const {
      item,
      itemPath,
      itemWebsiteUrl,
      legacyItemWebsiteUrl,
    } of missingItems) {
      console.log(
        `trying to fetch ${item.filename ?? `unknown ${itemType}`} from ${itemWebsiteUrl}`,
      );
      const itemFromMainWebsite = await fetch(itemWebsiteUrl);
      if (itemFromMainWebsite.ok) {
        console.log(`fetch OK, writing to ${itemPath}`);
        writeFile(itemPath, await itemFromMainWebsite.bytes());
      } else {
        console.log(`error fetching, ${itemFromMainWebsite.statusText}`);
        console.log(
          `trying to fetch ${item.filename ?? `unknown ${itemType}`} from ${legacyItemWebsiteUrl}`,
        );
        const itemFromMainWebsiteLegacy = await fetch(legacyItemWebsiteUrl);
        if (itemFromMainWebsiteLegacy.ok) {
          console.log(`fetch OK, writing to ${itemPath}`);
          writeFile(itemPath, await itemFromMainWebsiteLegacy.bytes());
        } else {
          console.log(
            `error fetching, ${itemFromMainWebsiteLegacy.statusText}`,
          );
        }
      }
    }
  }
  for (const collection of collectionsToImport) {
    await syncUploadCollectionUploads(collection, PUBLIC_PRODUCTION_URL);
  }

  process.exit();
};

void importUploads();
