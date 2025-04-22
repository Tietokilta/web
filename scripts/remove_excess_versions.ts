#!/usr/bin/env bun
import assert from "assert";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const generatedDBDir = path.resolve(__dirname, "../data/gen/db");
const versionedCollections = [];
const VERSION_COLLECTION_PREFIX = "_";
const VERSION_COLLECTION_SUFFIX = "_versions.json";
type CollectionItem = {
  _id: {
    $oid: string;
  };
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  _status: string;
  title: {
    fi: string;
  };
};
type VersionCollectionItem = {
  parent: string;
  latest: boolean;
  autosave: boolean;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  version: {
    _status: string;
  };
};
for (const entry of readdirSync(generatedDBDir)) {
  console.log(entry);
  if (
    entry.startsWith(VERSION_COLLECTION_PREFIX) &&
    entry.endsWith(VERSION_COLLECTION_SUFFIX)
  ) {
    const collectionName = entry.slice(
      VERSION_COLLECTION_PREFIX.length,
      entry.length - VERSION_COLLECTION_SUFFIX.length,
    );
    console.log("found versioned collection " + collectionName);
    versionedCollections.push(collectionName);
  }
}
for (const versionedCollectionName of versionedCollections) {
  console.log("parsing " + versionedCollectionName);
  const actualCollection = JSON.parse(
    readFileSync(
      path.resolve(generatedDBDir, versionedCollectionName + ".json"),
    ).toString(),
  ) as CollectionItem[];
  const versionCollectionFilePath = path.resolve(
    generatedDBDir,
    VERSION_COLLECTION_PREFIX +
      versionedCollectionName +
      VERSION_COLLECTION_SUFFIX,
  );
  const versionCollection = JSON.parse(
    readFileSync(versionCollectionFilePath).toString(),
  ) as VersionCollectionItem[];
  console.log(actualCollection.length, "entries");
  console.log(versionCollection.length, "versions");
  const versionsGrouped = Object.groupBy(
    versionCollection,
    (item: VersionCollectionItem) => item.parent,
  );
  const versionsToSave = [];
  for (const collectionItem of actualCollection) {
    console.log("parsing ", collectionItem?.title?.fi ?? "Unknown title");
    const collectionVersions =
      versionsGrouped[collectionItem._id.$oid]?.toSorted((a, b) => {
        if (a.latest) {
          return -1;
        }
        if (b.latest) {
          return 1;
        }
        return (
          new Date(b.updatedAt.$date).valueOf() -
          new Date(a.updatedAt.$date).valueOf()
        );
      }) ?? [];
    const toSave = collectionVersions.splice(0, 1);
    const second = collectionVersions.find(
      (item) => item.version._status === item.version._status,
    );
    toSave.push(second ?? collectionVersions[0]);

    for (const version of toSave) {
      console.log({ ...version, version: undefined });
    }
    versionsToSave.push(...toSave.filter(Boolean));
  }
  assert(versionsToSave.length <= actualCollection.length * 2);
  console.log("rewriting " + versionCollectionFilePath);
  writeFileSync(versionCollectionFilePath, JSON.stringify(versionsToSave));
}
