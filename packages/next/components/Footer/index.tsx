import { fetchFooter } from "../../api/footer";
import { Locale } from "../../lib/dictionaries";
import { localisePath } from "../../lib/utils";

import { RenderIcon } from "@tietokilta/ui";
import { cn } from "@tietokilta/ui/utils";
import Image from "next/image";
import Link from "next/link";
import {
  LinkRowBlock,
  LogoRowBlock,
  Media,
  Page,
} from "payload/generated-types";

export async function Footer({ locale }: { locale: Locale }) {
  const footer = await fetchFooter(locale)({});
  if (!footer) return null;

  const footerLinks = footer.layout?.filter(
    (block): block is LinkRowBlock => block.blockType === "link-row",
  );
  const footerSponsors = footer.layout?.filter(
    (block): block is LogoRowBlock => block.blockType === "logo-row",
  );

  return (
    <footer className="flex flex-col items-center gap-12 bg-gray-900 px-8 py-16 font-mono text-gray-100">
      {footerSponsors?.map((sponsorRow) => (
        <ul
          key={sponsorRow.id}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {sponsorRow.logos?.map((logo) => (
            <li key={logo.id} className="relative max-w-[240px]">
              <Link href={logo.link!}>
                {/* TODO: actually check image color and invert / modify according to contrast or something */}
                <Image
                  className="h-auto w-full object-contain invert"
                  src={(logo.image as Media).url ?? ""}
                  alt={(logo.image as Media).alt ?? ""}
                  width={(logo.image as Media).width ?? 0}
                  height={(logo.image as Media).height ?? 0}
                />
              </Link>
            </li>
          ))}
        </ul>
      ))}
      {footerLinks?.map((linkRow) => (
        <ul
          key={linkRow.id}
          className={cn(
            "flex max-w-full items-center justify-center gap-8 overflow-x-clip px-4 py-2",
            linkRow.showLabel && "flex-col sm:flex-row sm:gap-12",
          )}
        >
          {linkRow.links?.map((link) => (
            <li key={link.id}>
              <Link
                href={
                  "url" in link
                    ? link.url ?? "#broken"
                    : localisePath(
                        (link.page as Page).path ?? "#broken",
                        locale,
                      )
                }
                className={cn(
                  "aria-[current='page']:underline",
                  linkRow.showLabel &&
                    "flex items-center gap-2 underline-offset-2 hover:underline",
                  !linkRow.showLabel &&
                    "-m-2 block rounded-full p-2 hover:bg-gray-800",
                )}
              >
                <RenderIcon name={link.icon} className="h-6 w-6" />
                <span className={cn(!linkRow.showLabel && "sr-only")}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </footer>
  );
}
