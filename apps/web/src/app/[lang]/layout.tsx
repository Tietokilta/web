import type { Metadata } from "next";
// eslint-disable-next-line camelcase -- next/font/google
import { Inter, Roboto_Mono } from "next/font/google";
import { Footer } from "../../components/footer";
import { MainNav } from "../../components/main-nav";
import { MobileNav } from "../../components/mobile-nav";
import { cn } from "../../lib/utils";
import { getDictionary, type Locale } from "../../lib/dictionaries";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

interface LayoutProps {
  params: {
    lang: Locale;
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
  params: { lang },
}: LayoutProps): Metadata => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
  ...(localizedMetadata[lang] || localizedMetadata.fi),
  metadataBase: new URL("https://tietokilta.fi"),
});

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
} & LayoutProps) {
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={cn(inter.className, robotoMono.className)}>
        <div className="flex min-h-screen flex-col">
          <MobileNav
            className="sticky top-0 z-10 md:hidden"
            dictionary={dictionary}
            locale={lang}
          />
          <MainNav
            className="sticky top-0 z-10 hidden h-20 md:block"
            locale={lang}
          />
          <div className="min-h-screen flex-1">{children}</div>
          <Footer locale={lang} />
        </div>
      </body>
    </html>
  );
}
