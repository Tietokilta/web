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
      <Link className={navigationMenuTriggerStyle()} href={localisedPath}>
        {(pageOrTopic.pageConfig?.page as Page).title}
      </Link>
    );
  }

  return (
    <>
      <NavigationMenuTrigger>
        {(pageOrTopic.topicConfig?.topic as Topic).title}
      </NavigationMenuTrigger>
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
                      className="my-3 flex w-full items-center justify-start gap-2"
                      variant="outlineLink"
                    >
                      <Link href={externalLink.href} target="_blank">
                        <RenderIcon
                          className="h-6 w-6"
                          name={externalLink.icon}
                        />
                        <span>{externalLink.title}</span>
                        <ExternalLinkIcon className="h-4 w-4" />
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
