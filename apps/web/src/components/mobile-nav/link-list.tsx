import type {
  LinkRowBlock,
  MainNavigationItem,
  Page,
  Topic,
} from "@tietokilta/cms-types/payload";
import {
  RenderIcon,
  Separator,
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ExternalLinkIcon,
} from "@tietokilta/ui";
import { cn } from "../../lib/utils";
import { getScopedI18n } from "../../locales/server";
import { Link } from "./link";

async function NavigationLink({
  pageOrTopic,
}: {
  pageOrTopic: MainNavigationItem[number];
}) {
  if (pageOrTopic.type === "page") {
    const path = (pageOrTopic.pageConfig?.page as Page).path ?? "#broken";

    return (
      <Link
        className="underline-offset-2 hover:underline aria-[current='page']:underline"
        href={path}
      >
        <span>{(pageOrTopic.pageConfig?.page as Page).title}</span>
      </Link>
    );
  }

  const t = await getScopedI18n("action");

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center gap-2">
        <span>{(pageOrTopic.topicConfig?.topic as Topic).title}</span>
        <ChevronDownIcon className="block h-6 w-6 group-data-[state=open]:hidden" />
        <span className="sr-only block group-data-[state=open]:hidden">
          {t("Open")}
        </span>
        <ChevronUpIcon className="hidden h-6 w-6 group-data-[state=open]:block" />
        <span className="sr-only hidden group-data-[state=open]:block">
          {t("Close")}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 p-3 text-base">
        {pageOrTopic.topicConfig?.categories?.map((linkCategorySublist) => (
          <ul key={linkCategorySublist.title}>
            <li className="pb-2 pt-4 text-xl">{linkCategorySublist.title}</li>
            {linkCategorySublist.pages?.map(({ page }) => (
              <li key={(page as Page).id}>
                <Button
                  asChild
                  className="w-full border-b-0 pl-0"
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
}: {
  links: MainNavigationItem;
  footerLinks: LinkRowBlock[];
}) {
  return (
    <div className="h-[100lvh] overflow-y-auto font-mono text-xl font-semibold text-gray-900">
      <ul className="mt-6 flex flex-col gap-6 p-4">
        {links.map((pageOrTopic) => (
          <li key={pageOrTopic.id}>
            <NavigationLink pageOrTopic={pageOrTopic} />
          </li>
        ))}
      </ul>
      <Separator className="my-2" />
      <ul className="mb-16 space-y-6 p-6">
        {footerLinks.map((linkRow) => (
          <li key={linkRow.id}>
            <ul
              className={cn(
                "max-w-full overflow-x-clip",
                !linkRow.showLabel &&
                  "flex items-center justify-start gap-6 py-2",
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
                        : (link.page as Page).path ?? "#broken"
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
    </div>
  );
}
