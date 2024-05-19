import { type ImageLinkGridBlockNode } from "@tietokilta/cms-types/lexical";
import Link from "next/link";
import Image from "next/image";
import TikLogo from "../../assets/TiK-logo.png";

function ImageLink({
  image,
}: {
  image: ImageLinkGridBlockNode["fields"]["images"][number];
}) {
  const img = (
    <Image
      className="w-44 object-cover object-center dark:hue-rotate-180 dark:invert"
      src={image.image.url ?? TikLogo}
      alt={image.image.alt}
      width={image.image.width ?? undefined}
      height={image.image.height ?? undefined}
    />
  );

  if (!image.externalLink) {
    return img;
  }

  return <Link href={image.externalLink}>{img}</Link>;
}

export function ImageLinkGrid({
  images,
}: {
  images: ImageLinkGridBlockNode["fields"]["images"];
}) {
  return (
    <div className="not-prose shadow-solid dark:shadow-dark-fg dark:border-dark-fg relative my-8 flex flex-wrap items-center justify-center gap-4 overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-12 font-mono md:px-6">
      {images.map((image) => (
        <ImageLink key={image.image.id} image={image} />
      ))}
    </div>
  );
}
