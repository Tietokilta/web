/* eslint-disable react/no-unknown-property -- Next.js og custom stuff https://vercel.com/guides/using-tailwind */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@i18n/routing";

const size = {
  width: 1200,
  height: 630,
};

// Direct message imports for opengraph images (no request context during build)
const messages = {
  en: {
    title: "Tietokilta",
    description: "Homepage of the Computer Science Guild",
  },
  fi: {
    title: "Tietokilta",
    description: "Tietotekniikan opiskelijoiden kilta",
  },
} as const;

interface ImageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { locale } = await params;
  const t = messages[locale] ?? messages.en;
  return [
    {
      id: 1,
      size,
      alt: `${t.title} - ${t.description}`,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const t = messages[locale] ?? messages.en;
  const interRegular = await readFile(
    join(process.cwd(), "public/og/fonts/Inter/static/Inter_18pt-Regular.ttf"),
  );
  const robotoMonoBold = await readFile(
    join(
      process.cwd(),
      "public/og/fonts/Roboto_Mono/static/RobotoMono-Bold.ttf",
    ),
  );
  const tikLogoData = await readFile(
    join(process.cwd(), "public/og/TiK-logo.png"),
  );
  const tikLogoSrc = Uint8Array.from(tikLogoData).buffer;

  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "#f8f9fa",
        color: "#0a0d10",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2em",
        gap: "1em",
      }}
    >
      {/* @ts-expect-error -- this works with ArrayBuffer src specifically in Next.js ImageResponse*/}
      <img src={tikLogoSrc} alt="" width="196" height="196" />
      <div tw="flex flex-col max-w-4/5">
        <span style={{ fontFamily: "Roboto Mono", fontSize: "1.5em" }}>
          {t.title}
        </span>
        <span style={{ fontFamily: "Inter", fontSize: "1em" }}>
          {t.description}
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Roboto Mono",
          data: robotoMonoBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
