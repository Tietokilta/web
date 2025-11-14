import { Button, ClockIcon, MapPinIcon } from "@tietokilta/ui";
import Link from "next/link";
import { Suspense } from "react";
import { chunk } from "remeda";
import { notFound } from "next/navigation";
import { type UserEventListItem } from "@tietokilta/ilmomasiina-models";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import { fetchUpcomingEvents } from "../../lib/api/external/ilmomasiina";
import { getCurrentLocale, getI18n } from "../../locales/server";
import { formatDateTime, formatDateTimeOptions, cn } from "../../lib/utils";
import { DateTime } from "../datetime";

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
  const locale = await getCurrentLocale();
  const t = await getI18n();

  const eventUrl = `/${locale}/${t("ilmomasiina.path.events")}/${event.slug}`;

  return (
    <li className="flex flex-col justify-between gap-4 rounded-md border-2 border-gray-900 p-4 font-mono text-gray-900 shadow-solid md:flex-row md:items-center">
      <div className="flex-1 shrink-0">
        <span className="block text-pretty text-lg font-bold">
          {event.title}
        </span>
        <Button asChild className="hidden md:inline-flex" variant="link">
          <Link href={eventUrl}>
            <span aria-hidden="true">{t("action.Read more")}</span>
            <span className="sr-only">
              {t("action.Read more about {something}", {
                something: event.title,
              })}
            </span>
          </Link>
        </Button>
      </div>
      <div className="flex shrink-0 flex-col font-medium md:w-2/5">
        {event.date ? (
          <time
            className="line-clamp-2 text-pretty pl-5"
            dateTime={event.date}
            // title={formatDateTime(event.date, locale)}
          >
            <ClockIcon className="-ml-5 mr-1 inline-block size-4" />
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
            className="line-clamp-3 text-pretty pl-5"
            title={event.location}
          >
            <MapPinIcon className="-ml-5 mr-1 inline-block size-4" />
            <span>{event.location}</span>
          </span>
        ) : null}
      </div>
      <Button asChild className="md:hidden" variant="link">
        <Link href={eventUrl}>
          <span aria-hidden="true">{t("action.Read more")}</span>
          <span className="sr-only">
            {t("action.Read more about {something}", {
              something: event.title,
            })}
          </span>
        </Link>
      </Button>
    </li>
  );
}

async function EventList({ currentPage = 1 }: { currentPage?: number }) {
  const locale = await getCurrentLocale();
  const upcomingEvents = await fetchUpcomingEvents(locale);
  const t = await getI18n();
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

  const paginatedEvents = chunk(eventsList, 5);
  const pageCount = paginatedEvents.length;

  if (pageCount !== 0 && (currentPage < 1 || currentPage > pageCount)) {
    return notFound();
  }

  return (
    <>
      <ul className="space-y-4">
        {paginatedEvents[currentPage - 1].map((event) => (
          <EventItem event={event} key={event.id} />
        ))}
      </ul>
      {pageCount > 1 ? (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 ? (
              <PaginationItem>
                <PaginationPrevious
                  href={`/${locale}/?page=${(currentPage - 1).toFixed()}`}
                  ariaLabel={t("action.Go to previous page")}
                >
                  {t("action.Back")}
                </PaginationPrevious>
              </PaginationItem>
            ) : null}
            {Array.from({ length: pageCount }, (__, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  href={`/${locale}/?page=${page.toFixed()}`}
                >
                  <span className="sr-only">{t("generic.Page")}</span>
                  <span>{page}</span>
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < pageCount ? (
              <PaginationItem>
                <PaginationNext
                  href={`/${locale}/?page=${(currentPage + 1).toFixed()}`}
                  ariaLabel={t("action.Go to next page")}
                >
                  {t("action.Next")}
                </PaginationNext>
              </PaginationItem>
            ) : null}
          </PaginationContent>
        </Pagination>
      ) : null}
    </>
  );
}

export async function EventsDisplay({
  eventsListPath,
  currentPage,
  systemSeven,
}: {
  eventsListPath?: string;
  currentPage?: number;
  systemSeven?: boolean;
}) {
  const locale = await getCurrentLocale();
  const t = await getI18n();
  return (
    <section className="space-y-4">
      <Link
        className="font-mono text-2xl font-bold text-gray-900 underline-offset-2 hover:underline"
        href={eventsListPath ?? `/${locale}/${t("ilmomasiina.path.events")}`}
      >
        <h2
          className={cn(
            "font-mono text-2xl font-bold text-gray-900",
            systemSeven && "glitch layers",
          )}
          data-text={t("heading.Upcoming events")}
        >
          {t("heading.Upcoming events")}
        </h2>
      </Link>

      <Suspense fallback={<EventListSkeleton />}>
        <EventList currentPage={currentPage} />
      </Suspense>
    </section>
  );
}
