import Link from "next/link";
import { Button } from "@tietokilta/ui";
import { type UserEventListResponse } from "@tietokilta/ilmomasiina-models";
import {
  fetchEvents,
  fetchUpcomingEvents,
} from "../lib/api/external/ilmomasiina";
import { BackButton } from "../components/back-button";
import { getCurrentLocale, getScopedI18n } from "../locales/server";
import { CalendarSubButton } from "../components/calendar-sub-button";
import EventCard from "../components/event-card";
import EventCalendar from "./event-calendar";

async function Calendar({ events }: { events: UserEventListResponse }) {
  const t = await getScopedI18n("ilmomasiina");
  const locale = await getCurrentLocale();

  return (
    <div className="flex flex-col gap-2">
      <div className="h-160">
        <EventCalendar events={events} />
      </div>
      <CalendarSubButton
        locale={locale}
        ctaText={t("Tilaa kalenteri")}
        copyingText={t("Kopioidaan leikepöydälle")}
        copiedText={t("Kopioitu leikepöydälle")}
      />
    </div>
  );
}

export default async function Page() {
  const t = await getScopedI18n("ilmomasiina");
  const ta = await getScopedI18n("action");
  const locale = await getCurrentLocale();
  // Use maxAge to fetch historical events (180 days is the maximum for default Ilmomasiina config)
  // This allows past events to show in the calendar for a while
  const maxAge = 180; // days
  const events = await fetchEvents(locale, maxAge);
  const upcomingEvents = await fetchUpcomingEvents(locale);

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
          <h1 className="font-mono text-4xl">{t("Tapahtumat")}</h1>
          <Calendar events={events.data} />
          <ul className="space-y-8">
            {upcomingEvents.data.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </ul>
          <div className="flex justify-center">
            <Button asChild>
              <Link href={t("path.all-events")} className="block">
                {t("Selaa vanhoja tapahtumia")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
