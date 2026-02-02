import Link from "next/link";
import { Button } from "@tietokilta/ui";
import { type UserEventListResponse } from "@tietokilta/ilmomasiina-models";
import { getMessages } from "next-intl/server";
import {
  fetchEvents,
  fetchUpcomingEvents,
} from "../lib/api/external/ilmomasiina";
import { BackButton } from "../components/back-button";
import { getLocale, getTranslations } from "../locales/server";
import { NextIntlClientProvider } from "../locales/client";
import { CalendarSubButton } from "../components/calendar-sub-button";
import EventCard from "../components/event-card";
import EventCalendar from "./event-calendar";

async function Calendar({ events }: { events: UserEventListResponse }) {
  const t = await getTranslations("ilmomasiina");
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <div className="flex flex-col gap-2">
      <div className="h-160">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <EventCalendar events={events} />
        </NextIntlClientProvider>
      </div>
      <CalendarSubButton
        locale={locale}
        ctaText={t("Subscribe to calendar")}
        copyingText={t("Copying to clipboard")}
        copiedText={t("Copied to clipboard")}
      />
    </div>
  );
}

export default async function Page() {
  const tAction = await getTranslations("action");
  const tIlmo = await getTranslations("ilmomasiina");
  const tPath = await getTranslations("ilmomasiina.path");
  const locale = await getLocale();
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
          <BackButton>{tAction("Back")}</BackButton>
          <h1 className="font-mono text-4xl hyphens-auto">{tIlmo("Events")}</h1>
          <Calendar events={events.data} />
          <ul className="space-y-8">
            {upcomingEvents.data.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </ul>
          <div className="flex justify-center">
            <Button asChild>
              <Link href={tPath("all-events")} className="block">
                {tIlmo("Browse old events")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
