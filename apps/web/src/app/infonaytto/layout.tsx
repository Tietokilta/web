import React from "react";
import { Inter, Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils.ts";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export default function ScreenLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
} ) {
  return (
    <html lang="fi">
      <body className={cn(inter.variable, robotoMono.variable, "font-sans")}>
        <div>
          {children}
        </div>
      </body>
    </html>
);
}