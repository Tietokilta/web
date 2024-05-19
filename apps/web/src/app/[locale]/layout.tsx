import type { Metadata } from "next";
// eslint-disable-next-line camelcase -- next/font/google
import { Inter, Roboto_Mono } from "next/font/google";
import { Footer } from "../../components/footer";
import { MainNav } from "../../components/main-nav";
import { MobileNav } from "../../components/mobile-nav";
import { SkipLink } from "../../components/skip-link";
import { cn } from "../../lib/utils";
import "./globals.css";
import { type Locale } from "../../locales/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export interface LayoutProps {
  params: {
    locale: Locale;
  };
}

const localizedMetadata = {
  fi: {
    title: {
      template: "%s - Tietokilta",
      default: "Tietokilta",
    },
    description: "Tietokilta ry:n kotisivut",
  },
  en: {
    title: {
      template: "%s - Computer Science Guild",
      default: "Computer Science Guild",
    },
    description: "Homepage of the Computer Science Guild",
  },
} as const;

const mainUrl = process.env.PUBLIC_FRONTEND_URL ?? "https://tietokilta.fi";

export const generateMetadata = ({
  params: { locale },
}: LayoutProps): Metadata => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
  ...(localizedMetadata[locale] || localizedMetadata.fi),
  metadataBase: new URL(mainUrl),
});

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
} & LayoutProps) {
  return (
    <html lang={locale}>
      <body className={cn(inter.variable, robotoMono.variable, "font-sans")}>
        <SkipLink />
        <div className="flex min-h-screen flex-col">
          <MobileNav className="sticky top-0 z-50 lg:hidden" />
          <MainNav className="sticky top-0 z-50 hidden lg:block" />
          <div className="min-h-screen flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
