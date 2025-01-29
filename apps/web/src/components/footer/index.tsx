import type {
  LinkRowBlock,
  Page,
  PartnersRowBlock,
} from "@tietokilta/cms-types/payload";
import { RenderIcon } from "@tietokilta/ui";
import Link from "next/link";
import { PartnerLogos } from "@components/partner-logos";
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
    (block): block is PartnersRowBlock => block.blockType === "partners-row",
  );

  return (
    <footer className="flex flex-col items-center gap-12 bg-gray-900 px-8 py-16 font-mono text-gray-100">
      {footerSponsors.map((sponsorRow) => (
        <div className="space-y-4" key={sponsorRow.id}>
          <h2 className="text-center">{sponsorRow.title}</h2>
          <PartnerLogos
            statuses={sponsorRow.types ?? ["mainPartner"]}
            size="medium"
            type="row"
          />
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
