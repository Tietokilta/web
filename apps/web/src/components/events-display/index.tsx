import { Button, ClockIcon, MapPinIcon } from "@tietokilta/ui";
import Link from "next/link";
import { Suspense } from "react";
import type { IlmomasiinaEvent } from "../../lib/api/external/ilmomasiina";
import { fetchEvents } from "../../lib/api/external/ilmomasiina";

function EventListSkeleton() {
  return (
    <ul className="space-y-4">
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
      <li className="h-24 w-full animate-pulse rounded-md border-2 border-gray-300 bg-gray-100" />
    </ul>
  );
}

// TODO: better env handling since next.js doesn't have that built-in
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ideally would throw during build, but let's at least throw here if it's missing
const baseUrl = process.env.PUBLIC_ILMOMASIINA_URL!;

function EventItem({
  event,
  ilmolinkText,
  locale,
}: {
  event: IlmomasiinaEvent;
  ilmolinkText: string;
  locale: string;
}) {
  const date = new Date(event.date);

  // get date in format "su 12.2. klo 18"
  const formattedDate = new Intl.DateTimeFormat(`${locale}-FI`, {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  const eventUrl = `${baseUrl}/events/${event.slug}`;

  return (
    <li className="shadow-solid flex flex-col justify-between gap-4 rounded-md border-2 border-gray-900 p-4 font-mono text-gray-900 md:flex-row md:items-center">
      <div className="flex-grow-[2/3]">
        <span className="block text-pretty text-lg font-bold">
          {event.title}
        </span>
        <Button asChild className="hidden md:inline-flex" variant="link">
          <Link href={eventUrl}>{ilmolinkText}</Link>
        </Button>
      </div>
      <div className="shrink-0 flex-grow-[1/3] truncate font-medium">
        <span className="block truncate" title={formattedDate}>
          <ClockIcon className="mr-1 inline-block h-4 w-4" />
          {formattedDate}
        </span>
        {event.location ? (
          <span className="block truncate" title={event.location}>
            <MapPinIcon className="mr-1 inline-block h-4 w-4" />
            {event.location}
          </span>
        ) : null}
      </div>
      <Button asChild className="md:hidden" variant="link">
        <Link href={eventUrl}>{ilmolinkText}</Link>
      </Button>
    </li>
  );
}

async function EventList({
  ilmolinkText,
  locale,
}: {
  ilmolinkText: string;
  locale: string;
}) {
  const events = await fetchEvents();

  if (!events.ok) {
    console.warn("Failed to fetch events from Ilmomasiina", events.error);
    return null;
  }

  return (
    <ul className="space-y-4">
      {events.data.map((event) => (
        <EventItem
          event={event}
          ilmolinkText={ilmolinkText}
          key={event.id}
          locale={locale}
        />
      ))}
    </ul>
  );
}

export function EventsDisplay({
  ilmolinkText,
  ilmoheaderText,
  locale,
}: {
  ilmolinkText: string;
  ilmoheaderText: string;
  locale: string;
}) {
  return (
    <section className="space-y-4">
      <h3 className="font-mono text-2xl font-bold text-gray-900">
        {ilmoheaderText}
      </h3>
      <Suspense fallback={<EventListSkeleton />}>
        <EventList ilmolinkText={ilmolinkText} locale={locale} />
      </Suspense>
    </section>
  );
}
