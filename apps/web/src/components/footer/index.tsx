import type {
  LinkRowBlock,
  Media,
  Page,
  SponsorLogoRowBlock,
} from "@tietokilta/cms-types/payload";
import { RenderIcon } from "@tietokilta/ui";
import Image from "next/image";
import Link from "next/link";
import { fetchFooter } from "../../lib/api/footer";
import { cn } from "../../lib/utils";
import { getCurrentLocale } from "../../locales/server";
import { VersionSha } from "./version-sha";

export async function Footer() {
  const locale = await getCurrentLocale();
  const footer = await fetchFooter(locale)({});
  if (!footer) return null;

  const footerLinks = footer.layout.filter(
    (block): block is LinkRowBlock => block.blockType === "link-row",
  );
  const footerSponsors = footer.layout.filter(
    (block): block is SponsorLogoRowBlock => block.blockType === "logo-row",
  );

  return (
    <footer className="flex flex-col items-center gap-12 bg-gray-900 px-8 py-16 font-mono text-gray-100">
      {footerSponsors.map((sponsorRow) => (
        <div className="space-y-4" key={sponsorRow.id}>
          <h2 className="text-center">{sponsorRow.title}</h2>
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {sponsorRow.logos?.map((logo) => (
              <li className="relative w-60" key={logo.id}>
                <Link href={logo.link}>
                  {/* TODO: actually check image color and invert / modify according to contrast or something */}
                  <Image
                    alt={(logo.image as Media).alt}
                    className="h-auto w-full object-contain invert"
                    height={(logo.image as Media).height ?? 0}
                    src={(logo.image as Media).url ?? ""}
                    width={(logo.image as Media).width ?? 0}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {footerLinks.map((linkRow) => (
        <ul
          className={cn(
            "flex max-w-full items-center justify-center gap-8 overflow-x-clip px-4 py-2",
            linkRow.showLabel && "flex-col sm:flex-row sm:gap-12",
          )}
          key={linkRow.id}
        >
          {linkRow.links?.map((link) => (
            <li key={link.id}>
              <Link
                className={cn(
                  "aria-[current='page']:underline",
                  linkRow.showLabel &&
                    "flex items-center gap-2 underline-offset-2 hover:underline",
                  !linkRow.showLabel &&
                    "-m-2 block rounded-full p-2 hover:bg-gray-800",
                )}
                href={
                  "url" in link
                    ? (link.url ?? "#broken")
                    : ((link.page as Page).path ?? "#broken")
                }
              >
                <RenderIcon
                  aria-hidden="true"
                  className="size-6"
                  name={link.icon}
                />
                <span className={cn(!linkRow.showLabel && "sr-only")}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
      <VersionSha />
    </footer>
  );
}
