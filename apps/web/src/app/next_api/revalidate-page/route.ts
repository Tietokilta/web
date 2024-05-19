import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Revalidate pages when a collection is updated.
 */
export function POST(request: NextRequest): NextResponse {
  const collectionSlug = decodeURIComponent(
    request.nextUrl.searchParams.get("collectionSlug") ?? "",
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

  if (typeof collectionSlug !== "string") {
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("invalid collection from revalidate request: ", collectionSlug);
    return NextResponse.json(
      { revalidated: false, now: Date.now() },
      { status: 400 },
    );
  }

  revalidateTag("collection-pages");
  revalidateTag(`collection-${collectionSlug}`);
  revalidatePath("/[locale]/[...path]", "page");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
