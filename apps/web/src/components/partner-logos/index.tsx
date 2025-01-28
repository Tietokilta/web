import type { Media, Partner } from "@tietokilta/cms-types/payload";
import type { PartnersBlockNode } from "@tietokilta/cms-types/lexical";
import { ImageLinkGrid } from "@components/image-link-grid";
import { fetchPartners } from "@lib/api/partners";
import { getCurrentLocale } from "@locales/server";

export async function PartnerLogos({
  statuses,
  size,
}: {
  statuses: Partner["status"][];
  size: PartnersBlockNode["fields"]["size"];
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
    return { image: partner.logo as Media, externalLink: partner.externalLink };
  });
  return (
    <div>
      <ImageLinkGrid size={size} images={logos} />
    </div>
  );
}
