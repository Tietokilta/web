import Image from "next/image";
import Link from "next/link";
import type { Media, Partner } from "@payload-types";
import type { PartnersBlockNode } from "@lexical-types";
import { ImageLinkGrid } from "@components/image-link-grid";
import { fetchPartners } from "@lib/api/partners";
import { getCurrentLocale } from "@locales/server";
import { Link as MobileLink } from "@components/mobile-nav/link";
import { cn } from "@lib/utils";

export async function PartnerLogos({
  statuses,
  size,
  type = "grid",
}: {
  statuses: Partner["status"][];
  size: PartnersBlockNode["fields"]["size"];
  type?: "grid" | "row" | "mobileRow" | "infoscreen";
}) {
  const locale = await getCurrentLocale();
  const partners = await fetchPartners({
    where: { or: statuses.map((status) => ({ status: { equals: status } })) },
    locale,
  });
  if (!partners || partners.length === 0) {
    return null;
  }

  const logos = partners.map((partner) => {
    // Use grayscale logo only in footer contexts (row/mobileRow) and in infoscreen header, fallback to regular logo
    const image =
      type === "row" || type === "mobileRow" || type === "infoscreen"
        ? ((partner.logoGrayscale as Media | null) ?? (partner.logo as Media))
        : (partner.logo as Media);
    return { image, externalLink: partner.externalLink };
  });

  if (type === "row" || type === "infoscreen") {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {logos.map((logo) => (
          <li
            className={cn(
              "relative flex items-center justify-center",
              type === "row" ? "h-16 max-w-48" : "h-24 max-w-60 p-2",
            )}
            key={logo.image.id}
          >
            <Link
              href={logo.externalLink}
              className="flex h-full w-full items-center justify-center"
            >
              {/* TODO: actually check image color and invert / modify according to contrast or something */}
              <Image
                alt={logo.image.alt}
                className="h-full w-full object-contain grayscale invert"
                height={logo.image.height ?? 0}
                src={logo.image.url ?? ""}
                width={logo.image.width ?? 0}
              />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (type === "mobileRow") {
    // No inversion for mobile (has light background), different Link element
    return (
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {logos.map((logo) => (
          <li
            className="relative flex h-16 max-w-48 items-center justify-center"
            key={logo.image.id}
          >
            <MobileLink
              href={logo.externalLink}
              className="flex h-full w-full items-center justify-center"
            >
              {/* TODO: actually check image color and invert / modify according to contrast or something */}
              <Image
                alt={logo.image.alt}
                className="h-full w-full object-contain"
                height={logo.image.height ?? 0}
                src={logo.image.url ?? ""}
                width={logo.image.width ?? 0}
              />
            </MobileLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <ImageLinkGrid size={size} images={logos} />
    </div>
  );
}
