import type { LinkRowBlock } from "@tietokilta/cms-types/payload";
import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
  TikLogo,
} from "@tietokilta/ui";
import Link from "next/link";
import { fetchFooter } from "../../lib/api/footer";
import { fetchMainNavigation } from "../../lib/api/main-navigation";
import type { Dictionary } from "../../lib/dictionaries";
import { cn } from "../../lib/utils";
import { LinkList } from "./link-list";

export async function MobileNav({
  className,
  locale,
  dictionary,
  ...rest
}: React.ComponentPropsWithoutRef<"header"> & {
  locale: string;
  dictionary: Dictionary;
}) {
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
        "flex items-center justify-between bg-gray-900 p-2 text-gray-100 sm:p-4",
        className,
      )}
      {...rest}
    >
      <Link className="rounded-full hover:text-gray-400" href={`/${locale}`}>
        <TikLogo className="h-16 w-16" />
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="hover:bg-transparent" variant="ghost">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">{dictionary.action["Toggle menu"]}</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav>
            <LinkList
              dictionary={dictionary.action}
              footerLinks={footerLinks}
              links={links}
              locale={locale}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
