// Bust the landing-page caches whenever any news item changes.

import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";
import { expireTag } from "./expire-tag";

export const revalidateLandingPageAnnouncement: CollectionAfterChangeHook = ({
  doc,
  req,
}) => {
  req.payload.logger.info("revalidating landing-page announcement");
  expireTag("global-landing-page");
  revalidatePath("/[locale]", "layout");

  return doc;
};
