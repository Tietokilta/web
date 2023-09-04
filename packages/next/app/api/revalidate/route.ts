import { getSortedJSON } from "../../../api/fetcher";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// this endpoint will revalidate a page by tag or path
// this is to achieve on-demand revalidation of pages that use this data
// send either `collection` and `slug` or `revalidatePath` as query params
export function GET(request: NextRequest): NextResponse {
  const collection = request.nextUrl.searchParams.get("collection");
  const fetchData = request.nextUrl.searchParams.get("fetchData");
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.NEXT_PRIVATE_REVALIDATION_KEY) {
    return NextResponse.json({ revalidated: false, now: Date.now() });
  }

  if (typeof collection === "string" && typeof fetchData === "string") {
    revalidateTag(
      `get_/api/${collection}_${getSortedJSON(
        JSON.parse(fetchData) as Record<string, unknown>,
      )}`,
    );
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }

  return NextResponse.json({ revalidated: false, now: Date.now() });
}
