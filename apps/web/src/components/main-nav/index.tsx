import { NavigationMenu, NavigationMenuList } from "@tietokilta/ui";
import type { MainNavigationItem, Media, Page, Topic } from "@payload-types";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { getLocale } from "../../locales/server";
import { LanguageSelector } from "./language-selector";
import { LinkList } from "./link-list";
import { LogoLink } from "./logo-link";

// The nav font is monospace, so a label's length in characters stands in for
// its width. These are the extra widths in the same units.
const ITEM_PADDING_WEIGHT = 3;
const DROPDOWN_CHEVRON_WEIGHT = 3;
const LANGUAGE_SELECTOR_WEIGHT = 7;

function itemWeight(item: MainNavigationItem[number]) {
  const title =
    item.type === "page"
      ? (item.pageConfig?.page as Page | undefined)?.title
      : (item.topicConfig?.topic as Topic | undefined)?.title;
  return (
    (title?.length ?? 0) +
    ITEM_PADDING_WEIGHT +
    (item.type === "topic" ? DROPDOWN_CHEVRON_WEIGHT : 0)
  );
}

/**
 * Where to put the logo so the wider side is as narrow as possible. The logo
 * is centred, so the wider side decides how much room the whole bar needs.
 */
function logoIndex(links: MainNavigationItem) {
  const weights = links.map(itemWeight);
  const total =
    weights.reduce((sum, weight) => sum + weight, 0) + LANGUAGE_SELECTOR_WEIGHT;

  let bestIndex = Math.floor(links.length / 2);
  let narrowestWiderSide = Infinity;
  let leftWeight = 0;
  for (let index = 1; index < links.length; index++) {
    leftWeight += weights[index - 1];
    const widerSide = Math.max(leftWeight, total - leftWeight);
    if (widerSide < narrowestWiderSide) {
      narrowestWiderSide = widerSide;
      bestIndex = index;
    }
  }
  return bestIndex;
}

export async function MainNav({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenu>) {
  const locale = await getLocale();
  const mainNav = await fetchMainNavigation(locale)({});
  if (!mainNav || mainNav.items.length === 0) return null;

  const links = mainNav.items;
  const splitIndex = logoIndex(links);
  const leftLinks = links.slice(0, splitIndex);
  const rightLinks = links.slice(splitIndex);

  const logo = mainNav.logo as Media;

  return (
    <NavigationMenu
      className={cn("block h-20 w-full max-w-none", className)}
      {...props}
    >
      {/* Equal side columns keep the logo centred however long the links are */}
      <NavigationMenuList className="grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] space-x-0">
        <li className="flex h-full justify-end">
          <ul className="flex items-center gap-1 xl:gap-2">
            <LinkList links={leftLinks} />
          </ul>
        </li>
        <LogoLink image={logo} />
        <li className="flex h-full items-center justify-between gap-4 pr-4 xl:pr-8">
          <ul className="flex items-center gap-1 xl:gap-2">
            <LinkList links={rightLinks} />
          </ul>
          <LanguageSelector />
        </li>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
