import { NavigationMenu, NavigationMenuList } from "@tietokilta/ui";
import type { Media } from "@payload-types";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { getCurrentLocale } from "../../locales/server";
import { LanguageSelector } from "./language-selector";
import { LinkList } from "./link-list";
import { LogoLink } from "./logo-link";

export async function MainNav({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenu>) {
  const locale = await getCurrentLocale();
  const mainNav = await fetchMainNavigation(locale)({});
  if (!mainNav || mainNav.items.length === 0) return null;

  const links = mainNav.items;
  const middleIndex = Math.floor(links.length / 2);
  const leftLinks = links.slice(0, middleIndex);
  const rightLinks = links.slice(middleIndex);

  const logo = mainNav.logo as Media;

  return (
    <NavigationMenu
      className={cn("h-20 w-full max-w-none", className)}
      {...props}
    >
      <NavigationMenuList>
        <LinkList links={leftLinks} />
        <LogoLink image={logo} />
        <LinkList links={rightLinks} />
        <LanguageSelector />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
