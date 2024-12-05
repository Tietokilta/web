"use client";
import React, { useRef } from "react";
import { Inter, Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils.ts";
import "../globals.css";
import { InfoScreenHeader } from "../../components/infoscreen/infoscreen-header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLBodyElement>(null);

  const enterFullScreen = () => {
    if (containerRef.current) {
      void containerRef.current.requestFullscreen();
    }
  };

  return (
    <html lang="fi">
      <body
        ref={containerRef}
        className={cn(
          inter.variable,
          robotoMono.variable,
          "flex h-full flex-col bg-gray-200 font-mono",
        )}
      >
        <InfoScreenHeader />
        <div className="size-full p-4">{children}</div>
        <button
          onClick={enterFullScreen}
          type="button"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Enter Fullscreen
        </button>
      </body>
    </html>
  );
}
