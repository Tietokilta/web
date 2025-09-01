"use client";
import dynamic from "next/dynamic";
import { useCurrentLocale } from "@locales/client";

const Clock = dynamic(() => import("react-live-clock"), { ssr: false });

export function InfoscreenClock() {
  const locale = useCurrentLocale();
  return (
    <div className="flex h-full flex-col">
      <Clock
        format="HH:mm:ss"
        style={{
          color: "white",
          fontSize: "2.0rem",
          paddingLeft: "1rem",
          alignItems: "center",
        }}
        locale={locale}
        timezone="EET"
        ticking
      />
      <Clock
        format="LL"
        style={{
          color: "white",
          fontSize: "1.2rem",
          paddingLeft: "1rem",
          alignItems: "center",
        }}
        locale={locale}
        ticking
      />
    </div>
  );
}
