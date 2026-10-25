import { revalidateTag } from "next/cache";

/**
 * Named profiles like "default" only mark the data stale, so the next render
 * may still show the old data while it is refreshed in the background. `updateTag`
 * would expire it immediately, but it only works in Server Actions, and
 * Payload hooks run in a Route Handler.
 */
export function expireTag(tag: string) {
  revalidateTag(tag, { expire: 0 });
}
