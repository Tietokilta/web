/**
 * Need to do a workaround via api routes, since the og image generation doesn't support catch-all routes.
 *
 * @see https://github.com/vercel/next.js/issues/57349
 */

/* eslint-disable @next/next/no-img-element -- Next.js ImageResponse stuff */
/* eslint-disable react/no-unknown-property -- Next.js ImageResponse custom stuff https://vercel.com/guides/using-tailwind */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const size = {
    width: 1200,
    height: 630,
  };

  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");

  if (!title || !description) {
    return notFound();
  }

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
          flexDirection: "column",
          padding: "2em",
          gap: "1em",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1em",
          }}
        >
          {/* @ts-expect-error -- this works with ArrayBuffer src specifically in Next.js ImageResponse*/}
          <img src={tikLogoSrc} alt="" width="196" height="196" />
          <div tw="flex flex-col max-w-4/5">
            <div
              style={{
                fontFamily: "Roboto Mono",
                fontSize: "1.25em",
                fontWeight: 700,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "0.75em",
                overflow: "hidden",
                display: "block",
                lineClamp: 2,
              }}
            >
              {description}
            </div>
          </div>
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
