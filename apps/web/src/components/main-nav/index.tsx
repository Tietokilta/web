import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  TikLogo,
} from "@tietokilta/ui";
import Link from "next/link";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { LinkList } from "./link-list";

export async function MainNav({
  locale,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenu> & { locale: string }) {
  const mainNav = await fetchMainNavigation(locale)({});
  if (!mainNav || mainNav.items.length === 0) return null;

  const links = mainNav.items;
  const middleIndex = Math.floor(links.length / 2);
  const leftLinks = links.slice(0, middleIndex);
  const rightLinks = links.slice(middleIndex);

  return (
    <NavigationMenu className={cn("w-full max-w-none", className)} {...props}>
      <NavigationMenuList>
        <LinkList links={leftLinks} locale={locale} />
        <NavigationMenuItem>
          <Link
            className="rounded-full hover:text-gray-400"
            href={`/${locale}`}
          >
            <TikLogo />
          </Link>
        </NavigationMenuItem>
        <LinkList links={rightLinks} locale={locale} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
