import { LinkList } from "./LinkList";

import { fetchFooter } from "../../api/footer";
import { fetchMainNavigation } from "../../api/main-navigation";
import { Dictionary } from "../../lib/dictionaries";

import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
  TikLogo,
} from "@tietokilta/ui";
import { cn } from "@tietokilta/ui/utils";
import Link from "next/link";
import { LinkRowBlock } from "payload/generated-types";

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

  if (!mainNav || !footer) return null;

  const links = mainNav.items;
  const footerLinks = footer.layout?.filter(
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
      <Link href={`/${locale}`} className="rounded-full hover:text-gray-400">
        <TikLogo className="h-16 w-16" />
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="hover:bg-transparent">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">{dictionary.action["Toggle menu"]}</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav>
            <LinkList
              dictionary={dictionary.action}
              links={links}
              footerLinks={footerLinks}
              locale={locale}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
