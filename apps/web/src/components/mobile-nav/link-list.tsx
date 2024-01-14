"use client";

import type {
  LinkRowBlock,
  MainNavigationItem,
  Page,
  Topic,
} from "@tietokilta/cms-types/payload";
import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ExternalLinkIcon,
  RenderIcon,
  ScrollArea,
  Separator,
  cn,
} from "@tietokilta/ui";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLProps } from "react";
import type { Dictionary } from "../../lib/dictionaries";
import { localisePath } from "../../lib/utils";

function Link({
  href,
  ...props
}: Omit<LinkProps & HTMLProps<HTMLAnchorElement>, "ref">) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      aria-current={isActive ? "page" : undefined}
      href={href}
      {...props}
    />
  );
}

function NavigationLink({
  pageOrTopic,
  locale,
  dict,
}: {
  pageOrTopic: MainNavigationItem[number];
  locale: string;
  dict: {
    Open: string;
    Close: string;
  };
}) {
  if (pageOrTopic.type === "page") {
    const localisedPath = localisePath(
      (pageOrTopic.pageConfig?.page as Page).path ?? "#broken",
      locale,
    );

    return (
      <Link
        className="underline-offset-2 hover:underline aria-[current='page']:underline"
        href={localisedPath}
      >
        <span>{(pageOrTopic.pageConfig?.page as Page).title}</span>
      </Link>
    );
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center gap-2">
        <span>{(pageOrTopic.topicConfig?.topic as Topic).title}</span>
        <ChevronDownIcon className="block h-6 w-6 group-data-[state=open]:hidden" />
        <span className="sr-only block group-data-[state=open]:hidden">
          {dict.Open}
        </span>
        <ChevronUpIcon className="hidden h-6 w-6 group-data-[state=open]:block" />
        <span className="sr-only hidden group-data-[state=open]:block">
          {dict.Close}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 p-3 text-base">
        {pageOrTopic.topicConfig?.categories?.map((linkCategorySublist) => (
          <ul key={linkCategorySublist.title}>
            <li className="text-lg">{linkCategorySublist.title}</li>
            {linkCategorySublist.pages?.map(({ page }) => (
              <li key={(page as Page).id}>
                <Button
                  asChild
                  className="w-full border-b-0 pl-0"
                  variant="link"
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
                  className="my-3 flex w-full items-center justify-start gap-2"
                  variant="outlineLink"
                >
                  <Link href={externalLink.href} target="_blank">
                    <RenderIcon className="h-6 w-6" name={externalLink.icon} />
                    <span>{externalLink.title}</span>
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function LinkList({
  links,
  footerLinks,
  locale,
  dictionary: dict,
}: {
  links: MainNavigationItem;
  footerLinks: LinkRowBlock[];
  locale: string;
  dictionary: Dictionary["action"];
}) {
  return (
    <ScrollArea className="h-[100lvh] font-mono text-xl font-semibold text-gray-900">
      <ul className="mt-6 flex flex-col gap-6 p-4">
        {links.map((pageOrTopic) => (
          <li key={pageOrTopic.id}>
            <NavigationLink
              dict={dict}
              locale={locale}
              pageOrTopic={pageOrTopic}
            />
          </li>
        ))}
      </ul>
      <Separator className="my-2" />
      <ul className="space-y-6 p-4">
        {footerLinks.map((linkRow) => (
          <li key={linkRow.id}>
            <ul
              className={cn(
                "max-w-full overflow-x-clip",
                !linkRow.showLabel &&
                  "flex items-center justify-center gap-6 py-2",
                linkRow.showLabel && "space-y-6",
              )}
            >
              {linkRow.links?.map((link) => (
                <li key={link.id}>
                  <Link
                    className={cn(
                      "aria-[current='page']:underline",
                      linkRow.showLabel &&
                        "flex items-center gap-2 underline-offset-2 hover:underline",
                      !linkRow.showLabel &&
                        "-m-2 block rounded-full p-2 hover:bg-gray-300",
                    )}
                    href={
                      "url" in link
                        ? link.url ?? "#broken"
                        : localisePath(
                            (link.page as Page).path ?? "#broken",
                            locale,
                          )
                    }
                  >
                    <RenderIcon className="h-6 w-6" name={link.icon} />
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
}
