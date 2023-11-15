import { MainNav } from "../../components/MainNav";
import { MobileNav } from "../../components/MobileNav";
import "./globals.css";

import { cn } from "@tietokilta/ui/utils";
import { Inter, Roboto_Mono } from "next/font/google";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

interface Props {
  params: {
    lang: "en" | "fi";
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

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
} & Props) {
  return (
    <html lang={lang}>
      <body className={cn(inter.className, robotoMono.className)}>
        <MobileNav locale={lang} className="sticky top-0 md:hidden" />
        <MainNav locale={lang} className="sticky top-0 hidden md:block" />
        <div>{children}</div>
      </body>
    </html>
  );
}
