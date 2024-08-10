import { fetchEvents } from "../../../lib/api/external/ilmomasiina";
import { createEvents } from "../../../lib/ics";

/**
 * Return all events in ICS format
 */
export async function GET() {
  const events = await fetchEvents();

  if (!events.ok) {
    return new Response("Failed to fetch events", { status: 500 });
  }

  const icsEvents = createEvents(events.data);

  return new Response(icsEvents, {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
