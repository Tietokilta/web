"use client";

import { localisePath } from "../../lib/utils";

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
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { MainNavigationItem, Page, Topic } from "payload/generated-types";
import { ComponentPropsWithoutRef } from "react";

const Link = ({
  href,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof NextLink>) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuLink asChild className={className} active={isActive}>
      <NextLink href={href} {...props} />
    </NavigationMenuLink>
  );
};

const NavigationLink = ({
  pageOrTopic,
  locale,
}: {
  pageOrTopic: MainNavigationItem[number];
  locale: string;
}) => {
  if (pageOrTopic.type === "page") {
    const localisedPath = localisePath(
      `${(pageOrTopic.pageConfig?.page as Page).path}` ?? "#broken",
      locale,
    );
    return (
      <Link href={localisedPath} className={navigationMenuTriggerStyle()}>
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
              <span className="text-lg font-bold">
                {linkCategorySublist.title}
              </span>
              <ul>
                {linkCategorySublist.pages?.map(({ page }) => (
                  <li key={(page as Page).id}>
                    <Button
                      asChild
                      variant="link"
                      className="mb-2 w-full border-b-0 pb-0 pl-0"
                    >
                      <Link
                        href={localisePath(
                          (page as Page).path ?? "#broken",
                          locale,
                        )}
                      >
                        {(page as Page).title}
                      </Link>
                    </Button>
                  </li>
                ))}
                {linkCategorySublist.externalLinks?.map((externalLink) => (
                  <li key={externalLink.title}>
                    <Button
                      asChild
                      variant="outlineLink"
                      className="my-3 flex w-full items-center justify-start gap-2"
                    >
                      <Link href={externalLink.href}>
                        <RenderIcon
                          name={externalLink.icon}
                          className="h-6 w-6"
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
};

export const LinkList = ({
  links,
  locale,
}: {
  links: MainNavigationItem;
  locale: string;
}) =>
  links.map((pageOrTopic) => (
    <NavigationMenuItem key={pageOrTopic.id}>
      <NavigationLink pageOrTopic={pageOrTopic} locale={locale} />
    </NavigationMenuItem>
  ));
