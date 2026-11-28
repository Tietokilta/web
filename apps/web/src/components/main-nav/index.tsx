import { createHash } from "node:crypto";
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

const LOGO_WIDTH = "5rem";
const DROPDOWN_CHEVRON_WIDTH = "1.75rem";

function itemTitle(item: MainNavigationItem[number]) {
  return item.type === "page"
    ? (item.pageConfig?.page as Page | undefined)?.title
    : (item.topicConfig?.topic as Topic | undefined)?.title;
}

function itemWeight(item: MainNavigationItem[number]) {
  return (
    (itemTitle(item)?.length ?? 0) +
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

/**
 * How wide the bar has to be for a split to fit with full spacing, as a CSS
 * length for a container query on the bar. In a container query `ch` is the
 * bar's own monospace font, so the labels are measured exactly. Links are
 * text-lg, 1.125 times the bar's font.
 */
function evenSplitWidth(
  leftLinks: MainNavigationItem,
  rightLinks: MainNavigationItem,
) {
  const side = (sideLinks: MainNavigationItem, extra: string) => {
    const characters = sideLinks.reduce(
      (sum, link) => sum + (itemTitle(link)?.length ?? 0),
      0,
    );
    const chevrons = sideLinks.filter((link) => link.type === "topic").length;
    // Each link has 1rem of padding and 1.25rem of spacers, and the side has
    // 1rem at the screen edge
    return `${String(characters * 1.125)}ch + ${String(chevrons)} * ${DROPDOWN_CHEVRON_WIDTH} + ${String(sideLinks.length)} * 2.25rem + 1rem${extra}`;
  };
  // The right side also has the 1rem gap and FI/EN, which is 4ch and its gap
  return `calc(${LOGO_WIDTH} + 2 * max(${side(leftLinks, "")}, ${side(rightLinks, " + 1rem + 4ch + 1.25rem")}))`;
}

export async function MainNav({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenu>) {
  const locale = await getLocale();
  const mainNav = await fetchMainNavigation(locale)({});
  if (!mainNav || mainNav.items.length === 0) return null;

  // Narrow screens balance the two sides by width. Once the bar is wide enough
  // for an even split by count, it switches to that, so links between the two
  // split points are rendered on both sides and a container query shows one.
  const links = mainNav.items;
  const narrowSplit = logoIndex(links);
  const wideSplit = Math.ceil(links.length / 2);
  const leftLinks = links.slice(0, Math.min(narrowSplit, wideSplit));
  const movingLinks = links.slice(
    Math.min(narrowSplit, wideSplit),
    Math.max(narrowSplit, wideSplit),
  );
  const rightLinks = links.slice(Math.max(narrowSplit, wideSplit));
  const narrowOnly = "main-nav-narrow";
  const wideOnly = "main-nav-wide";
  const movesRight = narrowSplit > wideSplit;
  const switchWidth = evenSplitWidth(
    links.slice(0, wideSplit),
    links.slice(wideSplit),
  );
  // React keeps hoisted styles in <head> across navigations, so the rules are
  // scoped to this nav's split and a stale one from the other language can't
  // match
  const splitId = createHash("sha1")
    .update(switchWidth)
    .digest("hex")
    .slice(0, 8);
  const scope = `[data-nav-split="${splitId}"]`;

  const logo = mainNav.logo as Media;

  return (
    <NavigationMenu
      className={cn("block h-20 w-full max-w-none", className)}
      {...props}
    >
      {movingLinks.length > 0 && (
        // href and precedence make React hoist this into <head>
        <style href={`main-nav-split-${splitId}`} precedence="default">{`
          ${scope} .${wideOnly} { display: none }
          @container main-nav (width >= ${switchWidth}) {
            ${scope} .${wideOnly} { display: block }
            ${scope} .${narrowOnly} { display: none }
          }
        `}</style>
      )}
      {/* Equal side columns keep the logo centred however long the links are */}
      <NavigationMenuList
        className="@container/main-nav grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] space-x-0"
        data-nav-split={splitId}
      >
        <li className="flex h-full justify-end pl-[max(1rem,var(--safe-x))] xl:pl-[max(2rem,var(--safe-x))]">
          <ul className="flex min-w-0 items-center">
            <LinkList links={leftLinks} />
            <LinkList
              className={movesRight ? narrowOnly : wideOnly}
              links={movingLinks}
            />
          </ul>
        </li>
        <LogoLink image={logo} />
        <li className="flex h-full items-center justify-between gap-4 pr-[max(1rem,var(--safe-x))] xl:pr-[max(2rem,var(--safe-x))]">
          <ul className="flex min-w-0 items-center">
            <LinkList
              className={movesRight ? wideOnly : narrowOnly}
              links={movingLinks}
            />
            <LinkList links={rightLinks} />
          </ul>
          <LanguageSelector />
        </li>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
