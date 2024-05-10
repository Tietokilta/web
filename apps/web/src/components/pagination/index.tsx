"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  buttonVariants,
} from "@tietokilta/ui";
import type { ButtonProps } from "@tietokilta/ui";
import Link from "next/link";
import { cn } from "../../lib/utils";

function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">): JSX.Element {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      role="navigation"
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    ref={ref}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li className={cn("", className)} ref={ref} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = "sm",
  ...props
}: PaginationLinkProps): JSX.Element {
  return (
    <Link
      scroll={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({
  className,
  ariaLabel,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  ariaLabel: string;
}): JSX.Element {
  return (
    <PaginationLink
      aria-label={ariaLabel}
      className={cn("gap-1 pl-2.5", className)}
      size="default"
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span>{children}</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
  className,
  ariaLabel,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  ariaLabel: string;
}): JSX.Element {
  return (
    <PaginationLink
      aria-label={ariaLabel}
      className={cn("gap-1 pr-2.5", className)}
      size="default"
      {...props}
    >
      <span>{children}</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({
  className,
  children,
  ...props
}: React.ComponentProps<"span">): JSX.Element {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">{children}</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
