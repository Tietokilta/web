import type { CollectionAfterChangeHook, TypeWithID } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Config } from "@payload-types";

type CollectionSlug = keyof Config["collections"];

/**
 * Revalidate the page in the background, so the user doesn't have to wait.
 *
 * Notice that the hook itself is not async and we are not awaiting `revalidate`.
 *
 * Only revalidate existing docs that are published (not drafts).
 */
export function revalidateCollection<T extends TypeWithID>(
  collectionSlug: CollectionSlug,
): CollectionAfterChangeHook<T> {
  return ({ doc, req }): T => {
    const isPage = collectionSlug === "pages";
    const isPublished = "_status" in doc && doc._status === "published";
    if (isPage && !isPublished) {
      req.payload.logger.info(
        `Not revalidating collection page because it's not published or not an update`,
      );
      return doc;
    }

    req.payload.logger.info(`revalidating ${collectionSlug}`);
    revalidateTag(`collection-${collectionSlug}`);
    if (collectionSlug !== "pages") {
      req.payload.logger.info(`revalidating pages`);
      revalidateTag("collection-pages");
    }
    revalidatePath("/[locale]/[...path]", "page");

    return doc;
  };
}
