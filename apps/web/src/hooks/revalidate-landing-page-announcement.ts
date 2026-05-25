// Bust the landing-page caches whenever any news item changes.

import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

export const revalidateLandingPageAnnouncement: CollectionAfterChangeHook = ({
  doc,
  req,
}) => {
  req.payload.logger.info("revalidating landing-page announcement");
  revalidateTag("global-landing-page", "default");
  revalidatePath("/[locale]", "layout");

  return doc;
};
