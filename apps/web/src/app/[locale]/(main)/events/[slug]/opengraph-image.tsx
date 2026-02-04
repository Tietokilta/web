/* eslint-disable react/no-unknown-property -- Next.js og custom stuff https://vercel.com/guides/using-tailwind */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import stripMarkdown from "strip-markdown";
import { remark } from "remark";
import { fetchEvent } from "@lib/api/external/ilmomasiina";
import { formatDateTime } from "@lib/utils";
import type { Locale } from "@i18n/routing";

const size = {
  width: 1200,
  height: 630,
};

interface PageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export async function generateImageMetadata(props: PageProps) {
  const { locale, slug } = await props.params;
  // Next.js 16 calls generateImageMetadata with undefined params during the
  // "collecting page data" build phase to probe the route structure. Return
  // an empty array so the build doesn't fail with NEXT_HTTP_ERROR_FALLBACK.
  if (!slug) {
    return [];
  }
  const event = await fetchEvent(slug, locale);
  if (!event.ok) {
    return notFound();
  }

  return [
    {
      id: 1,
      size,
      alt: event.data.title,
      contentType: "image/png",
    },
  ];
}

export default async function Image(props: PageProps) {
  const { locale, slug } = await props.params;
  const event = await fetchEvent(slug, locale);

  if (!event.ok) {
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
  const robotoMonoMedium = await readFile(
    join(
      process.cwd(),
      "public/og/fonts/Roboto_Mono/static/RobotoMono-Medium.ttf",
    ),
  );
  const tikLogoData = await readFile(
    join(process.cwd(), "public/og/TiK-logo.png"),
  );
  const tikLogoSrc = Uint8Array.from(tikLogoData).buffer;

  const description = (
    await remark()
      .use(stripMarkdown)
      .process(event.data.description ?? "")
  ).toString();

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
              overflow: "hidden",
              display: "block",
              lineClamp: 2,
            }}
          >
            {event.data.title}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Roboto Mono",
          fontWeight: 500,
        }}
      >
        {event.data.date ? (
          <div tw="line-clamp-2 text-pretty pl-5 flex items-center">
            <svg
              style={{ width: "48px", height: "48px", display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div style={{ fontSize: "0.75em", marginLeft: "0.5em" }}>
              {formatDateTime(event.data.date, locale)}
            </div>
          </div>
        ) : null}
        {event.data.location ? (
          <div tw="line-clamp-2 text-pretty pl-5 flex items-center">
            <svg
              style={{ width: "48px", height: "48px", display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div style={{ fontSize: "0.75em", marginLeft: "0.5em" }}>
              {event.data.location}
            </div>
          </div>
        ) : null}
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
          name: "Roboto Mono",
          data: robotoMonoMedium,
          style: "normal",
          weight: 500,
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
