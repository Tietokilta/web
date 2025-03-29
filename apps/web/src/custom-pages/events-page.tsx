import Link from "next/link";
import { Button } from "@tietokilta/ui";
import type { IlmomasiinaEvent } from "../lib/api/external/ilmomasiina";
import {
  fetchEvents,
  fetchUpcomingEvents,
} from "../lib/api/external/ilmomasiina";
import { BackButton } from "../components/back-button";
import { getScopedI18n } from "../locales/server";
import { CalendarSubButton } from "../components/calendar-sub-button";
import EventCard from "../components/event-card";
import EventCalendar from "./event-calendar";

async function Calendar({ events }: { events: IlmomasiinaEvent[] }) {
  const t = await getScopedI18n("ilmomasiina");

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[40rem]">
        <EventCalendar events={events} />
      </div>
      <CalendarSubButton
        ctaText={t("Subscribe to calendar")}
        copyingText={t("Copying to clipboard")}
        copiedText={t("Copied to clipboard")}
      />
    </div>
  );
}

export default async function Page() {
  const t = await getScopedI18n("ilmomasiina");
  const ta = await getScopedI18n("action");
  const events = await fetchEvents();
  const upcomingEvents = await fetchUpcomingEvents();

  if (!events.ok || !upcomingEvents.ok) {
    // eslint-disable-next-line no-console -- nice to know
    console.warn("Failed to fetch events from Ilmomasiina", events.error);
    throw new Error("Failed to fetch events from Ilmomasiina");
  }

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton>{ta("Back")}</BackButton>
          <h1 className="font-mono text-4xl">{t("Events")}</h1>
          <Calendar events={events.data} />
          <ul className="space-y-8">
            {upcomingEvents.data.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </ul>
          <div className="flex justify-center">
            <Button>
              <Link href={t("path.all-events")}>{t("Browse old events")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
