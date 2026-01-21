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
import type {
  LinkRowBlock,
  MainNavigationItem,
  Page,
  PartnersRowBlock,
  Topic,
} from "@payload-types";
import { PartnerLogos } from "@components/partner-logos";
import { cn } from "../../lib/utils";
import { getTranslations } from "next-intl/server";
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

  const t = await getTranslations("action");

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex cursor-pointer items-center gap-2">
        <span>{(pageOrTopic.topicConfig?.topic as Topic).title}</span>
        <ChevronDownIcon className="block size-6 group-data-[state=open]:hidden" />
        <span className="sr-only block group-data-[state=open]:hidden">
          {t("Open")}
        </span>
        <ChevronUpIcon className="hidden size-6 group-data-[state=open]:block" />
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
                  className="mb-2 mr-2 w-full border-b-0 px-0 pb-0"
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
                    <RenderIcon className="size-6" name={externalLink.icon} />
                    <span>{externalLink.title}</span>
                    <ExternalLinkIcon className="size-4" />
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
  footerSponsors,
}: {
  links: MainNavigationItem;
  footerLinks: LinkRowBlock[];
  footerSponsors: PartnersRowBlock[];
}) {
  return (
    <div className="overflow-y-auto font-mono text-xl font-semibold text-gray-900">
      <ul className="mt-6 flex flex-col gap-6 p-4">
        {links.map((pageOrTopic) => (
          <li key={pageOrTopic.id}>
            <NavigationLink pageOrTopic={pageOrTopic} />
          </li>
        ))}
      </ul>
      <Separator className="my-2" />
      <ul className="space-y-6 p-6">
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
                        ? (link.url ?? "#broken")
                        : ((link.page as Page).path ?? "#broken")
                    }
                  >
                    <RenderIcon
                      aria-hidden="true"
                      className="size-6"
                      name={link.icon}
                    />
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
      <Separator className="my-2" />
      <footer className="mb-8 pt-4">
        {footerSponsors.map((sponsorRow) => (
          <ul className="space-y-4" key={sponsorRow.id}>
            <h2 className="text-center">{sponsorRow.title}</h2>
            <PartnerLogos
              statuses={sponsorRow.types ?? ["mainPartner"]}
              size="medium"
              type="mobileRow"
            />
          </ul>
        ))}
      </footer>
    </div>
  );
}
