import { type NextRequest } from "next/server";
import { fetchEvents } from "../../../lib/api/external/ilmomasiina";
import { createEvents } from "../../../lib/ics";

/**
 * Return all events in ICS format
 */
export async function GET(request: NextRequest) {
  const events = await fetchEvents();

  // Set the host to the one in the request headers
  // We trust the middleware to set the host header correctly in Azure
  // See https://github.com/vercel/next.js/issues/37536#issuecomment-1157000990
  request.nextUrl.host = request.headers.get("Host") ?? request.nextUrl.host;
  const host = request.nextUrl.host;
  const origin = request.nextUrl.origin;

  if (!events.ok) {
    return new Response("Failed to fetch events", { status: 500 });
  }

  const icsEvents = createEvents(events.data, { host, origin });

  return new Response(icsEvents, {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
