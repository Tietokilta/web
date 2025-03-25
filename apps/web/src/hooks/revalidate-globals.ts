// revalidate the page in the background, so the user doesn't have to wait
// notice that the hook itself is not async and we are not awaiting `revalidate`

import type { GlobalAfterChangeHook } from "payload";

// only revalidate existing docs that are published (not drafts)
export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  req,
  global,
}) => {
  const revalidate = async (): Promise<void> => {
    const revalidationKey = process.env.PAYLOAD_REVALIDATION_KEY;
    if (!revalidationKey) {
      req.payload.logger.error(
        "PAYLOAD_REVALIDATION_KEY not set, cannot revalidate",
      );
      return;
    }
    try {
      const fetchUrl = `${
        process.env.PUBLIC_FRONTEND_URL ?? ""
      }/next_api/revalidate-global?${new URLSearchParams({
        secret: encodeURIComponent(revalidationKey),
        globalSlug: encodeURIComponent(global.slug),
      }).toString()}`;
      req.payload.logger.info(
        `sending revalidate request ${fetchUrl.replace(revalidationKey, "REDACTED")}`,
      );
      const res = await fetch(fetchUrl, { method: "POST" });
      if (res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- is ok trust me bro
        const thing = await res.json();
        req.payload.logger.info(`revalidate response ${JSON.stringify(thing)}`);
        req.payload.logger.info(`Revalidated global ${global.slug}`);
      } else {
        req.payload.logger.error(
          `Error revalidating collection ${global.slug}`,
        );
      }
    } catch (_) {
      req.payload.logger.error(
        `Error hitting revalidate collection ${global.slug}`,
      );
    }
  };

  void revalidate();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ¯\_(ツ)_/¯
  return doc;
};
