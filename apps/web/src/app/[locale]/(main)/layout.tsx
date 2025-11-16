import type { Metadata, Viewport } from "next";
// eslint-disable-next-line camelcase -- next/font/google
import { Inter, Roboto_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { Footer } from "@components/footer";
import { MainNav } from "@components/main-nav";
import { MobileNav } from "@components/mobile-nav";
import { SkipLink } from "@components/skip-link";
import { cn } from "@lib/utils";
import "@tietokilta/ui/global.css";
import "../globals.css";
import { getScopedI18n, type Locale } from "@locales/server";
import { DigiCommitteeRecruitmentAlert } from "@components/digi-committee-recruitment-alert";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export interface LayoutProps {
  params: Promise<{
    locale: Locale;
  }>;
}

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

const mainUrl = process.env.PUBLIC_FRONTEND_URL ?? "https://tietokilta.fi";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getScopedI18n("metadata");
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

export const viewport: Viewport = {
  themeColor: "black",
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
  } & LayoutProps,
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  return (
    <html lang={locale}>
      <body className={cn(inter.variable, robotoMono.variable, "font-sans")}>
        <SkipLink />
        <DigiCommitteeRecruitmentAlert />
        <NextTopLoader color="var(--color-gray-100)" showSpinner={false} />
        <div className="flex min-h-screen flex-col">
          <MobileNav className="sticky top-0 z-50 lg:hidden" />
          <MainNav className="sticky top-0 z-50 hidden lg:block" />
          <div className="min-h-screen flex-1">{children}</div>
          <Toaster richColors />
          <Footer />
        </div>
      </body>
    </html>
  );
}
