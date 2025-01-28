import type { Media, Partner } from "@tietokilta/cms-types/payload";
import type { PartnersBlockNode } from "@tietokilta/cms-types/lexical";
import Link from "next/link";
import Image from "next/image";
import { ImageLinkGrid } from "@components/image-link-grid";
import { fetchPartners } from "@lib/api/partners";
import { getCurrentLocale } from "@locales/server";
import { assertUnreachable } from "@lib/utils";

export async function PartnerLogos({
  partnerStatus,
  size,
  style,
}: {
  partnerStatus: Partner["status"][] | Partner["status"];
  size: PartnersBlockNode["fields"]["size"];
  style: "grid" | "row";
}) {
  const locale = await getCurrentLocale();
  const partners = await fetchPartners({
    where:
      typeof partnerStatus === "string"
        ? {
            status: { equals: partnerStatus },
          }
        : {
            or: partnerStatus.map((status) => ({ status: { equals: status } })),
          },
    locale,
  });
  if (!partners || partners.length === 0) {
    return null;
  }

  const logos = partners.map((partner) => {
    return { image: partner.logo as Media, externalLink: partner.externalLink };
  });
  switch (style) {
    case "grid":
      return <ImageLinkGrid size={size} images={logos} />;
    case "row":
      return (
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {logos.map((logo) => (
            <li className="relative w-60" key={logo.image.id}>
              <Link href={logo.externalLink}>
                {/* TODO: actually check image color and invert / modify according to contrast or something */}
                <Image
                  alt={logo.image.alt}
                  className="h-auto w-full object-contain invert"
                  height={logo.image.height ?? 0}
                  src={logo.image.url ?? ""}
                  width={logo.image.width ?? 0}
                />
              </Link>
            </li>
          ))}
        </ul>
      );
    default:
      assertUnreachable(style);
  }
}
