import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/api")
  ) {
    const destination = new URL(process.env.PUBLIC_SERVER_URL || "");
    const url = request.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.pathname = pathname;
    return NextResponse.rewrite(url);
  }
  return NextResponse.redirect(
    new URL(`/fi/${request.nextUrl.pathname}`, request.url),
  );
}
export const config = {
  matcher: ["/((?!_next|fi|en).*)"],
};