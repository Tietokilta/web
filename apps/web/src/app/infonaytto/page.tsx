"use client";
import React from "react";
// eslint-disable-next-line camelcase -- Roboto_Mono name is set by next/font
import { Inter, Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils.ts";
import "../globals.css";
import { InfoScreenHeader } from "../../components/infoscreen/infoscreen-header";
import { InfoScreenContents } from "../../components/infoscreen/info-screen-contents/index.tsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export default function InfoScreen() {
  return (
    <html lang="fi">
      <body
        className={cn(
          inter.variable,
          robotoMono.variable,
          "flex h-full flex-col bg-gray-200 font-mono",
        )}
      >
        <InfoScreenHeader />
        <div className="size-full p-4">
          <InfoScreenContents />
        </div>
      </body>
    </html>
  );
}
