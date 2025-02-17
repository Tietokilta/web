/* eslint-disable react/no-unknown-property -- Next.js og custom stuff https://vercel.com/guides/using-tailwind */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getScopedI18n } from "@locales/server";

const size = {
  width: 1200,
  height: 630,
};

export async function generateImageMetadata() {
  const t = await getScopedI18n("metadata");
  return [
    {
      id: 1,
      size,
      alt: `${t("title")} - ${t("description")}`,
      contentType: "image/png",
    },
  ];
}

export default async function Image() {
  const t = await getScopedI18n("metadata");
  const interRegular = await readFile(
    join(
      process.cwd(),
      "src/assets/og/fonts/Inter/static/Inter_18pt-Regular.ttf",
    ),
  );
  const robotoMonoBold = await readFile(
    join(
      process.cwd(),
      "src/assets/og/fonts/Roboto_Mono/static/RobotoMono-Bold.ttf",
    ),
  );
  const tikLogoData = await readFile(
    join(process.cwd(), "src/assets/TiK-logo.png"),
  );
  const tikLogoSrc = Uint8Array.from(tikLogoData).buffer;

  return new ImageResponse(
    (
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
            {t("title")}
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "1em" }}>
            {t("description")}
          </span>
        </div>
      </div>
    ),
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
