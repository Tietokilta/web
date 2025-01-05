import { draftMode } from "next/headers";

export async function GET(): Promise<Response> {
  (await draftMode()).disable();
  return new Response("Draft mode is disabled");
}
