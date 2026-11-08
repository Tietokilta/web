import {
  buttonVariants,
  MenuIcon,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@tietokilta/ui";
import { getLocale, getTranslations } from "@locales/server";
import type { Media } from "@payload-types";
import { fetchFooter } from "../../lib/api/footer";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { LanguageSelector } from "./language-selector";
import { LinkList } from "./link-list";
import { LogoLink } from "./logo-link";
import { MobileNavSheetContent } from "./sheet-content";

export async function MobileNav({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"header">) {
  const tAction = await getTranslations("action");
  const tHeading = await getTranslations("heading");
  const locale = await getLocale();
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
    (block): block is Extract<typeof block, { blockType: "link-row" }> =>
      block.blockType === "link-row",
  );

  const footerSponsors = footer.layout.filter(
    (block): block is Extract<typeof block, { blockType: "partners-row" }> =>
      block.blockType === "partners-row",
  );
  const navLogo = mainNav.logo as Media;

  return (
    <header
      className={cn(
        "flex items-center justify-between bg-gray-900 p-2 text-gray-100",
        className,
      )}
      {...rest}
    >
      <LogoLink locale={locale} image={navLogo} />
      <Sheet>
        <SheetTrigger
          className={buttonVariants({
            variant: "ghost",
            className: "hover:bg-transparent",
          })}
        >
          <MenuIcon className="size-6" />
          <span className="sr-only">{tAction("Toggle menu")}</span>
        </SheetTrigger>
        <MobileNavSheetContent
          closeLabel={tAction("Close")}
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{tHeading("Main navigation")}</SheetTitle>
          </SheetHeader>
          <nav className="flex h-full flex-col">
            <LanguageSelector />
            <LinkList
              footerLinks={footerLinks}
              links={links}
              footerSponsors={footerSponsors}
            />
          </nav>
        </MobileNavSheetContent>
      </Sheet>
    </header>
  );
}
