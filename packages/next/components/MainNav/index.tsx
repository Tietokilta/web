import { LinkList } from "./LinkList";

import { fetchMainNavigation } from "../../api/main-navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  TikLogo,
} from "@/ui";
import Link from "next/link";

export async function MainNav(
  props: React.ComponentPropsWithoutRef<typeof NavigationMenu>,
) {
  const mainNav = await fetchMainNavigation({});

  if (!mainNav) return null;

  const links = mainNav.items;
  const middleIndex = Math.floor(links.length / 2);
  const leftLinks = links.slice(0, middleIndex);
  const rightLinks = links.slice(middleIndex);

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="w-screen">
        <LinkList links={leftLinks} />
        <NavigationMenuItem>
          <Link href="/" className="hover:text-gray-400">
            <TikLogo />
          </Link>
        </NavigationMenuItem>
        <LinkList links={rightLinks} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
