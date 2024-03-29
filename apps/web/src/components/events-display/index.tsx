import { Button, ClockIcon, MapPinIcon } from "@tietokilta/ui";
import Link from "next/link";
import { Suspense } from "react";
import _ from "lodash";
import { notFound } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import type { IlmomasiinaEvent } from "../../lib/api/external/ilmomasiina";
import { fetchEvents } from "../../lib/api/external/ilmomasiina";
import { getCurrentLocale, getScopedI18n } from "../../locales/server";
import { formatDatetime } from "../../lib/utils";

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

async function EventItem({ event }: { event: IlmomasiinaEvent }) {
  const locale = getCurrentLocale();
  const t = await getScopedI18n("action");

  const eventUrl = `/${locale}/events/${event.slug}`;

  return (
    <li className="shadow-solid flex flex-col justify-between gap-4 rounded-md border-2 border-gray-900 p-4 font-mono text-gray-900 md:flex-row md:items-center">
      <div className="flex-1">
        <span className="block text-pretty text-lg font-bold">
          {event.title}
        </span>
        <Button asChild className="hidden md:inline-flex" variant="link">
          <Link href={eventUrl}>{t("Sign up")}</Link>
        </Button>
      </div>
      <div className="shrink-0 truncate font-medium">
        {event.date ? (
          <time
            className="block truncate"
            dateTime={event.date}
            title={formatDatetime(event.date, locale)}
          >
            <ClockIcon className="mr-1 inline-block h-4 w-4" />
            {formatDatetime(event.date, locale)}
          </time>
        ) : null}
        {event.location ? (
          <span className="block truncate" title={event.location}>
            <MapPinIcon className="mr-1 inline-block h-4 w-4" />
            {event.location}
          </span>
        ) : null}
      </div>
      <Button asChild className="md:hidden" variant="link">
        <Link href={eventUrl}>{t("Sign up")}</Link>
      </Button>
    </li>
  );
}

async function EventList({ currentPage = 1 }: { currentPage?: number }) {
  const events = await fetchEvents();

  if (!events.ok) {
    console.warn("Failed to fetch events from Ilmomasiina", events.error);
    return null;
  }

  const eventsList = events.data;
  const paginatedEvents = _.chunk(eventsList, 5);
  const pageCount = paginatedEvents.length;

  if (currentPage < 1 || currentPage > pageCount) {
    console.warn(`Invalid page number: ${currentPage.toFixed()}`);
    return notFound();
  }

  return (
    <>
      <ul className="space-y-4">
        {paginatedEvents[currentPage - 1].map((event) => (
          <EventItem event={event} key={event.id} />
        ))}
      </ul>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 ? (
            <PaginationItem>
              <PaginationPrevious
                href={`/?page=${(currentPage - 1).toFixed()}`}
              />
            </PaginationItem>
          ) : null}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                href={`/?page=${page.toFixed()}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < pageCount ? (
            <PaginationItem>
              <PaginationNext href={`/?page=${(currentPage + 1).toFixed()}`} />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      </Pagination>
    </>
  );
}

export async function EventsDisplay({ currentPage }: { currentPage?: number }) {
  const locale = getCurrentLocale();
  const t = await getScopedI18n("headings");
  return (
    <section className="space-y-4">
      <Link
        className="font-mono text-2xl font-bold text-gray-900 underline-offset-2 hover:underline"
        href={`/${locale}/events`}
      >
        <h3 className="font-mono text-2xl font-bold text-gray-900">
          {t("Upcoming events")}
        </h3>
      </Link>

      <Suspense fallback={<EventListSkeleton />}>
        <EventList currentPage={currentPage} />
      </Suspense>
    </section>
  );
}
