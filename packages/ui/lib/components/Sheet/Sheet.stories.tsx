import {
  FacebookIcon,
  InstagramIcon,
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
  TiktokIcon,
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
  InboxIcon,
  LanguagesIcon,
  MenuIcon,
} from "../../icons";
import { cn } from "../../utils";
import { Button } from "../Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible";
import { ScrollArea } from "../ScrollArea";
import { Separator } from "../Separator";
import { Sheet, SheetContent, SheetTrigger } from "../Sheet";

import type { Meta, StoryFn } from "@storybook/react";

const links = [
  {
    title: "Kilta",
    links: [
      {
        title: "Ajankohtaista",
        links: [
          {
            title: "Tapahtumat",
            href: "#",
          },
          {
            title: "Viikkotiedote",
            href: "#",
          },
          {
            title: "Alkorytmi",
            href: "#",
          },
          {
            title: "Rekrylehti",
            href: "#",
          },
          {
            title: "Kiltatuotteet",
            href: "#",
          },
        ],
      },
      {
        title: "Aktiivit",
        links: [
          {
            title: "Hallitus",
            href: "#",
          },
          {
            title: "Hallinto",
            href: "#",
          },
          {
            title: "Toimarit",
            href: "#",
          },
          {
            title: "Tunnisteet",
            href: "#",
          },
          {
            title: "Säännöt",
            href: "#",
          },
        ],
      },
      {
        title: "Työkalut",
        links: [
          {
            title: "Kuvagalleria",
            href: "#",
            icon: <ImageIcon className="h-6 w-6" />,
          },
          {
            title: "Kulukorvaus",
            href: "#",
            icon: <BanknoteIcon className="h-6 w-6" />,
          },
          {
            title: "Histotik",
            href: "#",
            icon: <BookMarkedIcon className="h-6 w-6" />,
          },
        ],
      },
    ],
  },
  {
    title: "Hakijat",
    href: "#",
  },
  {
    title: "Fuksit",
    href: "#",
  },
  {
    title: "Yritykset",
    href: "#",
  },
] as const;

const footerLinks = [
  {
    title: "In English",
    href: "#",
    icon: <LanguagesIcon className="h-6 w-6" />,
  },
  {
    title: "Yhteystiedot",
    href: "#",
    icon: <AtSignIcon className="h-6 w-6" />,
  },
  {
    title: "Anna palautetta",
    href: "#",
    icon: <InboxIcon className="h-6 w-6" />,
  },
] as const;

const socialLinks = [
  {
    title: "Instagram",
    href: "#",
    icon: <InstagramIcon className="h-6 w-6" />,
  },
  {
    title: "TikTok",
    href: "#",
    icon: <TiktokIcon className="h-6 w-6" />,
  },
  {
    title: "LinkedIn",
    href: "#",
    icon: <LinkedinIcon className="h-6 w-6" />,
  },
  {
    title: "Facebook",
    href: "#",
    icon: <FacebookIcon className="h-6 w-6" />,
  },
  {
    title: "Telegram",
    href: "#",
    icon: <TelegramIcon className="h-6 w-6" />,
  },
  {
    title: "GitHub",
    href: "#",
    icon: <GithubIcon className="h-6 w-6" />,
  },
] as const;

/**
 * ```typescript
 * import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from "@tietokilta/ui";
 * ```
 */
export default {
  title: "Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;

const ListSubLink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Button asChild variant="link" className={cn("w-full border-b-0", className)}>
    <a {...props} />
  </Button>
);

const BigListSublink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Button
    asChild
    variant="outlineLink"
    className={cn("w-full justify-start gap-2", className)}
  >
    <a {...props} />
  </Button>
);

const ListLink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={cn("underline-offset-2 hover:underline", className)}
    {...props}
  />
);

const Template: StoryFn<typeof Sheet> = (args) => (
  <Sheet {...args}>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent className="px-0 pb-0">
      <ScrollArea className="h-[calc(100lvh-1.5rem)] font-mono text-xl font-bold text-gray-900">
        <ul className="flex flex-col gap-6 p-4">
          {links.map((linkOrGroup) => (
            <li key={linkOrGroup.title}>
              {"href" in linkOrGroup ? (
                <ListLink href={linkOrGroup.href}>
                  <span>{linkOrGroup.title}</span>
                </ListLink>
              ) : (
                <Collapsible className="space-y-3">
                  <CollapsibleTrigger className="group flex items-center gap-2">
                    <span>{linkOrGroup.title}</span>
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
                    {linkOrGroup.links.map((linkCategorySublist) => (
                      <ul key={linkCategorySublist.title}>
                        <li className="text-lg">{linkCategorySublist.title}</li>
                        {linkCategorySublist.links.map((link) => (
                          <li key={link.title}>
                            {"icon" in link ? (
                              <BigListSublink
                                href="#"
                                className="my-3 flex items-center gap-2"
                              >
                                {link.icon}
                                <span>{link.title}</span>
                              </BigListSublink>
                            ) : (
                              <ListSubLink href="#">{link.title}</ListSubLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>
          ))}
        </ul>
        <Separator className="my-2" />
        <ul className="flex flex-col gap-6 p-4">
          {footerLinks.map((link) => (
            <li key={link.title}>
              <a
                href={link.href}
                className="flex items-center gap-2 underline-offset-2 hover:underline"
              >
                {link.icon}
                <span>{link.title}</span>
              </a>
            </li>
          ))}
          <li>
            <ul className="flex items-center justify-center gap-6">
              {socialLinks.map((link) => (
                <li key={link.title}>
                  <a
                    className="-m-2 block rounded-full p-2 hover:bg-gray-300"
                    href="#"
                  >
                    {link.icon}
                    <span className="sr-only">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </ScrollArea>
    </SheetContent>
  </Sheet>
);

export const Primary = Template.bind({});
