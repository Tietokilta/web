import { LinkList } from "./LinkList";

import { fetchMainNavigation } from "../../api/main-navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  TikLogo,
} from "@tietokilta/ui";
import Link from "next/link";

export async function MainNav({
  locale,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenu> & { locale: string }) {
  const mainNav = await fetchMainNavigation(locale)({});

  if (!mainNav) return null;

  const links = mainNav.items;
  const middleIndex = Math.floor(links.length / 2);
  const leftLinks = links.slice(0, middleIndex);
  const rightLinks = links.slice(middleIndex);

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="w-screen">
        <LinkList links={leftLinks} locale={locale} />
        <NavigationMenuItem>
          <Link
            href={`/${locale}`}
            className="rounded-full hover:text-gray-400"
          >
            <TikLogo />
          </Link>
        </NavigationMenuItem>
        <LinkList links={rightLinks} locale={locale} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
