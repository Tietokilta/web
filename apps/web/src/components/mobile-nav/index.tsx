import type { LinkRowBlock } from "@tietokilta/cms-types/payload";
import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@tietokilta/ui";
import { fetchFooter } from "../../lib/api/footer";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { getCurrentLocale, getScopedI18n } from "../../locales/server";
import { LanguageSelector } from "./language-selector";
import { LinkList } from "./link-list";
import { LogoLink } from "./logo-link";

export async function MobileNav({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"header">) {
  const t = await getScopedI18n("action");
  const locale = getCurrentLocale();
  const mainNav = await fetchMainNavigation(locale)({});
  const footer = await fetchFooter(locale)({});
  if (
    !mainNav ||
    mainNav.items.length === 0 ||
    !footer ||
    footer.layout.length === 0
  )
    return null;

  const links = mainNav.items;
  const footerLinks = footer.layout.filter(
    (block): block is LinkRowBlock => block.blockType === "link-row",
  );

  return (
    <header
      className={cn(
        "flex items-center justify-between bg-gray-900 p-2 text-gray-100",
        className,
      )}
      {...rest}
    >
      <LogoLink locale={locale} />
      <Sheet>
        <SheetTrigger asChild>
          <Button className="hover:bg-transparent" variant="ghost">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">{t("Toggle menu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav>
            <LanguageSelector />
            <LinkList footerLinks={footerLinks} links={links} />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
