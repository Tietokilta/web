"use client";

import type {
  MainNavigationItem,
  Page,
  Topic,
} from "@tietokilta/cms-types/payload";
import {
  Button,
  ExternalLinkIcon,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  RenderIcon,
  navigationMenuTriggerStyle,
} from "@tietokilta/ui";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLProps } from "react";

function Link({
  href,
  className,
  ...props
}: Omit<LinkProps & HTMLProps<HTMLAnchorElement>, "ref">) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuLink active={isActive} asChild className={className}>
      <NextLink href={href} {...props} />
    </NavigationMenuLink>
  );
}

function NavigationLink({
  pageOrTopic,
}: {
  pageOrTopic: MainNavigationItem[number];
}) {
  if (pageOrTopic.type === "page") {
    const localisedPath =
      (pageOrTopic.pageConfig?.page as Page | undefined)?.path ?? "#broken";
    return (
      <div className="group/link relative flex h-20 items-center justify-center">
        <Link
          className={`relative z-10 hover:underline ${navigationMenuTriggerStyle()}`}
          href={localisedPath}
        >
          {(pageOrTopic.pageConfig?.page as Page).title}
        </Link>
        {!!(pageOrTopic.pageConfig?.page as Page).icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RenderIcon
              width={80}
              height={80}
              aria-hidden="true"
              className="z-0 opacity-0 transition-opacity duration-300 group-hover/link:opacity-15"
              name={(pageOrTopic.pageConfig?.page as Page).icon ?? "HelpCircle"}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="group/link relative flex h-20 items-center justify-center">
        <NavigationMenuTrigger>
          <span className="hover:underline">
            {(pageOrTopic.topicConfig?.topic as Topic).title}
          </span>
          {!!(pageOrTopic.topicConfig?.topic as Topic).icon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RenderIcon
                width={100}
                height={100}
                aria-hidden="true"
                className="z-0 opacity-0 transition-opacity duration-300 group-hover/link:opacity-30"
                name={
                  (pageOrTopic.topicConfig?.topic as Topic).icon ?? "HelpCircle"
                }
              />
            </div>
          )}
        </NavigationMenuTrigger>
      </div>
      <NavigationMenuContent>
        <ul className="flex gap-16 p-8">
          {pageOrTopic.topicConfig?.categories?.map((linkCategorySublist) => (
            <li key={linkCategorySublist.title}>
              <header className="mb-4 text-xl font-bold">
                {linkCategorySublist.title}
              </header>
              <ul>
                {linkCategorySublist.pages?.map(({ page }) => (
                  <li key={(page as Page).id}>
                    <Button
                      asChild
                      className="m-0 mr-2 w-full border-b-0 p-0"
                      variant="link"
                    >
                      <Link href={(page as Page).path ?? "#broken"}>
                        {(page as Page).title}
                      </Link>
                    </Button>
                  </li>
                ))}
                {linkCategorySublist.externalLinks?.map((externalLink) => (
                  <li key={externalLink.title}>
                    <Button
                      asChild
                      className="relative z-10 my-2 w-full border-b-0 px-2"
                      variant="outlineLink"
                    >
                      <Link
                        href={externalLink.href}
                        target="_blank"
                        className="flex justify-between gap-1"
                      >
                        <RenderIcon
                          className="size-6"
                          name={externalLink.icon}
                        />
                        <span>{externalLink.title}</span>
                        <ExternalLinkIcon className="size-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
}

export const LinkList = ({ links }: { links: MainNavigationItem }) =>
  links.map((pageOrTopic) => (
    <NavigationMenuItem key={pageOrTopic.id}>
      <NavigationLink pageOrTopic={pageOrTopic} />
    </NavigationMenuItem>
  ));
