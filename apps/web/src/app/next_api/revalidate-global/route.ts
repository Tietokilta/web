import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Revalidate a global and root layout.
 */
export function POST(request: NextRequest): NextResponse {
  const globalSlug = decodeURIComponent(
    request.nextUrl.searchParams.get("globalSlug") ?? "",
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

  if (typeof globalSlug !== "string") {
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log(
      "invalid collection or fetchData from revalidate request: ",
      global,
    );
    return NextResponse.json(
      { revalidated: false, now: Date.now() },
      {
        status: 400,
      },
    );
  }

  revalidateTag(`global-${globalSlug}`);
  revalidatePath("/[locale]", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
