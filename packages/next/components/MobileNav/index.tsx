import { LinkList } from "./LinkList";

import { fetchFooter } from "../../api/footer";
import { fetchMainNavigation } from "../../api/main-navigation";

import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
  TikLogo,
} from "@/ui";
import { cn } from "@/ui/utils";
import { LinkRowBlock } from "payload/generated-types";

export async function MobileNav({
  className,
  locale,
  ...rest
}: React.ComponentPropsWithoutRef<"header"> & { locale: string }) {
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
      <TikLogo className="h-16 w-16" />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="px-0 pb-0">
          <LinkList links={links} footerLinks={footerLinks} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
