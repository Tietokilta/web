import type { Metadata, Viewport } from "next";
// eslint-disable-next-line camelcase -- next/font/google
import { Inter, Roboto_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { DigiCommitteeRecruitmentAlert } from "@components/digi-committee-recruitment-alert";
import { Footer } from "@components/footer";
import { MainNav } from "@components/main-nav";
import { MobileNav } from "@components/mobile-nav";
import { SkipLink } from "@components/skip-link";
import "@tietokilta/ui/global.css";
import "../globals.css";
import { cn } from "@lib/utils";
import { getTranslations, setLocaleFromParams } from "@locales/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

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

import { env } from "../../../env";

const mainUrl = env.PUBLIC_FRONTEND_URL;

// Next's own cache is cleared by Payload hooks, but shared caches like
// Cloudflare are not, so they may only keep a page for a minute
export const revalidate = 60;

export const generateMetadata = async (props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  await setLocaleFromParams(props.params);
  const t = await getTranslations("metadata");
  return {
    title: {
      template: t("template"),
      default: t("title"),
    },
    description: t("description"),
    metadataBase: new URL(mainUrl),
    generator: "Next.js",
    creator: "Tietokilta ry",
    icons,
  };
};

// Sonner's default distance from the screen edges, measured from the safe area
// instead so toasts stay clear of the notch and home bar
function safeAreaOffset(base: string) {
  return {
    top: `calc(${base} + env(safe-area-inset-top))`,
    right: `calc(${base} + env(safe-area-inset-right))`,
    bottom: `calc(${base} + env(safe-area-inset-bottom))`,
    left: `calc(${base} + env(safe-area-inset-left))`,
  };
}

export const viewport: Viewport = {
  themeColor: "black",
  // Draw under the notch on phones. The safe-area padding below keeps content
  // clear of it.
  viewportFit: "cover",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await setLocaleFromParams(props.params);

  const { children } = props;

  return (
    <html lang={locale}>
      <body
        className={cn(
          inter.variable,
          robotoMono.variable,
          // Keeps the skip link target clear of the sticky header
          "font-sans [&_#main]:scroll-mt-[calc(5rem+env(safe-area-inset-top))]",
          // The larger side inset, for bars whose middle has to stay in the middle
          // of the screen
          "[--safe-x:max(env(safe-area-inset-left),env(safe-area-inset-right))]",
        )}
      >
        <SkipLink />
        <DigiCommitteeRecruitmentAlert />
        <NextTopLoader color="var(--color-gray-100)" showSpinner={false} />
        <div className="flex min-h-screen flex-col">
          <MobileNav className="sticky top-0 z-50 lg:hidden" />
          <MainNav className="sticky top-0 z-50 hidden lg:block" />
          <div className="min-h-screen flex-1 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
            {children}
          </div>
          <Toaster
            mobileOffset={safeAreaOffset("16px")}
            offset={safeAreaOffset("24px")}
            richColors
          />
          <Footer />
        </div>
      </body>
    </html>
  );
}
