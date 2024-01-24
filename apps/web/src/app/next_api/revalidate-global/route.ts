import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// this endpoint will revalidate a page by tag or path
// this is to achieve on-demand revalidation of pages that use this data
// send either `collection` and `slug` or `revalidatePath` as query params
export function POST(request: NextRequest): NextResponse {
  const global = decodeURIComponent(
    request.nextUrl.searchParams.get("global") ?? "",
  );
  const locale = decodeURIComponent(
    request.nextUrl.searchParams.get("locale") ?? "",
  );
  const secret = decodeURIComponent(
    request.nextUrl.searchParams.get("secret") ?? "",
  );

  if (secret !== process.env.NEXT_REVALIDATION_KEY) {
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("invalid secret from revalidate request: ", secret);
    return NextResponse.json({ revalidated: false, now: Date.now() });
  }

  if (typeof global === "string" && typeof locale === "string") {
    const tagToRevalidate = `getGlobal_/api/globals/${global}?locale=${locale}`;
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("revalidating tag: ", tagToRevalidate);
    revalidateTag(tagToRevalidate);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
  // eslint-disable-next-line no-console -- for debugging purposes
  console.log(
    "invalid collection or fetchData from revalidate request: ",
    global,
  );
  return NextResponse.json({ revalidated: false, now: Date.now() });
}
