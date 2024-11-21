import type { Config } from "@tietokilta/cms-types/payload";
import type {
  AfterChangeHook,
  TypeWithID,
} from "payload/dist/collections/config/types";

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
): AfterChangeHook<T> {
  return ({ doc, req }): T => {
    const isPage = collectionSlug === "pages";
    const isPublished = "_status" in doc && doc._status === "published";
    if (isPage && !isPublished) {
      req.payload.logger.info(
        `Not revalidating collection page because it's not published or not an update`,
      );
      return doc;
    }

    const revalidationKey = process.env.PAYLOAD_REVALIDATION_KEY;
    if (!revalidationKey) {
      req.payload.logger.error(
        "PAYLOAD_REVALIDATION_KEY not set, cannot revalidate",
      );
      return doc;
    }

    const revalidate = async (): Promise<void> => {
      try {
        const fetchUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""}/next_api/revalidate-collection?${new URLSearchParams(
          {
            secret: encodeURIComponent(revalidationKey),
            collectionSlug: encodeURIComponent(collectionSlug),
          },
        ).toString()}`;
        req.payload.logger.info(
          `sending revalidate request ${fetchUrl.replace(revalidationKey, "REDACTED")}`,
        );
        const res = await fetch(fetchUrl, { method: "POST" });
        if (res.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- is ok
          const thing = await res.json();
          req.payload.logger.info(
            `revalidate response ${JSON.stringify(thing)}`,
          );
          req.payload.logger.info(`Revalidated collection ${collectionSlug}`);
        } else {
          req.payload.logger.error(
            `Error revalidating collection ${collectionSlug}`,
          );
        }
      } catch (err: unknown) {
        req.payload.logger.error(
          `Error hitting revalidate collection ${collectionSlug}`,
        );
        req.payload.logger.error(err);
      }
    };

    void revalidate();

    return doc;
  };
}
