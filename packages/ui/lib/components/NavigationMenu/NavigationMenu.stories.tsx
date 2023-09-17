import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from ".";

import { BanknoteIcon, BookMarkedIcon, ImageIcon, TikLogo } from "../../icons";
import { cn } from "../../utils";
import { Button } from "../Button";

import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * ```typescript
 * import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@tietokilta/ui"
 * ```
 */
const meta = {
  title: "Navigation Menu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>;
export default meta;

type Story = StoryObj<typeof NavigationMenu>;

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

const middleIndex = Math.floor(links.length / 2);
const leftLinks = links.slice(0, middleIndex);
const rightLinks = links.slice(middleIndex);

const ListSubLink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Button
    asChild
    variant="link"
    className={cn("w-full border-b-0 pl-0", className)}
  >
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
    className={cn(
      "my-3 flex w-full items-center justify-start gap-2",
      className,
    )}
  >
    <a {...props} />
  </Button>
);

const LinkList = ({ links }: { links: typeof leftLinks }) =>
  links.map((linkOrGroup) => (
    <NavigationMenuItem key={linkOrGroup.title}>
      {"links" in linkOrGroup ? (
        <>
          <NavigationMenuTrigger>{linkOrGroup.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex gap-8 px-8 py-4">
              {linkOrGroup.links.map((linkCategorySublist) => (
                <li key={linkCategorySublist.title}>
                  <span className="text-lg">{linkCategorySublist.title}</span>
                  <ul>
                    {linkCategorySublist.links.map((link) => (
                      <li key={link.title}>
                        {"icon" in link ? (
                          <BigListSublink href="#">
                            {link.icon}
                            <span>{link.title}</span>
                          </BigListSublink>
                        ) : (
                          <ListSubLink href="#">{link.title}</ListSubLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          <a href={linkOrGroup.href}>{linkOrGroup.title}</a>
        </NavigationMenuLink>
      )}
    </NavigationMenuItem>
  ));

export const Default = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="w-screen">
        <LinkList links={leftLinks} />
        <NavigationMenuItem>
          <a href="/" className="hover:text-gray-400">
            <TikLogo />
          </a>
        </NavigationMenuItem>
        <LinkList links={rightLinks} />
      </NavigationMenuList>
    </NavigationMenu>
  ),
} satisfies Story;
