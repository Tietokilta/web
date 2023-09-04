import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(
  req: Request & {
    cookies: {
      get: (name: string) => {
        value: string;
      };
    };
  },
): Promise<Response> {
  const payloadToken = req.cookies.get("payload-token")?.value;
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("No URL provided", { status: 404 });
  }

  if (!payloadToken) {
    new Response("You are not allowed to preview this page", { status: 403 });
  }

  // validate the Payload token
  const userReq = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${payloadToken}`,
      },
    },
  );

  const userRes = (await userReq.json()) as { user?: unknown } | null;

  if (!userReq.ok || !userRes?.user) {
    draftMode().disable();
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  draftMode().enable();

  redirect(url);
}
