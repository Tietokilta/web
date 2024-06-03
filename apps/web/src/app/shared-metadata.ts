import { type Metadata } from "next";

export const openGraphImage = {
  images: [
    {
      url: "/og-image.png",
      alt: "Tietokilta gear logo in black and white",
      type: "image/png",
      width: 600,
      height: 600,
    },
  ],
} satisfies Metadata["openGraph"];
