import type {
  LinkRowBlock,
  Media,
  SponsorLogoRowBlock,
} from "@tietokilta/cms-types/payload";
import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@tietokilta/ui";
import Link from "next/link";
import { fetchFooter } from "../../lib/api/footer";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import { cn } from "../../lib/utils";
import { getCurrentLocale, getScopedI18n } from "../../locales/server";
import { LanguageSelector } from "./language-selector";
import { LinkList } from "./link-list";
import { LogoLink } from "./logo-link";
import { DarkModeToggle } from "./dark-toggle";

export async function MobileNav({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"header">) {
  const t = await getScopedI18n("action");
  const locale = getCurrentLocale();
  const href = `/${locale}`;
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
  const footerSponsors = footer.layout.filter(
    (block): block is SponsorLogoRowBlock => block.blockType === "logo-row",
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
      <Link href={href} className="font-mono text-2xl">
        Tietokilta
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="hover:bg-transparent" variant="ghost">
            <MenuIcon className="size-6" />
            <span className="sr-only">{t("Toggle menu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav className="flex h-full flex-col">
            <div className="flex flex-row items-center pt-4">
              <LanguageSelector />
              <DarkModeToggle />
            </div>
            <LinkList
              footerLinks={footerLinks}
              links={links}
              footerSponsors={footerSponsors}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
