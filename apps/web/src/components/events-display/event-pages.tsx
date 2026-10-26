"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

interface EventPagesProps {
  pages: ReactNode[];
  locale: string;
  labels: {
    back: string;
    next: string;
    previousPage: string;
    nextPage: string;
    page: string;
  };
}

function EventPage({
  pages,
  locale,
  labels,
  current,
}: EventPagesProps & { current: number }) {
  const href = (page: number) => `/${locale}/?page=${page.toFixed()}`;

  return (
    <>
      {pages[current - 1]}
      {pages.length > 1 ? (
        <Pagination>
          <PaginationContent>
            {current > 1 ? (
              <PaginationItem>
                <PaginationPrevious
                  href={href(current - 1)}
                  ariaLabel={labels.previousPage}
                >
                  {labels.back}
                </PaginationPrevious>
              </PaginationItem>
            ) : null}
            {pages.map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={i + 1 === current} href={href(i + 1)}>
                  <span className="sr-only">{labels.page}</span>
                  <span>{i + 1}</span>
                </PaginationLink>
              </PaginationItem>
            ))}
            {current < pages.length ? (
              <PaginationItem>
                <PaginationNext
                  href={href(current + 1)}
                  ariaLabel={labels.nextPage}
                >
                  {labels.next}
                </PaginationNext>
              </PaginationItem>
            ) : null}
          </PaginationContent>
        </Pagination>
      ) : null}
    </>
  );
}

function EventPageFromQuery(props: EventPagesProps) {
  const requested = Number(useSearchParams().get("page"));
  const current =
    Number.isInteger(requested) &&
    requested >= 1 &&
    requested <= props.pages.length
      ? requested
      : 1;

  return <EventPage {...props} current={current} />;
}

/**
 * Picks the page from `?page=` in the browser, so that the landing page itself
 * does not read the query and can be rendered once and cached. Until then, and
 * without JavaScript, it shows the first page.
 */
export function EventPages(props: EventPagesProps) {
  return (
    <Suspense fallback={<EventPage {...props} current={1} />}>
      <EventPageFromQuery {...props} />
    </Suspense>
  );
}
