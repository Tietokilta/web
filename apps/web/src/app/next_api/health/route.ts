import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// this is here for CDN probePath
export function GET(_: NextRequest): NextResponse {
  return NextResponse.json(
    {
      status: "ok",
    },
    {
      status: 200,
    },
  );
}
