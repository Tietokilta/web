"use client";

import {
  Button,
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/ui";
import { cn } from "@/ui/utils";
import Link from "next/link";
import {
  LinkRowBlock,
  MainNavigationItem,
  Page,
  Topic,
} from "payload/generated-types";

export const LinkList = ({
  links,
  footerLinks,
}: {
  links: MainNavigationItem;
  footerLinks: LinkRowBlock[];
}) => (
  <ScrollArea className="h-[calc(100lvh-1.5rem)] font-mono text-xl font-bold text-gray-900">
    <ul className="flex flex-col gap-6 p-4">
      {links.map((pageOrTopic) => (
        <li key={pageOrTopic.id}>
          {pageOrTopic.type === "page" ? (
            <Link
              className="underline-offset-2 hover:underline"
              href={(pageOrTopic.pageConfig?.page as Page).path ?? "#broken"}
            >
              <span>{(pageOrTopic.pageConfig?.page as Page).title}</span>
            </Link>
          ) : (
            <Collapsible className="space-y-3">
              <CollapsibleTrigger className="group flex items-center gap-2">
                <span>{(pageOrTopic.topicConfig?.topic as Topic).title}</span>
                <ChevronDownIcon className="block h-6 w-6 group-data-[state=open]:hidden" />
                <span className="sr-only block group-data-[state=open]:hidden">
                  Open
                </span>
                <ChevronUpIcon className="hidden h-6 w-6 group-data-[state=open]:block" />
                <span className="sr-only hidden group-data-[state=open]:block">
                  Close
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 px-6 py-3 text-base">
                {pageOrTopic.topicConfig?.categories.map(
                  (linkCategorySublist) => (
                    <ul key={linkCategorySublist.title}>
                      <li className="text-lg">{linkCategorySublist.title}</li>
                      {linkCategorySublist.pages?.map(({ page }) => (
                        <li key={(page as Page).id}>
                          <Button
                            asChild
                            variant="link"
                            className="w-full border-b-0"
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
                              <Link href={externalLink.href ?? "#broken"}>
                                {externalLink.icon}
                                <span>{externalLink.title}</span>
                              </Link>
                            </Button>
                          </li>
                        ),
                      )}
                    </ul>
                  ),
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </li>
      ))}
    </ul>
    <Separator className="my-2" />
    <ul className="space-y-6 p-4">
      {footerLinks?.map((linkRow) => (
        <li key={linkRow.id}>
          <ul
            className={cn(
              "max-w-xs overflow-x-clip",
              !linkRow.showLabel && "flex items-center justify-center gap-6",
            )}
          >
            {linkRow.links?.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url ?? "#broken"}
                  className={cn(
                    linkRow.showLabel &&
                      "flex items-center gap-2 underline-offset-2 hover:underline",
                    !linkRow.showLabel &&
                      "-m-2 block rounded-full p-2 hover:bg-gray-300",
                  )}
                >
                  {link.icon}
                  <span className={cn(!linkRow.showLabel && "sr-only")}>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </ScrollArea>
);
