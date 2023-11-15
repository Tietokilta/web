"use client";

import {
  Button,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  RenderIcon,
  navigationMenuTriggerStyle,
} from "@tietokilta/ui";
import Link from "next/link";
import { MainNavigationItem, Page, Topic } from "payload/generated-types";

export const LinkList = ({ links }: { links: MainNavigationItem }) =>
  links.map((pageOrTopic) => (
    <NavigationMenuItem key={pageOrTopic.id}>
      {pageOrTopic.type === "page" ? (
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href={(pageOrTopic.pageConfig?.page as Page).path ?? "#broken"}>
            {(pageOrTopic.pageConfig?.page as Page).title}
          </Link>
        </NavigationMenuLink>
      ) : (
        <>
          <NavigationMenuTrigger>
            {(pageOrTopic.topicConfig?.topic as Topic).title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex gap-8 px-8 py-4">
              {pageOrTopic.topicConfig?.categories?.map(
                (linkCategorySublist) => (
                  <li key={linkCategorySublist.title}>
                    <span className="text-lg">{linkCategorySublist.title}</span>
                    <ul>
                      {linkCategorySublist.pages?.map(({ page }) => (
                        <li key={(page as Page).id}>
                          <Button
                            asChild
                            variant="link"
                            className="w-full border-b-0 pl-0"
                          >
                            <Link href={(page as Page).path ?? "#broken"}>
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
