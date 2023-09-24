import "./globals.css";
import { MainNav } from "../../components/MainNav";
import { MobileNav } from "../../components/MobileNav";

import { cn } from "@/ui/utils";
import { Inter, Roboto_Mono } from "next/font/google";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tietokilta",
  description: "Tietokilta ry:n kotisivut",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, robotoMono.className)}>
        <MobileNav className="sticky top-0 md:hidden" />
        <MainNav className="sticky top-0 hidden md:block" />
        <div>{children}</div>
      </body>
    </html>
  );
}
