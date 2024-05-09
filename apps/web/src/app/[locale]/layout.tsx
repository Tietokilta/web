import type { Metadata } from "next";
// eslint-disable-next-line camelcase -- next/font/google
import { Inter, Roboto_Mono } from "next/font/google";
import { Footer } from "../../components/footer";
import { MainNav } from "../../components/main-nav";
import { MobileNav } from "../../components/mobile-nav";
import { cn } from "../../lib/utils";
import "./globals.css";
import { I18nProviderClient } from "../../locales/client";
import { type Locale } from "../../locales/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

interface LayoutProps {
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

export const generateMetadata = ({
  params: { locale },
}: LayoutProps): Metadata => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
  ...(localizedMetadata[locale] || localizedMetadata.fi),
  metadataBase: new URL("https://tietokilta.fi"),
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
        <I18nProviderClient locale={locale}>
          <div className="flex min-h-screen flex-col">
            <MobileNav className="sticky top-0 z-50 lg:hidden" />
            <MainNav className="sticky top-0 z-50 hidden lg:block" />
            <div className="min-h-screen flex-1">{children}</div>
            <Footer />
          </div>
        </I18nProviderClient>
      </body>
    </html>
  );
}
