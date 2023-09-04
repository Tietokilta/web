import { draftMode } from "next/headers";

export function GET(): Response {
  draftMode().disable();
  return new Response("Draft mode is disabled");
}
