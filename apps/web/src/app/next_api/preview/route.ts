import { draftMode, headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@lib/api/payload";

/** The path to redirect to, or null if a browser would leave the site. */
function sitePath(url: string | null, base: URL): string | null {
  if (!url?.startsWith("/") || !URL.canParse(url, base)) return null;
  const target = new URL(url, base);
  if (target.origin !== base.origin) return null;
  const path = `${target.pathname}${target.search}${target.hash}`;
  // Check the path the browser receives: "//host", "/\host", "/\t/host" and
  // dot-segments like "/a/..//host" all lead to another site
  return URL.canParse(path, base) && new URL(path, base).origin === base.origin
    ? path
    : null;
}

export async function GET(req: Request): Promise<Response> {
  const base = new URL(req.url);
  const path = sitePath(base.searchParams.get("url"), base);
  if (!path) {
    return new Response("No URL provided", { status: 404 });
  }
  const headers = await nextHeaders();
  const payload = await getPayloadClient();
  const userRes = await payload.auth({ headers });

  if (!userRes.user) {
    (await draftMode()).disable();
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  (await draftMode()).enable();

  redirect(path);
}
