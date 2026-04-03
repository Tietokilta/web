// revalidate the page in the background, so the user doesn't have to wait
// notice that the hook itself is not async and we are not awaiting `revalidate`

import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

// only revalidate existing docs that are published (not drafts)
export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  global,
  req,
}) => {
  req.payload.logger.info(`revalidating ${global.slug}`);
  revalidateTag(`global-${global.slug}`, "default");
  revalidatePath("/[locale]", "layout");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ¯\_(ツ)_/¯
  return doc;
};
