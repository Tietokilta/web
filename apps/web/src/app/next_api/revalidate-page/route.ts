import stringify from "json-stable-stringify";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// this endpoint will revalidate a page by tag or path
// this is to achieve on-demand revalidation of pages that use this data
// send either `collection` and `slug` or `revalidatePath` as query params
export function POST(request: NextRequest): NextResponse {
  const collection = decodeURIComponent(
    request.nextUrl.searchParams.get("collection") ?? "",
  );
  const fetchData = decodeURIComponent(
    request.nextUrl.searchParams.get("fetchData") ?? "",
  );
  const secret = decodeURIComponent(
    request.nextUrl.searchParams.get("secret") ?? "",
  );

  if (secret !== process.env.NEXT_REVALIDATION_KEY) {
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("invalid secret from revalidate request: ", secret);
    return NextResponse.json(
      { revalidated: false, now: Date.now() },
      { status: 401 },
    );
  }

  if (typeof collection === "string" && typeof fetchData === "string") {
    const tagToRevalidate = `get_/api/${collection}_${stringify(JSON.parse(fetchData))}`;
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("revalidating tag: ", tagToRevalidate);
    revalidateTag(tagToRevalidate);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
  // eslint-disable-next-line no-console -- for debugging purposes
  console.log(
    "invalid collection or fetchData from revalidate request: ",
    collection,
    fetchData,
  );
  return NextResponse.json({ revalidated: false, now: Date.now() });
}
