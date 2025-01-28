import React from "react";
// eslint-disable-next-line camelcase -- Roboto_Mono name is set by next/font
import { Inter, Roboto_Mono } from "next/font/google";
import { type Metadata } from "next";
import { cn } from "@lib/utils.ts";
import "../../globals.css";
import { InfoScreenHeader } from "@components/infoscreen/infoscreen-header/index.tsx";
import { type LayoutProps } from "../../(main)/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const localizedMetadata = {
  fi: {
    title: "Infonäyttö - Tietokilta",
    description: "Tietokilta ry:n kotisivut",
  },
  en: {
    title: "Infoscreen - Computer Science Guild",
    description: "Homepage of the Computer Science Guild",
  },
} as const;

const mainUrl = process.env.PUBLIC_FRONTEND_URL ?? "https://tietokilta.fi";

const icons = {
  icon: [
    {
      rel: "icon",
      type: "image/png",
      media: "(prefers-color-scheme: light)",
      url: "/icon_dark.png",
    },
    {
      rel: "icon",
      type: "image/png",
      media: "(prefers-color-scheme: dark)",
      url: "/icon_light.png",
    },
  ],
};

export const generateMetadata = async (
  props: LayoutProps,
): Promise<Metadata> => {
  const { locale } = await props.params;
  return {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
    ...(localizedMetadata[locale] || localizedMetadata.fi),

    metadataBase: new URL(mainUrl),
    generator: "Next.js",
    creator: "Tietokilta ry",
    icons,
  };
};

export default async function ScreenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & LayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body
        className={cn(
          inter.variable,
          robotoMono.variable,
          "flex h-full flex-col bg-gray-200 font-mono",
        )}
      >
        <InfoScreenHeader />
        <div className="size-full p-4">{children}</div>
      </body>
    </html>
  );
}
