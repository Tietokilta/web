import type {
  AfterChangeHook,
  TypeWithID,
} from "payload/dist/collections/config/types";
import type { PayloadRequest } from "payload/types";

// revalidate the page in the background, so the user doesn't have to wait
// notice that the hook itself is not async and we are not awaiting `revalidate`
// only revalidate existing docs that are published (not drafts)
export const revalidatePage =
  <T extends TypeWithID>(
    collection: string,
    getFetchData: (doc: T, req: PayloadRequest) => Promise<unknown>,
  ): AfterChangeHook<T> =>
  ({ doc, req, operation }) => {
    if (
      operation === "update" &&
      (!("_status" in doc) || doc._status === "published")
    ) {
      const revalidate = async (): Promise<void> => {
        const revalidationKey = process.env.PAYLOAD_REVALIDATION_KEY;
        if (!revalidationKey) {
          req.payload.logger.error(
            "PAYLOAD_REVALIDATION_KEY not set, cannot revalidate",
          );
          return;
        }
        try {
          const fetchData = JSON.stringify(await getFetchData(doc, req));
          const fetchUrl = `${
            process.env.PUBLIC_FRONTEND_URL
          }/next_api/revalidate-page?${new URLSearchParams({
            secret: encodeURIComponent(revalidationKey),
            collection: encodeURIComponent(collection),
            fetchData: encodeURIComponent(fetchData),
          }).toString()}`;
          req.payload.logger.info(
            `sending revalidate request ${fetchUrl.replace(revalidationKey, "REDACTED")}`,
          );
          const res = await fetch(fetchUrl);
          if (res.ok) {
            const thing = await res.json();
            req.payload.logger.info(
              `revalidate response ${JSON.stringify(thing)}`,
            );
            req.payload.logger.info(
              `Revalidated collection ${collection} with data ${fetchData}`,
            );
          } else {
            req.payload.logger.error(
              `Error revalidating collection ${collection} with data ${fetchData}`,
            );
          }
        } catch (err: unknown) {
          req.payload.logger.error(
            `Error hitting revalidate collection ${collection}`,
          );
        }
      };

      void revalidate();
    }

    return doc;
  };
