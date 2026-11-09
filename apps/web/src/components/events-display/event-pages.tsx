"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
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
    page: string;
    previousPage: string;
    nextPage: string;
  };
}

export function EventPage({
  pages,
  locale,
  labels,
  currentPage,
}: EventPagesProps & { currentPage: number }) {
  const pageHref = (page: number) => `/${locale}/?page=${page.toFixed()}`;

  return (
    <>
      {pages[currentPage - 1]}
      {pages.length > 1 ? (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 ? (
              <PaginationItem>
                <PaginationPrevious
                  href={pageHref(currentPage - 1)}
                  ariaLabel={labels.previousPage}
                >
                  {labels.back}
                </PaginationPrevious>
              </PaginationItem>
            ) : null}
            {pages.map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={i + 1 === currentPage}
                  href={pageHref(i + 1)}
                >
                  <span className="sr-only">{labels.page}</span>
                  <span>{i + 1}</span>
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < pages.length ? (
              <PaginationItem>
                <PaginationNext
                  href={pageHref(currentPage + 1)}
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

/** Reads the page in the browser, so that the landing page itself can be cached. */
export function CurrentEventPage(props: EventPagesProps) {
  const requested = Number(useSearchParams().get("page"));
  const currentPage =
    Number.isInteger(requested) &&
    requested >= 1 &&
    requested <= props.pages.length
      ? requested
      : 1;

  return <EventPage {...props} currentPage={currentPage} />;
}
