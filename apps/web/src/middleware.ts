import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  return NextResponse.redirect(
    new URL(`/fi/${request.nextUrl.pathname}`, request.url),
  );
}
export const config = {
  matcher: ["/((?!_next|api|media|admin|fi|en).*)"],
};
