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
        try {
          const fetchData = JSON.stringify(await getFetchData(doc, req));
          const res = await fetch(
            `${
              process.env.PUBLIC_FRONTEND_URL
            }/api/revalidate?${new URLSearchParams({
              secret: process.env.PAYLOAD_REVALIDATION_KEY ?? "",
              collection,
              fetchData,
            }).toString()}`,
          );
          if (res.ok) {
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
