import type {
  AfterChangeHook,
  TypeWithID,
} from "payload/dist/collections/config/types";
import type { PayloadRequest } from "payload/types";

// revalidate the page in the background, so the user doesn't have to wait
// notice that the hook itself is not async and we are not awaiting `revalidate`
// only revalidate existing docs that are published (not drafts)
export function revalidatePage<T extends TypeWithID>(
  collectionSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- is needed for promise
  getFetchData: (doc: T, req: PayloadRequest) => Promise<unknown> | unknown,
): AfterChangeHook<T> {
  return ({ doc, req, operation }): T => {
    const isPage = collectionSlug === "pages";
    const isPublished = "_status" in doc && doc._status === "published";
    if (isPage && (operation !== "update" || !isPublished)) {
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
        const fetchData = JSON.stringify(await getFetchData(doc, req));
        const fetchUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""}/next_api/revalidate-page?${new URLSearchParams(
          {
            secret: encodeURIComponent(revalidationKey),
            collection: encodeURIComponent(collectionSlug),
            fetchData: encodeURIComponent(fetchData),
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
          req.payload.logger.info(
            `Revalidated collection ${collectionSlug} with data ${fetchData}`,
          );
        } else {
          req.payload.logger.error(
            `Error revalidating collection ${collectionSlug} with data ${fetchData}`,
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
