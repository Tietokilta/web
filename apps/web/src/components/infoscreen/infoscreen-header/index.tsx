"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import TiKLogo from "../../../assets/TiK-logo-white.png";

const Clock = dynamic(() => import("react-live-clock"), { ssr: false });

export function InfoScreenHeader() {
  return (
    <div className="flex h-[8.0rem] space-y-3 bg-black text-white">
      <Image
        alt="Tietokilta"
        className="size-[7.0rem] p-2"
        priority
        src={TiKLogo}
      />
      <div className="flex h-full flex-col">
        <Clock
          format="HH:mm:ss"
          style={{
            color: "white",
            fontSize: "2.5rem",
            paddingLeft: "1.5rem",
            alignItems: "center",
          }}
          timezone="EET"
          ticking
        />
        <Clock
          format="Do MMMM"
          style={{
            color: "white",
            fontSize: "1.5rem",
            paddingLeft: "2rem",
            alignItems: "center",
          }}
          ticking
        />
      </div>
    </div>
  );
}
export default InfoScreenHeader;
