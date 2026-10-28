import { type UserEventListItem } from "@tietokilta/ilmomasiina-models";
import { Button, ClockIcon, MapPinIcon } from "@tietokilta/ui";
import Link from "next/link";
import { Suspense } from "react";
import { chunk } from "remeda";
import { fetchUpcomingEvents } from "../../lib/api/external/ilmomasiina";
import { formatDateTime, formatDateTimeOptions } from "../../lib/utils";
import { getLocale, getTranslations } from "../../locales/server";
import { DateTime } from "../datetime";
import { CurrentEventPage, EventPage } from "./event-pages";

function EventListSkeleton() {
  return (
    <ul className="space-y-4">
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
    </ul>
  );
}

async function EventItem({ event }: { event: UserEventListItem }) {
  const locale = await getLocale();
  const tAction = await getTranslations("action");
  const tPath = await getTranslations("ilmomasiina.path");

  const eventUrl = `/${locale}/${tPath("events")}/${event.slug}`;

  return (
    <li className="flex flex-col justify-between gap-4 rounded-md border-2 border-gray-900 p-4 font-mono text-gray-900 shadow-solid md:flex-row md:items-center">
      <div className="flex-1 shrink-0">
        <span className="block text-lg font-bold text-pretty">
          {event.title}
        </span>
        <Button asChild className="hidden md:inline-flex" variant="link">
          <Link href={eventUrl}>
            <span aria-hidden="true">{tAction("Read more")}</span>
            <span className="sr-only">
              {tAction("Read more about {something}", {
                something: event.title,
              })}
            </span>
          </Link>
        </Button>
      </div>
      <div className="flex shrink-0 flex-col font-medium md:w-2/5">
        {event.date ? (
          <time
            className="line-clamp-2 pl-5 text-pretty"
            dateTime={event.date}
            // title={formatDateTime(event.date, locale)}
          >
            <ClockIcon className="mr-1 -ml-5 inline-block size-4" />
            <DateTime
              as="span"
              rawDate={event.date}
              defaultFormattedDate={formatDateTime(event.date, locale)}
              formatOptions={formatDateTimeOptions}
            />
          </time>
        ) : null}
        {event.location ? (
          <span
            className="line-clamp-3 pl-5 text-pretty"
            title={event.location}
          >
            <MapPinIcon className="mr-1 -ml-5 inline-block size-4" />
            <span>{event.location}</span>
          </span>
        ) : null}
      </div>
      <Button asChild className="md:hidden" variant="link">
        <Link href={eventUrl}>
          <span aria-hidden="true">{tAction("Read more")}</span>
          <span className="sr-only">
            {tAction("Read more about {something}", {
              something: event.title,
            })}
          </span>
        </Link>
      </Button>
    </li>
  );
}

async function EventList() {
  const locale = await getLocale();
  const upcomingEvents = await fetchUpcomingEvents(locale);
  const tAction = await getTranslations("action");
  const tGeneric = await getTranslations("generic");
  if (!upcomingEvents.ok) {
    // eslint-disable-next-line no-console -- nice to know if something goes wrong
    console.warn(
      "Failed to fetch events from Ilmomasiina",
      upcomingEvents.error,
    );
    return null;
  }

  const eventsList = upcomingEvents.data;
  if (!eventsList.length) {
    return null;
  }

  const pageProps = {
    pages: chunk(eventsList, 5).map((events) => (
      <ul className="space-y-4" key={events[0].id}>
        {events.map((event) => (
          <EventItem event={event} key={event.id} />
        ))}
      </ul>
    )),
    locale,
    labels: {
      back: tAction("Back"),
      next: tAction("Next"),
      page: tGeneric("Page"),
      previousPage: tAction("Go to previous page"),
      nextPage: tAction("Go to next page"),
    },
  };

  // The cached page shows the first page until the browser reads the requested one
  return (
    <Suspense fallback={<EventPage {...pageProps} currentPage={1} />}>
      <CurrentEventPage {...pageProps} />
    </Suspense>
  );
}

export async function EventsDisplay({
  eventsListPath,
}: {
  eventsListPath?: string;
}) {
  const locale = await getLocale();
  const tHeading = await getTranslations("heading");
  const tPath = await getTranslations("ilmomasiina.path");
  return (
    <section className="space-y-4">
      <Link
        className="font-mono text-2xl font-bold text-gray-900 underline-offset-2 hover:underline"
        href={eventsListPath ?? `/${locale}/${tPath("events")}`}
      >
        <h2 className="font-mono text-2xl font-bold text-gray-900">
          {tHeading("Upcoming events")}
        </h2>
      </Link>

      <Suspense fallback={<EventListSkeleton />}>
        <EventList />
      </Suspense>
    </section>
  );
}
