import Image from "next/image";
import { RenderIcon } from "@tietokilta/ui";
import Link from "next/link";
import type {
  LinkRowBlock,
  Media,
  Page,
  PartnersRowBlock,
  SponsorLogoRowBlock,
} from "@payload-types";
import { PartnerLogos } from "@components/partner-logos";
import { fetchFooter } from "../../lib/api/footer";
import { assertUnreachable, cn } from "../../lib/utils";
import { getLocale } from "next-intl/server";
import { VersionSha } from "./version-sha";

function RenderFooterRow({
  block,
}: {
  block: LinkRowBlock | SponsorLogoRowBlock | PartnersRowBlock;
}) {
  switch (block.blockType) {
    case "link-row":
      return (
        <ul
          className={cn(
            "flex max-w-full items-center justify-center gap-8 overflow-x-clip px-4 py-2",
            block.showLabel && "flex-col sm:flex-row sm:gap-12",
          )}
          key={block.id}
        >
          {block.links?.map((link) => (
            <li key={link.id}>
              <Link
                className={cn(
                  "aria-[current='page']:underline",
                  block.showLabel &&
                    "flex items-center gap-2 underline-offset-2 hover:underline",
                  !block.showLabel &&
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
                <span className={cn(!block.showLabel && "sr-only")}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      );
    case "logo-row":
      return (
        <div className="space-y-4" key={block.id}>
          <h2 className="text-center">{block.title}</h2>
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {block.logos?.map((logo) => (
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
      );
    case "partners-row":
      return (
        <div className="space-y-4" key={block.id}>
          <h2 className="text-center">{block.title}</h2>
          <PartnerLogos
            statuses={block.types ?? ["mainPartner"]}
            size="medium"
            type="row"
          />
        </div>
      );
    default:
      assertUnreachable(block);
  }
}

export async function Footer() {
  const locale = await getLocale();
  const footer = await fetchFooter(locale)({});
  if (!footer) return null;

  return (
    <footer className="flex flex-col items-center gap-12 bg-gray-900 px-8 py-16 font-mono text-gray-100">
      {footer.layout.map((block, i) => (
        <RenderFooterRow key={block.id ?? i} block={block} />
      ))}
      <VersionSha />
    </footer>
  );
}
