import { draftMode, headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("No URL provided", { status: 404 });
  }
  const headers = await nextHeaders();
  const payload = await getPayload({ config });
  const userRes = await payload.auth({ headers });

  if (!userRes.user) {
    (await draftMode()).disable();
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  (await draftMode()).enable();

  redirect(url);
}
