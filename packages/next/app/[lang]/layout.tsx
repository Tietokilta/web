import { MainNav } from "../../components/MainNav";
import { MobileNav } from "../../components/MobileNav";
import { Locale, getDictionary } from "../../lib/dictionaries";
import "./globals.css";

import { cn } from "@tietokilta/ui/utils";
import { Inter, Roboto_Mono } from "next/font/google";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

interface Props {
  params: {
    lang: Locale;
  };
}

const localizedMetadata = {
  fi: {
    title: "Tietokilta",
    description: "Tietokilta ry:n kotisivut",
  },
  en: {
    title: "Computer Science Guild",
    description: "Homepage of the Computer Science Guild",
  },
};

export const generateMetadata = ({ params: { lang } }: Props): Metadata =>
  localizedMetadata[lang] || localizedMetadata.fi;

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
} & Props) {
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={cn(inter.className, robotoMono.className)}>
        <div className="flex min-h-screen flex-col">
          <MobileNav
            dictionary={dictionary}
            locale={lang}
            className="sticky top-0 md:hidden"
          />
          <MainNav locale={lang} className="sticky top-0 hidden md:block" />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
