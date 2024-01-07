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
import Link from "next/link";
import { MainNavigationItem, Page, Topic } from "payload/generated-types";

export const LinkList = ({
  links,
  locale,
}: {
  links: MainNavigationItem;
  locale: string;
}) =>
  links.map((pageOrTopic) => (
    <NavigationMenuItem key={pageOrTopic.id}>
      {pageOrTopic.type === "page" ? (
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link
            href={localisePath(
              (pageOrTopic.pageConfig?.page as Page).path ?? "#broken",
              locale,
            )}
          >
            {(pageOrTopic.pageConfig?.page as Page).title}
          </Link>
        </NavigationMenuLink>
      ) : (
        <>
          <NavigationMenuTrigger>
            {(pageOrTopic.topicConfig?.topic as Topic).title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex gap-16 p-8">
              {pageOrTopic.topicConfig?.categories?.map(
                (linkCategorySublist) => (
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
                            className="w-full border-b-0 pl-0"
                          >
                            <Link
                              href={localisePath(
                                (page as Page).slug ?? "#broken",
                                locale,
                              )}
                            >
                              {(page as Page).title}
                            </Link>
                          </Button>
                        </li>
                      ))}
                      {linkCategorySublist.externalLinks?.map(
                        (externalLink) => (
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
                        ),
                      )}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </NavigationMenuContent>
        </>
      )}
    </NavigationMenuItem>
  ));
