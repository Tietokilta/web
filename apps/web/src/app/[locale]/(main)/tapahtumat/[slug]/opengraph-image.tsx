import Image_, {
  generateImageMetadata as generateImageMetadata_,
} from "../../events/[slug]/opengraph-image";

export function generateImageMetadata(
  ...metadata: Parameters<typeof generateImageMetadata_>
) {
  return generateImageMetadata_(...metadata);
}

export default function Image(...props: Parameters<typeof Image_>) {
  return Image_(...props);
}
