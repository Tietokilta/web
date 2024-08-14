import { type NextRequest } from "next/server";
import { fetchEvents } from "../../../lib/api/external/ilmomasiina";
import { createEvents } from "../../../lib/ics";

/**
 * Return all events in ICS format
 */
export async function GET(request: NextRequest) {
  const events = await fetchEvents();

  const originUrl = request.nextUrl.origin;

  if (!events.ok) {
    return new Response("Failed to fetch events", { status: 500 });
  }

  const icsEvents = createEvents(events.data, { originUrl });

  return new Response(icsEvents, {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
