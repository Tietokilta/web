import Image from "next/image";
import Link from "next/link";
import type { Media, Partner } from "@payload-types";
import type { PartnersBlockNode } from "@lexical-types";
import { ImageLinkGrid } from "@components/image-link-grid";
import { fetchPartners } from "@lib/api/partners";
import { getCurrentLocale } from "@locales/server";
import { Link as MobileLink } from "@components/mobile-nav/link";

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
    // Use monochrome logo if available, fallback to regular logo
    const image =
      (partner.logoMonochrome as Media | null) ?? (partner.logo as Media);
    return { image, externalLink: partner.externalLink };
  });

  if (type === "row" || type === "infoscreen") {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {logos.map((logo) => (
          <li
            className={`relative ${type === "row" ? "w-60" : "max-w-60"}`}
            key={logo.image.id}
          >
            <Link href={logo.externalLink}>
              <Image
                alt={logo.image.alt}
                className={`object-contain grayscale invert ${type === "row" ? "w-full" : "h-[6.0rem] w-full p-2"}`}
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
          <li className="relative w-60" key={logo.image.id}>
            <MobileLink href={logo.externalLink}>
              <Image
                alt={logo.image.alt}
                className="h-auto w-full object-contain"
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
