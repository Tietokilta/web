import { draftMode, headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@lib/api/payload";

export async function GET(req: Request): Promise<Response> {
  const base = new URL(req.url);
  const url = base.searchParams.get("url");
  // Resolve the path like a browser would: "//host", "/\host" and "/\t/host"
  // all lead to another site
  const target = url?.startsWith("/") ? new URL(url, base) : null;
  if (target?.origin !== base.origin) {
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

  redirect(`${target.pathname}${target.search}${target.hash}`);
}
