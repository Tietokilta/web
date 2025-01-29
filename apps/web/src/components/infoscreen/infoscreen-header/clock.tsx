"use client";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("react-live-clock"), { ssr: false });

export function InfoscreenClock() {
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
        timezone="EET"
        ticking
      />
      <Clock
        format="Do MMMM"
        style={{
          color: "white",
          fontSize: "1.2rem",
          paddingLeft: "1rem",
          alignItems: "center",
        }}
        ticking
      />
    </div>
  );
}
